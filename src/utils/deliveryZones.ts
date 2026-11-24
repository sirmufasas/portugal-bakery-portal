// src/utils/deliveryZones.ts

export interface DeliveryZone {
  zoneNumber: number;
  name: string;
  maxKm: number;
  fee: number;
  suburbs: string[];
}

export const BAKERY_ORIGIN_COORDS: [number, number] = [-26.2425, 28.0558];

// Delivery zones radiated from Portugal Bakery (245 Johannesburg Rd, La Rochelle, Johannesburg South, 2190)
export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    zoneNumber: 1,
    name: "Zone 1 - Local (0-5km)",
    maxKm: 5,
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
    maxKm: 10,
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
    maxKm: 15,
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
    maxKm: 20,
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
    maxKm: 30,
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
    maxKm: Infinity,
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

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(a[0])) *
      Math.cos(toRad(b[0])) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

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

export function calculateZoneDetails(
  address: string,
  coords?: [number, number] | null
): {
  fee: number;
  zone: string;
  found: boolean;
  zoneNumber: number;
} {
  if (
    coords &&
    Number.isFinite(coords[0]) &&
    Number.isFinite(coords[1]) &&
    coords[0] < -22 &&
    coords[0] > -35 &&
    coords[1] > 16 &&
    coords[1] < 33
  ) {
    const estRoadKm = haversineKm(BAKERY_ORIGIN_COORDS, coords) * 1.24;
    const matchedZone =
      DELIVERY_ZONES.find((z) => estRoadKm <= z.maxKm) ||
      DELIVERY_ZONES[DELIVERY_ZONES.length - 1];
    return {
      fee: matchedZone.fee,
      zone: matchedZone.name,
      found: true,
      zoneNumber: matchedZone.zoneNumber,
    };
  }

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

export function calculateDeliveryFee(
  address: string,
  coords?: [number, number] | null
): {
  fee: number;
  zone: string;
  found: boolean;
  multipleMatches?: boolean;
  allMatches?: DeliveryZone[];
} {
  if (coords) {
    const res = calculateZoneDetails(address, coords);
    return { fee: res.fee, zone: res.zone, found: res.found };
  }

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
