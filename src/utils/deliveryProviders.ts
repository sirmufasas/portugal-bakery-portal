// src/utils/deliveryProviders.ts
// Complete registry of South African delivery services supported by Portugal Bakery.

import { calculateZoneDetails } from "./deliveryZones";
import { computeLiveUberStyleEta } from "./etaCalculator";

export type DeliveryCategory = "in_house" | "on_demand" | "courier" | "pickup_point";

export interface DeliveryProviderMeta {
  id: string;
  name: string;
  shortTag: string;
  category: DeliveryCategory;
  description: string;
  bookingUrl: string | null;
  badgeClass: string;
  serviceType: string;
  maxZone?: number;
  enabledByDefault?: boolean;
  zoneFees: Record<number, number>;
  zoneEtas: Record<number, [number, number]>;
}

export interface DeliveryQuoteOption {
  providerId: string;
  providerName: string;
  category?: DeliveryCategory;
  description?: string;
  bookingUrl?: string | null;
  dispatchMode?: string;
  fee: number;
  originalFee?: number;
  freeDelivery?: boolean;
  currency: string;
  etaMinutesMin?: number;
  etaMinutesMax?: number;
  driveMinutes?: number;
  prepMinutes?: number;
  pickupMinutes?: number;
  trafficLabel?: string;
  storeOpenNow?: boolean;
  estimatedArrivalStart?: string;
  estimatedArrivalEnd?: string;
  zone?: string;
  serviceType?: string;
  labels?: string[];
  quoteId?: string | null;
}

export const SA_DELIVERY_PROVIDERS: DeliveryProviderMeta[] = [
  {
    id: "own_delivery",
    name: "Portugal Bakery Delivery",
    shortTag: "PB",
    category: "in_house",
    description: "In-house bakery van • Careful handling for cakes & large orders",
    bookingUrl: null,
    badgeClass: "bg-amber-600 text-white",
    serviceType: "standard",
    enabledByDefault: true,
    zoneFees: { 1: 150, 2: 200, 3: 350, 4: 400, 5: 450, 6: 500 },
    zoneEtas: { 1: [45, 90], 2: [60, 120], 3: [75, 140], 4: [90, 160], 5: [100, 180], 6: [120, 210] },
  },
  {
    id: "uber_direct",
    name: "Uber Package (Uber Direct)",
    shortTag: "UBER",
    category: "on_demand",
    description: "Fast on-demand motorbike/car delivery across Johannesburg",
    bookingUrl: "https://m.uber.com/",
    badgeClass: "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
    serviceType: "on_demand_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 65, 2: 95, 3: 135, 4: 175, 5: 230, 6: 310 },
    zoneEtas: { 1: [20, 35], 2: [25, 45], 3: [30, 50], 4: [35, 60], 5: [45, 75], 6: [60, 95] },
  },
  {
    id: "bolt",
    name: "Bolt Send",
    shortTag: "BOLT",
    category: "on_demand",
    description: "Fast same-day parcel & express delivery across Joburg",
    bookingUrl: "https://bolt.eu/en-za/",
    badgeClass: "bg-emerald-600 text-white",
    serviceType: "on_demand_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 55, 2: 85, 3: 120, 4: 160, 5: 210, 6: 285 },
    zoneEtas: { 1: [20, 35], 2: [25, 45], 3: [30, 50], 4: [35, 60], 5: [45, 75], 6: [60, 95] },
  },
  {
    id: "indrive",
    name: "inDrive Couriers",
    shortTag: "inD",
    category: "on_demand",
    description: "Affordable on-demand door-to-door courier across Gauteng",
    bookingUrl: "https://delivery.indrive.com/",
    badgeClass: "bg-lime-600 text-white",
    serviceType: "on_demand_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 50, 2: 78, 3: 110, 4: 145, 5: 195, 6: 260 },
    zoneEtas: { 1: [25, 45], 2: [30, 50], 3: [35, 55], 4: [40, 65], 5: [50, 80], 6: [65, 100] },
  },
  {
    id: "yassir",
    name: "Yassir Delivery",
    shortTag: "YAS",
    category: "on_demand",
    description: "Express on-demand courier straight to your door",
    bookingUrl: "https://yassir.com/",
    badgeClass: "bg-purple-600 text-white",
    serviceType: "on_demand_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 58, 2: 88, 3: 125, 4: 165, 5: 215, 6: 290 },
    zoneEtas: { 1: [25, 40], 2: [30, 45], 3: [35, 55], 4: [40, 65], 5: [50, 80], 6: [60, 95] },
  },
  {
    id: "mr_d",
    name: "Mr D Express",
    shortTag: "Mr D",
    category: "on_demand",
    description: "SA's local express bike delivery (up to 20km radius)",
    bookingUrl: "https://www.mrdfood.com/",
    badgeClass: "bg-sky-600 text-white",
    serviceType: "on_demand_door_to_door",
    maxZone: 4,
    enabledByDefault: true,
    zoneFees: { 1: 45, 2: 65, 3: 95, 4: 130, 5: 130, 6: 130 },
    zoneEtas: { 1: [25, 40], 2: [30, 45], 3: [35, 55], 4: [45, 65], 5: [45, 65], 6: [45, 65] },
  },
  {
    id: "droppa",
    name: "Droppa Express",
    shortTag: "DRP",
    category: "on_demand",
    description: "SA on-demand car & van delivery • Great for cakes & catering trays",
    bookingUrl: "https://www.droppa.co.za/",
    badgeClass: "bg-orange-600 text-white",
    serviceType: "on_demand_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 85, 2: 115, 3: 155, 4: 195, 5: 250, 6: 330 },
    zoneEtas: { 1: [35, 55], 2: [40, 65], 3: [45, 75], 4: [55, 85], 5: [65, 95], 6: [75, 120] },
  },
  {
    id: "courier_guy",
    name: "The Courier Guy",
    shortTag: "TCG",
    category: "courier",
    description: "Same-day Gauteng door-to-door courier • Waybill live tracking",
    bookingUrl: "https://portal.thecourierguy.co.za/",
    badgeClass: "bg-cyan-700 text-white",
    serviceType: "same_day_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 95, 2: 95, 3: 95, 4: 115, 5: 115, 6: 140 },
    zoneEtas: { 1: [120, 240], 2: [120, 240], 3: [120, 240], 4: [150, 300], 5: [150, 300], 6: [180, 360] },
  },
  {
    id: "ram",
    name: "RAM Hand-to-Hand Couriers",
    shortTag: "RAM",
    category: "courier",
    description: "Hand-to-hand signed delivery across Johannesburg & Pretoria",
    bookingUrl: "https://www.ram.co.za/",
    badgeClass: "bg-red-700 text-white",
    serviceType: "same_day_door_to_door",
    enabledByDefault: true,
    zoneFees: { 1: 105, 2: 105, 3: 105, 4: 125, 5: 125, 6: 155 },
    zoneEtas: { 1: [120, 240], 2: [120, 240], 3: [120, 240], 4: [150, 300], 5: [150, 300], 6: [180, 360] },
  },
  {
    id: "fastway",
    name: "Fastway Couriers SA",
    shortTag: "FWY",
    category: "courier",
    description: "Value regional parcel delivery across Gauteng (rusks, biscuits & hampers)",
    bookingUrl: "https://www.fastway.co.za/",
    badgeClass: "bg-blue-700 text-white",
    serviceType: "standard_parcel",
    enabledByDefault: true,
    zoneFees: { 1: 80, 2: 80, 3: 80, 4: 95, 5: 95, 6: 115 },
    zoneEtas: { 1: [180, 360], 2: [180, 360], 3: [180, 360], 4: [180, 360], 5: [180, 360], 6: [240, 420] },
  },
  {
    id: "aramex",
    name: "Aramex South Africa",
    shortTag: "AMX",
    category: "courier",
    description: "Express store-to-door parcel courier across Gauteng & SA",
    bookingUrl: "https://www.aramex.co.za/",
    badgeClass: "bg-rose-600 text-white",
    serviceType: "standard_parcel",
    enabledByDefault: true,
    zoneFees: { 1: 99, 2: 99, 3: 99, 4: 99, 5: 120, 6: 120 },
    zoneEtas: { 1: [180, 360], 2: [180, 360], 3: [180, 360], 4: [180, 360], 5: [240, 420], 6: [240, 420] },
  },
  {
    id: "pudo",
    name: "PUDO Smart Locker",
    shortTag: "PUDO",
    category: "pickup_point",
    description: "Collect 24/7 from your nearest PUDO locker (best for biscuits, rusks & gifts)",
    bookingUrl: "https://www.pudo.co.za/",
    badgeClass: "bg-teal-600 text-white",
    serviceType: "pickup_point",
    enabledByDefault: true,
    zoneFees: { 1: 60, 2: 60, 3: 60, 4: 60, 5: 75, 6: 75 },
    zoneEtas: { 1: [180, 360], 2: [180, 360], 3: [180, 360], 4: [180, 360], 5: [240, 480], 6: [240, 480] },
  },
  {
    id: "pargo",
    name: "Pargo Pickup Point",
    shortTag: "PRG",
    category: "pickup_point",
    description: "Click & Collect at Clicks, Spar, Caltex & partner stores nationwide",
    bookingUrl: "https://pargo.co.za/",
    badgeClass: "bg-yellow-500 text-neutral-900",
    serviceType: "pickup_point",
    enabledByDefault: true,
    zoneFees: { 1: 69, 2: 69, 3: 69, 4: 69, 5: 85, 6: 85 },
    zoneEtas: { 1: [180, 420], 2: [180, 420], 3: [180, 420], 4: [180, 420], 5: [240, 480], 6: [240, 480] },
  },
  {
    id: "local_courier",
    name: "Local Motorbike Courier",
    shortTag: "BIKE",
    category: "on_demand",
    description: "Direct neighbourhood bike courier for Johannesburg South & nearby suburbs",
    bookingUrl: null,
    badgeClass: "bg-stone-700 text-white",
    serviceType: "on_demand_door_to_door",
    maxZone: 3,
    enabledByDefault: false,
    zoneFees: { 1: 60, 2: 90, 3: 130, 4: 130, 5: 130, 6: 130 },
    zoneEtas: { 1: [25, 45], 2: [35, 55], 3: [45, 70], 4: [45, 70], 5: [45, 70], 6: [45, 70] },
  },
];

const PROVIDER_MAP: Record<string, DeliveryProviderMeta> = Object.fromEntries(
  SA_DELIVERY_PROVIDERS.map((p) => [p.id, p])
);

export const CATEGORY_LABELS: Record<DeliveryCategory, string> = {
  in_house: "In-House Bakery Delivery",
  on_demand: "Fast On-Demand Couriers (Uber, Bolt, inDrive, Yassir, Mr D, Droppa)",
  courier: "SA Same-Day & Parcel Couriers",
  pickup_point: "Smart Lockers & Click-and-Collect",
};

export function getProviderMeta(providerId?: string | null): DeliveryProviderMeta {
  if (providerId && PROVIDER_MAP[providerId]) {
    return PROVIDER_MAP[providerId];
  }
  return {
    id: providerId || "own_delivery",
    name: providerId ? providerId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Portugal Bakery Delivery",
    shortTag: "DLV",
    category: "courier",
    description: "Door-to-door delivery",
    bookingUrl: null,
    badgeClass: "bg-primary text-primary-foreground",
    serviceType: "standard",
    zoneFees: { 1: 150, 2: 200, 3: 350, 4: 400, 5: 450, 6: 500 },
    zoneEtas: { 1: [60, 180], 2: [60, 180], 3: [60, 180], 4: [60, 180], 5: [60, 180], 6: [60, 180] },
  };
}

export function formatEtaLabel(min?: number, max?: number): string {
  if (!max) return "";
  if (max >= 180) {
    const minH = Math.round((min || max) / 60);
    const maxH = Math.round(max / 60);
    return minH === maxH ? `~${maxH} hrs (Same day)` : `${minH}–${maxH} hrs (Same day)`;
  }
  return min === max ? `~${max} min` : `${min}–${max} min`;
}

/**
 * Fallback quote builder mirroring backend `delivery/engine.js` exact ZAR rates
 * so checkout still displays full SA options if the backend is waking up or
 * returning a pre-migration single-provider list.
 */
export function buildLocalQuotesFallback(
  address: string,
  coords?: [number, number] | null,
  itemCount = 2
): DeliveryQuoteOption[] {
  const { zone, zoneNumber } = calculateZoneDetails(address, coords);
  const now = new Date();

  const results: DeliveryQuoteOption[] = SA_DELIVERY_PROVIDERS.filter(
    (p) => p.enabledByDefault !== false && (!p.maxZone || zoneNumber <= p.maxZone)
  ).map((p) => {
    const fee = p.zoneFees[zoneNumber] ?? p.zoneFees[6];
    const liveEta = computeLiveUberStyleEta({
      providerId: p.id,
      deliveryMethod: "delivery",
      status: "pending",
      zoneNumber,
      coords,
      itemCount,
      now,
    });
    return {
      providerId: p.id,
      providerName: p.name,
      category: p.category,
      description: p.description,
      bookingUrl: p.bookingUrl,
      fee,
      currency: "ZAR",
      etaMinutesMin: liveEta.etaMinutesMin,
      etaMinutesMax: liveEta.etaMinutesMax,
      driveMinutes: liveEta.driveMinutes,
      prepMinutes: liveEta.prepMinutes,
      pickupMinutes: liveEta.pickupMinutes,
      trafficLabel: liveEta.traffic.label,
      storeOpenNow: liveEta.storeOpenNow,
      zone,
      serviceType: p.serviceType,
      quoteId: `${p.id}_z${zoneNumber}_${fee}`,
      labels: [],
    };
  });

  if (results.length > 0) {
    const doorToDoor = results.filter((q) => q.serviceType !== "pickup_point");
    const cheapestPool = doorToDoor.length > 0 ? doorToDoor : results;
    const minFee = Math.min(...cheapestPool.map((q) => q.fee));
    const minEta = Math.min(...results.map((q) => q.etaMinutesMax ?? Infinity));

    results.forEach((q) => {
      q.labels = [];
      if (q.fee === minFee && q.serviceType !== "pickup_point") q.labels.push("CHEAPEST");
      if (q.serviceType === "pickup_point" && q.fee <= minFee) q.labels.push("LOWEST LOCKER FEE");
      if ((q.etaMinutesMax ?? Infinity) === minEta) q.labels.push("FASTEST");
      if (q.providerId === "own_delivery" || q.providerId === "droppa") q.labels.push("BEST FOR CAKES");
      if (q.serviceType === "pickup_point") q.labels.push("PICKUP POINT");
      if (q.serviceType === "same_day_door_to_door") q.labels.push("SAME DAY");
    });
  }

  return results;
}
