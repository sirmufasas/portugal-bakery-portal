import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  Navigation,
  Clock,
  MapPin,
  LocateFixed,
  ExternalLink,
  CheckCircle2,
  Truck,
  Layers,
  Route,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import {
  DeliveryProviderLogo,
  getBakeryLogoSrc,
  getProviderLogoSrc,
} from "@/components/delivery/DeliveryProviderLogo";
import { formatEtaLabel, getProviderMeta } from "@/utils/deliveryProviders";
import { calculateZoneDetails } from "@/utils/deliveryZones";
import { cn } from "@/lib/utils";

const API_URL =
  import.meta.env.VITE_API_URL || "https://bakerybackend-i7wj.onrender.com";

export interface OrderTrackingMapProps {
  orderNumber?: string;
  status?: string;
  customerAddress: string;
  deliveryMethod?: "delivery" | "pickup";
  deliveryProvider?: string | null;
  deliveryServiceName?: string | null;
  pickupLocation?: string | null;
  trackingUrl?: string | null;
  driverDetails?: {
    name?: string | null;
    phone?: string | null;
    vehicle?: string | null;
  } | null;
  compact?: boolean;
  className?: string;
}

interface RouteTurnStep {
  instruction: string;
  road: string;
  distanceMeters: number;
}

// Portugal Bakery: 245 Johannesburg Rd, La Rochelle, Johannesburg South, 2190
const BAKERY_COORDS: [number, number] = [-26.2425, 28.0558];
const BAKERY_LABEL = "Portugal Bakery · 245 Johannesburg Rd, La Rochelle";

// Instant coordinate dictionary for Johannesburg & Gauteng suburbs (Zones 1–6)
const SA_SUBURB_COORDS: Record<string, [number, number]> = {
  // Zone 1 (0–5 km)
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
  ophirton: [-26.2248, 28.0265],
  robertsham: [-26.2485, 28.0145],
  selby: [-26.2155, 28.0398],
  malvern: [-26.2022, 28.1055],
  denver: [-26.2125, 28.0985],
  "moffat view": [-26.2562, 28.0812],
  "johannesburg south": [-26.2585, 28.0425],

  // Zone 2 (5–10 km)
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
  doornfontein: [-26.1972, 28.0598],
  bertrams: [-26.1945, 28.0685],
  kensington: [-26.1952, 28.0968],
  "city deep": [-26.2285, 28.0852],
  alberton: [-26.2678, 28.1225],
  germiston: [-26.2258, 28.1702],

  // Zone 3 (10–15 km)
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

  // Zone 4 (15–20 km)
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

  // Zone 5 (20–30 km)
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

  // Zone 6 (30 km+)
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

interface ProviderVisualTheme {
  accentColor: string;
  routeCoreColor: string;
  routeCasingColor: string;
  vehicleLabel: string;
  serviceBadge: string;
  avgSpeedKmh: number;
}

const PROVIDER_THEMES: Record<string, ProviderVisualTheme> = {
  own_delivery: {
    accentColor: "#B45309",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "Portugal Bakery Pastry Van",
    serviceBadge: "In-House Refrigerated Van",
    avgSpeedKmh: 36,
  },
  uber_direct: {
    accentColor: "#111827",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#090D16",
    vehicleLabel: "Uber Package Courier",
    serviceBadge: "On-Demand Express",
    avgSpeedKmh: 42,
  },
  bolt: {
    accentColor: "#059669",
    routeCoreColor: "#059669",
    routeCasingColor: "#064E3B",
    vehicleLabel: "Bolt Send Driver",
    serviceBadge: "Fast Same-Day Express",
    avgSpeedKmh: 42,
  },
  indrive: {
    accentColor: "#4D7C0F",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "inDrive Direct Courier",
    serviceBadge: "On-Demand Door-to-Door",
    avgSpeedKmh: 40,
  },
  yassir: {
    accentColor: "#6D28D9",
    routeCoreColor: "#2563EB",
    routeCasingColor: "#1E1B4B",
    vehicleLabel: "Yassir Express Rider",
    serviceBadge: "Express Door Delivery",
    avgSpeedKmh: 40,
  },
  mr_d: {
    accentColor: "#0369A1",
    routeCoreColor: "#0284C7",
    routeCasingColor: "#0C4A6E",
    vehicleLabel: "Mr D Express Bike",
    serviceBadge: "Local Express Bike",
    avgSpeedKmh: 38,
  },
  droppa: {
    accentColor: "#0369A1",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "Droppa Bakery-Safe Car/Van",
    serviceBadge: "Cake & Catering Safe",
    avgSpeedKmh: 38,
  },
  courier_guy: {
    accentColor: "#1D4ED8",
    routeCoreColor: "#2563EB",
    routeCasingColor: "#0F172A",
    vehicleLabel: "The Courier Guy Van",
    serviceBadge: "Same-Day Gauteng Courier",
    avgSpeedKmh: 35,
  },
  ram: {
    accentColor: "#B91C1C",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "RAM Hand-to-Hand Van",
    serviceBadge: "Signed Hand-to-Hand",
    avgSpeedKmh: 35,
  },
  fastway: {
    accentColor: "#1E40AF",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "Fastway Regional Van",
    serviceBadge: "Regional Parcel Route",
    avgSpeedKmh: 34,
  },
  aramex: {
    accentColor: "#BE123C",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "Aramex Express Van",
    serviceBadge: "Express Store-to-Door",
    avgSpeedKmh: 35,
  },
  pudo: {
    accentColor: "#B45309",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "PUDO Smart Locker Van",
    serviceBadge: "24/7 Smart Locker Drop",
    avgSpeedKmh: 34,
  },
  pargo: {
    accentColor: "#A16207",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "Pargo Pickup Van",
    serviceBadge: "Click & Collect Partner Point",
    avgSpeedKmh: 34,
  },
  local_courier: {
    accentColor: "#44403C",
    routeCoreColor: "#1D4ED8",
    routeCasingColor: "#0F172A",
    vehicleLabel: "Local Neighbourhood Bike",
    serviceBadge: "Direct Bike Courier",
    avgSpeedKmh: 38,
  },
};

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

function bearingDegrees(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const toDeg = (r: number) => (r * 180) / Math.PI;
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function resolveInitialDestCoords(address: string): [number, number] {
  const normalized = address
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const sortedSuburbs = Object.keys(SA_SUBURB_COORDS).sort(
    (a, b) => b.length - a.length
  );
  for (const sub of sortedSuburbs) {
    if (normalized.includes(sub)) {
      return SA_SUBURB_COORDS[sub];
    }
  }

  const { zoneNumber } = calculateZoneDetails(address);
  const zoneDefaults: Record<number, [number, number]> = {
    1: [-26.2522, 28.0547], // Rosettenville
    2: [-26.2782, 28.0668], // Bassonia
    3: [-26.1929, 28.0305], // Braamfontein
    4: [-26.1076, 28.0567], // Sandton
    5: [-25.9992, 28.1263], // Midrand
    6: [-25.8603, 28.1894], // Centurion
  };
  return zoneDefaults[zoneNumber] || zoneDefaults[3];
}

function getProgressFraction(status?: string, liveTick = 0): number {
  const s = (status || "pending").toLowerCase();
  if (s === "completed" || s === "delivered") return 1;
  if (
    s === "out_for_delivery" ||
    s === "in_transit" ||
    s === "picked_up" ||
    s === "shipped"
  ) {
    return 0.58 + (liveTick % 18) * 0.01;
  }
  if (s === "driver_assigned" || s === "driver_arriving") return 0.22;
  if (
    s === "ready" ||
    s === "ready_for_delivery" ||
    s === "courier_requested"
  ) {
    return 0.12;
  }
  return 0;
}

function interpolateAlongPolyline(
  pts: [number, number][],
  fraction: number
): {
  point: [number, number];
  splitIndex: number;
} {
  if (pts.length === 0) return { point: BAKERY_COORDS, splitIndex: 0 };
  if (pts.length === 1 || fraction <= 0)
    return { point: pts[0], splitIndex: 0 };
  if (fraction >= 1)
    return { point: pts[pts.length - 1], splitIndex: pts.length - 1 };

  const segLengths: number[] = [];
  let totalLen = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = haversineKm(pts[i - 1], pts[i]);
    segLengths.push(d);
    totalLen += d;
  }

  if (totalLen <= 0.001) return { point: pts[0], splitIndex: 0 };

  const targetDist = totalLen * fraction;
  let acc = 0;
  for (let i = 0; i < segLengths.length; i++) {
    const seg = segLengths[i];
    if (acc + seg >= targetDist) {
      const localT = seg > 0 ? (targetDist - acc) / seg : 0;
      const lat = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * localT;
      const lng = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * localT;
      return { point: [lat, lng], splitIndex: i };
    }
    acc += seg;
  }

  return { point: pts[pts.length - 1], splitIndex: pts.length - 1 };
}

function formatManeuverInstruction(step: any): string {
  const road = step.name || step.ref || step.road || "road";
  const type = step.maneuver?.type || step.type || "continue";
  const mod = step.maneuver?.modifier || step.modifier || "";

  if (type === "depart") return `Head out on ${road}`;
  if (type === "arrive") return `Arrive at destination (${road})`;
  if (type === "roundabout" || type === "rotary")
    return `At the roundabout, take exit onto ${road}`;
  if (type === "merge") return `Merge onto ${road}`;
  if (type === "on ramp" || type === "off ramp")
    return `Take ramp toward ${road}`;
  if (type === "turn") {
    const dir = mod ? `${mod} ` : "";
    return `Turn ${dir}onto ${road}`;
  }
  return `Continue along ${road}`;
}

function formatStepDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.max(20, Math.round(meters / 10) * 10)} m`;
}

export function OrderTrackingMap({
  orderNumber,
  status = "confirmed",
  customerAddress,
  deliveryMethod = "delivery",
  deliveryProvider,
  deliveryServiceName,
  pickupLocation,
  trackingUrl,
  driverDetails,
  compact = false,
  className,
}: OrderTrackingMapProps) {
  const providerMeta = useMemo(
    () => getProviderMeta(deliveryProvider),
    [deliveryProvider]
  );
  const theme = PROVIDER_THEMES[providerMeta.id] || PROVIDER_THEMES.own_delivery;
  const displayProviderName = deliveryServiceName || providerMeta.name;

  const destinationQuery = pickupLocation?.trim()
    ? `${pickupLocation.trim()}, ${customerAddress}`
    : customerAddress;

  const [destCoords, setDestCoords] = useState<[number, number]>(() =>
    deliveryMethod === "pickup"
      ? BAKERY_COORDS
      : resolveInitialDestCoords(destinationQuery)
  );
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [turnSteps, setTurnSteps] = useState<RouteTurnStep[]>([]);
  const [viaStreets, setViaStreets] = useState<string[]>([]);
  const [routingLoading, setRoutingLoading] = useState<boolean>(
    deliveryMethod === "delivery"
  );
  const [roadDistanceKm, setRoadDistanceKm] = useState<number>(() => {
    if (deliveryMethod === "pickup") return 0;
    const initial = resolveInitialDestCoords(destinationQuery);
    return Math.max(1.2, haversineKm(BAKERY_COORDS, initial) * 1.28);
  });
  const [driveMinutes, setDriveMinutes] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<"street" | "satellite">("street");
  const [showDirections, setShowDirections] = useState(false);
  const [liveTick, setLiveTick] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Subtle live tick when courier is actively en route
  useEffect(() => {
    const activeStatuses = [
      "out_for_delivery",
      "in_transit",
      "picked_up",
      "shipped",
      "driver_assigned",
      "driver_arriving",
    ];
    if (!activeStatuses.includes((status || "").toLowerCase())) return;
    const timer = window.setInterval(() => setLiveTick((t) => t + 1), 3500);
    return () => window.clearInterval(timer);
  }, [status]);

  // Geocode + Compute Real Turn-by-Turn Road Geometry along actual SA streets & highways
  useEffect(() => {
    if (deliveryMethod === "pickup" || !destinationQuery.trim()) {
      setDestCoords(BAKERY_COORDS);
      setRoutePoints([BAKERY_COORDS]);
      setTurnSteps([]);
      setViaStreets([]);
      setRoadDistanceKm(0);
      setRoutingLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const computeRealStreetRoute = async () => {
      setRoutingLoading(true);
      let targetCoords: [number, number] =
        resolveInitialDestCoords(destinationQuery);

      const searchQ = destinationQuery.toLowerCase().includes("south africa")
        ? destinationQuery
        : `${destinationQuery}, Gauteng, South Africa`;

      // 1. High-accuracy street geocoding via Photon (CORS-enabled OSM geocoder biased to Johannesburg)
      try {
        const photonRes = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            searchQ
          )}&lat=-26.2041&lon=28.0473&limit=4`,
          { signal: controller.signal }
        );
        if (photonRes.ok) {
          const photonJson = await photonRes.json();
          const feature = (photonJson.features || []).find((f: any) => {
            const [lon, lat] = f?.geometry?.coordinates || [];
            return lat < -24.2 && lat > -27.8 && lon > 26.2 && lon < 29.8;
          });
          if (feature) {
            targetCoords = [
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ];
          }
        }
      } catch {
        // Fallback to Nominatim if Photon is unreachable
        try {
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&countrycodes=za&limit=1&q=${encodeURIComponent(
              searchQ
            )}`,
            { signal: controller.signal }
          );
          if (nomRes.ok) {
            const nomJson = await nomRes.json();
            if (Array.isArray(nomJson) && nomJson[0]) {
              const lat = parseFloat(nomJson[0].lat);
              const lon = parseFloat(nomJson[0].lon);
              if (lat < -24.2 && lat > -27.8 && lon > 26.2 && lon < 29.8) {
                targetCoords = [lat, lon];
              }
            }
          }
        } catch {
          // Keep suburb dictionary coordinates
        }
      }

      if (cancelled) return;
      setDestCoords(targetCoords);

      // 2. Fetch real street-by-street GeoJSON road polyline & turn steps
      const coordPair = `${BAKERY_COORDS[1]},${BAKERY_COORDS[0]};${targetCoords[1]},${targetCoords[0]}`;
      const osrmEndpoints = [
        `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordPair}?overview=full&geometries=geojson&steps=true`,
        `https://router.project-osrm.org/route/v1/driving/${coordPair}?overview=full&geometries=geojson&steps=true`,
      ];

      let resolvedRoute: {
        pts: [number, number][];
        distKm: number;
        durMin: number;
        steps: RouteTurnStep[];
        vias: string[];
      } | null = null;

      for (const endpoint of osrmEndpoints) {
        try {
          const res = await fetch(endpoint, { signal: controller.signal });
          if (!res.ok) continue;
          const json = await res.json();
          const route = json?.routes?.[0];
          const rawCoords = route?.geometry?.coordinates;
          if (Array.isArray(rawCoords) && rawCoords.length > 1) {
            const pts: [number, number][] = rawCoords.map(
              ([lng, lat]: [number, number]) => [lat, lng]
            );
            const rawSteps = route.legs?.[0]?.steps || [];
            const parsedSteps: RouteTurnStep[] = rawSteps
              .filter(
                (s: any) =>
                  (s.distance || 0) >= 45 || s.maneuver?.type === "arrive"
              )
              .map((s: any) => ({
                instruction: formatManeuverInstruction(s),
                road: s.name || s.ref || "Local street",
                distanceMeters: Math.round(s.distance || 0),
              }));

            // Pick top named arterial roads / highways by distance
            const roadTotals = new Map<string, number>();
            for (const s of rawSteps) {
              const label = (s.ref && s.name ? `${s.ref} (${s.name})` : s.ref || s.name || "").trim();
              if (!label) continue;
              roadTotals.set(label, (roadTotals.get(label) || 0) + (s.distance || 0));
            }
            const topRoads = [...roadTotals.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([r]) => r);

            const distKm = Math.max(0.6, route.distance / 1000);
            const durMin = Math.max(
              5,
              Math.round(
                route.duration
                  ? route.duration / 60
                  : (distKm / theme.avgSpeedKmh) * 60
              )
            );

            resolvedRoute = {
              pts,
              distKm,
              durMin,
              steps: parsedSteps,
              vias: topRoads,
            };
            break;
          }
        } catch {
          // Try next OSRM router
        }
      }

      // 3. Secondary fallback via our backend /api/delivery/route proxy
      if (!resolvedRoute) {
        try {
          const proxyRes = await fetch(
            `${API_URL}/api/delivery/route?lat=${targetCoords[0]}&lng=${targetCoords[1]}&address=${encodeURIComponent(
              destinationQuery
            )}`,
            { signal: controller.signal }
          );
          if (proxyRes.ok) {
            const proxyData = await proxyRes.json();
            if (
              Array.isArray(proxyData.coordinates) &&
              proxyData.coordinates.length > 1
            ) {
              resolvedRoute = {
                pts: proxyData.coordinates,
                distKm: proxyData.distanceKm,
                durMin: proxyData.durationMinutes,
                steps: (proxyData.steps || []).map((s: any) => ({
                  instruction: formatManeuverInstruction(s),
                  road: s.road,
                  distanceMeters: s.distanceMeters,
                })),
                vias: [
                  ...new Set<string>(
                    (proxyData.steps || [])
                      .map((s: any) => s.ref || s.road)
                      .filter(Boolean)
                  ),
                ].slice(0, 4),
              };
            }
          }
        } catch {
          // Ignore if backend proxy not reachable
        }
      }

      if (cancelled) return;

      if (resolvedRoute) {
        setRoutePoints(resolvedRoute.pts);
        setRoadDistanceKm(resolvedRoute.distKm);
        setDriveMinutes(resolvedRoute.durMin);
        setTurnSteps(resolvedRoute.steps);
        setViaStreets(resolvedRoute.vias);
      } else {
        const approxKm = Math.max(
          1.2,
          haversineKm(BAKERY_COORDS, targetCoords) * 1.28
        );
        setRoutePoints([BAKERY_COORDS, targetCoords]);
        setRoadDistanceKm(approxKm);
        setDriveMinutes(Math.max(6, Math.round((approxKm / theme.avgSpeedKmh) * 60)));
        setTurnSteps([]);
        setViaStreets([]);
      }

      setRoutingLoading(false);
    };

    computeRealStreetRoute();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [destinationQuery, deliveryMethod, theme.avgSpeedKmh]);

  // Initialize Real Interactive Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BAKERY_COORDS,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

    const tileGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;
    tileLayerGroupRef.current = tileGroup;
    routeLayerGroupRef.current = routeGroup;

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 250);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      tileLayerGroupRef.current = null;
      routeLayerGroupRef.current = null;
    };
  }, []);

  // Swap between Real Street Map (OpenStreetMap Standard) & Satellite Hybrid Imagery
  useEffect(() => {
    const tileGroup = tileLayerGroupRef.current;
    if (!tileGroup) return;

    tileGroup.clearLayers();

    if (mapStyle === "satellite") {
      // Real Aerial Satellite Imagery + Street/Highway Hybrid Labels
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
          maxZoom: 19,
        }
      ).addTo(tileGroup);

      L.tileLayer(
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          opacity: 0.9,
        }
      ).addTo(tileGroup);

      L.tileLayer(
        "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 19,
          opacity: 0.95,
        }
      ).addTo(tileGroup);
    } else {
      // Crisp Real-World OpenStreetMap Standard Tiles (with SA M1/M2/N12/N3 highway shields & street names)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(tileGroup);
    }
  }, [mapStyle]);

  const progress =
    deliveryMethod === "pickup" ? 0 : getProgressFraction(status, liveTick);
  const remainingKm = Math.max(0, roadDistanceKm * (1 - progress));

  const { zoneNumber } = useMemo(
    () => calculateZoneDetails(customerAddress || "Johannesburg"),
    [customerAddress]
  );

  const etaSummary = useMemo(() => {
    if (deliveryMethod === "pickup") return "Ready for store collection";
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "delivered") return "Delivered";
    if (
      s === "out_for_delivery" ||
      s === "in_transit" ||
      s === "picked_up" ||
      s === "shipped"
    ) {
      const remMins = Math.max(
        4,
        Math.round((driveMinutes || 20) * (1 - progress) + 3)
      );
      return `~${remMins} min remaining`;
    }
    if (driveMinutes) {
      return `~${driveMinutes} min drive (${formatEtaLabel(
        providerMeta.zoneEtas[zoneNumber]?.[0] || driveMinutes + 10,
        providerMeta.zoneEtas[zoneNumber]?.[1] || driveMinutes + 25
      )})`;
    }
    const [minEta, maxEta] =
      providerMeta.zoneEtas[zoneNumber] || providerMeta.zoneEtas[3] || [30, 55];
    return formatEtaLabel(minEta, maxEta);
  }, [deliveryMethod, status, driveMinutes, progress, providerMeta, zoneNumber]);

  const statusHeadline = useMemo(() => {
    if (deliveryMethod === "pickup") {
      return "Collect your fresh bake at Portugal Bakery (245 Johannesburg Rd, La Rochelle)";
    }
    const s = (status || "confirmed").toLowerCase();
    if (s === "completed" || s === "delivered") {
      return `Delivered by ${displayProviderName}`;
    }
    if (
      s === "out_for_delivery" ||
      s === "in_transit" ||
      s === "picked_up" ||
      s === "shipped"
    ) {
      return `${displayProviderName} is on the road — ${remainingKm.toFixed(
        1
      )} km from your drop-off`;
    }
    if (s === "driver_assigned" || s === "driver_arriving") {
      return `${displayProviderName} driver assigned — ${roadDistanceKm.toFixed(
        1
      )} km street route`;
    }
    if (
      s === "ready" ||
      s === "ready_for_delivery" ||
      s === "courier_requested"
    ) {
      return `Order packed at Portugal Bakery — handing over to ${displayProviderName}`;
    }
    return `Street route mapped from Portugal Bakery · ${roadDistanceKm.toFixed(
      1
    )} km via live road network`;
  }, [
    deliveryMethod,
    status,
    displayProviderName,
    remainingKm,
    roadDistanceKm,
  ]);

  // Draw GPS Navigation Casing Polyline, Directional Arrows, Origin, Destination & Courier Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = routeLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const bakeryLogo = getBakeryLogoSrc();
    const courierLogo = getProviderLogoSrc(providerMeta.id) || bakeryLogo;

    // 1. Bakery Origin Pin
    const bakeryIcon = L.divIcon({
      className: "pb-custom-leaflet-pin",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
          <div style="background:#fff;border:2.5px solid #B45309;border-radius:12px;padding:3px;box-shadow:0 6px 16px rgba(0,0,0,0.28);width:38px;height:38px;overflow:hidden;">
            <img src="${bakeryLogo}" alt="Portugal Bakery" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />
          </div>
          <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #B45309;margin-top:-1px;"></div>
          <span style="margin-top:2px;background:#1C1917;color:#fff;font-size:10px;font-weight:700;padding:1.5px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.25);">
            Portugal Bakery
          </span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    L.marker(BAKERY_COORDS, { icon: bakeryIcon })
      .bindPopup(
        `<strong>Portugal Bakery</strong><br/>245 Johannesburg Rd, La Rochelle`
      )
      .addTo(group);

    if (deliveryMethod === "pickup") {
      map.setView(BAKERY_COORDS, 16);
      return;
    }

    if (routePoints.length > 1) {
      const { point: courierPoint, splitIndex } = interpolateAlongPolyline(
        routePoints,
        progress
      );
      const traveledSegment =
        progress > 0.01
          ? [...routePoints.slice(0, splitIndex + 1), courierPoint]
          : [];
      const activeSegment =
        progress > 0.01
          ? [courierPoint, ...routePoints.slice(splitIndex + 1)]
          : routePoints;

      // Ambient GPS route glow
      L.polyline(routePoints, {
        color: theme.routeCoreColor,
        weight: 14,
        opacity: 0.16,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(group);

      // Traveled road trail behind driver (muted slate)
      if (traveledSegment.length > 1) {
        L.polyline(traveledSegment, {
          color: "#334155",
          weight: 8,
          opacity: 0.7,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(group);
        L.polyline(traveledSegment, {
          color: "#94A3B8",
          weight: 4.5,
          opacity: 0.9,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(group);
      }

      // Active road route ahead: Google-Maps style dark road casing + solid bright navigation core
      if (activeSegment.length > 1) {
        L.polyline(activeSegment, {
          color: theme.routeCasingColor,
          weight: 9,
          opacity: 0.92,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(group);

        L.polyline(activeSegment, {
          color: theme.routeCoreColor,
          weight: 5.5,
          opacity: 1,
          lineCap: "round",
          lineJoin: "round",
        }).addTo(group);

        // Directional navigation arrows spaced along the real street polyline
        const arrowCount = Math.min(6, Math.max(2, Math.floor(activeSegment.length / 65)));
        for (let a = 1; a <= arrowCount; a++) {
          const idx = Math.floor((activeSegment.length - 2) * (a / (arrowCount + 1)));
          const p1 = activeSegment[idx];
          const p2 = activeSegment[idx + 1];
          if (!p1 || !p2) continue;
          const angle = bearingDegrees(p1, p2);
          const arrowIcon = L.divIcon({
            className: "pb-custom-leaflet-pin",
            html: `<div style="transform:translate(-50%,-50%) rotate(${angle}deg);width:14px;height:14px;display:flex;align-items:center;justify-content:center;pointer-events:none;">
              <svg viewBox="0 0 12 12" width="11" height="11">
                <path d="M6 1L10.5 10L6 7.8L1.5 10L6 1Z" fill="#FFFFFF" stroke="${theme.routeCasingColor}" stroke-width="1"/>
              </svg>
            </div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          });
          L.marker(p1, { icon: arrowIcon, interactive: false }).addTo(group);
        }
      }

      // Destination Pin (Customer Street Address / Locker)
      const destLabel =
        providerMeta.id === "pudo"
          ? "PUDO Locker"
          : providerMeta.id === "pargo"
          ? "Pargo Point"
          : "Drop-Off";

      const destIcon = L.divIcon({
        className: "pb-custom-leaflet-pin",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
            <div style="background:#DC2626;color:#fff;border:2.5px solid #fff;border-radius:999px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.3);">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3" fill="#fff"/>
              </svg>
            </div>
            <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #DC2626;margin-top:-1px;"></div>
            <span style="margin-top:2px;background:#fff;color:#111827;border:1px solid rgba(0,0,0,0.18);font-size:10px;font-weight:700;padding:1.5px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.18);">
              ${destLabel}
            </span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      L.marker(destCoords, { icon: destIcon })
        .bindPopup(`<strong>${destLabel}</strong><br/>${destinationQuery}`)
        .addTo(group);

      // Live Courier Marker when en route / assigned
      if (progress > 0) {
        const courierIcon = L.divIcon({
          className: "pb-custom-leaflet-pin",
          html: `
            <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
              <div style="position:relative;background:#fff;border:3px solid ${theme.accentColor};border-radius:12px;width:42px;height:42px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.32);">
                <img src="${courierLogo}" alt="${displayProviderName}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <span style="position:relative;margin-top:3px;background:${theme.accentColor};color:#fff;font-size:10px;font-weight:800;padding:1.5px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,0.28);">
                ${progress >= 1 ? "Arrived" : `${remainingKm.toFixed(1)} km`}
              </span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        L.marker(courierPoint, { icon: courierIcon, zIndexOffset: 900 })
          .bindPopup(
            `<strong>${displayProviderName}</strong><br/>${theme.vehicleLabel}<br/>${
              progress >= 1
                ? "Delivered!"
                : `${remainingKm.toFixed(1)} km to destination`
            }`
          )
          .addTo(group);
      }

      const bounds = L.latLngBounds([
        BAKERY_COORDS,
        destCoords,
        ...routePoints,
      ]);
      map.fitBounds(bounds, {
        padding: compact ? [38, 38] : [52, 52],
        maxZoom: 16,
      });
    }
  }, [
    routePoints,
    destCoords,
    progress,
    providerMeta.id,
    displayProviderName,
    theme,
    deliveryMethod,
    destinationQuery,
    remainingKm,
    compact,
  ]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (deliveryMethod === "pickup") {
      map.setView(BAKERY_COORDS, 16, { animate: true });
      return;
    }
    const bounds = L.latLngBounds([BAKERY_COORDS, destCoords, ...routePoints]);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16, animate: true });
  };

  const isDelivered = ["completed", "delivered"].includes(
    (status || "").toLowerCase()
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${BAKERY_COORDS[0]},${BAKERY_COORDS[1]}&destination=${destCoords[0]},${destCoords[1]}&travelmode=driving`;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden shadow-soft text-left",
        className
      )}
    >
      {/* Top Branded Courier Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-muted/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <DeliveryProviderLogo
              providerId={
                deliveryMethod === "pickup" ? "own_delivery" : providerMeta.id
              }
              alt={displayProviderName}
              size={compact ? "md" : "lg"}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading font-bold text-foreground text-base sm:text-lg leading-tight">
                  {deliveryMethod === "pickup"
                    ? "Portugal Bakery Store Pickup"
                    : displayProviderName}
                </h3>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  {isDelivered ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Delivered
                    </>
                  ) : deliveryMethod === "pickup" ? (
                    "La Rochelle Bakery"
                  ) : (
                    theme.serviceBadge
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-2">
                {statusHeadline}
              </p>
            </div>
          </div>

          {orderNumber && (
            <div className="text-left sm:text-right shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground block">
                Order Reference
              </span>
              <span className="text-sm font-bold text-primary">
                {orderNumber}
              </span>
            </div>
          )}
        </div>

        {/* Distance & ETA Telemetry Pills */}
        {deliveryMethod === "delivery" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
            <div className="rounded-xl bg-background border border-border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Navigation className="h-3.5 w-3.5 text-primary" />
                Road Distance
              </div>
              <p className="text-base sm:text-lg font-extrabold text-foreground mt-0.5">
                {isDelivered
                  ? "0.0 km"
                  : progress > 0
                  ? `${remainingKm.toFixed(1)} km left`
                  : `${roadDistanceKm.toFixed(1)} km`}
              </p>
            </div>

            <div className="rounded-xl bg-background border border-border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Est. Arrival
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-foreground mt-1">
                {etaSummary}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-background border border-border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Vehicle
              </div>
              <p className="text-xs sm:text-sm font-bold text-foreground mt-1 truncate">
                {driverDetails?.vehicle || theme.vehicleLabel}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real-World Street / Satellite Navigation Map */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className={cn(
            "w-full z-0 bg-stone-200",
            compact ? "h-[310px] sm:h-[340px]" : "h-[380px] sm:h-[440px]"
          )}
        />

        {/* Calculating Live Street Route Indicator */}
        {routingLoading && (
          <div className="absolute top-3 left-3 z-[400] inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-md text-xs font-medium text-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Mapping exact street route...
          </div>
        )}

        {/* Map View Switcher (Street Map | Satellite) + Fit Route */}
        <div className="absolute top-3 right-3 z-[400] flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-background/95 backdrop-blur-md border border-border shadow-md p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMapStyle("street")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors",
                mapStyle === "street"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapStyle("satellite")}
              className={cn(
                "px-2.5 py-1 rounded-md transition-colors inline-flex items-center gap-1",
                mapStyle === "satellite"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <Layers className="h-3 w-3" />
              Satellite
            </button>
          </div>

          <button
            type="button"
            onClick={handleRecenter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background/95 backdrop-blur-md text-foreground border border-border shadow-md text-xs font-semibold hover:bg-background transition-all"
          >
            <LocateFixed className="h-3.5 w-3.5 text-primary" />
            Fit Route
          </button>
        </div>
      </div>

      {/* Real Street Names ("Via ...") + Turn-by-Turn Directions + Origin/Destination Footer */}
      <div className="p-3.5 sm:p-4 bg-muted/20 border-t border-border space-y-2.5">
        {deliveryMethod === "delivery" && viaStreets.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/70 text-xs">
            <div className="flex items-center gap-1.5 text-foreground min-w-0">
              <Route className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="text-muted-foreground shrink-0">Via:</span>
              <span className="font-semibold truncate">
                {viaStreets.join(" → ")}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {turnSteps.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowDirections((v) => !v)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  {showDirections ? "Hide Directions" : `Directions (${turnSteps.length})`}
                  {showDirections ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>
              )}

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Google Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        {/* Expandable Turn-by-Turn Street Directions */}
        {showDirections && turnSteps.length > 0 && (
          <div className="rounded-xl border border-border bg-background p-3 max-h-48 overflow-y-auto space-y-1.5 text-xs">
            {turnSteps.map((st, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 py-1 border-b border-border/50 last:border-0"
              >
                <span className="text-foreground">
                  <strong className="text-muted-foreground mr-1.5">
                    {idx + 1}.
                  </strong>
                  {st.instruction}
                </span>
                <span className="text-muted-foreground font-mono shrink-0">
                  {formatStepDistance(st.distanceMeters)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start gap-2 min-w-0">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-amber-700 shrink-0" />
            <span className="text-muted-foreground truncate">
              <strong className="text-foreground">From:</strong> {BAKERY_LABEL}
            </span>
          </div>
          {deliveryMethod === "delivery" && (
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-600" />
              <span className="text-muted-foreground truncate">
                <strong className="text-foreground">
                  {providerMeta.id === "pudo"
                    ? "PUDO Locker:"
                    : providerMeta.id === "pargo"
                    ? "Pargo Point:"
                    : "To:"}
                </strong>{" "}
                {destinationQuery}
              </span>
            </div>
          )}
        </div>

        {(driverDetails?.name || trackingUrl) && (
          <div className="pt-2.5 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs">
            {driverDetails?.name && (
              <p className="text-foreground">
                <span className="text-muted-foreground">Assigned Driver:</span>{" "}
                <strong>{driverDetails.name}</strong>
                {driverDetails.phone && (
                  <>
                    {" · "}
                    <a
                      href={`tel:${driverDetails.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {driverDetails.phone}
                    </a>
                  </>
                )}
              </p>
            )}
            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
              >
                Open Live {displayProviderName} Trip Link
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderTrackingMap;
