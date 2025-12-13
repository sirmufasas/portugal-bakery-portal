// src/utils/deliveryZones.ts

export interface DeliveryZone {
  name: string;
  fee: number;
  suburbs: string[];
}

// Define delivery zones with suburbs
export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    name: "Zone 1 - Local (0-5km)",
    fee: 150,
    suburbs: [
      "rosettenville",
      "la rochelle",
      "turffontein",
      "malvern",
      "denver",
      "johannesburg south",
      "booysens",
      "ophirton"
    ]
  },
  {
    name: "Zone 2 - Near (5-10km)",
    fee: 200,
    suburbs: [
      "alberton",
      "meyerton",
      "germiston",
      "city deep",
      "kensington",
      "troyeville",
      "bertrams",
      "doornfontein",
      "jeppestown",
      "fordsburg",
      "mayfair",
      "crown mines",
      "ormonde",
      "riverlea",
      "mondeor",
      "bassonia",
      "gleneagles",
      "three rivers",
      "klipriviersberg"
    ]
  },
  {
    name: "Zone 3 - Medium (10-15km)",
    fee: 350,
    suburbs: [
      "benoni",
      "boksburg",
      "brakpan",
      "springs",
      "edenvale",
      "bedfordview",
      "observatory",
      "yeoville",
      "berea",
      "hillbrow",
      "braamfontein",
      "newtown",
      "marshalltown",
      "ferreirasdorp",
      "pageview",
      "vrededorp",
      "westdene",
      "brixton",
      "crosby",
      "mayfair west",
      "bosmont",
      "newclare",
      "westbury",
      "coronationville",
      "langlaagte",
      "melville",
      "auckland park",
      "parktown",
      "houghton",
      "parkwood",
      "norwood",
      "orange grove",
      "cyrildene",
      "bellevue",
      "bellevue east",
      "sydenham",
      "highlands north",
      "glenhazel",
      "lyndhurst",
      "oaklands",
      "cheltondale",
      "south hills",
      "kenilworth",
      "kibler park",
      "meredale",
      "rosettenville ext",
      "eikenhof"
    ]
  },
  {
    name: "Zone 4 - Far (15-20km)",
    fee: 400,
    suburbs: [
      "sandton",
      "randburg",
      "rosebank",
      "hyde park",
      "dunkeld",
      "illovo",
      "craighall",
      "parkhurst",
      "greenside",
      "emmarentia",
      "linden",
      "northcliff",
      "fairland",
      "roosevelt park",
      "bordeaux",
      "blackheath",
      "ferndale",
      "northgate",
      "weltevreden park",
      "roodepoort",
      "florida",
      "constantia kloof",
      "wilgeheuwel",
      "ruimsig",
      "helderkruin",
      "honeydew",
      "randpark ridge",
      "sundowner",
      "bromhof",
      "kya sand",
      "fourways",
      "sunninghill",
      "bryanston",
      "morningside",
      "rivonia",
      "wendywood",
      "sandown",
      "gallo manor",
      "woodmead",
      "kelvin",
      "marlboro",
      "alexandra",
      "wynberg",
      "sandton cbd"
    ]
  },
  {
    name: "Zone 5 - Extended (20-30km)",
    fee: 450,
    suburbs: [
      "midrand",
      "kempton park",
      "isando",
      "rhodesfield",
      "bardene",
      "birchleigh",
      "bonaero park",
      "chloorkop",
      "elandsfontein",
      "spartan",
      "modderfontein",
      "rabie ridge",
      "tembisa",
      "olifantsfontein",
      "clayville",
      "witfield",
      "bakerton",
      "brentwood park",
      "dawn park",
      "greenfields",
      "primrose",
      "zuurbekom",
      "lenasia",
      "ennerdale",
      "orange farm",
      "walkerville",
      "alberton north",
      "alrode",
      "meyersdal",
      "randhart",
      "brackenhurst",
      "kew",
      "eden glen",
      "norkem park",
      "greenstone",
      "founders hill",
      "linbro park",
      "glen austin",
      "waterfall",
      "kyalami",
      "halfway house",
      "blue hills",
      "vorna valley",
      "grand central",
      "erand"
    ]
  },
  {
    name: "Zone 6 - Very Far (30km+)",
    fee: 500,
    suburbs: [
      "pretoria",
      "centurion",
      "krugersdorp",
      "randfontein",
      "westonaria",
      "carletonville",
      "vereeniging",
      "vanderbijlpark",
      "sasolburg",
      "heidelberg",
      "nigel",
      "soweto outer",
      "diepsloot",
      "cosmo city",
      "chartwell",
      "muldersdrift",
      "lanseria",
      "randburg far",
      "northriding",
      "olivedale",
      "douglasdale",
      "paulshof",
      "dainfern",
      "cedar lakes",
      "broadacres",
      "lonehill",
      "carlswald",
      "crowthorne",
      "buccleuch",
      "bruma",
      "bedford gardens",
      "bagleyston",
      "duncanville"
    ]
  }
];

// Normalize suburb name for comparison
function normalizeSuburb(suburb: string): string {
  return suburb.toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ');   // Normalize spaces
}

// Find all matching zones for a given address
function findAllMatchingZones(address: string): DeliveryZone[] {
  const normalizedAddress = normalizeSuburb(address);
  const matchingZones: DeliveryZone[] = [];

  // Search through all zones and collect matches
  for (const zone of DELIVERY_ZONES) {
    for (const suburb of zone.suburbs) {
      const normalizedSuburb = normalizeSuburb(suburb);

      // Check if address contains the suburb name
      if (normalizedAddress.includes(normalizedSuburb)) {
        matchingZones.push(zone);
        break; // Only add zone once even if multiple suburbs match
      }
    }
  }

  return matchingZones;
}

// Find delivery zone for a given address (returns closest/cheapest zone)
export function findDeliveryZone(address: string): DeliveryZone | null {
  const matchingZones = findAllMatchingZones(address);

  if (matchingZones.length === 0) {
    return null;
  }

  // Return the first match (closest zone since array is ordered from nearest to farthest)
  return matchingZones[0];
}

// Get delivery fee from address
export function calculateDeliveryFee(address: string): {
  fee: number;
  zone: string;
  found: boolean;
  multipleMatches?: boolean;
  allMatches?: DeliveryZone[];  // ← CHANGED: Return zone objects, not strings
} {
  const allMatches = findAllMatchingZones(address);

  if (allMatches.length === 0) {
    // No matching zone found
    return {
      fee: 500,
      zone: "Outside delivery area - Please contact us",
      found: false
    };
  }

  // Get the closest (first) match
  const closestZone = allMatches[0];

  if (allMatches.length > 1) {
    // Multiple zones matched - inform user we're using the closest
    return {
      fee: closestZone.fee,
      zone: `${closestZone.name} (closest match)`,
      found: true,
      multipleMatches: true,
      allMatches: allMatches  // ← CHANGED: Return full zone objects
    };
  }

  // Single match found
  return {
    fee: closestZone.fee,
    zone: closestZone.name,
    found: true
  };
}

// Get all zones for display
export function getAllZones(): DeliveryZone[] {
  return DELIVERY_ZONES;
}