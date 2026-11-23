// src/utils/deliveryZones.ts

export interface DeliveryZone {
  zoneNumber: number;
  name: string;
  fee: number;
  suburbs: string[];
}

// Delivery zones radiated from Portugal Bakery (245 Johannesburg Rd, La Rochelle, Johannesburg South, 2190)
export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    zoneNumber: 1,
    name: "Zone 1 - Local (0-5km)",
    fee: 150,
    suburbs: [
      "rosettenville", "la rochelle", "turffontein", "malvern", "denver",
      "johannesburg south", "booysens", "ophirton", "regents park", "the hill",
      "moffat view", "townsview", "robertsham", "reuven", "selby", "wemmer",
      "village main", "springfield", "stafford", "linmeyer", "oakdene"
    ]
  },
  {
    zoneNumber: 2,
    name: "Zone 2 - Near (5-10km)",
    fee: 200,
    suburbs: [
      "alberton", "meyerton", "germiston", "city deep", "kensington",
      "troyeville", "bertrams", "doornfontein", "jeppestown", "fordsburg",
      "mayfair", "crown mines", "ormonde", "riverlea", "mondeor", "bassonia",
      "gleneagles", "three rivers", "klipriviersberg", "mulbarton", "glenvista",
      "winchester hills", "ridgeway", "suideroord", "southgate", "aeroton",
      "nasrec", "johannesburg cbd", "maboneng", "eloff"
    ]
  },
  {
    zoneNumber: 3,
    name: "Zone 3 - Medium (10-15km)",
    fee: 350,
    suburbs: [
      "benoni", "boksburg", "brakpan", "springs", "edenvale", "bedfordview",
      "observatory", "yeoville", "berea", "hillbrow", "braamfontein", "newtown",
      "marshalltown", "ferreirasdorp", "pageview", "vrededorp", "westdene",
      "brixton", "crosby", "mayfair west", "bosmont", "newclare", "westbury",
      "coronationville", "langlaagte", "melville", "auckland park", "parktown",
      "houghton", "parkwood", "norwood", "orange grove", "cyrildene", "bellevue",
      "bellevue east", "sydenham", "highlands north", "glenhazel", "lyndhurst",
      "oaklands", "cheltondale", "south hills", "kenilworth", "kibler park",
      "meredale", "rosettenville ext", "eikenhof", "diepkloof", "orlando",
      "soweto", "baragwanath", "pimville"
    ]
  },
  {
    zoneNumber: 4,
    name: "Zone 4 - Far (15-20km)",
    fee: 400,
    suburbs: [
      "sandton", "randburg", "rosebank", "hyde park", "dunkeld", "illovo",
      "craighall", "parkhurst", "greenside", "emmarentia", "linden", "northcliff",
      "fairland", "roosevelt park", "bordeaux", "blackheath", "ferndale",
      "northgate", "weltevreden park", "roodepoort", "florida", "constantia kloof",
      "wilgeheuwel", "ruimsig", "helderkruin", "honeydew", "randpark ridge",
      "sundowner", "bromhof", "kya sand", "fourways", "sunninghill", "bryanston",
      "morningside", "rivonia", "wendywood", "sandown", "gallo manor", "woodmead",
      "kelvin", "marlboro", "alexandra", "wynberg", "sandton cbd", "meadowlands",
      "dobsonville", "jabulani", "protea glen"
    ]
  },
  {
    zoneNumber: 5,
    name: "Zone 5 - Extended (20-30km)",
    fee: 450,
    suburbs: [
      "midrand", "kempton park", "isando", "rhodesfield", "bardene", "birchleigh",
      "bonaero park", "chloorkop", "elandsfontein", "spartan", "modderfontein",
      "rabie ridge", "tembisa", "olifantsfontein", "clayville", "witfield",
      "bakerton", "brentwood park", "dawn park", "greenfields", "primrose",
      "zuurbekom", "lenasia", "ennerdale", "orange farm", "walkerville",
      "alberton north", "alrode", "meyersdal", "randhart", "brackenhurst", "kew",
      "eden glen", "norkem park", "greenstone", "founders hill", "linbro park",
      "glen austin", "waterfall", "kyalami", "halfway house", "blue hills",
      "vorna valley", "grand central", "erand"
    ]
  },
  {
    zoneNumber: 6,
    name: "Zone 6 - Very Far (30km+)",
    fee: 500,
    suburbs: [
      "pretoria", "centurion", "krugersdorp", "randfontein", "westonaria",
      "carletonville", "vereeniging", "vanderbijlpark", "sasolburg", "heidelberg",
      "nigel", "soweto outer", "diepsloot", "cosmo city", "chartwell",
      "muldersdrift", "lanseria", "randburg far", "northriding", "olivedale",
      "douglasdale", "paulshof", "dainfern", "cedar lakes", "broadacres",
      "lonehill", "carlswald", "crowthorne", "buccleuch", "bruma",
      "bedford gardens", "bagleyston", "duncanville"
    ]
  }
];

function normalizeSuburb(suburb: string): string {
  return suburb
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ");
}

function findAllMatchingZones(address: string): DeliveryZone[] {
  const normalizedAddress = normalizeSuburb(address);
  const matchingZones: DeliveryZone[] = [];

  for (const zone of DELIVERY_ZONES) {
    for (const suburb of zone.suburbs) {
      if (normalizedAddress.includes(normalizeSuburb(suburb))) {
        matchingZones.push(zone);
        break;
      }
    }
  }

  return matchingZones;
}

export function findDeliveryZone(address: string): DeliveryZone | null {
  const matchingZones = findAllMatchingZones(address);
  return matchingZones.length > 0 ? matchingZones[0] : null;
}

export function calculateZoneDetails(address: string): {
  fee: number;
  zone: string;
  found: boolean;
  zoneNumber: number;
} {
  const allMatches = findAllMatchingZones(address);
  if (allMatches.length === 0) {
    return {
      fee: 500,
      zone: "Zone 6 - Greater Gauteng (Standard Rate)",
      found: false,
      zoneNumber: 6
    };
  }
  const closest = allMatches[0];
  return {
    fee: closest.fee,
    zone: closest.name,
    found: true,
    zoneNumber: closest.zoneNumber
  };
}

export function calculateDeliveryFee(address: string): {
  fee: number;
  zone: string;
  found: boolean;
  multipleMatches?: boolean;
  allMatches?: DeliveryZone[];
} {
  const allMatches = findAllMatchingZones(address);

  if (allMatches.length === 0) {
    return {
      fee: 500,
      zone: "Zone 6 - Greater Gauteng (Standard Rate)",
      found: false
    };
  }

  const closestZone = allMatches[0];

  if (allMatches.length > 1) {
    return {
      fee: closestZone.fee,
      zone: `${closestZone.name} (closest match)`,
      found: true,
      multipleMatches: true,
      allMatches
    };
  }

  return {
    fee: closestZone.fee,
    zone: closestZone.name,
    found: true
  };
}

export function getAllZones(): DeliveryZone[] {
  return DELIVERY_ZONES;
}
