// src/utils/saAddressGeocoder.ts
// Uber-style South African street address autocomplete, suburb-border street resolver,
// reverse geocoding (for dragged map pins), and live browser GPS detection.

import { BAKERY_ORIGIN_COORDS } from "@/utils/deliveryZones";

const API_URL =
  import.meta.env.VITE_API_URL || "https://bakerybackend-i7wj.onrender.com";

export interface SAAddressSuggestion {
  id: string;
  primaryText: string;
  secondaryText: string;
  fullAddress: string;
  lat: number;
  lng: number;
  distanceFromBakeryKm: number;
}

export interface LiveGPSPosition {
  lat: number;
  lng: number;
  accuracyMeters: number;
}

// Known Johannesburg & Gauteng suburb centroids for instant proximity ranking
// (especially helpful when an OSM street sits right on the boundary of two suburbs,
// e.g. "4th Street" on the La Rochelle / Rosettenville border).
export const GAUTENG_SUBURB_COORDS: Record<string, [number, number]> = {
  "la rochelle": [-26.2432, 28.0565],
  rosettenville: [-26.2522, 28.0547],
  turffontein: [-26.2448, 28.0402],
  kenilworth: [-26.2485, 28.0485],
  "regents park": [-26.2465, 28.0715],
  "the hill": [-26.2528, 28.0695],
  linmeyer: [-26.2615, 28.0662],
  oakdene: [-26.2655, 28.0512],
  townsview: [-26.2572, 28.0472],
  booysens: [-26.2328, 28.0235],
  "booysens reserve": [-26.2305, 28.0135],
  ophirton: [-26.2248, 28.0265],
  robertsham: [-26.2485, 28.0145],
  selby: [-26.2155, 28.0398],
  malvern: [-26.2022, 28.1055],
  denver: [-26.2125, 28.0985],
  "moffat view": [-26.2562, 28.0812],
  "johannesburg south": [-26.2585, 28.0425],
  glenvista: [-26.2865, 28.0575],
  "the glen": [-26.2682, 28.0504],
  mulbarton: [-26.2945, 28.0665],
  bassonia: [-26.2782, 28.0668],
  mondeor: [-26.2788, 28.0155],
  "winchester hills": [-26.2692, 28.0238],
  suideroord: [-26.2665, 28.0315],
  ridgeway: [-26.2625, 28.0068],
  ormonde: [-26.2452, 28.0012],
  southgate: [-26.2668, 27.9912],
  "crown mines": [-26.2165, 28.0055],
  nasrec: [-26.2435, 27.9825],
  mayfair: [-26.2015, 28.0095],
  fordsburg: [-26.2055, 28.0245],
  "johannesburg cbd": [-26.2041, 28.0473],
  maboneng: [-26.2038, 28.0588],
  jeppestown: [-26.2058, 28.0672],
  troyeville: [-26.1992, 28.0662],
  doornfontein: [-26.1972, 28.0598],
  bertrams: [-26.1945, 28.0685],
  kensington: [-26.1952, 28.0968],
  "city deep": [-26.2285, 28.0852],
  alberton: [-26.2678, 28.1225],
  germiston: [-26.2258, 28.1702],
  braamfontein: [-26.1929, 28.0305],
  newtown: [-26.2018, 28.0328],
  parktown: [-26.1808, 28.0382],
  "auckland park": [-26.1825, 28.0045],
  melville: [-26.1765, 28.0085],
  westdene: [-26.1782, 27.9875],
  brixton: [-26.1928, 27.9985],
  houghton: [-26.1665, 28.0568],
  norwood: [-26.1548, 28.0752],
  "orange grove": [-26.1585, 28.0825],
  cyrildene: [-26.1788, 28.1055],
  bedfordview: [-26.1795, 28.1385],
  edenvale: [-26.1408, 28.1525],
  boksburg: [-26.2125, 28.2528],
  benoni: [-26.1885, 28.3208],
  brakpan: [-26.2365, 28.3695],
  springs: [-26.2545, 28.4428],
  soweto: [-26.2678, 27.8585],
  diepkloof: [-26.2512, 27.9435],
  orlando: [-26.2385, 27.9185],
  pimville: [-26.2745, 27.8965],
  "kibler park": [-26.3185, 28.0215],
  eikenhof: [-26.3325, 27.9985],
  rosebank: [-26.1467, 28.0416],
  parkhurst: [-26.1392, 28.0155],
  greenside: [-26.1518, 28.0125],
  emmarentia: [-26.1575, 28.0038],
  linden: [-26.1355, 27.9945],
  northcliff: [-26.1475, 27.9655],
  "hyde park": [-26.1245, 28.0378],
  illovo: [-26.1278, 28.0492],
  sandton: [-26.1076, 28.0567],
  morningside: [-26.0865, 28.0628],
  bryanston: [-26.0585, 28.0225],
  rivonia: [-26.0528, 28.0602],
  woodmead: [-26.0575, 28.0865],
  sunninghill: [-26.0342, 28.0685],
  fourways: [-26.0178, 28.0095],
  randburg: [-26.0936, 27.9985],
  ferndale: [-26.0888, 27.9895],
  roodepoort: [-26.1625, 27.8725],
  florida: [-26.1765, 27.9125],
  alexandra: [-26.1032, 28.0985],
  "protea glen": [-26.2785, 27.7985],
  meyersdal: [-26.2925, 28.0945],
  brackenhurst: [-26.3125, 28.1185],
  greenstone: [-26.1185, 28.1465],
  modderfontein: [-26.0945, 28.1585],
  "kempton park": [-26.1005, 28.2315],
  isando: [-26.1395, 28.2045],
  midrand: [-25.9992, 28.1263],
  waterfall: [-26.0145, 28.1085],
  kyalami: [-25.9865, 28.0785],
  tembisa: [-25.9965, 28.2268],
  lenasia: [-26.3228, 27.8295],
  ennerdale: [-26.4045, 27.8385],
  walkerville: [-26.4125, 27.9625],
  centurion: [-25.8603, 28.1894],
  pretoria: [-25.7479, 28.2293],
  lanseria: [-25.9385, 27.9265],
  krugersdorp: [-26.1015, 27.7745],
  randfontein: [-26.1795, 27.7015],
  vereeniging: [-26.6736, 27.9319],
  vanderbijlpark: [-26.7031, 27.8378],
  heidelberg: [-26.5048, 28.3592],
  nigel: [-26.4315, 28.4725],
};

export function haversineKm(a: [number, number], b: [number, number]): number {
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

function isWithinSouthAfrica(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat < -22.0 &&
    lat > -35.0 &&
    lng > 16.0 &&
    lng < 33.5
  );
}

function cleanAdminLabel(raw?: string | null): string {
  if (!raw) return "";
  return raw
    .replace(/Johannesburg Ward \d+/gi, "")
    .replace(/City of Johannesburg Metropolitan Municipality/gi, "Johannesburg")
    .replace(/City of Ekurhuleni Metropolitan Municipality/gi, "Ekurhuleni")
    .replace(/City of Tshwane Metropolitan Municipality/gi, "Pretoria")
    .replace(/^Commercial area$/i, "")
    .trim();
}

function extractLeadingHouseNumber(query: string): string {
  const m = query.trim().match(/^(\d+[A-Za-z]?)\s+(?=[A-Za-z0-9])/);
  return m ? m[1] : "";
}

function detectMentionedSuburb(query: string): {
  suburbName: string;
  coords: [number, number];
  streetOnlyQuery: string;
} | null {
  const lower = query.toLowerCase();
  const sorted = Object.keys(GAUTENG_SUBURB_COORDS).sort(
    (a, b) => b.length - a.length
  );
  for (const sub of sorted) {
    const idx = lower.indexOf(sub);
    if (idx > 0) {
      const streetPart = query
        .slice(0, idx)
        .replace(/[,\-]+$/g, "")
        .trim();
      if (streetPart.length >= 2) {
        return {
          suburbName: sub
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          coords: GAUTENG_SUBURB_COORDS[sub],
          streetOnlyQuery: streetPart,
        };
      }
    }
  }
  return null;
}

/**
 * Search South African street addresses, suburbs, complexes, and landmarks (Uber-style).
 */
export async function searchSAAddressSuggestions(
  rawQuery: string,
  userLiveCoords?: [number, number] | null,
  signal?: AbortSignal
): Promise<SAAddressSuggestion[]> {
  const q = rawQuery.trim();
  if (q.length < 2) return [];

  const typedHouseNumber = extractLeadingHouseNumber(q);
  const mentionedSuburb = detectMentionedSuburb(q);
  const biasPoint: [number, number] =
    mentionedSuburb?.coords || userLiveCoords || BAKERY_ORIGIN_COORDS;

  const photonQ = q.toLowerCase().includes("south africa")
    ? q
    : `${q}, Johannesburg, South Africa`;

  const requests: Promise<SAAddressSuggestion[]>[] = [];

  // 1. Nominatim ZA Structured Viewbox Search
  requests.push(
    (async () => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=za&viewbox=27.5,-25.5,28.7,-26.8&bounded=0&limit=8&q=${encodeURIComponent(
          q
        )}`,
        { signal }
      );
      if (!res.ok) return [];
      const items = await res.json();
      return parseNominatimItems(items, typedHouseNumber);
    })().catch(() => [])
  );

  // 2. If user typed "<street> <suburb>" (e.g. "4th Street La Rochelle"), also search
  // "<street>, Johannesburg" so streets sitting on an adjacent OSM ward border still appear!
  if (mentionedSuburb) {
    requests.push(
      (async () => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=za&viewbox=27.7,-25.8,28.5,-26.5&bounded=0&limit=8&q=${encodeURIComponent(
            `${mentionedSuburb.streetOnlyQuery}, Johannesburg`
          )}`,
          { signal }
        );
        if (!res.ok) return [];
        const items = await res.json();
        return parseNominatimItems(
          items,
          typedHouseNumber,
          mentionedSuburb.suburbName,
          mentionedSuburb.coords
        );
      })().catch(() => [])
    );
  }

  // 3. Photon Fast Autocomplete (OSM-backed, typo-tolerant)
  requests.push(
    (async () => {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(
          photonQ
        )}&lat=${biasPoint[0]}&lon=${biasPoint[1]}&limit=8`,
        { signal }
      );
      if (!res.ok) return [];
      const data = await res.json();
      return parsePhotonFeatures(data?.features || [], typedHouseNumber);
    })().catch(() => [])
  );

  const settled = await Promise.all(requests);
  let combined = settled.flat();

  // 4. Backend fallback if direct browser requests yielded nothing
  if (combined.length === 0) {
    try {
      const proxyRes = await fetch(
        `${API_URL}/api/delivery/address-search?q=${encodeURIComponent(
          q
        )}&lat=${biasPoint[0]}&lng=${biasPoint[1]}`,
        { signal }
      );
      if (proxyRes.ok) {
        const proxyJson = await proxyRes.json();
        combined = (proxyJson.suggestions || []).map((s: any) => ({
          ...s,
          distanceFromBakeryKm:
            Math.round(
              haversineKm(BAKERY_ORIGIN_COORDS, [s.lat, s.lng]) * 1.24 * 10
            ) / 10,
        }));
      }
    } catch {
      // ignore fallback error
    }
  }

  // Deduplicate nearby identical street/place names & rank smartly
  const deduped: SAAddressSuggestion[] = [];
  for (const item of combined) {
    if (!isWithinSouthAfrica(item.lat, item.lng)) continue;
    const normPrimary = item.primaryText.toLowerCase().trim();
    const duplicate = deduped.find(
      (existing) =>
        existing.primaryText.toLowerCase().trim() === normPrimary &&
        haversineKm([existing.lat, existing.lng], [item.lat, item.lng]) < 0.35
    );
    if (!duplicate) {
      deduped.push(item);
    }
  }

  // Rank: exact street/POI matches near the mentioned suburb or bias point come first
  const qWords = q
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2);

  deduped.sort((a, b) => {
    const score = (cand: SAAddressSuggestion) => {
      let s = 0;
      const hay = `${cand.primaryText} ${cand.secondaryText}`.toLowerCase();
      for (const w of qWords) {
        if (hay.includes(w)) s += 25;
      }
      if (
        cand.primaryText.toLowerCase().includes("street") ||
        cand.primaryText.toLowerCase().includes("road") ||
        cand.primaryText.toLowerCase().includes("avenue") ||
        cand.primaryText.toLowerCase().includes("drive") ||
        /\d/.test(cand.primaryText)
      ) {
        s += 18;
      }
      const distToBias = haversineKm(biasPoint, [cand.lat, cand.lng]);
      // Strongly prefer streets right next to the requested suburb / user GPS
      s -= Math.min(45, distToBias * 1.8);
      return s;
    };
    return score(b) - score(a);
  });

  return deduped.slice(0, 7);
}

function parseNominatimItems(
  items: any[],
  typedHouseNumber: string,
  nearSuburbLabel?: string,
  nearSuburbCoords?: [number, number]
): SAAddressSuggestion[] {
  const out: SAAddressSuggestion[] = [];
  for (const item of items || []) {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    if (!isWithinSouthAfrica(lat, lng)) continue;

    const addr = item.address || {};
    const house = addr.house_number || typedHouseNumber || "";
    const road =
      addr.road ||
      addr.pedestrian ||
      addr.footway ||
      addr.street ||
      (item.category === "highway" ? item.name : "") ||
      "";
    const poiName =
      item.name && item.name !== road && item.category !== "boundary"
        ? item.name
        : "";
    let suburb = cleanAdminLabel(
      addr.suburb ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.residential ||
        addr.subdistrict ||
        addr.village ||
        ""
    );

    // If this street is within 1.4km of the suburb the user explicitly typed (e.g. La Rochelle / Rosettenville border),
    // include that suburb label so the user recognizes it immediately!
    if (
      nearSuburbLabel &&
      nearSuburbCoords &&
      haversineKm([lat, lng], nearSuburbCoords) <= 1.5 &&
      !suburb.toLowerCase().includes(nearSuburbLabel.toLowerCase())
    ) {
      suburb = suburb ? `${nearSuburbLabel} / ${suburb}` : nearSuburbLabel;
    }

    const city = cleanAdminLabel(
      addr.city || addr.town || addr.municipality || "Johannesburg"
    );
    const postcode = addr.postcode || "";

    const streetLine = [house, road].filter(Boolean).join(" ").trim();
    const primaryText =
      poiName && streetLine
        ? `${poiName} (${streetLine})`
        : poiName || streetLine || suburb || item.display_name?.split(",")[0] || "";

    if (!primaryText) continue;

    const secondaryParts = [suburb, city, postcode].filter(
      (part, idx, arr) =>
        Boolean(part) &&
        part.toLowerCase() !== primaryText.toLowerCase() &&
        arr.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === idx
    );
    const secondaryText = secondaryParts.join(", ");
    const fullAddress = [primaryText, ...secondaryParts]
      .filter(Boolean)
      .join(", ");

    const distanceFromBakeryKm =
      Math.round(haversineKm(BAKERY_ORIGIN_COORDS, [lat, lng]) * 1.24 * 10) /
      10;

    out.push({
      id: `nom_${item.place_id}_${lat.toFixed(4)}`,
      primaryText,
      secondaryText,
      fullAddress,
      lat,
      lng,
      distanceFromBakeryKm,
    });
  }
  return out;
}

function parsePhotonFeatures(
  features: any[],
  typedHouseNumber: string
): SAAddressSuggestion[] {
  const out: SAAddressSuggestion[] = [];
  for (const f of features || []) {
    const props = f.properties || {};
    if (props.countrycode && String(props.countrycode).toUpperCase() !== "ZA") {
      continue;
    }
    const [lng, lat] = f.geometry?.coordinates || [];
    if (!isWithinSouthAfrica(lat, lng)) continue;

    const house = props.housenumber || (props.street || props.osm_key === "highway" ? typedHouseNumber : "") || "";
    const street = props.street || (props.osm_key === "highway" ? props.name : "") || "";
    const poi = props.name && props.name !== street ? props.name : "";
    const suburb = cleanAdminLabel(props.locality || props.district || "");
    const city = cleanAdminLabel(props.city || props.county || props.state || "Johannesburg");
    const postcode = props.postcode || "";

    const streetLine = [house, street].filter(Boolean).join(" ").trim();
    const primaryText =
      poi && streetLine
        ? `${poi} (${streetLine})`
        : poi || streetLine || suburb;
    if (!primaryText) continue;

    const secondaryParts = [suburb, city, postcode].filter(
      (part, idx, arr) =>
        Boolean(part) &&
        part.toLowerCase() !== primaryText.toLowerCase() &&
        arr.findIndex((p) => p.toLowerCase() === part.toLowerCase()) === idx
    );

    const distanceFromBakeryKm =
      Math.round(haversineKm(BAKERY_ORIGIN_COORDS, [lat, lng]) * 1.24 * 10) /
      10;

    out.push({
      id: `ph_${props.osm_id || ""}_${lat.toFixed(4)}_${lng.toFixed(4)}`,
      primaryText,
      secondaryText: secondaryParts.join(", "),
      fullAddress: [primaryText, ...secondaryParts].filter(Boolean).join(", "),
      lat,
      lng,
      distanceFromBakeryKm,
    });
  }
  return out;
}

/**
 * Reverse-geocode exact GPS coordinates (from "Use My Live Location" or dragging the map pin)
 * into a clean South African street address.
 */
export async function reverseGeocodeSAPoint(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<string> {
  // 1. Nominatim street-level reverse geocode (zoom=18)
  try {
    const nomRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { signal }
    );
    if (nomRes.ok) {
      const data = await nomRes.json();
      const addr = data.address || {};
      const house = addr.house_number || "";
      const road =
        addr.road ||
        addr.pedestrian ||
        addr.residential ||
        addr.footway ||
        data.name ||
        "";
      const suburb = cleanAdminLabel(
        addr.suburb ||
          addr.neighbourhood ||
          addr.quarter ||
          addr.residential ||
          addr.village ||
          ""
      );
      const city = cleanAdminLabel(
        addr.city || addr.town || addr.municipality || "Johannesburg"
      );
      const postcode = addr.postcode || "";
      const streetLine = [house, road].filter(Boolean).join(" ").trim();
      const parts = [streetLine, suburb, city, postcode].filter(
        (p, i, arr) =>
          Boolean(p) &&
          arr.findIndex((x) => x.toLowerCase() === p.toLowerCase()) === i
      );
      if (parts.length > 0) return parts.join(", ");
    }
  } catch {
    // try Photon below
  }

  // 2. Photon reverse geocode
  try {
    const phRes = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`,
      { signal }
    );
    if (phRes.ok) {
      const phData = await phRes.json();
      const props = phData?.features?.[0]?.properties;
      if (props) {
        const streetLine = [props.housenumber, props.street || props.name]
          .filter(Boolean)
          .join(" ")
          .trim();
        const suburb = cleanAdminLabel(props.locality || props.district || "");
        const city = cleanAdminLabel(props.city || "Johannesburg");
        const postcode = props.postcode || "";
        const parts = [streetLine, suburb, city, postcode].filter(Boolean);
        if (parts.length > 0) return parts.join(", ");
      }
    }
  } catch {
    // try backend proxy below
  }

  // 3. Backend reverse-geocode fallback
  try {
    const proxyRes = await fetch(
      `${API_URL}/api/delivery/reverse-geocode?lat=${lat}&lng=${lng}`,
      { signal }
    );
    if (proxyRes.ok) {
      const proxyData = await proxyRes.json();
      if (proxyData?.address) return proxyData.address;
    }
  } catch {
    // ignore
  }

  return `Pinned Location (${lat.toFixed(5)}, ${lng.toFixed(5)}), Johannesburg`;
}

/**
 * Request the customer's live device GPS coordinates via the browser Geolocation API.
 * Attempts high-accuracy GPS first, with automatic Wi-Fi/cellular fallback if indoors.
 */
export function getCurrentLiveGPS(): Promise<LiveGPSPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new Error("Live location is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyMeters: Math.round(pos.coords.accuracy || 25),
        });
      },
      (highAccErr) => {
        // If user explicitly denied permission, surface clear message immediately
        if (highAccErr.code === highAccErr.PERMISSION_DENIED) {
          reject(
            new Error(
              "Location permission was denied. Please allow location access in your browser settings or search your street address."
            )
          );
          return;
        }
        // Fallback to fast network/Wi-Fi positioning
        navigator.geolocation.getCurrentPosition(
          (pos2) => {
            resolve({
              lat: pos2.coords.latitude,
              lng: pos2.coords.longitude,
              accuracyMeters: Math.round(pos2.coords.accuracy || 50),
            });
          },
          (fallbackErr) => {
            reject(
              new Error(
                fallbackErr.message ||
                  "Could not determine your live location. Please search your street address or place the pin on the map."
              )
            );
          },
          { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 10000 }
    );
  });
}
