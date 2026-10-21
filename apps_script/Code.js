/**
 * ============================================================================
 * HSK REAL ESTATE — ENTERPRISE APPS SCRIPT ENGINE (V1.2)
 * Dedicated Google Spreadsheet Integration for AI Outbound Voice Dialer (ElevenLabs)
 *
 * Dedicated Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1a4sfmK6faPs9QR3-_0fQzksn49epumoTbzwas2tnfv8/edit
 *
 * Configured Tabs:
 * 1. Enquiries       (gid: 0)
 * 2. Call_Outcomes  (gid: 1001)
 * 3. Webhook_Events (gid: 1002)
 * 4. System_State   (gid: 1003)
 * ============================================================================
 */

// Global Configuration
var CONFIG = {
  DEFAULT_SPREADSHEET_ID: '1a4sfmK6faPs9QR3-_0fQzksn49epumoTbzwas2tnfv8',
  TIMEZONE: 'Asia/Kolkata', // Indian Standard Time (UTC+05:30)
  CALLING_WINDOW: {
    START_HOUR: 9,  // 09:00 AM IST
    END_HOUR: 20,   // 08:00 PM IST
  },
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_BACKOFF_HOURS: [2, 24, 48],
  LOCK_TIMEOUT_MS: 10000,
  ALLOW_PUBLIC_ENQUIRIES: true, // Allows website visitor submissions without exposing shared secret
  TABS: {
    ENQUIRIES: 'Enquiries',
    CALL_OUTCOMES: 'Call_Outcomes',
    WEBHOOK_EVENTS: 'Webhook_Events',
    SYSTEM_STATE: 'System_State'
  }
};

/**
 * Main Web App POST Entrypoint
 * Handles enquiry submissions, queue claims, outcomes, webhook events, and state updates
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Acquire lock if needed (e.g. for queue mutations)
    var payload = parseRequestBody(e);
    var action = determineAction(payload, e);

    // Verify secret for protected operations
    if (isProtectedAction(action)) {
      if (!verifySecret(payload, e)) {
        return createJsonResponse({
          success: false,
          error: 'Unauthorized: invalid or missing shared secret'
        }, 401);
      }
    }

    // Dispatch action to dedicated handler
    var result = dispatchAction(action, payload, e);
    return createJsonResponse(result, 200);

  } catch (err) {
    Logger.log('Error in doPost: ' + err.toString() + ' Stack: ' + err.stack);
    return createJsonResponse({
      success: false,
      error: err.message || err.toString()
    }, 500);
  } finally {
    try {
      lock.releaseLock();
    } catch (ignored) {}
  }
}

/**
 * Main Web App GET Entrypoint (Health Checks, Enquiry Queries)
 */
function doGet(e) {
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var action = params.action || 'health';

    if (action === 'health' || action === 'ping') {
      return createJsonResponse({
        success: true,
        service: 'HSK Voice Agent Engine',
        version: '1.2.0',
        timestamp: new Date().toISOString(),
        calling_window_open: isWithinCallingWindow(),
        spreadsheet_id: getSpreadsheetId()
      });
    }

    // Protected read actions require secret verification
    if (!verifySecret(params, e)) {
      return createJsonResponse({
        success: false,
        error: 'Unauthorized: invalid or missing shared secret'
      }, 401);
    }

    if (action === 'get_enquiries' || action === 'list_enquiries') {
      var enquiries = handleGetEnquiries(params);
      return createJsonResponse({ success: true, count: enquiries.length, data: enquiries });
    }

    if (action === 'get_system_state') {
      var state = handleGetSystemState(params.key);
      return createJsonResponse({ success: true, data: state });
    }

    return createJsonResponse({
      success: false,
      error: 'Unknown GET action: ' + action
    }, 400);

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.message || err.toString()
    }, 500);
  }
}

/**
 * Handle Preflight CORS OPTIONS requests
 */
function doOptions(e) {
  return createJsonResponse({ success: true });
}

// ============================================================================
// ACTION DISPATCHER & CORE ENGINE HANDLERS
// ============================================================================

/**
 * Route request to specific operational handlers
 */
function dispatchAction(action, payload, e) {
  switch (action) {
    case 'create_enquiry':
    case 'submit_enquiry':
    case 'new_enquiry':
      return handleCreateEnquiry(payload);

    case 'get_enquiries':
    case 'read_enquiries':
    case 'list_enquiries':
      return { success: true, data: handleGetEnquiries(payload) };

    case 'claim_queue_item':
    case 'claim_enquiry':
      return handleClaimQueueItem(payload);

    case 'release_claim':
    case 'release_lock':
      return handleReleaseClaim(payload);

    case 'record_outcome':
    case 'log_outcome':
      return handleRecordCallOutcome(payload);

    case 'webhook_event':
    case 'log_webhook':
      return handleRecordWebhookEvent(payload);

    case 'get_system_state':
      return { success: true, data: handleGetSystemState(payload.key) };

    case 'update_system_state':
      return handleUpdateSystemState(payload);

    case 'health':
    case 'ping':
      return {
        success: true,
        status: 'ONLINE',
        calling_window_open: isWithinCallingWindow(),
        timestamp: new Date().toISOString()
      };

    default:
      throw new Error('Unsupported action: ' + action);
  }
}

/**
 * 1. CREATE ENQUIRY (Website Backend Submission Contract)
 * Accepts website contract with full field normalization, validation & deduplication
 */
function handleCreateEnquiry(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

  try {
    var raw = payload.data || payload.enquiry || payload;
    var norm = normalizeEnquiryPayload(raw);

    if (!norm.customer_name) {
      throw new Error('customer_name is required');
    }
    if (!norm.phone_number) {
      throw new Error('phone_number is required');
    }

    var sheet = getSheet(CONFIG.TABS.ENQUIRIES);
    var headerMap = getHeaderMap(sheet);

    // Stable Enquiry ID generation or validation
    var enquiryId = norm.enquiry_id || generateEnquiryId();
    var createdAt = norm.created_at || new Date().toISOString();

    // Check for duplicate submission by ID or recent phone submission
    var existingRow = findRowByValue(sheet, headerMap['enquiry_id'], enquiryId);
    if (existingRow > 0) {
      // Idempotent return of existing enquiry
      return {
        success: true,
        message: 'Enquiry already exists (idempotent)',
        enquiry_id: enquiryId,
        is_duplicate: true
      };
    }

    // Determine initial queue status based on calling window rules
    var inWindow = isWithinCallingWindow();
    var initialStatus = 'PENDING_CALL';
    var nextRetryAt = '';

    if (!inWindow) {
      // Scheduled for next morning at 09:00 AM IST
      initialStatus = 'PENDING_CALL';
      nextRetryAt = getNextCallingWindowStartIso();
    }

    // Build the row object matching exact spreadsheet headers
    var rowData = {
      enquiry_id: enquiryId,
      created_at: createdAt,
      customer_name: norm.customer_name,
      phone_number: norm.phone_number,
      project_interest: norm.project_interest || 'General Inquiry',
      source: norm.source || 'hsk-website',
      utm_campaign: norm.utm_campaign || 'direct-web',
      customer_notes: norm.customer_notes || '',
      queue_class: norm.queue_class || 'NEW',
      current_status: initialStatus,
      attempt_sequence_count: 0,
      customer_no_answer_count: 0,
      technical_failures_count: 0,
      last_call_at: '',
      next_retry_at: nextRetryAt,
      active_session_id: '',
      latest_outcome_id: '',
      error_details: ''
    };

    appendRowWithHeaderMap(sheet, headerMap, rowData);

    return {
      success: true,
      message: 'Enquiry created successfully',
      enquiry_id: enquiryId,
      current_status: initialStatus,
      calling_window_open: inWindow,
      next_retry_at: nextRetryAt
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 2. GET ENQUIRIES
 * Query enquiries with optional filtering
 */
function handleGetEnquiries(filter) {
  filter = filter || {};
  var sheet = getSheet(CONFIG.TABS.ENQUIRIES);
  var headerMap = getHeaderMap(sheet);
  var data = getSheetObjects(sheet, headerMap);

  return data.filter(function(row) {
    if (filter.status && row.current_status !== filter.status) return false;
    if (filter.queue_class && row.queue_class !== filter.queue_class) return false;
    if (filter.enquiry_id && row.enquiry_id !== filter.enquiry_id) return false;
    return true;
  });
}

/**
 * 3. CLAIM QUEUE ITEM (For ElevenLabs / AI Voice Dialer)
 * Thread-safe queue locking to assign a pending enquiry to a dialer session
 */
function handleClaimQueueItem(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

  try {
    var actor = payload.actor || 'elevenlabs-dialer';
    var sessionId = payload.session_id || ('SES-' + Date.now());

    // Check calling window
    if (!isWithinCallingWindow() && !payload.bypass_calling_window) {
      return {
        success: false,
        claimed: false,
        reason: 'OUTSIDE_CALLING_WINDOW',
        message: 'Current time is outside permitted calling hours (09:00 - 20:00 IST)',
        next_window_start: getNextCallingWindowStartIso()
      };
    }

    var sheet = getSheet(CONFIG.TABS.ENQUIRIES);
    var headerMap = getHeaderMap(sheet);
    var data = getSheetObjects(sheet, headerMap);
    var now = new Date();

    // Priority 1: Queue Class = 'NEW', Priority 2: Next retry reached
    var targetRowIdx = -1;
    var targetItem = null;

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if (item.current_status === 'PENDING_CALL' && !item.active_session_id) {
        if (!item.next_retry_at || new Date(item.next_retry_at) <= now) {
          targetRowIdx = i + 2; // Row index is 1-based + 1 for header
          targetItem = item;
          break;
        }
      }
    }

    if (!targetItem) {
      return {
        success: true,
        claimed: false,
        message: 'No eligible enquiries pending dial'
      };
    }

    // Apply Dialer Lock
    var attemptCount = (parseInt(targetItem.attempt_sequence_count, 10) || 0) + 1;
    var callStartedAt = new Date().toISOString();

    sheet.getRange(targetRowIdx, headerMap['current_status']).setValue('DIALING');
    sheet.getRange(targetRowIdx, headerMap['active_session_id']).setValue(sessionId);
    sheet.getRange(targetRowIdx, headerMap['attempt_sequence_count']).setValue(attemptCount);
    sheet.getRange(targetRowIdx, headerMap['last_call_at']).setValue(callStartedAt);

    SpreadsheetApp.flush();

    targetItem.current_status = 'DIALING';
    targetItem.active_session_id = sessionId;
    targetItem.attempt_sequence_count = attemptCount;
    targetItem.last_call_at = callStartedAt;

    return {
      success: true,
      claimed: true,
      session_id: sessionId,
      enquiry: targetItem
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 4. RELEASE CLAIM
 * Releases a dialer lock if the session aborts or fails to connect
 */
function handleReleaseClaim(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

  try {
    var enquiryId = payload.enquiry_id;
    var reason = payload.reason || 'MANUAL_RELEASE';

    var sheet = getSheet(CONFIG.TABS.ENQUIRIES);
    var headerMap = getHeaderMap(sheet);
    var rowIdx = findRowByValue(sheet, headerMap['enquiry_id'], enquiryId);

    if (rowIdx === -1) {
      throw new Error('Enquiry not found: ' + enquiryId);
    }

    sheet.getRange(rowIdx, headerMap['current_status']).setValue('PENDING_CALL');
    sheet.getRange(rowIdx, headerMap['active_session_id']).setValue('');
    sheet.getRange(rowIdx, headerMap['error_details']).setValue('Released: ' + reason);

    SpreadsheetApp.flush();

    return {
      success: true,
      message: 'Claim released successfully',
      enquiry_id: enquiryId
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 5. RECORD CALL OUTCOME
 * Records detailed call log into Call_Outcomes tab and updates Enquiries tab
 */
function handleRecordCallOutcome(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

  try {
    var outcomeSheet = getSheet(CONFIG.TABS.CALL_OUTCOMES);
    var outcomeHeaderMap = getHeaderMap(outcomeSheet);

    var outcomeId = payload.outcome_id || generateOutcomeId();
    var enquiryId = payload.enquiry_id;

    if (!enquiryId) {
      throw new Error('enquiry_id is required to record call outcome');
    }

    var disposition = (payload.disposition || 'COMPLETED').toUpperCase();
    var interested = payload.interested !== undefined ? payload.interested : false;

    // Build Call_Outcomes row data
    var outcomeRowData = {
      outcome_id: outcomeId,
      enquiry_id: enquiryId,
      attempt_sequence: payload.attempt_sequence || 1,
      channel: payload.channel || 'elevenlabs-voice',
      call_sid: payload.call_sid || '',
      conversation_id: payload.conversation_id || '',
      call_started_at: payload.call_started_at || new Date().toISOString(),
      call_ended_at: payload.call_ended_at || new Date().toISOString(),
      duration_seconds: payload.duration_seconds || 0,
      disposition: disposition,
      interested: interested,
      interest_status: payload.interest_status || (interested ? 'INTERESTED' : 'NOT_INTERESTED'),
      property_interest: payload.property_interest || '',
      budget_range: payload.budget_range || '',
      preferred_location: payload.preferred_location || '',
      timeline: payload.timeline || '',
      next_step_type: payload.next_step_type || '',
      interest_reason: payload.interest_reason || '',
      qualification_status: payload.qualification_status || (interested ? 'QUALIFIED' : 'UNQUALIFIED'),
      transcript_summary: payload.transcript_summary || payload.summary || ''
    };

    appendRowWithHeaderMap(outcomeSheet, outcomeHeaderMap, outcomeRowData);

    // Update parent row in Enquiries tab
    var enqSheet = getSheet(CONFIG.TABS.ENQUIRIES);
    var enqHeaderMap = getHeaderMap(enqSheet);
    var enqRowIdx = findRowByValue(enqSheet, enqHeaderMap['enquiry_id'], enquiryId);

    if (enqRowIdx > 0) {
      var currentAttempts = parseInt(enqSheet.getRange(enqRowIdx, enqHeaderMap['attempt_sequence_count']).getValue(), 10) || 1;
      var currentNoAnswer = parseInt(enqSheet.getRange(enqRowIdx, enqHeaderMap['customer_no_answer_count']).getValue(), 10) || 0;
      var currentTechFail = parseInt(enqSheet.getRange(enqRowIdx, enqHeaderMap['technical_failures_count']).getValue(), 10) || 0;

      var newStatus = 'COMPLETED';
      var nextRetryAt = '';

      if (interested || disposition === 'INTERESTED' || disposition === 'SITE_VISIT_SCHEDULED') {
        newStatus = 'CONVERTED_INTERESTED';
      } else if (disposition === 'NOT_INTERESTED') {
        newStatus = 'CLOSED_NOT_INTERESTED';
      } else if (disposition === 'NO_ANSWER' || disposition === 'BUSY' || disposition === 'VOICEMAIL') {
        currentNoAnswer += 1;
        enqSheet.getRange(enqRowIdx, enqHeaderMap['customer_no_answer_count']).setValue(currentNoAnswer);

        if (currentAttempts >= CONFIG.MAX_RETRY_ATTEMPTS) {
          newStatus = 'EXHAUSTED_NO_ANSWER';
        } else {
          newStatus = 'PENDING_CALL';
          nextRetryAt = calculateNextRetryTimestamp(currentAttempts);
        }
      } else if (disposition === 'FAILED' || disposition === 'INVALID_NUMBER') {
        currentTechFail += 1;
        enqSheet.getRange(enqRowIdx, enqHeaderMap['technical_failures_count']).setValue(currentTechFail);
        newStatus = 'FAILED_TECHNICAL';
      }

      enqSheet.getRange(enqRowIdx, enqHeaderMap['current_status']).setValue(newStatus);
      enqSheet.getRange(enqRowIdx, enqHeaderMap['latest_outcome_id']).setValue(outcomeId);
      enqSheet.getRange(enqRowIdx, enqHeaderMap['active_session_id']).setValue('');
      enqSheet.getRange(enqRowIdx, enqHeaderMap['next_retry_at']).setValue(nextRetryAt);

      SpreadsheetApp.flush();
    }

    return {
      success: true,
      message: 'Call outcome recorded successfully',
      outcome_id: outcomeId,
      enquiry_id: enquiryId,
      disposition: disposition
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 6. RECORD WEBHOOK EVENT
 * Stores raw webhook payload in Webhook_Events tab for observability & replay
 */
function handleRecordWebhookEvent(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

  try {
    var sheet = getSheet(CONFIG.TABS.WEBHOOK_EVENTS);
    var headerMap = getHeaderMap(sheet);

    var eventId = payload.event_id || generateEventId();
    var idempotencyKey = payload.idempotency_key || '';

    if (idempotencyKey) {
      var existingRow = findRowByValue(sheet, headerMap['idempotency_key'], idempotencyKey);
      if (existingRow > 0) {
        return {
          success: true,
          message: 'Webhook event already processed (idempotent)',
          event_id: eventId,
          is_duplicate: true
        };
      }
    }

    var rowData = {
      event_id: eventId,
      provider: payload.provider || 'elevenlabs',
      event_type: payload.event_type || 'call_completed',
      idempotency_key: idempotencyKey,
      enquiry_id: payload.enquiry_id || '',
      call_sid: payload.call_sid || '',
      conversation_id: payload.conversation_id || '',
      received_at: new Date().toISOString(),
      processing_status: payload.processing_status || 'PROCESSED',
      processed_at: new Date().toISOString(),
      raw_payload: typeof payload.raw_payload === 'object' ? JSON.stringify(payload.raw_payload) : String(payload.raw_payload || '')
    };

    appendRowWithHeaderMap(sheet, headerMap, rowData);

    return {
      success: true,
      message: 'Webhook event recorded',
      event_id: eventId
    };

  } finally {
    lock.releaseLock();
  }
}

/**
 * 7. GET SYSTEM STATE
 */
function handleGetSystemState(key) {
  var sheet = getSheet(CONFIG.TABS.SYSTEM_STATE);
  var headerMap = getHeaderMap(sheet);
  var data = getSheetObjects(sheet, headerMap);

  if (key) {
    for (var i = 0; i < data.length; i++) {
      if (data[i].state_key === key) return data[i];
    }
    return null;
  }
  return data;
}

/**
 * 8. UPDATE SYSTEM STATE
 */
function handleUpdateSystemState(payload) {
  var lock = LockService.getScriptLock();
  lock.waitLock(CONFIG.LOCK_TIMEOUT_MS);

  try {
    var key = payload.state_key || payload.key;
    var value = payload.state_value || payload.value;
    var actor = payload.actor || 'system';
    var notes = payload.notes || '';

    if (!key) throw new Error('state_key is required');

    var sheet = getSheet(CONFIG.TABS.SYSTEM_STATE);
    var headerMap = getHeaderMap(sheet);
    var rowIdx = findRowByValue(sheet, headerMap['state_key'], key);

    var now = new Date().toISOString();

    if (rowIdx > 0) {
      sheet.getRange(rowIdx, headerMap['state_value']).setValue(value);
      sheet.getRange(rowIdx, headerMap['updated_at']).setValue(now);
      sheet.getRange(rowIdx, headerMap['actor']).setValue(actor);
      if (notes) sheet.getRange(rowIdx, headerMap['notes']).setValue(notes);
    } else {
      var rowData = {
        state_key: key,
        state_value: value,
        updated_at: now,
        actor: actor,
        notes: notes
      };
      appendRowWithHeaderMap(sheet, headerMap, rowData);
    }

    SpreadsheetApp.flush();

    return {
      success: true,
      message: 'System state updated',
      key: key,
      value: value
    };

  } finally {
    lock.releaseLock();
  }
}

// ============================================================================
// HELPER UTILITIES: SHEET ACCESS, HEADER MAPPING, CALLING WINDOW & SECURITY
// ============================================================================

/**
 * Resolves the Google Spreadsheet instance
 * Checks Script Properties first, then container-bound active sheet, then default ID
 */
function getSpreadsheet() {
  var scriptProps = PropertiesService.getScriptProperties();
  var configuredId = scriptProps.getProperty('SPREADSHEET_ID') || CONFIG.DEFAULT_SPREADSHEET_ID;

  try {
    return SpreadsheetApp.openById(configuredId);
  } catch (e) {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
    throw new Error('Unable to open spreadsheet with ID: ' + configuredId + '. Verify permissions.');
  }
}

function getSpreadsheetId() {
  var scriptProps = PropertiesService.getScriptProperties();
  return scriptProps.getProperty('SPREADSHEET_ID') || CONFIG.DEFAULT_SPREADSHEET_ID;
}

/**
 * Safely fetches a specific tab by name, throwing a clear error if missing
 */
function getSheet(tabName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    throw new Error("Required tab '" + tabName + "' does not exist in spreadsheet: " + ss.getId());
  }
  return sheet;
}

/**
 * Extracts a dynamic 1-indexed header map from Row 1
 * e.g. { enquiry_id: 1, created_at: 2, ... }
 */
function getHeaderMap(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) throw new Error("Sheet '" + sheet.getName() + "' has no columns or headers");
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var key = String(headers[i]).trim();
    if (key) map[key] = i + 1;
  }
  return map;
}

/**
 * Appends a row by strictly mapping object properties to their dynamic column indexes
 */
function appendRowWithHeaderMap(sheet, headerMap, dataObj) {
  var lastCol = sheet.getLastColumn();
  var rowValues = new Array(lastCol);

  // Initialize with empty strings
  for (var c = 0; c < lastCol; c++) {
    rowValues[c] = '';
  }

  // Populate matching header keys
  for (var key in headerMap) {
    if (headerMap.hasOwnProperty(key)) {
      var colIdx = headerMap[key] - 1; // 0-indexed for array
      if (dataObj.hasOwnProperty(key) && dataObj[key] !== undefined && dataObj[key] !== null) {
        rowValues[colIdx] = dataObj[key];
      }
    }
  }

  sheet.appendRow(rowValues);
  SpreadsheetApp.flush();
}

/**
 * Converts a sheet into an array of JS objects using the dynamic header map
 */
function getSheetObjects(sheet, headerMap) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol < 1) return [];

  var values = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  var result = [];

  for (var r = 0; r < values.length; r++) {
    var obj = {};
    for (var key in headerMap) {
      if (headerMap.hasOwnProperty(key)) {
        var colIdx = headerMap[key] - 1;
        obj[key] = values[r][colIdx];
      }
    }
    result.push(obj);
  }
  return result;
}

/**
 * Finds the row index (1-based) where a column matches a target value
 */
function findRowByValue(sheet, colIndex, targetValue) {
  if (!colIndex || colIndex < 1) return -1;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  var colValues = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  var searchStr = String(targetValue).trim().toLowerCase();

  for (var i = 0; i < colValues.length; i++) {
    if (String(colValues[i][0]).trim().toLowerCase() === searchStr) {
      return i + 2; // 1-based index (skipping row 1 header)
    }
  }
  return -1;
}

/**
 * Normalizes website backend request payloads
 * Accommodates camelCase and snake_case variants
 */
function normalizeEnquiryPayload(raw) {
  var name = raw.customer_name || raw.name || raw.fullName || '';
  var phone = raw.phone_number || raw.phone || raw.mobile || '';
  var email = raw.email || '';
  var property = raw.project_interest || raw.propertyId || raw.property_interest || raw.property || '';
  var preferredDate = raw.preferredDate || raw.preferred_date || raw.visitDate || '';

  // Combine supplementary customer notes
  var notes = raw.customer_notes || raw.notes || '';
  var extraDetails = [];
  if (email) extraDetails.push('Email: ' + email);
  if (preferredDate) extraDetails.push('Preferred Visit: ' + preferredDate);
  if (raw.consent !== undefined) extraDetails.push('Consent: ' + (raw.consent ? 'YES' : 'NO'));

  if (extraDetails.length > 0) {
    notes = notes ? (notes + ' | ' + extraDetails.join(' | ')) : extraDetails.join(' | ');
  }

  // Clean phone number
  phone = cleanPhoneNumber(phone);

  return {
    enquiry_id: raw.enquiry_id || raw.id || '',
    created_at: raw.created_at || raw.timestamp || '',
    customer_name: name.trim(),
    phone_number: phone,
    project_interest: property.trim(),
    source: raw.source || 'hsk-website',
    utm_campaign: raw.utm_campaign || raw.campaign || 'direct-web',
    customer_notes: notes,
    queue_class: raw.queue_class || 'NEW'
  };
}

/**
 * Cleans and formats phone number
 */
function cleanPhoneNumber(phone) {
  if (!phone) return '';
  var cleaned = String(phone).replace(/[^\d+]/g, '').trim();
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = '+91' + cleaned;
  }
  return cleaned;
}

/**
 * Determine action from incoming payload or URL parameters
 */
function determineAction(payload, e) {
  if (payload.action) return String(payload.action).toLowerCase();
  if (e && e.parameter && e.parameter.action) return String(e.parameter.action).toLowerCase();

  // If payload contains lead details directly, default to create_enquiry
  if (payload.customer_name || payload.name || payload.phone_number || payload.phone) {
    return 'create_enquiry';
  }
  return 'health';
}

/**
 * Parses POST request body with support for raw JSON or URL-encoded payloads
 */
function parseRequestBody(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (parseErr) {
      // Fallback for form-encoded payload
      if (e.parameter) return e.parameter;
    }
  }
  return e.parameter || {};
}

/**
 * Checks whether an action requires shared secret verification
 */
function isProtectedAction(action) {
  var publicActions = ['create_enquiry', 'submit_enquiry', 'new_enquiry', 'health', 'ping'];
  if (publicActions.indexOf(action) !== -1) {
    return false;
  }
  return true;
}

/**
 * Verifies shared secret against Script Properties
 */
function verifySecret(payload, e) {
  var scriptProps = PropertiesService.getScriptProperties();
  var configuredSecret = scriptProps.getProperty('HSK_SHARED_SECRET');

  // If no secret is configured in Script Properties, permit internal development
  if (!configuredSecret) return true;

  var providedSecret = '';

  // 1. Check payload
  if (payload && (payload.secret || payload.shared_secret || payload.auth_token)) {
    providedSecret = payload.secret || payload.shared_secret || payload.auth_token;
  }

  // 2. Check query parameter
  if (!providedSecret && e && e.parameter && e.parameter.secret) {
    providedSecret = e.parameter.secret;
  }

  // 3. Check request headers
  if (!providedSecret && e && e.headers) {
    providedSecret = e.headers['x-hsk-secret'] || e.headers['X-HSK-Secret'] || e.headers['authorization'];
    if (providedSecret && providedSecret.toLowerCase().indexOf('bearer ') === 0) {
      providedSecret = providedSecret.substring(7);
    }
  }

  return providedSecret === configuredSecret;
}

/**
 * Checks if current time is within permitted calling window (09:00 AM - 08:00 PM IST)
 */
function isWithinCallingWindow() {
  var now = new Date();
  var istDateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
  var hour = parseInt(istDateStr.substring(11, 13), 10);
  return hour >= CONFIG.CALLING_WINDOW.START_HOUR && hour < CONFIG.CALLING_WINDOW.END_HOUR;
}

/**
 * Calculates ISO string for 09:00 AM IST of the next morning
 */
function getNextCallingWindowStartIso() {
  var now = new Date();
  var istDateStr = Utilities.formatDate(now, CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
  var hour = parseInt(istDateStr.substring(11, 13), 10);

  // If before 9 AM today, schedule for today at 9 AM
  var targetDayOffset = (hour < CONFIG.CALLING_WINDOW.START_HOUR) ? 0 : 1;
  var targetDate = new Date(now.getTime() + (targetDayOffset * 24 * 60 * 60 * 1000));
  var datePrefix = Utilities.formatDate(targetDate, CONFIG.TIMEZONE, 'yyyy-MM-dd');

  // 09:00:00 IST = 03:30:00 UTC
  return datePrefix + 'T09:00:00+05:30';
}

/**
 * Calculates retry timestamp with backoff
 */
function calculateNextRetryTimestamp(attemptCount) {
  var backoffHours = CONFIG.RETRY_BACKOFF_HOURS[attemptCount - 1] || 24;
  var retryDate = new Date(Date.now() + (backoffHours * 60 * 60 * 1000));

  // Verify if retryDate falls within window
  var istHour = parseInt(Utilities.formatDate(retryDate, CONFIG.TIMEZONE, 'HH'), 10);
  if (istHour < CONFIG.CALLING_WINDOW.START_HOUR || istHour >= CONFIG.CALLING_WINDOW.END_HOUR) {
    return getNextCallingWindowStartIso();
  }
  return retryDate.toISOString();
}

/**
 * ID Generators
 */
function generateEnquiryId() {
  return 'ENQ-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generateOutcomeId() {
  return 'OUT-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function generateEventId() {
  return 'EVT-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

/**
 * Standardized JSON HTTP Response Envelope
 */
function createJsonResponse(data, statusCode) {
  var output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
