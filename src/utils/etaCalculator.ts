// src/utils/etaCalculator.ts
// Real-time, traffic-aware Uber-style ETA & arrival-clock engine (Africa/Johannesburg SAST)
// for Portugal Bakery (245 Johannesburg Rd, La Rochelle, Johannesburg South, 2190).

import { BAKERY_ORIGIN_COORDS } from "@/utils/deliveryZones";
import { haversineKm } from "@/utils/saAddressGeocoder";

export interface LiveTrafficState {
  factor: number;
  label: string;
  severity: "low" | "moderate" | "heavy";
}

export interface RealisticEtaBreakdown {
  /** e.g. "14:38 – 14:48" or "Tomorrow 07:12 – 07:24" or "Arriving ~14:36" */
  arrivalWindowLabel: string;
  /** e.g. "24–34 min" or "8 min away" */
  durationLabel: string;
  /** e.g. "Latest arrival by 14:54" */
  latestByLabel: string;
  /** Live traffic-adjusted road drive time in minutes */
  driveMinutes: number;
  /** Remaining bakery packing time in minutes */
  prepMinutes: number;
  /** Remaining courier match & pickup time in minutes */
  pickupMinutes: number;
  etaMinutesMin: number;
  etaMinutesMax: number;
  traffic: LiveTrafficState;
  storeOpenNow: boolean;
  nextOpenLabel: string | null;
  isDelivered: boolean;
  isEnRoute: boolean;
}

interface ProviderDispatchProfile {
  prepMin: number;
  prepMax: number;
  pickupMin: number;
  pickupMax: number;
  speedKmh: number;
  mode: "on_demand" | "van" | "same_day_hub" | "locker";
}

const PROVIDER_DISPATCH_PROFILES: Record<string, ProviderDispatchProfile> = {
  uber_direct: {
    prepMin: 8,
    prepMax: 11,
    pickupMin: 5,
    pickupMax: 9,
    speedKmh: 38,
    mode: "on_demand",
  },
  bolt: {
    prepMin: 8,
    prepMax: 11,
    pickupMin: 6,
    pickupMax: 10,
    speedKmh: 38,
    mode: "on_demand",
  },
  mr_d: {
    prepMin: 8,
    prepMax: 12,
    pickupMin: 6,
    pickupMax: 11,
    speedKmh: 35,
    mode: "on_demand",
  },
  indrive: {
    prepMin: 8,
    prepMax: 12,
    pickupMin: 7,
    pickupMax: 13,
    speedKmh: 36,
    mode: "on_demand",
  },
  yassir: {
    prepMin: 8,
    prepMax: 12,
    pickupMin: 7,
    pickupMax: 13,
    speedKmh: 36,
    mode: "on_demand",
  },
  local_courier: {
    prepMin: 8,
    prepMax: 12,
    pickupMin: 7,
    pickupMax: 12,
    speedKmh: 35,
    mode: "on_demand",
  },
  droppa: {
    prepMin: 10,
    prepMax: 15,
    pickupMin: 14,
    pickupMax: 24,
    speedKmh: 34,
    mode: "van",
  },
  own_delivery: {
    prepMin: 10,
    prepMax: 15,
    pickupMin: 12,
    pickupMax: 22,
    speedKmh: 34,
    mode: "van",
  },
  courier_guy: {
    prepMin: 12,
    prepMax: 18,
    pickupMin: 35,
    pickupMax: 75,
    speedKmh: 32,
    mode: "same_day_hub",
  },
  ram: {
    prepMin: 12,
    prepMax: 18,
    pickupMin: 40,
    pickupMax: 85,
    speedKmh: 32,
    mode: "same_day_hub",
  },
  aramex: {
    prepMin: 12,
    prepMax: 18,
    pickupMin: 40,
    pickupMax: 85,
    speedKmh: 32,
    mode: "same_day_hub",
  },
  fastway: {
    prepMin: 12,
    prepMax: 18,
    pickupMin: 45,
    pickupMax: 95,
    speedKmh: 30,
    mode: "same_day_hub",
  },
  pudo: {
    prepMin: 12,
    prepMax: 18,
    pickupMin: 45,
    pickupMax: 95,
    speedKmh: 32,
    mode: "locker",
  },
  pargo: {
    prepMin: 12,
    prepMax: 18,
    pickupMin: 50,
    pickupMax: 105,
    speedKmh: 32,
    mode: "locker",
  },
};

const ZONE_AVG_ROAD_KM: Record<number, number> = {
  1: 2.6,
  2: 7.4,
  3: 12.5,
  4: 17.5,
  5: 24.5,
  6: 35.0,
};

const SAST_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Get SAST (Africa/Johannesburg, UTC+2) clock components for any instant.
 */
export function getJHBClock(date: Date = new Date()) {
  const sastMs = date.getTime() + 2 * 3600 * 1000;
  const d = new Date(sastMs);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    dayOfWeek: d.getUTCDay(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    minutesOfDay: d.getUTCHours() * 60 + d.getUTCMinutes(),
  };
}

export function formatSASTTime(date: Date): string {
  const { hour, minute } = getJHBClock(date);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatDayPrefix(target: Date, now: Date): string {
  const t = getJHBClock(target);
  const n = getJHBClock(now);
  if (t.year === n.year && t.month === n.month && t.day === n.day) {
    return "";
  }
  const tomorrowMs = now.getTime() + 86400 * 1000;
  const tm = getJHBClock(new Date(tomorrowMs));
  if (t.year === tm.year && t.month === tm.month && t.day === tm.day) {
    return "Tomorrow ";
  }
  return `${SAST_WEEKDAYS[t.dayOfWeek]} `;
}

/**
 * Live Johannesburg road traffic conditions based on SAST day & rush-hour windows.
 */
export function getLiveJhbTraffic(date: Date = new Date()): LiveTrafficState {
  const { dayOfWeek, minutesOfDay } = getJHBClock(date);
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isFriday = dayOfWeek === 5;
  const isSaturday = dayOfWeek === 6;

  if (isWeekday && minutesOfDay >= 6 * 60 + 45 && minutesOfDay <= 9 * 60) {
    return {
      factor: 1.42,
      label: "Heavy morning traffic",
      severity: "heavy",
    };
  }
  if (isFriday && minutesOfDay >= 14 * 60 && minutesOfDay <= 18 * 60 + 15) {
    return {
      factor: 1.54,
      label: "Friday peak traffic",
      severity: "heavy",
    };
  }
  if (isWeekday && minutesOfDay >= 15 * 60 && minutesOfDay <= 18 * 60 + 15) {
    return {
      factor: 1.46,
      label: "Peak afternoon traffic",
      severity: "heavy",
    };
  }
  if (
    isWeekday &&
    minutesOfDay >= 12 * 60 + 30 &&
    minutesOfDay <= 14 * 60 + 15
  ) {
    return {
      factor: 1.22,
      label: "Moderate midday traffic",
      severity: "moderate",
    };
  }
  if (isSaturday && minutesOfDay >= 8 * 60 + 30 && minutesOfDay <= 13 * 60) {
    return {
      factor: 1.18,
      label: "Busy weekend roads",
      severity: "moderate",
    };
  }
  return {
    factor: 1.12,
    label: "Light traffic",
    severity: "low",
  };
}

/**
 * Portugal Bakery Operating Hours (245 Johannesburg Rd, La Rochelle):
 *  - Mon–Fri: 06:45 – 16:00 SAST
 *  - Sat:     06:45 – 14:00 SAST
 *  - Sun:     Closed
 */
export function getBakeryDispatchWindow(now: Date = new Date()): {
  storeOpenNow: boolean;
  dispatchBaseDate: Date;
  nextOpenLabel: string | null;
} {
  const { dayOfWeek, minutesOfDay } = getJHBClock(now);
  const openMin = 6 * 60 + 45; // 06:45
  const closeMin = dayOfWeek === 6 ? 14 * 60 : 16 * 60;

  if (
    dayOfWeek !== 0 &&
    minutesOfDay >= openMin &&
    minutesOfDay < closeMin - 15
  ) {
    return {
      storeOpenNow: true,
      dispatchBaseDate: now,
      nextOpenLabel: null,
    };
  }

  for (let addDays = 0; addDays <= 3; addDays++) {
    const candMs = now.getTime() + addDays * 86400 * 1000;
    const cand = getJHBClock(new Date(candMs));
    if (cand.dayOfWeek === 0) continue; // Sunday closed
    if (addDays === 0 && minutesOfDay >= openMin) continue; // Already past today's close

    const openUtcMs =
      Date.UTC(cand.year, cand.month, cand.day, 6, 45, 0) - 2 * 3600 * 1000;
    const openDate = new Date(openUtcMs);
    const prefix = formatDayPrefix(openDate, now).trim() || "Today";
    return {
      storeOpenNow: false,
      dispatchBaseDate: openDate,
      nextOpenLabel: `Opens ${prefix} at 06:45`,
    };
  }

  return {
    storeOpenNow: false,
    dispatchBaseDate: now,
    nextOpenLabel: "Opens Mon at 06:45",
  };
}

export interface ComputeLiveEtaInput {
  providerId?: string | null;
  deliveryMethod?: "delivery" | "pickup";
  status?: string;
  zoneNumber?: number;
  coords?: [number, number] | null;
  roadDistanceKm?: number | null;
  osrmDurationSeconds?: number | null;
  turnCount?: number;
  itemCount?: number;
  orderCreatedAt?: string | Date | null;
  statusUpdatedAt?: string | Date | null;
  now?: Date;
}

/**
 * Computes real-time Uber-style arrival window, countdown duration, and stage breakdown.
 */
export function computeLiveUberStyleEta(
  input: ComputeLiveEtaInput
): RealisticEtaBreakdown {
  const {
    providerId = "own_delivery",
    deliveryMethod = "delivery",
    status = "pending",
    zoneNumber = 1,
    coords = null,
    roadDistanceKm = null,
    osrmDurationSeconds = null,
    turnCount = 4,
    itemCount = 2,
    orderCreatedAt = null,
    statusUpdatedAt = null,
    now = new Date(),
  } = input;

  const normStatus = (status || "pending").toLowerCase();
  const isDelivered =
    normStatus === "delivered" || normStatus === "completed";
  const isEnRoute = [
    "out_for_delivery",
    "in_transit",
    "picked_up",
    "shipped",
  ].includes(normStatus);
  const isDriverAssigned = ["driver_assigned", "driver_arriving"].includes(
    normStatus
  );
  const isReadyPacked = [
    "ready",
    "ready_for_delivery",
    "ready_for_pickup",
    "courier_requested",
  ].includes(normStatus);

  // Active in-progress orders (already accepted/dispatched) always count from NOW,
  // whereas new checkout previews respect store opening hours!
  const isActiveLiveOrder =
    isEnRoute || isDriverAssigned || isReadyPacked || Boolean(orderCreatedAt);
  const bakeryWindow = getBakeryDispatchWindow(now);
  const baseClock =
    isActiveLiveOrder || bakeryWindow.storeOpenNow
      ? now
      : bakeryWindow.dispatchBaseDate;

  const traffic = getLiveJhbTraffic(baseClock);

  if (isDelivered) {
    return {
      arrivalWindowLabel: "Delivered",
      durationLabel: "Arrived",
      latestByLabel: "Completed",
      driveMinutes: 0,
      prepMinutes: 0,
      pickupMinutes: 0,
      etaMinutesMin: 0,
      etaMinutesMax: 0,
      traffic,
      storeOpenNow: bakeryWindow.storeOpenNow,
      nextOpenLabel: bakeryWindow.nextOpenLabel,
      isDelivered: true,
      isEnRoute: false,
    };
  }

  // Store Pickup at 245 Johannesburg Rd, La Rochelle
  if (deliveryMethod === "pickup") {
    const extraPrep = Math.min(8, Math.max(0, Math.floor((itemCount - 3) / 3) * 2));
    const pMin = isReadyPacked ? 0 : 10 + extraPrep;
    const pMax = isReadyPacked ? 2 : 16 + extraPrep;
    const start = new Date(baseClock.getTime() + pMin * 60000);
    const end = new Date(baseClock.getTime() + pMax * 60000);
    const dayPrefix = formatDayPrefix(start, now);

    return {
      arrivalWindowLabel: isReadyPacked
        ? "Ready Now at Counter"
        : `${dayPrefix}${formatSASTTime(start)} – ${formatSASTTime(end)}`,
      durationLabel: isReadyPacked ? "Ready for pickup" : `${pMin}–${pMax} min`,
      latestByLabel: `Ready by ${formatSASTTime(end)}`,
      driveMinutes: 0,
      prepMinutes: Math.round((pMin + pMax) / 2),
      pickupMinutes: 0,
      etaMinutesMin: pMin,
      etaMinutesMax: pMax,
      traffic,
      storeOpenNow: bakeryWindow.storeOpenNow,
      nextOpenLabel: bakeryWindow.nextOpenLabel,
      isDelivered: false,
      isEnRoute: false,
    };
  }

  const profile =
    PROVIDER_DISPATCH_PROFILES[providerId || "own_delivery"] ||
    PROVIDER_DISPATCH_PROFILES.own_delivery;

  // 1. Road distance
  let distKm =
    typeof roadDistanceKm === "number" && roadDistanceKm > 0
      ? roadDistanceKm
      : 0;
  if (!distKm) {
    if (coords && Number.isFinite(coords[0]) && Number.isFinite(coords[1])) {
      distKm = Math.max(
        0.3,
        haversineKm(BAKERY_ORIGIN_COORDS, coords) * 1.25
      );
    } else {
      distKm = ZONE_AVG_ROAD_KM[zoneNumber] || 8;
    }
  }

  // 2. Realistic road drive duration (OSRM free-flow + JHB traffic-light delay + live traffic factor + gate handover)
  let freeFlowDriveMin: number;
  if (typeof osrmDurationSeconds === "number" && osrmDurationSeconds > 0) {
    // ~18 sec average signal/intersection delay per turn in JHB + 2 min gate drop-off
    const signalDelayMin = Math.min(8, Math.max(1, (turnCount * 18) / 60));
    freeFlowDriveMin = osrmDurationSeconds / 60 + signalDelayMin;
  } else {
    freeFlowDriveMin =
      (distKm / profile.speedKmh) * 60 + Math.min(6, distKm * 0.25);
  }

  const fullTrafficDriveMin = Math.max(
    3,
    Math.round(freeFlowDriveMin * traffic.factor + 2)
  );

  // 3. Stage-aware remaining minutes (accounts for real elapsed time on placed orders!)
  const elapsedSinceCreatedMin = orderCreatedAt
    ? Math.max(0, (now.getTime() - new Date(orderCreatedAt).getTime()) / 60000)
    : 0;
  const elapsedSinceStatusMin = statusUpdatedAt
    ? Math.max(0, (now.getTime() - new Date(statusUpdatedAt).getTime()) / 60000)
    : 0;

  const extraItemsPrep = Math.min(
    8,
    Math.max(0, Math.floor((itemCount - 3) / 3) * 2)
  );

  let remPrepMin = 0;
  let remPrepMax = 0;
  let remPickupMin = 0;
  let remPickupMax = 0;
  let remDriveMin = fullTrafficDriveMin;

  if (isEnRoute) {
    // Courier already picked up from 245 Johannesburg Rd and is on the road!
    remPrepMin = 0;
    remPrepMax = 0;
    remPickupMin = 0;
    remPickupMax = 0;
    remDriveMin = Math.max(
      2,
      Math.round(fullTrafficDriveMin - elapsedSinceStatusMin)
    );
  } else if (isDriverAssigned) {
    remPrepMin = 0;
    remPrepMax = 2;
    remPickupMin = Math.max(2, Math.round(4 - elapsedSinceStatusMin * 0.5));
    remPickupMax = remPickupMin + 3;
  } else if (isReadyPacked) {
    const pickupScale =
      profile.mode === "on_demand"
        ? Math.max(1, (traffic.factor - 1) * 0.6 + 1)
        : 1;
    remPickupMin = Math.max(
      3,
      Math.round(profile.pickupMin * pickupScale - elapsedSinceStatusMin * 0.5)
    );
    remPickupMax = Math.max(
      remPickupMin + 3,
      Math.round(profile.pickupMax * pickupScale - elapsedSinceStatusMin * 0.5)
    );
  } else {
    // Checkout preview or newly placed order in preparation
    remPrepMin = Math.max(
      2,
      Math.round(profile.prepMin + extraItemsPrep - elapsedSinceCreatedMin)
    );
    remPrepMax = Math.max(
      remPrepMin + 3,
      Math.round(profile.prepMax + extraItemsPrep + 2 - elapsedSinceCreatedMin)
    );
    const pickupScale =
      profile.mode === "on_demand"
        ? Math.max(1, (traffic.factor - 1) * 0.6 + 1)
        : 1;
    remPickupMin = Math.round(profile.pickupMin * pickupScale);
    remPickupMax = Math.round(profile.pickupMax * pickupScale);
  }

  const etaMinutesMin = remPrepMin + remPickupMin + remDriveMin;
  const etaMinutesMax = isEnRoute
    ? remDriveMin + Math.max(2, Math.round(remDriveMin * 0.2))
    : remPrepMax +
      remPickupMax +
      Math.round(remDriveMin * 1.15) +
      2;

  const arrivalStart = new Date(baseClock.getTime() + etaMinutesMin * 60000);
  const arrivalEnd = new Date(baseClock.getTime() + etaMinutesMax * 60000);
  const latestBy = new Date(arrivalEnd.getTime() + 5 * 60000);

  const dayPrefix = formatDayPrefix(arrivalStart, now);
  const startStr = formatSASTTime(arrivalStart);
  const endStr = formatSASTTime(arrivalEnd);

  const arrivalWindowLabel = isEnRoute
    ? `~${startStr} (${remDriveMin} min)`
    : `${dayPrefix}${startStr} – ${endStr}`;

  let durationLabel: string;
  if (isEnRoute) {
    durationLabel = `${remDriveMin} min away`;
  } else if (etaMinutesMax >= 150) {
    const minH = Math.max(1, Math.round((etaMinutesMin / 60) * 10) / 10);
    const maxH = Math.max(minH + 0.5, Math.round((etaMinutesMax / 60) * 10) / 10);
    durationLabel = `${minH}–${maxH} hrs`;
  } else {
    durationLabel = `${etaMinutesMin}–${etaMinutesMax} min`;
  }

  return {
    arrivalWindowLabel,
    durationLabel,
    latestByLabel: `Latest by ${dayPrefix}${formatSASTTime(latestBy)}`,
    driveMinutes: remDriveMin,
    prepMinutes: Math.round((remPrepMin + remPrepMax) / 2),
    pickupMinutes: Math.round((remPickupMin + remPickupMax) / 2),
    etaMinutesMin,
    etaMinutesMax,
    traffic,
    storeOpenNow: bakeryWindow.storeOpenNow,
    nextOpenLabel: bakeryWindow.nextOpenLabel,
    isDelivered: false,
    isEnRoute,
  };
}
