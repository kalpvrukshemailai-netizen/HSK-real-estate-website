import React, { useEffect, useState, useRef } from 'react'
import Lenis from 'lenis'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  MapPin,
  Check,
  MessageCircle,
  Menu,
  X
} from 'lucide-react'

// Authentic Silverleaf & HSK Properties Data (Source: Project Specification PDF, Sections 2, 3-6 & 17)
const PROPERTIES = [
  {
    id: 'SL-1B-401',
    code: 'sl-1b-401',
    number: '01',
    title: '1 bhk starter apartment',
    typology: '1 BHK Starter Compact Home',
    tagline: 'compact starter home, combined living/dining, kitchen, lift and common security',
    category: 'Apartment',
    configGroup: '1bhk',
    bhk: 1,
    priceNumeric: 5400000,
    priceDisplay: '₹54 lakh',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Bopal, Ahmedabad, Gujarat',
    tower: 'Tower A',
    floor: 'Floor 2 (illustrative)',
    facing: 'North-East courtyard view',
    carpetAreaSqM: 49,
    carpetAreaSqFt: 527,
    builtUpSqM: 61,
    builtUpSqFt: 657,
    saleableSqM: 73,
    saleableSqFt: 786,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 1,
    bathrooms: 1,
    balconies: 1,
    parking: '1 allotted two-wheeler space; car parking subject to availability',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Ready to move',
    possession: 'Immediate / Ready to Move',
    rera: 'Sanctioned Plan Ref: SL/BOP/2026/401',
    image: '/images/praise2-lg.webp',
    details: 'Compact starter home in Bopal designed for young professionals or investors, featuring combined living/dining, functional kitchen, lift access and security.',
    spaces: [
      { name: 'living + dining', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bedroom', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'kitchen', areaM: '6 sq. m.', areaFt: '65 sq. ft.' },
      { name: 'bathroom', areaM: '5 sq. m.', areaFt: '54 sq. ft.' },
      { name: 'passage & storage', areaM: '7 sq. m.', areaFt: '75 sq. ft.' },
      { name: 'balcony / utility', areaM: '4 sq. m.', areaFt: '43 sq. ft.' }
    ],
    highlights: [
      'RCC framed structure with approved masonry and anti-skid bathroom tile',
      'Vitrified flooring in dry areas and stone kitchen counter',
      'Concealed wiring/plumbing with approved common fire-safety measures',
      'Ready-to-move efficiency ideal for single occupants or starter couples'
    ],
    bestSuited: 'first-time buyers, young professionals, and investors seeking manageable maintenance'
  },
  {
    id: 'SL-2B-101',
    code: 'sl-2b-101',
    number: '02',
    title: '2 bhk apartment',
    typology: '2 BHK Compact Luxury Sanctuary',
    tagline: 'compact two-bedroom home for couples, small families, or first-time buyers',
    category: 'Apartment',
    configGroup: '2bhk',
    bhk: 2,
    priceNumeric: 7800000,
    priceDisplay: '₹78 lakh',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Near SP Ring Road, South-West Ahmedabad',
    tower: 'Tower A',
    floor: 'Floor 5',
    facing: 'East-facing living room (morning light)',
    carpetAreaSqM: 74,
    carpetAreaSqFt: 797,
    builtUpSqM: 92,
    builtUpSqFt: 990,
    saleableSqM: 111,
    saleableSqFt: 1195,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    parking: '1 allotted covered space',
    maintenance: '₹3,000 / month (illustrative)',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/AMD/2028/01',
    image: '/images/pramukh-pentagon.webp',
    details: 'Compact two-bedroom floor plan engineered with dual-aspect ventilation, morning sunlight channels, and an independent utility niche.',
    spaces: [
      { name: 'living + dining', areaM: '20 sq. m.', areaFt: '215 sq. ft.' },
      { name: 'bedroom 1', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'bedroom 2', areaM: '11 sq. m.', areaFt: '118 sq. ft.' },
      { name: 'kitchen', areaM: '8 sq. m.', areaFt: '86 sq. ft.' },
      { name: 'bathrooms (2 combined)', areaM: '8 sq. m.', areaFt: '86 sq. ft.' },
      { name: 'passage, storage & internal', areaM: '14 sq. m.', areaFt: '151 sq. ft.' },
      { name: 'balcony / utility', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'East-facing living room capturing gentle morning daylight',
      'Vitrified tile flooring in living areas; anti-skid in wet zones',
      'AAC lightweight masonry with acoustic and thermal insulation',
      'Granite kitchen counter with sink, water purifier & exhaust provision'
    ],
    bestSuited: 'first-time buyers, couples, small families prioritizing manageable maintenance'
  },
  {
    id: 'SL-2B-102',
    code: 'sl-2b-102',
    number: '03',
    title: '2 bhk smart apartment',
    typology: '2 BHK Smart Efficiency Suite',
    tagline: 'balcony, utility niche, modular-kitchen provision, lift and landscaped garden',
    category: 'Apartment',
    configGroup: '2bhk',
    bhk: 2,
    priceNumeric: 8200000,
    priceDisplay: '₹82 lakh',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'South Bopal, Ahmedabad, Gujarat',
    tower: 'Tower A',
    floor: 'Floor 3',
    facing: 'North-facing (balanced ambient daylight)',
    carpetAreaSqM: 76,
    carpetAreaSqFt: 818,
    builtUpSqM: 94,
    builtUpSqFt: 1012,
    saleableSqM: 113,
    saleableSqFt: 1216,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    parking: '1 covered car parking',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Ready to move',
    possession: 'Immediate / Ready to Move',
    rera: 'Sanctioned Plan Ref: SL/SBOP/2026/102',
    image: '/images/arista1-lg.webp',
    details: 'Smart two-bedroom apartment in South Bopal with private balcony, utility niche, modular kitchen provision, passenger lift, and landscaped garden views.',
    spaces: [
      { name: 'living + dining', areaM: '21 sq. m.', areaFt: '226 sq. ft.' },
      { name: 'bedroom 1', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'bedroom 2', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'kitchen', areaM: '8.5 sq. m.', areaFt: '91 sq. ft.' },
      { name: 'bathrooms (2 combined)', areaM: '8 sq. m.', areaFt: '86 sq. ft.' },
      { name: 'passage & internal storage', areaM: '13.5 sq. m.', areaFt: '146 sq. ft.' },
      { name: 'balcony / utility', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'North-facing floor 3 position shielding from harsh afternoon glare',
      'Modular kitchen electrical conduits, gas line, and plumbing provisioned',
      'Vitrified flooring in dry rooms, anti-skid tiles in bathrooms',
      'Concealed copper wiring with dedicated MCB distribution box'
    ],
    bestSuited: 'first-time buyers, couples, and professionals seeking move-in readiness in South Bopal'
  },
  {
    id: 'SL-2B-103',
    code: 'sl-2b-103',
    number: '04',
    title: '2 bhk garden-view apartment',
    typology: '2 BHK Garden-View Sanctuary',
    tagline: 'garden-facing balcony, dining niche, utility area, children\'s play area and bicycle parking',
    category: 'Apartment',
    configGroup: '2bhk',
    bhk: 2,
    priceNumeric: 8600000,
    priceDisplay: '₹86 lakh',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Bopal, Ahmedabad, Gujarat',
    tower: 'Tower A',
    floor: 'Floor 6',
    facing: 'Garden-facing (central botanical park view)',
    carpetAreaSqM: 79,
    carpetAreaSqFt: 850,
    builtUpSqM: 98,
    builtUpSqFt: 1055,
    saleableSqM: 118,
    saleableSqFt: 1270,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    parking: '1 covered car parking',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Under construction',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/BOP/2028/103',
    image: '/images/praise3-lg.webp',
    details: 'Garden-view residence on Floor 6 in Bopal, featuring a tranquil garden-facing balcony, dedicated dining niche, utility enclave, and bicycle parking.',
    spaces: [
      { name: 'living + dining niche', areaM: '22 sq. m.', areaFt: '237 sq. ft.' },
      { name: 'bedroom 1', areaM: '14 sq. m.', areaFt: '151 sq. ft.' },
      { name: 'bedroom 2', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'kitchen', areaM: '9 sq. m.', areaFt: '97 sq. ft.' },
      { name: 'bathrooms (2 combined)', areaM: '8 sq. m.', areaFt: '86 sq. ft.' },
      { name: 'circulation & passage', areaM: '14 sq. m.', areaFt: '150 sq. ft.' },
      { name: 'garden-facing balcony', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Elevated 6th floor balcony overlooking landscaped green lawns',
      'Engineered RCC frame with waterproofed wet zones and anti-skid tiles',
      'Pre-installed AC conduits and concealed electrical lines',
      'Children\'s play enclave and common fire-safety infrastructure'
    ],
    bestSuited: 'nature enthusiasts and young families desiring green vistas and community recreation'
  },
  {
    id: 'SL-2B-104',
    code: 'sl-2b-104',
    number: '05',
    title: '2 bhk corner apartment',
    typology: '2 BHK Corner Cross-Breeze Residence',
    tagline: 'corner layout, potential two-side ventilation subject to plan, balcony, lift and security',
    category: 'Apartment',
    configGroup: '2bhk',
    bhk: 2,
    priceNumeric: 8900000,
    priceDisplay: '₹89 lakh',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Shela, Ahmedabad, Gujarat',
    tower: 'Tower B',
    floor: 'Floor 9',
    facing: 'Corner dual-aspect (cross-ventilation breeze)',
    carpetAreaSqM: 81,
    carpetAreaSqFt: 872,
    builtUpSqM: 100,
    builtUpSqFt: 1076,
    saleableSqM: 121,
    saleableSqFt: 1302,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    parking: '1 covered car parking',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SHL/2028/104',
    image: '/images/arista2-lg.webp',
    details: 'Corner layout on Floor 9 in Shela offering potential two-side ventilation, expansive natural light, powder-coated uPVC windows, and high-speed elevator access.',
    spaces: [
      { name: 'living + dining room', areaM: '23 sq. m.', areaFt: '248 sq. ft.' },
      { name: 'master bedroom', areaM: '14.5 sq. m.', areaFt: '156 sq. ft.' },
      { name: 'bedroom 2', areaM: '12.5 sq. m.', areaFt: '135 sq. ft.' },
      { name: 'kitchen', areaM: '9 sq. m.', areaFt: '97 sq. ft.' },
      { name: 'bathrooms (2 combined)', areaM: '8 sq. m.', areaFt: '86 sq. ft.' },
      { name: 'passage & storage', areaM: '14 sq. m.', areaFt: '150 sq. ft.' },
      { name: 'corner viewing balcony', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Dual-aspect corner positioning maximizing fresh cross-ventilation',
      'Floor 9 elevated open horizons and unhindered skyline vistas',
      'Powder-coated aluminium/uPVC windows with clear acoustic glass',
      'Concealed wiring with MCB distribution board and covered car space'
    ],
    bestSuited: 'buyers seeking superior ventilation, natural daylight, and corner privacy in Shela'
  },
  {
    id: 'SL-3B-204',
    code: 'sl-3b-204',
    number: '06',
    title: '3 bhk apartment',
    typology: '3 BHK Corner Family Residence',
    tagline: 'larger family apartment with separate dining area, three bedrooms and additional storage',
    category: 'Apartment',
    configGroup: '3bhk',
    bhk: 3,
    priceNumeric: 11200000,
    priceDisplay: '₹1.12 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Near SP Ring Road, South-West Ahmedabad',
    tower: 'Tower A',
    floor: 'Floor 8',
    facing: 'North-East corner unit (dual aspect breeze)',
    carpetAreaSqM: 105,
    carpetAreaSqFt: 1130,
    builtUpSqM: 130,
    builtUpSqFt: 1399,
    saleableSqM: 156,
    saleableSqFt: 1679,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: '1 covered space (second optional)',
    maintenance: '₹4,200 / month (illustrative)',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/AMD/2028/02',
    image: '/images/pramukh-praise.webp',
    details: 'Spacious corner residence configured with two expansive balconies, open dining zone, and dedicated laundry and utility enclosure.',
    spaces: [
      { name: 'living + dining', areaM: '27 sq. m.', areaFt: '291 sq. ft.' },
      { name: 'master bedroom', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'bedroom 2', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'bedroom 3', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'kitchen', areaM: '10 sq. m.', areaFt: '108 sq. ft.' },
      { name: 'bathrooms (3 combined)', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'passage, storage & internal', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: '2 balconies / utility', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'North-East corner vantage with continuous natural cross-ventilation',
      'Master bathroom with provision for tempered glass shower partition',
      'Aluminium/uPVC windows with weather-resistant exterior emulsion',
      'Concealed copper wiring with dedicated AC and data feeds in all rooms'
    ],
    bestSuited: 'families needing a dedicated room for children, guests, work-from-home or study'
  },
  {
    id: 'SL-3B-205',
    code: 'sl-3b-205',
    number: '07',
    title: '3 bhk family apartment',
    typology: '3 BHK Family Living Residence',
    tagline: 'three bathrooms, two balconies, utility zone, family dining, lift and community room',
    category: 'Apartment',
    configGroup: '3bhk',
    bhk: 3,
    priceNumeric: 11800000,
    priceDisplay: '₹1.18 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Bopal, Ahmedabad, Gujarat',
    tower: 'Tower A',
    floor: 'Floor 5',
    facing: 'East-facing (dawn morning sunshine)',
    carpetAreaSqM: 108,
    carpetAreaSqFt: 1163,
    builtUpSqM: 134,
    builtUpSqFt: 1442,
    saleableSqM: 161,
    saleableSqFt: 1733,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: '1 covered car parking',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Ready to move',
    possession: 'Immediate / Ready to Move',
    rera: 'Sanctioned Plan Ref: SL/BOP/2026/205',
    image: '/images/trinity1-lg.webp',
    details: 'Spacious ready-to-move 3 BHK in Bopal featuring 3 bathrooms, two deep balconies, dedicated family dining area, separate utility zone, and multipurpose room access.',
    spaces: [
      { name: 'living + family dining', areaM: '28 sq. m.', areaFt: '301 sq. ft.' },
      { name: 'master bedroom', areaM: '17 sq. m.', areaFt: '183 sq. ft.' },
      { name: 'bedroom 2', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'bedroom 3', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'kitchen', areaM: '11 sq. m.', areaFt: '118 sq. ft.' },
      { name: 'bathrooms (3 combined)', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'passage & internal storage', areaM: '15 sq. m.', areaFt: '163 sq. ft.' },
      { name: '2 balconies & utility', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Three full bathrooms accommodating large multi-member households',
      'East-facing master layout bathed in morning sunrise illumination',
      'Stone kitchen counter with exhaust provision & anti-skid bathroom tiles',
      'Immediate occupancy ready with lift access and covered car space'
    ],
    bestSuited: 'families wanting immediate move-in readiness with three private bathrooms and double balconies'
  },
  {
    id: 'SL-3B-206',
    code: 'sl-3b-206',
    number: '08',
    title: '3 bhk work-from-home apartment',
    typology: '3 BHK Hybrid Work & Living Haven',
    tagline: 'flexible third bedroom for office/study, two balconies, internet/TV points, play area and gym room',
    category: 'Apartment',
    configGroup: '3bhk',
    bhk: 3,
    priceNumeric: 12400000,
    priceDisplay: '₹1.24 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'South Bopal, Ahmedabad, Gujarat',
    tower: 'Tower B',
    floor: 'Floor 7',
    facing: 'South-East orientation (all-day ambient daylight)',
    carpetAreaSqM: 112,
    carpetAreaSqFt: 1206,
    builtUpSqM: 139,
    builtUpSqFt: 1496,
    saleableSqM: 167,
    saleableSqFt: 1798,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: '1 covered car; second subject to availability',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Under construction',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SBOP/2028/206',
    image: '/images/praise2-lg.webp',
    details: 'Intelligently planned hybrid apartment in South Bopal with flexible third bedroom configured for quiet executive study, high-speed fiber conduits, and dual balconies.',
    spaces: [
      { name: 'living + dining zone', areaM: '29 sq. m.', areaFt: '312 sq. ft.' },
      { name: 'master bedroom', areaM: '17 sq. m.', areaFt: '183 sq. ft.' },
      { name: 'bedroom 2', areaM: '14 sq. m.', areaFt: '151 sq. ft.' },
      { name: 'executive home office / bed 3', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'kitchen', areaM: '11 sq. m.', areaFt: '118 sq. ft.' },
      { name: 'bathrooms (3 combined)', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'passage & storage', areaM: '15 sq. m.', areaFt: '162 sq. ft.' },
      { name: '2 balconies & utility', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Acoustically insulated third bedroom tailored for executive remote work',
      'Floor 7 South-East orientation providing continuous gentle sunlight',
      'Structured high-speed internet, data and split-AC conduit feeds',
      'Direct access to resident gym studio and children\'s recreation lawns'
    ],
    bestSuited: 'remote professionals, tech leaders, consultants, and families needing a dedicated study'
  },
  {
    id: 'SL-3B-207',
    code: 'sl-3b-207',
    number: '09',
    title: '3 bhk premium balcony apartment',
    typology: '3 BHK Panoramic Terrace Balcony Suite',
    tagline: 'larger living/dining, two balconies, optional upgraded finish package, gym and landscaped open space',
    category: 'Apartment',
    configGroup: '3bhk',
    bhk: 3,
    priceNumeric: 13200000,
    priceDisplay: '₹1.32 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Shela, Ahmedabad, Gujarat',
    tower: 'Tower B',
    floor: 'Floor 11',
    facing: 'Open horizon view (sunset skyline perspective)',
    carpetAreaSqM: 116,
    carpetAreaSqFt: 1249,
    builtUpSqM: 144,
    builtUpSqFt: 1550,
    saleableSqM: 173,
    saleableSqFt: 1862,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: '2 covered spaces (verify)',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SHL/2028/207',
    image: '/images/arista2-lg.webp',
    details: 'Upper-floor sky residence in Shela offering an enlarged living/dining salon, dual wide panoramic balconies, optional designer finishes, and two covered parking spaces.',
    spaces: [
      { name: 'expansive living + dining', areaM: '31 sq. m.', areaFt: '334 sq. ft.' },
      { name: 'master bedroom suite', areaM: '18 sq. m.', areaFt: '194 sq. ft.' },
      { name: 'bedroom 2', areaM: '14 sq. m.', areaFt: '151 sq. ft.' },
      { name: 'bedroom 3', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'kitchen', areaM: '11 sq. m.', areaFt: '118 sq. ft.' },
      { name: 'bathrooms (3 combined)', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'foyer & circulation', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: '2 wide panoramic balconies', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'High-altitude 11th-floor horizon views overlooking green Shela enclaves',
      'Two reserved covered vehicular parking stalls',
      'Large-format vitrified floor options and engineered balcony balustrades',
      'Exclusive fitness pavilion and landscaped open space privileges'
    ],
    bestSuited: 'buyers who cherish elevated open views, outdoor balcony hosting, and expanded living dimensions'
  },
  {
    id: 'SL-3B-208',
    code: 'sl-3b-208',
    number: '10',
    title: '3 bhk terrace-access apartment',
    typology: '3 BHK Top-Floor Sky Penthouse with Terrace Access',
    tagline: 'top-floor layout, two balconies; terrace access only if granted in approved plans and sale agreement',
    category: 'Apartment',
    configGroup: '3bhk',
    bhk: 3,
    priceNumeric: 13800000,
    priceDisplay: '₹1.38 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Shela, Ahmedabad, Gujarat',
    tower: 'Tower B',
    floor: 'Top Floor',
    facing: 'Top-floor 360° panoramic horizon vantage',
    carpetAreaSqM: 120,
    carpetAreaSqFt: 1292,
    builtUpSqM: 148,
    builtUpSqFt: 1593,
    saleableSqM: 178,
    saleableSqFt: 1916,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 3,
    bathrooms: 3,
    balconies: 2,
    parking: '2 covered spaces (verify)',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SHL/2028/208',
    image: '/images/praise3-lg.webp',
    details: 'Crown top-floor apartment in Shela featuring 120 m² (1,292 sq. ft.) carpet area, two expansive balconies, roof terrace access potential, and 2 covered parking bays.',
    spaces: [
      { name: 'grand living + dining', areaM: '32 sq. m.', areaFt: '344 sq. ft.' },
      { name: 'master bedroom suite', areaM: '19 sq. m.', areaFt: '205 sq. ft.' },
      { name: 'bedroom 2', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bedroom 3', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'kitchen & utility', areaM: '12 sq. m.', areaFt: '129 sq. ft.' },
      { name: 'bathrooms (3 combined)', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'gallery & passage', areaM: '16 sq. m.', areaFt: '173 sq. ft.' },
      { name: 'sky terrace access & balconies', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Top-floor penthouse exclusivity with direct rooftop sky terrace connection',
      'Two generous open-air balconies capturing panoramic sunrises & sunsets',
      'Dual covered parking bays included in reservation scope',
      'Specialized multi-layer roof thermal insulation and waterproofing system'
    ],
    bestSuited: 'buyers seeking penthouse prestige, open-sky terrace lifestyle, and top-floor peace'
  },
  {
    id: 'SL-4B-305',
    code: 'sl-4b-305',
    number: '11',
    title: '4 bhk premium apartment',
    typology: '4 BHK Grand Sky Residence',
    tagline: 'spacious apartment with four bedrooms, larger living zone and room for a home office',
    category: 'Premium Apartment',
    configGroup: '4bhk',
    bhk: 4,
    priceNumeric: 15800000,
    priceDisplay: '₹1.58 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Near SP Ring Road, South-West Ahmedabad',
    tower: 'Tower B',
    floor: 'Floor 12',
    facing: 'West-facing balcony with open horizon view',
    carpetAreaSqM: 145,
    carpetAreaSqFt: 1561,
    builtUpSqM: 178,
    builtUpSqFt: 1916,
    saleableSqM: 214,
    saleableSqFt: 2303,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    parking: '2 covered parking spaces',
    maintenance: '₹5,800 / month (illustrative)',
    availability: 'Limited',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/AMD/2028/03',
    image: '/images/pramukh-arista.webp',
    details: 'Limited floor-12 high rise home offering private vestibule arrival, four en-suite bathrooms, dedicated home office/guest suite, and sunset views.',
    spaces: [
      { name: 'living + dining', areaM: '32 sq. m.', areaFt: '344 sq. ft.' },
      { name: 'master bedroom', areaM: '19 sq. m.', areaFt: '205 sq. ft.' },
      { name: 'bedroom 2', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bedroom 3', areaM: '14 sq. m.', areaFt: '151 sq. ft.' },
      { name: 'bedroom 4 / home office', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'kitchen + utility room', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bathrooms (4 combined)', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'passage, storage & internal', areaM: '21 sq. m.', areaFt: '226 sq. ft.' },
      { name: '2 wide horizon balconies', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Level 12 penthouse vantage framing panoramic western horizon',
      'Large-format vitrified stone-finish tiling in living & dining areas',
      'Four full bathrooms with concealed plumbing and branded CP fittings',
      'Dual covered parking bays and high-speed passenger elevators'
    ],
    bestSuited: 'larger families, multi-generational households, or buyers needing separate office and guest suites'
  },
  {
    id: 'SL-4B-306',
    code: 'sl-4b-306',
    number: '12',
    title: '4 bhk multi-generation apartment',
    typology: '4 BHK Multi-Generational Family Suite',
    tagline: 'four bedrooms and bathrooms, larger dining zone, two balconies and two parking spaces',
    category: 'Premium Apartment',
    configGroup: '4bhk',
    bhk: 4,
    priceNumeric: 16800000,
    priceDisplay: '₹1.68 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'South Bopal, Ahmedabad, Gujarat',
    tower: 'Tower A',
    floor: 'Floor 10',
    facing: 'East-facing living & master suite (dawn light)',
    carpetAreaSqM: 149,
    carpetAreaSqFt: 1604,
    builtUpSqM: 183,
    builtUpSqFt: 1970,
    saleableSqM: 220,
    saleableSqFt: 2368,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    parking: '2 covered cars',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SBOP/2028/306',
    image: '/images/psygroup.webp',
    details: 'Spacious 4 BHK residence in South Bopal planned for joint families with 4 full bathrooms, expansive dining room, two balconies, and two parking stalls.',
    spaces: [
      { name: 'formal living & family dining', areaM: '33 sq. m.', areaFt: '355 sq. ft.' },
      { name: 'primary master suite', areaM: '20 sq. m.', areaFt: '215 sq. ft.' },
      { name: 'bedroom 2 (elder suite)', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'bedroom 3', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bedroom 4 / study', areaM: '13 sq. m.', areaFt: '140 sq. ft.' },
      { name: 'kitchen & utility pantry', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bathrooms (4 combined)', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'vestibule & circulation', areaM: '21 sq. m.', areaFt: '228 sq. ft.' },
      { name: '2 wide horizon balconies', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Four independent en-suite bedrooms providing absolute privacy for multi-gen families',
      'Level 10 vantage with gentle morning east daylight illumination',
      'Two reserved covered vehicular parking stalls',
      'Reinforced RCC acoustic frame and double passenger elevator access'
    ],
    bestSuited: 'large families, multi-generational households, and owners wanting separate private suites'
  },
  {
    id: 'SL-4B-307',
    code: 'sl-4b-307',
    number: '13',
    title: '4 bhk corner premium apartment',
    typology: '4 BHK Corner Sky Sanctuary',
    tagline: 'corner plan, flexible office/guest bedroom, two balconies and larger kitchen',
    category: 'Premium Apartment',
    configGroup: '4bhk',
    bhk: 4,
    priceNumeric: 17800000,
    priceDisplay: '₹1.78 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Bopal, Ahmedabad, Gujarat',
    tower: 'Tower B',
    floor: 'Floor 14',
    facing: 'Corner triple-aspect (panoramic horizon)',
    carpetAreaSqM: 154,
    carpetAreaSqFt: 1658,
    builtUpSqM: 190,
    builtUpSqFt: 2045,
    saleableSqM: 228,
    saleableSqFt: 2454,
    plotSqM: null,
    plotSqFt: null,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    parking: '2 covered cars',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Under construction',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/BOP/2028/307',
    image: '/images/pramukh-arista.webp',
    details: 'Penthouse level 14 corner sky sanctuary in Bopal offering triple-aspect airflow, 154 m² usable carpet area, flexible office suite, chef kitchen, and 2 covered parking bays.',
    spaces: [
      { name: 'grand corner living & dining', areaM: '35 sq. m.', areaFt: '377 sq. ft.' },
      { name: 'presidential master suite', areaM: '21 sq. m.', areaFt: '226 sq. ft.' },
      { name: 'bedroom 2', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'bedroom 3', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'bedroom 4 / studio', areaM: '14 sq. m.', areaFt: '151 sq. ft.' },
      { name: 'large gourmet kitchen + utility', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'bathrooms (4 combined)', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'foyer, passage & store', areaM: '21 sq. m.', areaFt: '227 sq. ft.' },
      { name: '2 corner terrace balconies', areaM: 'exclusive', areaFt: 'excluded from carpet' }
    ],
    highlights: [
      'Highest 14th-floor corner elevation with expansive triple-aspect city skyline panorama',
      'Substantial chef kitchen layout with independent exterior service utility',
      'Two covered parking spaces with EV charging point conduit access',
      'Private vestibule entry with enhanced acoustic insulation doors'
    ],
    bestSuited: 'discerning families desiring top-floor corner vistas, maximum spatial volume, and elite finishing'
  },
  {
    id: 'SL-V-07',
    code: 'sl-v-07',
    number: '14',
    title: 'independent 4 bhk villa',
    typology: '4 BHK Standalone Signature Villa',
    tagline: 'two-level independent home with private outdoor space, family lounge and dedicated parking',
    category: 'Independent Villa',
    configGroup: 'villa',
    bhk: 4,
    priceNumeric: 26500000,
    priceDisplay: '₹2.65 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Near SP Ring Road, South-West Ahmedabad',
    tower: 'Villa Enclave',
    floor: 'Ground + First Floor',
    facing: 'Private plot perimeter with 70 sq. m. garden',
    carpetAreaSqM: 204,
    carpetAreaSqFt: 2196,
    builtUpSqM: 252,
    builtUpSqFt: 2712,
    saleableSqM: null,
    saleableSqFt: null,
    plotSqM: 325,
    plotSqFt: 3498,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    parking: '2 cars within private plot',
    maintenance: '₹6,500 / month (gated services; private upkeep extra)',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/AMD/2028/04',
    image: '/images/pramukh-trinity.webp',
    details: 'Free-standing two-tier architectural villa set on a 325 sq. m. private plot, featuring ground-floor formal entertaining, private lawn, and upper family lounge.',
    spaces: [
      { name: 'ground: living + dining', areaM: '36 sq. m.', areaFt: '388 sq. ft.' },
      { name: 'ground: kitchen + utility', areaM: '15 sq. m.', areaFt: '161 sq. ft.' },
      { name: 'ground: bedroom + bath', areaM: '22 sq. m.', areaFt: '237 sq. ft.' },
      { name: 'ground: circulation & stair', areaM: '18 sq. m.', areaFt: '194 sq. ft.' },
      { name: 'first: master suite + bath', areaM: '30 sq. m.', areaFt: '323 sq. ft.' },
      { name: 'first: bedrooms 3 & 4', areaM: '28 sq. m.', areaFt: '301 sq. ft.' },
      { name: 'first: lounge & circulation', areaM: '55 sq. m.', areaFt: '592 sq. ft.' },
      { name: 'private garden & lawn', areaM: 'approx. 70 sq. m.', areaFt: 'plot: 3,498 sq. ft.' }
    ],
    highlights: [
      'Independent structural envelope with complete privacy and private grounds',
      'Approx. 70 sq. m. private landscaped garden and open-air courtyard',
      'Waterproofed private roof terrace with integrated rainwater drainage',
      'Private two-car paved driveway within the gated plot boundary'
    ],
    bestSuited: 'buyers seeking complete privacy, private outdoor space, independent access and room for larger households'
  },
  {
    id: 'SL-V-08',
    code: 'sl-v-08',
    number: '15',
    title: '4 bhk courtyard villa',
    typology: '4 BHK Private Courtyard Signature Villa',
    tagline: 'approx. 350 m² plot, private courtyard/garden, family lounge and two-car parking',
    category: 'Independent Villa',
    configGroup: 'villa',
    bhk: 4,
    priceNumeric: 28200000,
    priceDisplay: '₹2.82 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Shela, Ahmedabad, Gujarat',
    tower: 'Villa Enclave (Shela)',
    floor: 'Ground + First Floor',
    facing: 'Private courtyard & internal landscaped garden',
    carpetAreaSqM: 210,
    carpetAreaSqFt: 2260,
    builtUpSqM: 260,
    builtUpSqFt: 2799,
    saleableSqM: null,
    saleableSqFt: null,
    plotSqM: 350,
    plotSqFt: 3767,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    parking: '2 cars within plot',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SHL/2028/V08',
    image: '/images/trinity1-lg.webp',
    details: 'Two-level standalone villa in Shela on approx. 350 m² plot, boasting a secluded central open-air courtyard, private garden lawn, family lounge, and 2-car internal driveway.',
    spaces: [
      { name: 'ground: formal living + dining', areaM: '38 sq. m.', areaFt: '409 sq. ft.' },
      { name: 'ground: central open courtyard', areaM: 'approx. 40 sq. m.', areaFt: 'open to sky' },
      { name: 'ground: kitchen & utility pantry', areaM: '16 sq. m.', areaFt: '172 sq. ft.' },
      { name: 'ground: guest suite + bath', areaM: '23 sq. m.', areaFt: '248 sq. ft.' },
      { name: 'first: master suite + bath', areaM: '32 sq. m.', areaFt: '344 sq. ft.' },
      { name: 'first: bedrooms 3 & 4', areaM: '30 sq. m.', areaFt: '323 sq. ft.' },
      { name: 'first: private family lounge', areaM: '38 sq. m.', areaFt: '409 sq. ft.' },
      { name: 'landscaped lawn & driveway', areaM: 'plot 350 sq. m.', areaFt: '3,767 sq. ft.' }
    ],
    highlights: [
      '350 sq. m. private plot centered around a signature open-air courtyard',
      'Two-car paved driveway with secure automated sliding compound gate',
      'Waterproofed private roof terrace with integrated solar/rainwater collection',
      'Zero shared walls ensuring absolute acoustic and visual seclusion'
    ],
    bestSuited: 'buyers desiring private independent villa grounds, internal open-to-sky courtyards, and secluded family living'
  },
  {
    id: 'SL-V-09',
    code: 'sl-v-09',
    number: '16',
    title: '4 bhk garden villa',
    typology: '4 BHK Verdant Botanical Garden Villa',
    tagline: 'approx. 375 m² plot, private garden, family lounge, covered entry and two-car parking',
    category: 'Independent Villa',
    configGroup: 'villa',
    bhk: 4,
    priceNumeric: 29500000,
    priceDisplay: '₹2.95 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'Bopal, Ahmedabad, Gujarat',
    tower: 'Villa Enclave (Bopal)',
    floor: 'Ground + First Floor',
    facing: 'Perimeter private botanical garden',
    carpetAreaSqM: 218,
    carpetAreaSqFt: 2347,
    builtUpSqM: 270,
    builtUpSqFt: 2906,
    saleableSqM: null,
    saleableSqFt: null,
    plotSqM: 375,
    plotSqFt: 4036,
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    parking: '2 cars within plot',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Under construction',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/BOP/2028/V09',
    image: '/images/trinity2-lg.webp',
    details: 'Spectacular 375 m² estate villa in Bopal framed by an extensive wraparound private garden, shaded portico arrival, double-height foyer, and dedicated upper family retreat.',
    spaces: [
      { name: 'ground: living + garden dining', areaM: '40 sq. m.', areaFt: '430 sq. ft.' },
      { name: 'ground: kitchen & utility wash', areaM: '17 sq. m.', areaFt: '183 sq. ft.' },
      { name: 'ground: bedroom 1 + bath', areaM: '24 sq. m.', areaFt: '258 sq. ft.' },
      { name: 'first: master retreat + balcony', areaM: '34 sq. m.', areaFt: '366 sq. ft.' },
      { name: 'first: bedrooms 3 & 4', areaM: '32 sq. m.', areaFt: '344 sq. ft.' },
      { name: 'first: upstairs family salon', areaM: '40 sq. m.', areaFt: '430 sq. ft.' },
      { name: 'private wraparound garden', areaM: 'approx. 90 sq. m.', areaFt: 'lush lawn' },
      { name: 'estate plot area', areaM: '375 sq. m.', areaFt: '4,036 sq. ft.' }
    ],
    highlights: [
      '375 sq. m. generous estate grounds with sprawling lawn and mature fruit trees',
      'Covered carriage portico with two-car paved private parking',
      'Engineered foundation with reinforced anti-termite and waterproofing barrier',
      'Low-VOC breathable interior paint and energy-efficient AAC envelope'
    ],
    bestSuited: 'nature lovers and families prioritizing extensive green lawn space and independent living'
  },
  {
    id: 'SL-V-10',
    code: 'sl-v-10',
    number: '17',
    title: '5 bhk executive villa',
    typology: '5 BHK Grand Executive Sovereign Estate',
    tagline: 'approx. 420 m² plot, five bedrooms, guest suite, family lounge, private garden and two-car parking',
    category: 'Independent Villa',
    configGroup: 'villa',
    bhk: 5,
    priceNumeric: 34500000,
    priceDisplay: '₹3.45 crore',
    priceNote: 'indicative base price • taxes & maintenance extra',
    location: 'South Bopal, Ahmedabad, Gujarat',
    tower: 'Villa Enclave (South Bopal)',
    floor: 'Ground + First Floor',
    facing: 'Exclusive private plot perimeter',
    carpetAreaSqM: 246,
    carpetAreaSqFt: 2648,
    builtUpSqM: 305,
    builtUpSqFt: 3283,
    saleableSqM: null,
    saleableSqFt: null,
    plotSqM: 420,
    plotSqFt: 4521,
    bedrooms: 5,
    bathrooms: 5,
    balconies: 3,
    parking: '2 cars; third subject to plot design',
    maintenance: 'Illustrative only; confirm with sales team',
    availability: 'Available',
    possession: 'December 2028',
    rera: 'Sanctioned Plan Ref: SL/SBOP/2028/V10',
    image: '/images/pramukh-trinity.webp',
    details: 'The crown jewel of Silverleaf Residences: a 420 m² sovereign estate villa in South Bopal with 5 spacious suites, 2,648 sq. ft. net carpet area, executive lounge, and 3-car parking capacity.',
    spaces: [
      { name: 'ground: grand salon + banquet dining', areaM: '46 sq. m.', areaFt: '495 sq. ft.' },
      { name: 'ground: executive kitchen + utility', areaM: '20 sq. m.', areaFt: '215 sq. ft.' },
      { name: 'ground: guest suite 1 + bath', areaM: '26 sq. m.', areaFt: '280 sq. ft.' },
      { name: 'first: presidential master suite', areaM: '38 sq. m.', areaFt: '409 sq. ft.' },
      { name: 'first: junior suites 3 & 4', areaM: '36 sq. m.', areaFt: '388 sq. ft.' },
      { name: 'first: bedroom 5 / study', areaM: '20 sq. m.', areaFt: '215 sq. ft.' },
      { name: 'first: executive family lounge', areaM: '42 sq. m.', areaFt: '452 sq. ft.' },
      { name: 'private landscaped grounds & lawn', areaM: 'plot 420 sq. m.', areaFt: '4,521 sq. ft.' }
    ],
    highlights: [
      'Monumental 420 sq. m. parcel with 246 m² (2,648 sq. ft.) net carpet area',
      'Five complete bedroom suites with five en-suite luxury bathrooms',
      'Private compound wall with multi-vehicle driveway parking (up to 3 vehicles)',
      'Reinforced RCC structure engineered to seismic specifications with private terrace'
    ],
    bestSuited: 'prominent industrialists, corporate leaders, and large families seeking unmatched luxury and privacy'
  }
]


// Staggered Editorial Gallery Items
const GALLERY_ITEMS = [
  {
    title: 'central botanical garden & walkways',
    project: 'hsk',
    image: '/images/praise2-lg.webp',
    span: 'col-span-12 md:col-span-7',
    height: 'h-80 md:h-[440px]'
  },
  {
    title: 'resident fitness & wellness studio',
    project: 'hsk',
    image: '/images/trinity1-lg.webp',
    span: 'col-span-12 md:col-span-5',
    height: 'h-80 md:h-[440px]'
  },
  {
    title: 'children’s play enclave & outdoor lawns',
    project: 'hsk',
    image: '/images/trinity2-lg.webp',
    span: 'col-span-12 md:col-span-8',
    height: 'h-80 md:h-[480px]'
  },
  {
    title: 'pergola sky lounge & terrace decks',
    project: 'hsk',
    image: '/images/praise3-lg.webp',
    span: 'col-span-12 md:col-span-4',
    height: 'h-80 md:h-[480px]'
  },
  {
    title: 'masterplan aerial view & landscaped podium',
    project: 'hsk',
    image: '/images/arista2-lg.webp',
    span: 'col-span-12 md:col-span-5',
    height: 'h-80 md:h-[440px]'
  },
  {
    title: 'stone-paved pedestrian court & trees',
    project: 'hsk',
    image: '/images/arista1-lg.webp',
    span: 'col-span-12 md:col-span-7',
    height: 'h-80 md:h-[440px]'
  }
]

// Community Facilities (Section 7)
const AMENITIES = [
  { no: '01', title: 'landscaped central garden', desc: 'continuous walking trail framed by native shade trees and stone seating.' },
  { no: '02', title: 'children’s play grounds', desc: 'dedicated activity zone with certified age-appropriate play equipment.' },
  { no: '03', title: 'multipurpose community hall', desc: 'acoustically engineered gathering venue for private resident events.' },
  { no: '04', title: 'equipped fitness studio', desc: 'strength, cardio and mobility zones overlooking the botanical garden.' },
  { no: '05', title: '24/7 guarded security & cctv', desc: 'regulated gate access control and surveillance across public perimeters.' },
  { no: '06', title: 'essential power backup', desc: 'continuous emergency generator feed for high-speed lifts and common services.' },
  { no: '07', title: 'rainwater percolation network', desc: 'engineered ground recharging systems and on-site waste segregation.' },
  { no: '08', title: 'ev charging infrastructure', desc: 'designated parking bays provisioned for electric vehicle charging setups.' }
]

// Location & Connectivity (Section 8)
const TRANSIT = [
  { item: 'public transport station', dist: '0.8 km', detail: 'regular feeder connectivity' },
  { item: 'supermarkets & daily groceries', dist: '1.0 km', detail: 'essential neighborhood retail' },
  { item: 'educational institutions', dist: '1.5 km', detail: 'primary and secondary schools' },
  { item: 'medical hospital & clinic', dist: '2.0 km', detail: 'multi-speciality healthcare' },
  { item: 'sp ring road expressway access', dist: '2.5 km', detail: 'direct arterial transit corridor' },
  { item: 'ahmedabad international airport', dist: '18 km', detail: 'approx. driving distance' }
]

// Heritage & Project Metrics
const STATS = [
  { value: '8,100', label: 'square metres site area', detail: 'approx. 2 acres masterplan near sp ring road' },
  { value: '17', label: 'curated residences', detail: '1, 2, 3 & 4 bhk apartments plus independent villas' },
  { value: '2028', label: 'possession target', detail: 'december 2028 delivery & ready-to-move options' },
  { value: '100%', label: 'rera registered process', detail: 'transparent title, sanctioned plans & approvals' }
]

export default function App() {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0)
  const [activeModalProperty, setActiveModalProperty] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [tableFilter, setTableFilter] = useState('all')
  const [tableLocation, setTableLocation] = useState('all')
  
  // Interactive Living Index / Daylight Calculator
  const [unitType, setUnitType] = useState('3bhk')
  const [floorZone, setFloorZone] = useState('mid')
  
  // Lead Consultation Form
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyId: 'SL-3B-204',
    preferredDate: '',
    consent: true
  })

  // Dynamic Navbar Scroll Shrink & Expand + Progress Bar
  const [isAtHero, setIsAtHero] = useState(true)
  const [isCompact, setIsCompact] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredNav, setHoveredNav] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollYRef = useRef(0)

  // Architectural Window Shutter / Venetian Blind Louvers ("Open a shed from window" Animation)
  const [isShutterOpen, setIsShutterOpen] = useState(false)
  const isTransitioningRef = useRef(false)

  useEffect(() => {
    // Initial entrance window-shed shutter reveal animation
    const timer = setTimeout(() => {
      setIsShutterOpen(true)
    }, 180)
    return () => clearTimeout(timer)
  }, [])

  const triggerProjectChange = (nextIdx) => {
    if (isTransitioningRef.current) return
    isTransitioningRef.current = true
    setIsShutterOpen(false) // Close the window shutter slats
    setTimeout(() => {
      setActiveProjectIdx(nextIdx)
      setTimeout(() => {
        setIsShutterOpen(true) // Stagger open the window shutter slats to reveal the new project!
        isTransitioningRef.current = false
      }, 90)
    }, 380)
  }

  const handleNextProject = () => {
    triggerProjectChange((activeProjectIdx + 1) % PROPERTIES.length)
  }

  const handlePrevProject = () => {
    triggerProjectChange((activeProjectIdx - 1 + PROPERTIES.length) % PROPERTIES.length)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const lastScrollY = lastScrollYRef.current

      // Calculate scroll progress (0 to 1)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, currentScrollY / docHeight)))
      }

      // Detect rest position / hero section (top of the page)
      const atHero = currentScrollY <= 50
      setIsAtHero(atHero)

      if (atHero) {
        // At rest position / hero: expand to grand premium navbar
        setIsCompact(false)
      } else if (currentScrollY > lastScrollY + 6 && currentScrollY > 80) {
        // Scrolling down past hero: shrink to aerodynamic pill
        setIsCompact(true)
      } else if (currentScrollY < lastScrollY - 6) {
        // Scrolling up: comfortably expand
        setIsCompact(false)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Initialize smooth scroll with Lenis
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.webdriver) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  const currentProperty = PROPERTIES[activeProjectIdx]

  // Live calculator calculation
  const getBiophilicMetrics = () => {
    if (unitType === '2bhk') {
      if (floorZone === 'garden') return { daylight: '7.5 hrs/day', daylightPct: 68, breeze: '88% airflow', terrace: '110 sq. ft.', energy: '19% saved' }
      if (floorZone === 'mid') return { daylight: '8.1 hrs/day', daylightPct: 76, breeze: '92% airflow', terrace: '125 sq. ft.', energy: '22% saved' }
      return { daylight: '9.2 hrs/day', daylightPct: 88, breeze: '96% airflow', terrace: '145 sq. ft.', energy: '26% saved' }
    }
    if (unitType === '3bhk') {
      if (floorZone === 'garden') return { daylight: '8.0 hrs/day', daylightPct: 74, breeze: '91% airflow', terrace: '165 sq. ft.', energy: '23% saved' }
      if (floorZone === 'mid') return { daylight: '8.6 hrs/day', daylightPct: 82, breeze: '94% airflow', terrace: '185 sq. ft.', energy: '27% saved' }
      return { daylight: '9.6 hrs/day', daylightPct: 92, breeze: '98% airflow', terrace: '220 sq. ft.', energy: '31% saved' }
    }
    // 4bhk / Villa
    if (floorZone === 'garden') return { daylight: '8.4 hrs/day', daylightPct: 80, breeze: '93% airflow', terrace: '240 sq. ft.', energy: '26% saved' }
    if (floorZone === 'mid') return { daylight: '9.0 hrs/day', daylightPct: 88, breeze: '96% airflow', terrace: '280 sq. ft.', energy: '30% saved' }
    return { daylight: '10.2 hrs/day', daylightPct: 98, breeze: '99% airflow', terrace: '340 sq. ft.', energy: '35% saved' }
  }

  const metrics = getBiophilicMetrics()

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone) return

    setIsSubmitting(true)

    const scriptUrl = import.meta.env.VITE_APPS_SCRIPT_URL || (typeof window !== 'undefined' && window.HSK_APPS_SCRIPT_URL ? window.HSK_APPS_SCRIPT_URL : 'https://script.google.com/macros/s/AKfycbxcEEMuk7jhNUH657G0oYLvDGhKFZt2Oh8xpbdlM1fxwJuhwPihCZMtbM0o525huytHhw/exec')

    const payload = {
      action: 'createEnquiry',
      customer_name: formData.name,
      phone_number: formData.phone,
      email: formData.email,
      project_interest: formData.propertyId,
      preferred_date: formData.preferredDate,
      consent: formData.consent,
      source: 'hsk-website',
      utm_campaign: 'direct-web'
    }

    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        })
      } catch (err) {
        console.warn('Google Sheet submission warning:', err)
      }
    } else {
      console.warn('VITE_APPS_SCRIPT_URL not configured. Form submitted in mock state.')
    }

    setIsSubmitting(false)
    setFormSubmitted(true)
  }

  return (
    <div className="min-h-[100svh] bg-white text-[#0d0e0d] font-body selection:bg-[#0d0e0d] selection:text-white overflow-x-clip">
      
      {/* 0. Architectural Window Shutter / Venetian Blind Louvers ("Open a shed from window" Animation) */}
      <div
        className="fixed inset-0 pointer-events-none z-[120] flex flex-col overflow-hidden"
        aria-hidden="true"
      >
        {Array.from({ length: 20 }).map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ scaleY: 1 }}
            animate={{ scaleY: isShutterOpen ? 0 : 1 }}
            transition={{
              duration: 0.52,
              delay: idx * 0.022,
              ease: [0.76, 0, 0.24, 1] // Mechanical shutter snap
            }}
            style={{ transformOrigin: isShutterOpen ? '50% 100%' : '50% 0%' }}
            className="w-full flex-1 bg-[#0d0e0d]"
          />
        ))}
      </div>

      {/* 1. Floating Glassmorphic Pill Navigation Bar (Bigger & Grand at Hero Rest Position, Sleek Dynamic Shrink on Scroll) */}
      <header className={`fixed left-0 right-0 z-50 pointer-events-none transition-all duration-500 ${
        isAtHero ? 'top-4 sm:top-6 px-3 sm:px-6 md:px-8' : 'top-3 sm:top-5 px-3 sm:px-6 md:px-8'
      }`}>
        <motion.div
          layout
          initial={{ y: -30, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: isCompact ? 0.98 : 1
          }}
          transition={{
            type: 'spring',
            stiffness: 240,
            damping: 24,
            mass: 0.8
          }}
          className={`relative mx-auto backdrop-blur-2xl text-white rounded-full flex items-center justify-between pointer-events-auto border transition-all duration-500 shadow-2xl gap-3 sm:gap-6 ${
            isAtHero
              ? 'max-w-6xl py-3 sm:py-4 pl-5 sm:pl-7 pr-3 sm:pr-4 bg-[#0d0e0d]/80 border-white/20 shadow-black/40'
              : isCompact
              ? 'max-w-4xl py-2 pl-4 sm:pl-5 pr-2.5 sm:pr-3 bg-[#0d0e0d]/90 border-white/15 shadow-black/30'
              : 'max-w-5xl py-2.5 pl-4 sm:pl-6 pr-3 sm:pr-3.5 bg-[#0d0e0d]/80 border-white/20 shadow-black/30'
          }`}
        >
          {/* HSK Builder Group Logo & Name */}
          <a href="#top" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" aria-label="HSK Builder Group Homepage">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className={`rounded-full overflow-hidden border border-white/20 shadow-md shadow-black/40 flex items-center justify-center transition-all duration-300 ${
                isAtHero ? 'w-10 h-10 sm:w-11 sm:h-11' : 'w-8 h-8 sm:w-9 sm:h-9'
              }`}
            >
              <img
                src="/images/hsk-logo.jpg"
                alt="HSK Builder Group"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className={`font-display font-medium tracking-wider text-white group-hover:text-neutral-200 transition-all duration-300 uppercase whitespace-nowrap ${
                isAtHero ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'
              }`}>
                HSK
              </span>
              {isAtHero && (
                <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase -mt-0.5 hidden sm:block whitespace-nowrap">
                  builder group • ahmedabad
                </span>
              )}
            </div>
          </a>

          {/* Desktop Nav Links with Sliding Hover Capsule */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 lowercase text-neutral-300"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {[
              { id: 'properties', label: 'residences' },
              { id: 'comparison', label: 'matrix' },
              { id: 'calculator', label: 'living index' },
              { id: 'specifications', label: 'specs' },
              { id: 'amenities', label: 'amenities' },
              { id: 'location', label: 'location' }
            ].map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onMouseEnter={() => setHoveredNav(link.id)}
                className={`relative rounded-full text-neutral-300 hover:text-white transition-colors duration-200 whitespace-nowrap ${
                  isAtHero ? 'px-3 py-1.5 text-xs xl:text-[13px]' : 'px-2.5 py-1 text-xs'
                }`}
              >
                {hoveredNav === link.id && (
                  <motion.div
                    layoutId="navbar-hover-capsule"
                    className="absolute inset-0 bg-white/15 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Action Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`group rounded-full bg-white hover:bg-neutral-100 text-[#0d0e0d] font-medium tracking-normal transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap shrink-0 lowercase ${
                isAtHero
                  ? 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-[13px] shadow-md shadow-black/20'
                  : isCompact
                  ? 'px-3 py-1.5 text-xs'
                  : 'px-3.5 py-1.5 text-xs'
              }`}
            >
              <span>schedule visit</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </motion.a>

            {/* Mobile Hamburger Toggle Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 text-white transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Dynamic Scroll Progress Indicator at Base of Pill */}
          <div className="absolute bottom-0 left-6 right-6 sm:left-8 sm:right-8 h-[2px] bg-white/10 rounded-full overflow-hidden pointer-events-none">
            <motion.div
              style={{ scaleX: scrollProgress, transformOrigin: '0%' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>

        {/* Mobile Animated Dropdown Glassmorphic Capsule */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="lg:hidden mt-2 mx-auto max-w-sm backdrop-blur-2xl bg-[#0d0e0d]/95 border border-white/20 rounded-3xl p-4 text-white shadow-2xl pointer-events-auto"
            >
              <div className="flex flex-col gap-1">
                {[
                  { id: 'properties', label: 'the 4 bespoke residences' },
                  { id: 'comparison', label: 'property comparison matrix' },
                  { id: 'calculator', label: 'living index calculator' },
                  { id: 'specifications', label: 'construction specifications' },
                  { id: 'amenities', label: 'community facilities' },
                  { id: 'location', label: 'location & transit' },
                  { id: 'contact', label: 'schedule private visit' }
                ].map((item, idx) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="px-4 py-2.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-light transition-colors flex items-center justify-between lowercase"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section — Full-Bleed Cinematic Photography with Ken-Burns Motion & Minimalist Elite Quiet Luxury */}
      <section id="top" className="relative min-h-[94svh] flex items-end pb-20 px-6 md:px-10 overflow-hidden">
        {/* Full-bleed authentic hero photography with slow Ken-Burns motion */}
        <motion.img
          src="/images/psygroup.webp"
          alt="HSK South-West Ahmedabad"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Neutral scrim for readability */}
        <div className="absolute inset-0 hero-scrim-darker" />

        <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-8 space-y-6"
          >
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-neutral-400">
              <span>project id: HSK-AMD-01</span>
              <span>•</span>
              <span>ahmedabad, gujarat</span>
            </div>

            <h1 className="font-display font-extralight text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.98] tracking-[-0.045em] text-white max-w-4xl lowercase">
              restrained architecture.
              <br />
              <span className="text-neutral-300">four bespoke residences.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              className="text-base sm:text-lg text-neutral-200 max-w-2xl font-light leading-relaxed lowercase"
            >
              HSK comprises two residential towers plus an independent villa enclave set across 8,100 sq. m. near sp ring road, south-west ahmedabad. crafted with thermal comfort, seismic engineering, and privacy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <motion.a
                href="#properties"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-3.5 rounded-full bg-white text-[#0d0e0d] text-xs font-medium tracking-normal transition-colors inline-flex items-center gap-2 lowercase"
              >
                <span>explore the 4 properties</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </motion.a>

              <motion.a
                href="#comparison"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 text-xs font-medium tracking-normal transition-colors lowercase"
              >
                view comparison matrix
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-4 text-left lg:text-right space-y-2 border-t lg:border-t-0 border-white/10 pt-4 lg:pt-0"
          >
            <div className="text-xs font-mono text-neutral-300 uppercase tracking-wider">south-west ahmedabad • sp ring road</div>
            <div className="text-sm font-medium text-white tracking-wider uppercase">HSK BUILDER GROUP</div>
            <a href="#properties" className="group inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors mt-2 lowercase">
              <span>scroll to inspect inventory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 3. The 17 Properties Showcase Slider with Window Shutter Transition Animation */}
      <section id="properties" className="py-28 px-6 md:px-10 bg-[#f7f7f5] border-b border-black/[0.08]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-2"
            >
              <div className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
                active inventory • section 02
              </div>
              <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
                curated residences
              </h2>
              <p className="text-sm text-[#5a5c57] font-light max-w-xl lowercase">
                seventeen sculpted apartment towers and independent villa enclaves with verified carpet area definitions across South-West Ahmedabad.
              </p>
            </motion.div>

            {/* Slider Controls */}
            <div className="flex items-center gap-4">
              <div className="text-xs font-mono text-[#5a5c57]">
                <span className="text-base font-light text-[#0d0e0d]">{activeProjectIdx + 1}</span> / {PROPERTIES.length}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handlePrevProject}
                  aria-label="Previous Property"
                  className="w-11 h-11 rounded-full bg-white hover:bg-[#0d0e0d] hover:text-white text-[#0d0e0d] border border-black/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleNextProject}
                  aria-label="Next Property"
                  className="w-11 h-11 rounded-full bg-white hover:bg-[#0d0e0d] hover:text-white text-[#0d0e0d] border border-black/10 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Featured Property Display Card */}
          <div className="rounded-3xl bg-white border border-black/[0.08] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch shadow-sm">
            {/* Property Image with Shutter Transition Integration */}
            <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[500px] overflow-hidden bg-neutral-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentProperty.id}
                  src={currentProperty.image}
                  alt={currentProperty.title}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute top-6 left-6 flex items-center gap-2 flex-wrap">
                <div className="px-3.5 py-1.5 rounded-full bg-[#0d0e0d]/85 text-white font-mono text-[11px] tracking-wider uppercase backdrop-blur-md">
                  {currentProperty.id}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-white/90 text-[#0d0e0d] text-[11px] font-medium backdrop-blur-md lowercase">
                  {currentProperty.availability}
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/60 text-white text-[10px] font-mono backdrop-blur-md uppercase">
                  {currentProperty.location.split(',')[0]}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0d0e0d]/80 backdrop-blur-md text-white flex items-center justify-between text-xs font-light">
                <div>
                  <span className="text-[#8c8e87] block font-mono text-[10px] uppercase">location & level</span>
                  <span>{currentProperty.tower} • {currentProperty.floor}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#8c8e87] block font-mono text-[10px] uppercase">parking</span>
                  <span>{currentProperty.parking}</span>
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProperty.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-black/[0.06] pb-3 text-xs font-mono text-[#8c8e87]">
                    <span>residence {currentProperty.number} / {PROPERTIES.length < 10 ? '0' + PROPERTIES.length : PROPERTIES.length}</span>
                    <span>{currentProperty.category}</span>
                  </div>

                  <div>
                    <h3 className="font-display font-light text-3xl sm:text-4xl text-[#0d0e0d] tracking-[-0.035em] lowercase">
                      {currentProperty.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#5a5c57] font-light mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8c8e87]" />
                      <span>{currentProperty.location}</span>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="p-5 rounded-2xl bg-[#f7f7f5] border border-black/[0.06] space-y-1">
                    <span className="text-[10px] font-mono text-[#8c8e87] uppercase tracking-wider block">indicative base price</span>
                    <div className="font-display font-light text-3xl sm:text-4xl text-[#0d0e0d]">
                      {currentProperty.priceDisplay}
                    </div>
                    <span className="text-[11px] text-[#5a5c57] font-light block">
                      {currentProperty.priceNote}
                    </span>
                  </div>

                  {/* Surface Area Breakdown */}
                  <div className="grid grid-cols-3 gap-2 border-y border-black/[0.06] py-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#8c8e87] uppercase block">carpet</span>
                      <span className="font-display font-light text-xl text-[#0d0e0d] block mt-0.5">
                        {currentProperty.carpetAreaSqFt}
                      </span>
                      <span className="text-[11px] text-[#8c8e87]">sq. ft. ({currentProperty.carpetAreaSqM} m²)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8c8e87] uppercase block">built-up</span>
                      <span className="font-display font-light text-xl text-[#0d0e0d] block mt-0.5">
                        {currentProperty.builtUpSqFt}
                      </span>
                      <span className="text-[11px] text-[#8c8e87]">sq. ft. ({currentProperty.builtUpSqM} m²)</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#8c8e87] uppercase block">
                        {currentProperty.plotSqFt ? 'plot area' : 'saleable'}
                      </span>
                      <span className="font-display font-light text-xl text-[#0d0e0d] block mt-0.5">
                        {currentProperty.plotSqFt ? currentProperty.plotSqFt : currentProperty.saleableSqFt}
                      </span>
                      <span className="text-[11px] text-[#8c8e87]">
                        sq. ft. {currentProperty.plotSqM ? `(${currentProperty.plotSqM} m²)` : `(${currentProperty.saleableSqM} m²)`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5a5c57] font-light leading-relaxed">
                    {currentProperty.details}
                  </p>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-[#8c8e87] uppercase block">features & finish</span>
                    <div className="space-y-1.5 text-xs text-[#5a5c57] font-light">
                      {currentProperty.highlights.slice(0, 3).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#0d0e0d] shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="pt-4 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setActiveModalProperty(currentProperty)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#0d0e0d] font-medium hover:underline underline-offset-4 cursor-pointer"
                >
                  <span>view room schedule & specs</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormData((prev) => ({ ...prev, propertyId: currentProperty.id }))}
                  className="px-6 py-3 rounded-full bg-[#0d0e0d] hover:bg-neutral-800 text-white text-xs font-medium tracking-normal transition-colors lowercase"
                >
                  inquire about {currentProperty.id}
                </motion.a>
              </div>
            </div>
          </div>

          {/* Category Filter Pills & Quick Project Select Cards */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-mono text-[#8c8e87] uppercase">
                filter inventory by typology:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: `all (${PROPERTIES.length})` },
                  { id: '1bhk', label: `1 bhk (${PROPERTIES.filter(p => p.configGroup === '1bhk').length})` },
                  { id: '2bhk', label: `2 bhk (${PROPERTIES.filter(p => p.configGroup === '2bhk').length})` },
                  { id: '3bhk', label: `3 bhk (${PROPERTIES.filter(p => p.configGroup === '3bhk').length})` },
                  { id: '4bhk', label: `4 bhk (${PROPERTIES.filter(p => p.configGroup === '4bhk').length})` },
                  { id: 'villa', label: `villas (${PROPERTIES.filter(p => p.configGroup === 'villa').length})` }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono lowercase transition-colors cursor-pointer border ${
                      selectedCategory === cat.id
                        ? 'bg-[#0d0e0d] text-white border-[#0d0e0d]'
                        : 'bg-white text-[#5a5c57] border-black/[0.08] hover:border-black/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {PROPERTIES
                .filter(proj => selectedCategory === 'all' || proj.configGroup === selectedCategory)
                .map((proj) => {
                  const actualIdx = PROPERTIES.findIndex(p => p.id === proj.id)
                  const isActive = activeProjectIdx === actualIdx
                  return (
                    <motion.button
                      key={proj.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ y: 0 }}
                      onClick={() => triggerProjectChange(actualIdx)}
                      className={`p-4 sm:p-5 rounded-2xl text-left transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#0d0e0d] text-white border-[#0d0e0d] shadow-md ring-2 ring-black/10'
                          : 'bg-white text-[#0d0e0d] border-black/[0.08] hover:border-black/20 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-[11px] font-mono font-medium ${isActive ? 'text-neutral-200' : 'text-[#0d0e0d]'}`}>
                          {proj.id}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full lowercase font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-neutral-100 text-[#5a5c57]'
                        }`}>
                          {proj.availability}
                        </span>
                      </div>
                      
                      <div className="font-display font-light text-sm sm:text-base mt-2 line-clamp-1 lowercase">
                        {proj.title}
                      </div>

                      <div className={`text-xs mt-1 font-light ${isActive ? 'text-neutral-300' : 'text-[#5a5c57]'}`}>
                        {proj.carpetAreaSqFt} sq. ft. • {proj.bedrooms} bed
                      </div>

                      <div className="mt-3 pt-2 border-t border-black/[0.06] flex items-center justify-between text-[11px]">
                        <span className={`font-mono font-medium ${isActive ? 'text-white' : 'text-[#0d0e0d]'}`}>
                          {proj.priceDisplay}
                        </span>
                        <span className={`text-[10px] ${isActive ? 'text-neutral-300' : 'text-[#8c8e87]'}`}>
                          {proj.location.split(',')[0]}
                        </span>
                      </div>
                    </motion.button>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Comparison at a Glance Table (Complete 17 Properties Matrix from PDF) */}
      <section id="comparison" className="py-28 px-6 md:px-10 border-b border-black/[0.08] bg-white">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
                data matrix • section 03
              </span>
              <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
                property comparison at a glance
              </h2>
              <p className="text-sm text-[#5a5c57] font-light max-w-2xl leading-relaxed lowercase">
                all measurements conform to Gujarat real estate regulatory standards. carpet area reflects net usable floor area excluding external walls, shafts and open terrace.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'all typologies' },
                  { id: '1bhk', label: '1 bhk' },
                  { id: '2bhk', label: '2 bhk' },
                  { id: '3bhk', label: '3 bhk' },
                  { id: '4bhk', label: '4 bhk' },
                  { id: 'villa', label: 'villas' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTableFilter(f.id)}
                    className={`px-3 py-1 rounded-full text-xs font-mono lowercase transition-colors cursor-pointer border ${
                      tableFilter === f.id
                        ? 'bg-[#0d0e0d] text-white border-[#0d0e0d]'
                        : 'bg-[#f7f7f5] text-[#5a5c57] border-black/[0.08] hover:border-black/20'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'all areas' },
                  { id: 'bopal', label: 'bopal' },
                  { id: 'south bopal', label: 'south bopal' },
                  { id: 'shela', label: 'shela' },
                  { id: 'sp ring road', label: 'sp ring road' }
                ].map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => setTableLocation(loc.id)}
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono lowercase transition-colors cursor-pointer ${
                      tableLocation === loc.id
                        ? 'bg-neutral-800 text-white'
                        : 'text-[#8c8e87] hover:text-[#0d0e0d]'
                    }`}
                  >
                    • {loc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clean Geometric Table */}
          <div className="overflow-x-auto border border-black/[0.08] rounded-2xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f7f7f5] border-b border-black/[0.08] text-[11px] font-mono uppercase tracking-wider text-[#8c8e87]">
                  <th className="py-4 px-6 font-medium">property id</th>
                  <th className="py-4 px-6 font-medium">configuration & locality</th>
                  <th className="py-4 px-6 font-medium">status</th>
                  <th className="py-4 px-6 font-medium">carpet area</th>
                  <th className="py-4 px-6 font-medium">built-up area</th>
                  <th className="py-4 px-6 font-medium">saleable / plot</th>
                  <th className="py-4 px-6 font-medium">indicative base price</th>
                  <th className="py-4 px-6 font-medium text-right">actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {PROPERTIES
                  .filter((prop) => {
                    const matchCategory = tableFilter === 'all' || prop.configGroup === tableFilter
                    const matchLocation = tableLocation === 'all' || prop.location.toLowerCase().includes(tableLocation.toLowerCase())
                    return matchCategory && matchLocation
                  })
                  .map((prop) => {
                    const actualIdx = PROPERTIES.findIndex(p => p.id === prop.id)
                    return (
                      <tr
                        key={prop.id}
                        className="hover:bg-[#f7f7f5]/70 transition-colors group"
                      >
                        <td className="py-4 px-6 font-mono font-medium text-[#0d0e0d]">
                          <button
                            onClick={() => {
                              triggerProjectChange(actualIdx)
                              const el = document.getElementById('properties')
                              if (el) el.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="hover:underline underline-offset-2 cursor-pointer text-left"
                          >
                            {prop.id}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-[#0d0e0d] block lowercase">{prop.title}</span>
                          <span className="text-[11px] text-[#8c8e87]">{prop.location.split(',')[0]} • {prop.floor}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono lowercase ${
                            prop.availability === 'Ready to move'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : prop.availability === 'Under construction'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-neutral-100 text-neutral-800 border border-black/10'
                          }`}>
                            {prop.availability}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#5a5c57]">
                          <span className="text-[#0d0e0d] font-medium block">{prop.carpetAreaSqFt} sq. ft.</span>
                          <span className="text-[11px] text-[#8c8e87]">{prop.carpetAreaSqM} sq. m.</span>
                        </td>
                        <td className="py-4 px-6 text-[#5a5c57]">
                          <span className="text-[#0d0e0d] font-medium block">{prop.builtUpSqFt} sq. ft.</span>
                          <span className="text-[11px] text-[#8c8e87]">{prop.builtUpSqM} sq. m.</span>
                        </td>
                        <td className="py-4 px-6 text-[#5a5c57]">
                          {prop.plotSqFt ? (
                            <div>
                              <span className="text-[#0d0e0d] font-medium block">plot {prop.plotSqFt} sq. ft.</span>
                              <span className="text-[11px] text-[#8c8e87]">{prop.plotSqM} sq. m. plot</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[#0d0e0d] font-medium block">{prop.saleableSqFt} sq. ft.</span>
                              <span className="text-[11px] text-[#8c8e87]">{prop.saleableSqM} sq. m.</span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-display font-light text-lg sm:text-xl text-[#0d0e0d] block">
                            {prop.priceDisplay}
                          </span>
                          <span className="text-[10px] text-[#8c8e87] lowercase">base quotation</span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setActiveModalProperty(prop)}
                              className="px-3 py-1.5 rounded-full border border-black/15 text-[11px] font-mono hover:bg-[#0d0e0d] hover:text-white transition-colors cursor-pointer"
                            >
                              specs
                            </button>
                            <a
                              href="#contact"
                              onClick={() => setFormData((prev) => ({ ...prev, propertyId: prop.id }))}
                              className="px-3 py-1.5 rounded-full bg-[#0d0e0d] text-white text-[11px] font-mono hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                              inquire
                            </a>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>

          <div className="p-6 rounded-2xl bg-[#f7f7f5] border border-black/[0.06] text-xs text-[#5a5c57] leading-relaxed">
            <span className="font-mono text-[#0d0e0d] block uppercase mb-1 text-[11px]">legal area definitions:</span>
            carpet area is the net usable floor area within the apartment, excluding external walls, service shafts, exclusive balcony/verandah area and open terrace, but including internal partition walls as defined under applicable rules. built-up area generally includes carpet area plus wall thickness. square-foot values are rounded (1 sq. m. ≈ 10.7639 sq. ft.).
          </div>
        </div>
      </section>

      {/* 5. Biophilic Living & Orientation Explorer */}
      <section id="calculator" className="py-28 px-6 md:px-10 bg-white border-b border-black/[0.08]">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-3 text-center max-w-2xl mx-auto"
          >
            <div className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
              solar & airflow calculation • section 04
            </div>
            <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
              climate-responsive orientation index
            </h2>
            <p className="text-sm text-[#5a5c57] font-light leading-relaxed lowercase">
              explore how our building orientation optimizes natural daylight, breeze channels, and private balcony terraces across different floor elevations.
            </p>
          </motion.div>

          <div className="p-8 sm:p-12 rounded-3xl bg-[#f7f7f5] border border-black/[0.08] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Unit Type Selection */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#8c8e87] uppercase block">residence typology</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '2bhk', label: '2 bhk apartment' },
                    { id: '3bhk', label: '3 bhk apartment' },
                    { id: '4bhk', label: '4 bhk / villa' }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUnitType(item.id)}
                      className={`p-3.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center lowercase ${
                        unitType === item.id
                          ? 'bg-[#0d0e0d] text-white'
                          : 'bg-white border border-black/[0.08] text-[#0d0e0d] hover:bg-neutral-100'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Floor Level Selection */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#8c8e87] uppercase block">vertical elevation zone</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'garden', label: 'podium (l1–4)' },
                    { id: 'mid', label: 'mid-tier (l5–8)' },
                    { id: 'sky', label: 'skyline (l9–12)' }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFloorZone(item.id)}
                      className={`p-3.5 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center lowercase ${
                        floorZone === item.id
                          ? 'bg-[#0d0e0d] text-white'
                          : 'bg-white border border-black/[0.08] text-[#0d0e0d] hover:bg-neutral-100'
                      }`}
                    >
                      {item.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Metric Displays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {[
                { val: metrics.daylight, title: 'natural daylight exposure', sub: 'optimized solar orientation' },
                { val: metrics.breeze, title: 'cross-breeze circulation', sub: 'passive cooling channels' },
                { val: metrics.terrace, title: 'private balcony outdoor area', sub: 'exclusive outdoor terrace' },
                { val: metrics.energy, title: 'hvac energy reduction', sub: 'reduced seasonal thermal load' }
              ].map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-2xl bg-white border border-black/[0.07] space-y-1"
                >
                  <motion.div
                    key={m.val}
                    initial={{ opacity: 0.5, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-display font-light text-3xl text-[#0d0e0d]"
                  >
                    {m.val}
                  </motion.div>
                  <div className="text-xs font-medium text-[#0d0e0d] lowercase">{m.title}</div>
                  <div className="text-[11px] text-[#8c8e87] lowercase">{m.sub}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Construction & Material Specifications (Pages 2-5 of PDF) */}
      <section id="specifications" className="py-28 px-6 md:px-10 border-b border-black/[0.08] bg-[#f7f7f5]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
              engineering discipline • section 05
            </span>
            <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
              construction and finish standards
            </h2>
            <p className="text-sm text-[#5a5c57] font-light max-w-2xl leading-relaxed lowercase">
              engineered to seismic requirements by licensed structural engineers with AAC block masonry, concealed electrical wiring and branded fittings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'structural engineering',
                code: 'spec.01',
                detail: 'reinforced cement concrete (rcc) framed structure designed to seismic codes; foundation depth verified via site-specific soil investigation.'
              },
              {
                title: 'masonry & internal walls',
                code: 'spec.02',
                detail: 'aac lightweight autoclaved aerated concrete blocks providing enhanced thermal barrier and sound isolation with internal plaster finish.'
              },
              {
                title: 'flooring & finishes',
                code: 'spec.03',
                detail: 'large-format vitrified tiles in all living spaces and bedrooms; anti-skid ceramic tiles in bathrooms and outdoor utility zones.'
              },
              {
                title: 'culinary kitchens',
                code: 'spec.04',
                detail: 'granite or engineered-stone counter, stainless-steel sink, provision for water purifier and chimney/exhaust electrical conduit points.'
              },
              {
                title: 'bathrooms & fixtures',
                code: 'spec.05',
                detail: 'branded chrome-plated fittings, high-grade ceramic sanitaryware, concealed plumbing pipes and certified multi-layer waterproofing.'
              },
              {
                title: 'fenestration & doors',
                code: 'spec.06',
                detail: 'engineered main entry door, flush internal doors, powder-coated aluminium / upvc sliding windows with clear glass.'
              }
            ].map((spec, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl border border-black/[0.07] bg-white flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8c8e87]">
                  <span>{spec.code}</span>
                  <span>verified standard</span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display font-light text-xl text-[#0d0e0d] lowercase">
                    {spec.title}
                  </h4>
                  <p className="text-xs text-[#5a5c57] font-light leading-relaxed lowercase">
                    {spec.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Experiences Editorial Gallery */}
      <section id="experiences" className="py-28 px-6 md:px-10 bg-white border-b border-black/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3 max-w-3xl mx-auto"
          >
            <div className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
              curated surroundings • section 06
            </div>
            <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
              living experiences & grounds
            </h2>
            <p className="text-sm text-[#5a5c57] font-light leading-relaxed lowercase">
              designed across 8,100 sq. m. to cultivate tranquility, pedestrian recreation, and community connection.
            </p>
          </motion.div>

          {/* Uneven Staggered Photo Grid */}
          <div className="grid grid-cols-12 gap-6">
            {GALLERY_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className={`${item.span} group relative rounded-2xl overflow-hidden bg-neutral-100 ${item.height}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-mono text-neutral-300 uppercase block">{item.project}</span>
                  <h3 className="font-display font-light text-xl text-white lowercase">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Community Amenities (Section 7 of PDF) */}
      <section id="amenities" className="py-28 px-6 md:px-10 border-b border-black/[0.08] bg-[#f7f7f5]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/[0.08] pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
                shared facilities • section 07
              </span>
              <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
                community amenities
              </h2>
            </div>
            <p className="text-xs text-[#5a5c57] font-light max-w-sm lowercase">
              purpose-built facilities designed to serve all resident towers and the independent villa enclave.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AMENITIES.map((am) => (
              <div
                key={am.no}
                className="p-6 rounded-2xl bg-white border border-black/[0.07] space-y-3"
              >
                <span className="text-xs font-mono text-[#8c8e87] block">
                  {am.no}
                </span>
                <h4 className="font-display font-light text-lg text-[#0d0e0d] lowercase">
                  {am.title}
                </h4>
                <p className="text-xs text-[#5a5c57] font-light leading-relaxed lowercase">
                  {am.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Location & Transit Radar (Section 8 of PDF) */}
      <section id="location" className="py-28 px-6 md:px-10 border-b border-black/[0.08] bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
                urban connectivity • section 08
              </span>
              <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
                south-west ahmedabad
              </h2>
              <p className="text-sm text-[#5a5c57] font-light leading-relaxed lowercase">
                conveniently positioned near the sp ring road corridor, balancing arterial road access with peaceful low-density residential grounds.
              </p>

              <div className="p-6 rounded-2xl bg-[#f7f7f5] border border-black/[0.06] space-y-3 text-xs">
                <div className="font-mono text-[#8c8e87] uppercase">project address</div>
                <div className="text-sm font-light text-[#0d0e0d]">
                  Near SP Ring Road, South-West Ahmedabad, Gujarat, India
                </div>
                <div className="text-[#8c8e87] font-light pt-2 border-t border-black/[0.06]">
                  office hours: monday–saturday, 10:00 am–6:00 pm • sunday visits by appointment
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 border border-black/[0.08] rounded-2xl divide-y divide-black/[0.06] overflow-hidden">
              {TRANSIT.map((t, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 flex items-center justify-between hover:bg-[#f7f7f5]/50 transition-colors"
                >
                  <div>
                    <h5 className="font-medium text-[#0d0e0d] text-sm lowercase">
                      {t.item}
                    </h5>
                    <span className="text-xs text-[#8c8e87] font-light mt-0.5 block lowercase">
                      {t.detail}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base text-[#0d0e0d] font-light">
                      {t.dist}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Quiet Stats & Heritage (Section 1 & 10) */}
      <section id="heritage" className="py-24 px-6 md:px-10 bg-[#0d0e0d] text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[#8c8e87]">
                project credentials
              </span>
              <h2 className="font-display font-light text-3xl sm:text-5xl leading-tight tracking-[-0.03em] text-white uppercase">
                HSK BUILDER GROUP
              </h2>
              <p className="text-sm text-neutral-300 font-light leading-relaxed lowercase">
                building thoughtfully engineered residential communities. our projects emphasize verified construction craftsmanship, structural durability, and transparent rera governance.
              </p>
              <div>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-[#0d0e0d] text-xs font-medium tracking-normal transition-colors lowercase"
                >
                  <span>connect with project advisory</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>
            </motion.div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="font-display font-light text-4xl sm:text-5xl text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-medium text-neutral-200 lowercase">{stat.label}</div>
                  <div className="text-xs text-neutral-400 font-light leading-relaxed lowercase">{stat.detail}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. Private Consultation & Booking Lead Capture (Section 14 of PDF) */}
      <section id="contact" className="py-28 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6"
            >
              <span className="text-xs font-mono tracking-widest text-[#8c8e87] uppercase">
                private client advisory • section 09
              </span>
              <h2 className="font-display font-extralight text-3xl sm:text-5xl tracking-[-0.04em] text-[#0d0e0d] lowercase">
                private project consultation
              </h2>
              <p className="text-sm text-[#5a5c57] font-light leading-relaxed lowercase">
                connect directly with our project advisory team for private site viewings, custom floor plans, RERA documentation, and payment schedules.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-5 rounded-2xl bg-[#f7f7f5] border border-black/[0.06] space-y-1">
                  <span className="font-mono text-[#8c8e87] uppercase block text-[11px]">site sales lounge</span>
                  <span className="font-medium text-[#0d0e0d] block">Near SP Ring Road, South-West Ahmedabad, Gujarat</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#f7f7f5] border border-black/[0.06] space-y-1">
                  <span className="font-mono text-[#8c8e87] uppercase block text-[11px]">direct advisory line</span>
                  <span className="font-medium text-[#0d0e0d] block">+91 90000 00000</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#f7f7f5] border border-black/[0.06] space-y-1">
                  <span className="font-mono text-[#8c8e87] uppercase block text-[11px]">email correspondence</span>
                  <span className="font-medium text-[#0d0e0d] block">sales@example.com</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#f7f7f5] border border-black/[0.08]"
            >
              {formSubmitted ? (
                <div className="p-8 text-center space-y-4 bg-white rounded-2xl border border-black/[0.08]">
                  <div className="w-12 h-12 rounded-full bg-[#0d0e0d] text-white flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-light text-2xl text-[#0d0e0d] lowercase">inquiry received</h3>
                  <p className="text-xs text-[#5a5c57] font-light max-w-sm mx-auto leading-relaxed lowercase">
                    thank you, {formData.name}. our senior project consultant for {formData.propertyId} will connect with you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="px-6 py-2.5 rounded-full bg-[#0d0e0d] text-white text-xs font-medium cursor-pointer lowercase"
                  >
                    submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h3 className="font-display font-light text-2xl text-[#0d0e0d] mb-2 lowercase">
                    request project details & pricing
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#0d0e0d] block lowercase">full name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#0d0e0d] focus:outline-none focus:border-[#0d0e0d]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#0d0e0d] block lowercase">contact number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#0d0e0d] focus:outline-none focus:border-[#0d0e0d]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#0d0e0d] block lowercase">email address</label>
                      <input
                        type="email"
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#0d0e0d] focus:outline-none focus:border-[#0d0e0d]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-[#0d0e0d] block lowercase">select property of interest *</label>
                      <select
                        value={formData.propertyId}
                        onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.08] text-sm text-[#0d0e0d] focus:outline-none focus:border-[#0d0e0d]"
                      >
                        {PROPERTIES.map((proj) => (
                          <option key={proj.id} value={proj.id}>
                            {proj.id} — {proj.title} • {proj.location.split(',')[0]} ({proj.priceDisplay})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="lead-consent"
                      required
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 accent-[#0d0e0d]"
                    />
                    <label htmlFor="lead-consent" className="text-xs text-[#5a5c57] leading-tight lowercase font-light">
                      i provide consent to be contacted by HSK Builder Group regarding pricing, schedule, and site appointments.
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#0d0e0d] hover:bg-neutral-800 disabled:opacity-60 text-white text-xs font-medium tracking-normal transition-colors cursor-pointer mt-2 lowercase flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>transmitting to hsk advisory queue...</span>
                    ) : (
                      <span>confirm consultation request</span>
                    )}
                  </motion.button>
                  <p className="text-[11px] font-mono text-[#8c8e87] text-center lowercase">
                    your details are held strictly confidential under RERA Gujarat guidelines.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="bg-[#0d0e0d] text-white pt-20 pb-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md">
                  <img
                    src="/images/hsk-logo.jpg"
                    alt="HSK Builder Group"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-medium text-2xl tracking-wider text-white uppercase">
                    HSK
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                    builder group
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm lowercase">
                near sp ring road, south-west ahmedabad. developed by HSK Builder Group. committed to enduring construction craftsmanship, sustainable daylight architecture, and client excellence.
              </p>
            </div>

            <div className="md:col-span-3 space-y-3 text-xs text-neutral-300">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[#8c8e87] uppercase block text-[11px]">residences ({PROPERTIES.length})</span>
                <span className="text-[10px] font-mono text-neutral-400">1 to 5 bhk</span>
              </div>
              <div className="space-y-2 font-light max-h-56 overflow-y-auto pr-2">
                {PROPERTIES.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      triggerProjectChange(idx)
                      const el = document.getElementById('properties')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="block hover:text-white text-neutral-400 transition-colors text-left lowercase w-full truncate cursor-pointer"
                  >
                    <span className="font-mono text-white/90">{p.id}</span> • {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 space-y-3 text-xs text-neutral-300">
              <span className="font-mono text-[#8c8e87] uppercase block text-[11px]">corporate governance</span>
              <p className="leading-relaxed font-light lowercase">
                all projects verified with Gujarat Real Estate Regulatory Authority (GujRERA). verify sanctioned plans, possession dates, and developer title before final booking.
              </p>
              <div className="text-xs font-mono text-neutral-400">
                possession target: december 2028 (illustrative)
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-400 gap-4 border-t border-white/10">
            <p>© 2026 HSK BUILDER GROUP. all rights reserved. south-west ahmedabad.</p>
            <div className="flex gap-6 lowercase">
              <a href="#overview" className="hover:text-white transition-colors">top</a>
              <a href="#comparison" className="hover:text-white transition-colors">matrix</a>
              <a href="#contact" className="hover:text-white transition-colors">contact lounge</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 13. WhatsApp Floating Button */}
      <motion.a
        href="https://wa.me/919000000000?text=Hello%20HSK,%20I%20would%20like%20to%20inquire%20about%20your%20Ahmedabad%20properties."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Connect on WhatsApp"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0d0e0d] hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer shadow-xl shadow-black/30 border border-white/20 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>

      {/* 14. Slide-Over Modal for Room-by-Room Internal Space Schedule & Finish Specifications */}
      <AnimatePresence>
        {activeModalProperty && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-black/[0.1] shadow-2xl p-6 sm:p-10 space-y-8"
            >
              <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                <div>
                  <span className="text-[11px] font-mono text-[#8c8e87] uppercase block">
                    architectural schedule • {activeModalProperty.id}
                  </span>
                  <h3 className="font-display font-light text-2xl text-[#0d0e0d] lowercase mt-0.5">
                    {activeModalProperty.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveModalProperty(null)}
                  className="w-10 h-10 rounded-full border border-black/15 flex items-center justify-center text-[#0d0e0d] hover:bg-[#0d0e0d] hover:text-white transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Space schedule list */}
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#8c8e87] uppercase block">
                  internal space schedule (approximate)
                </span>
                <div className="border border-black/[0.08] rounded-2xl divide-y divide-black/[0.06] overflow-hidden">
                  {activeModalProperty.spaces.map((sp, idx) => (
                    <div key={idx} className="p-3.5 sm:p-4 flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-[#0d0e0d] lowercase">{sp.name}</span>
                      <span className="font-mono text-[#5a5c57]">
                        {sp.areaFt} {sp.areaM !== 'exclusive' && `(${sp.areaM})`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#8c8e87] uppercase block">
                  construction & engineering inclusions
                </span>
                <div className="space-y-2">
                  {activeModalProperty.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5a5c57] font-light">
                      <Check className="w-4 h-4 text-[#0d0e0d] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal footer CTA */}
              <div className="pt-4 border-t border-black/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8c8e87] uppercase block">indicative base price</span>
                  <span className="font-display font-light text-xl text-[#0d0e0d]">{activeModalProperty.priceDisplay}</span>
                </div>

                <a
                  href="#contact"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, propertyId: activeModalProperty.id }))
                    setActiveModalProperty(null)
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#0d0e0d] text-white text-xs font-medium hover:bg-neutral-800 transition-colors lowercase"
                >
                  proceed to inquire
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
