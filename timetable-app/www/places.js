// Durham University room codes → buildings.
//
// Built from the AccessAble guides to Durham's learning spaces
// (https://www.accessable.co.uk/durham-university/learning-spaces), October 2026.
// A room code is a building prefix plus a room number, e.g. CLC013 = Calman Learning Centre, room 013.
//
// To add a building, add it to BUILDINGS and point its code at it in PREFIXES.
// ROOMS only lists rooms with their own name, or rooms in a different building from their prefix.

const BUILDINGS = {
  BL: ['Department of Biosciences', 'South Road, Durham'],
  CB: ['Confluence Building', 'Lower Mountjoy, South Road, Durham'],
  CC: ['Chemistry Courtyard Computer Suite', 'Chemistry Building, Lower Mountjoy, South Road, Durham'],
  CG: ['Chemistry Building', 'Lower Mountjoy, South Road, Durham'],
  CGMC: ['Materials Chemistry', 'Lower Mountjoy, South Road, Durham'],
  CL: ['38–39 North Bailey', 'North Bailey, Durham'],
  CLC: ['Calman Learning Centre', 'Stockton Road, Durham'],
  D: ['Dawson Building', 'Lower Mountjoy, South Road, Durham'],
  DH: ['Dunelm House', 'New Elvet, Durham'],
  E: ['Christopherson Building', 'South Road, Durham'],
  EH: ['Elvet Hill House', 'Mill Hill Lane, Durham'],
  ER: ['Elvet Riverside', 'New Elvet, Durham'],
  ER1: ['Elvet Riverside 1', '83 New Elvet, Durham'],
  ER2: ['Elvet Riverside 2', 'Court Lane, Durham'],
  ES: ['Arthur Holmes Building', 'Lower Mountjoy, South Road, Durham'],
  HH: ['Hallgarth House', '77 Hallgarth Street, Durham'],
  HIG: ['Higginson Building', 'South Road, Durham'],
  HS: ['43–46 North Bailey', 'North Bailey, Durham'],
  IM: ['Al-Qasimi Building', 'Elvet Hill Road, Durham'],
  L: ['Psychology Building', 'Upper Mountjoy, Stockton Road, Durham'],
  MCS: ['Mathematical Sciences and Computer Science Building', 'Stockton Road, Durham'],
  MHL: ['Mill Hill Lane', 'Mill Hill Lane, Durham'],
  MU: ['Divinity House', 'Palace Green, Durham'],
  NB48: ['48–49 North Bailey', 'North Bailey, Durham'],
  OC: ['Ogden Centre for Fundamental Physics', 'South Road, Durham'],
  OE: ['Old Elvet', 'Old Elvet, Durham'],
  OE29: ['29 Old Elvet', 'Old Elvet, Durham'],
  OE32: ['32 Old Elvet', 'Old Elvet, Durham'],
  OE32B: ['Back of 32 Old Elvet', 'Old Elvet, Durham'],
  OE42: ['42 Old Elvet', 'Old Elvet, Durham'],
  OE48: ['47–49 Old Elvet', 'Old Elvet, Durham'],
  OE50: ['50–51 Old Elvet', 'Old Elvet, Durham'],
  OTL: ['Territorial Lane Building', 'Territorial Lane, Durham'],
  PCL: ['Palatine Centre', 'Stockton Road, Durham'],
  PG: ['Pemberton Building', 'Palace Green, Durham'],
  PH: ['Rochester Building (Physics)', 'Lower Mountjoy, South Road, Durham'],
  RH: ['Rowan House', 'Stockton Road, Durham'],
  SS58: ['58 Saddler Street', 'Saddler Street, Durham'],
  TH: ['Abbey House', 'Palace Green, Durham'],
  TLC: ['Teaching and Learning Centre', 'South Road, Durham'],
  W: ['West Building', 'Lower Mountjoy, South Road, Durham'],
  WB: ['Waterside Building', 'Riverside Place, Durham'],
};

// Code prefix → building, where they differ or share a building.
const PREFIXES = {
  DHE: 'DH',
  ENGEX: 'E',
  ERA: 'ER1',
  PO: 'OE48',
  SS: 'SS58',
};

// Room code (letters and digits only) → [room name, building if not the usual one for its prefix].
const ROOMS = {
  BL201: ['The Whitehead Room'],
  CB0008: ['Heawood Lecture Theatre'],
  CG141: ['The Musgrove Room'],
  CG193: ['The Coates Laboratory'],
  CG85: ['Richard D. Chambers FRS Lecture Theatre'],
  CG91: ['Arthur Holmes Lecture Theatre'],
  CG93: ['Scarborough Lecture Theatre'],
  CLC013: ['Arnold Wolfendale Lecture Theatre'],
  CLC202: ['Rosemary Cramp Lecture Theatre'],
  CLC203: ['Ken Wade Lecture Theatre'],
  CLC406: ['Derman Christopherson Room'],
  CLC407: ['Kingsley Barrett Room'],
  D125: ['Bilsborough Laboratory'],
  D133: ['Fenwick Human Osteology Laboratory'],
  D203: ['Kiln Laboratory'],
  D204: ['Fenwick Human Osteology Laboratory'],
  D210: ['Birley Room'],
  D233: ['Conservation Laboratory'],
  D243: ['Archaeology Isotopes Laboratory'],
  D244: ['Digital Visualisation Laboratory'],
  DHC05A: ['The Learning Lounge'],
  DHD16: ['Vane Tempest Room'],
  DHE01: ['Fonteyn Ballroom'],
  E092: ['Page Laboratory'],
  E145: ['Civils Laboratory'],
  E219: ['Focus Room'],
  E240: ['', 'HIG'],
  ENGEX1: ['Computer Classroom'],
  L050: ['F V Smith Lecture Theatre'],
  MCS0001: ['Scott Logic Lecture Theatre'],
  MCS3070: ['Magic Room'],
  MU106: ['', 'NB48'],
  OC218: ['Stirling Room'],
  OE113: ['', 'OE32B'],
  PCL048: ['Hogan Lovells Lecture Theatre'],
  PCL152: ['Moot Court'],
  PH132: ['Sir James Knott Room'],
  PH220: ['Level 2 Teaching Laboratory'],
  WB0001: ['Lecture Theatre'],
  WB1003: ['Financial Trading Lab'],
  WB2003: ['Executive Lecture Theatre'],
  WB2005: ['Executive Learning Room'],
};

// Room-code-shaped tokens: letters, optional dash, then a number
// (e.g. CLC013, CB-0008, CB-LG001, OE42-1008, DH-A04).
const CODE_RE = /\b[A-Z]{1,5}-?[A-Z]{0,2}\d[A-Z0-9/-]*/gi;

function buildingKeyFor(code) {
  const upper = code.toUpperCase();
  const room = ROOMS[upper.replace(/[^A-Z0-9]/g, '')];
  if (room?.[1]) return room[1];
  const [, letters, digits] = upper.match(/^([A-Z]+)-?(\d*)/) || [];
  if (!letters) return null;
  // Codes like OE42-1008 or SS58-1003 name the building before the dash.
  const beforeDash = upper.split('-')[0];
  if (upper.includes('-') && BUILDINGS[beforeDash]) return beforeDash;
  // ER1xx rooms are in Elvet Riverside 1, ER2xx in Elvet Riverside 2.
  if (digits && BUILDINGS[letters + digits[0]]) return letters + digits[0];
  if (PREFIXES[letters]) return PREFIXES[letters];
  return BUILDINGS[letters] ? letters : null;
}

// Finds the first known room code in a timetable location.
// Returns { code, room, building, address } or null if nothing matches.
export function lookupPlace(location) {
  if (!location) return null;
  for (const [token] of location.matchAll(CODE_RE)) {
    const key = buildingKeyFor(token);
    if (!key) continue;
    const [building, address] = BUILDINGS[key];
    const room = ROOMS[token.toUpperCase().replace(/[^A-Z0-9]/g, '')]?.[0] || '';
    return { code: token, room, building, address };
  }
  return null;
}
