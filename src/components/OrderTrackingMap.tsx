import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Navigation, Clock, MapPin, LocateFixed, ExternalLink, Sparkles, CheckCircle2, Truck } from "lucide-react";
import {
  DeliveryProviderLogo,
  getBakeryLogoSrc,
  getProviderLogoSrc,
} from "@/components/delivery/DeliveryProviderLogo";
import { formatEtaLabel, getProviderMeta } from "@/utils/deliveryProviders";
import { calculateZoneDetails } from "@/utils/deliveryZones";
import { cn } from "@/lib/utils";

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

// Portugal Bakery: 245 Johannesburg Rd, La Rochelle, Johannesburg South, 2190
const BAKERY_COORDS: [number, number] = [-26.2425, 28.0558];
const BAKERY_LABEL = "Portugal Bakery · 245 Johannesburg Rd, La Rochelle";

// Instant coordinate dictionary for Johannesburg & Gauteng suburbs (Zones 1–6)
// Ensures 0ms map rendering while Nominatim refines street-level coordinates.
const SA_SUBURB_COORDS: Record<string, [number, number]> = {
  // Zone 1 (0–5 km)
  "la rochelle": [-26.2432, 28.0565],
  "rosettenville": [-26.2522, 28.0547],
  "turffontein": [-26.2448, 28.0402],
  "kenilworth": [-26.2485, 28.0485],
  "regents park": [-26.2465, 28.0715],
  "the hill": [-26.2528, 28.0695],
  "linmeyer": [-26.2615, 28.0662],
  "oakdene": [-26.2655, 28.0512],
  "townsview": [-26.2572, 28.0472],
  "booysens": [-26.2328, 28.0235],
  "ophirton": [-26.2248, 28.0265],
  "robertsham": [-26.2485, 28.0145],
  "selby": [-26.2155, 28.0398],
  "malvern": [-26.2022, 28.1055],
  "denver": [-26.2125, 28.0985],
  "moffat view": [-26.2562, 28.0812],
  "johannesburg south": [-26.2585, 28.0425],

  // Zone 2 (5–10 km)
  "glenvista": [-26.2865, 28.0575],
  "mulbarton": [-26.2945, 28.0665],
  "bassonia": [-26.2782, 28.0668],
  "mondeor": [-26.2788, 28.0155],
  "winchester hills": [-26.2692, 28.0238],
  "suideroord": [-26.2665, 28.0315],
  "ridgeway": [-26.2625, 28.0068],
  "ormonde": [-26.2452, 28.0012],
  "southgate": [-26.2668, 27.9912],
  "crown mines": [-26.2165, 28.0055],
  "nasrec": [-26.2435, 27.9825],
  "mayfair": [-26.2015, 28.0095],
  "fordsburg": [-26.2055, 28.0245],
  "johannesburg cbd": [-26.2041, 28.0473],
  "maboneng": [-26.2038, 28.0588],
  "jeppestown": [-26.2058, 28.0672],
  "doornfontein": [-26.1972, 28.0598],
  "bertrams": [-26.1945, 28.0685],
  "kensington": [-26.1952, 28.0968],
  "city deep": [-26.2285, 28.0852],
  "alberton": [-26.2678, 28.1225],
  "germiston": [-26.2258, 28.1702],

  // Zone 3 (10–15 km)
  "braamfontein": [-26.1929, 28.0305],
  "newtown": [-26.2018, 28.0328],
  "parktown": [-26.1808, 28.0382],
  "auckland park": [-26.1825, 28.0045],
  "melville": [-26.1765, 28.0085],
  "westdene": [-26.1782, 27.9875],
  "brixton": [-26.1928, 27.9985],
  "houghton": [-26.1665, 28.0568],
  "norwood": [-26.1548, 28.0752],
  "orange grove": [-26.1585, 28.0825],
  "cyrildene": [-26.1788, 28.1055],
  "bedfordview": [-26.1795, 28.1385],
  "edenvale": [-26.1408, 28.1525],
  "boksburg": [-26.2125, 28.2528],
  "benoni": [-26.1885, 28.3208],
  "brakpan": [-26.2365, 28.3695],
  "springs": [-26.2545, 28.4428],
  "soweto": [-26.2678, 27.8585],
  "diepkloof": [-26.2512, 27.9435],
  "orlando": [-26.2385, 27.9185],
  "pimville": [-26.2745, 27.8965],
  "kibler park": [-26.3185, 28.0215],
  "eikenhof": [-26.3325, 27.9985],

  // Zone 4 (15–20 km)
  "rosebank": [-26.1467, 28.0416],
  "parkhurst": [-26.1392, 28.0155],
  "greenside": [-26.1518, 28.0125],
  "emmarentia": [-26.1575, 28.0038],
  "linden": [-26.1355, 27.9945],
  "northcliff": [-26.1475, 27.9655],
  "hyde park": [-26.1245, 28.0378],
  "illovo": [-26.1278, 28.0492],
  "sandton": [-26.1076, 28.0567],
  "morningside": [-26.0865, 28.0628],
  "bryanston": [-26.0585, 28.0225],
  "rivonia": [-26.0528, 28.0602],
  "woodmead": [-26.0575, 28.0865],
  "sunninghill": [-26.0342, 28.0685],
  "fourways": [-26.0178, 28.0095],
  "randburg": [-26.0936, 27.9985],
  "ferndale": [-26.0888, 27.9895],
  "roodepoort": [-26.1625, 27.8725],
  "florida": [-26.1765, 27.9125],
  "alexandra": [-26.1032, 28.0985],
  "protea glen": [-26.2785, 27.7985],

  // Zone 5 (20–30 km)
  "meyersdal": [-26.2925, 28.0945],
  "brackenhurst": [-26.3125, 28.1185],
  "greenstone": [-26.1185, 28.1465],
  "modderfontein": [-26.0945, 28.1585],
  "kempton park": [-26.1005, 28.2315],
  "isando": [-26.1395, 28.2045],
  "midrand": [-25.9992, 28.1263],
  "waterfall": [-26.0145, 28.1085],
  "kyalami": [-25.9865, 28.0785],
  "tembisa": [-25.9965, 28.2268],
  "lenasia": [-26.3228, 27.8295],
  "ennerdale": [-26.4045, 27.8385],
  "walkerville": [-26.4125, 27.9625],

  // Zone 6 (30 km+)
  "centurion": [-25.8603, 28.1894],
  "pretoria": [-25.7479, 28.2293],
  "lanseria": [-25.9385, 27.9265],
  "krugersdorp": [-26.1015, 27.7745],
  "randfontein": [-26.1795, 27.7015],
  "vereeniging": [-26.6736, 27.9319],
  "vanderbijlpark": [-26.7031, 27.8378],
  "heidelberg": [-26.5048, 28.3592],
  "nigel": [-26.4315, 28.4725],
};

interface ProviderVisualTheme {
  routeColor: string;
  glowColor: string;
  vehicleLabel: string;
  serviceBadge: string;
  avgSpeedKmh: number;
}

const PROVIDER_THEMES: Record<string, ProviderVisualTheme> = {
  own_delivery: {
    routeColor: "#D97706",
    glowColor: "rgba(217, 119, 6, 0.25)",
    vehicleLabel: "Portugal Bakery Pastry Van",
    serviceBadge: "In-House Refrigerated Van",
    avgSpeedKmh: 36,
  },
  uber_direct: {
    routeColor: "#111827",
    glowColor: "rgba(17, 24, 39, 0.22)",
    vehicleLabel: "Uber Package Courier",
    serviceBadge: "On-Demand Express",
    avgSpeedKmh: 42,
  },
  bolt: {
    routeColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.28)",
    vehicleLabel: "Bolt Send Driver",
    serviceBadge: "Fast Same-Day Express",
    avgSpeedKmh: 42,
  },
  indrive: {
    routeColor: "#65A30D",
    glowColor: "rgba(101, 163, 13, 0.28)",
    vehicleLabel: "inDrive Direct Courier",
    serviceBadge: "On-Demand Door-to-Door",
    avgSpeedKmh: 40,
  },
  yassir: {
    routeColor: "#7C3AED",
    glowColor: "rgba(124, 58, 237, 0.26)",
    vehicleLabel: "Yassir Express Rider",
    serviceBadge: "Express Door Delivery",
    avgSpeedKmh: 40,
  },
  mr_d: {
    routeColor: "#0284C7",
    glowColor: "rgba(2, 132, 199, 0.26)",
    vehicleLabel: "Mr D Express Bike",
    serviceBadge: "Local Express Bike",
    avgSpeedKmh: 38,
  },
  droppa: {
    routeColor: "#0369A1",
    glowColor: "rgba(3, 105, 161, 0.26)",
    vehicleLabel: "Droppa Bakery-Safe Car/Van",
    serviceBadge: "Cake & Catering Safe",
    avgSpeedKmh: 38,
  },
  courier_guy: {
    routeColor: "#1D4ED8",
    glowColor: "rgba(29, 78, 216, 0.25)",
    vehicleLabel: "The Courier Guy Van",
    serviceBadge: "Same-Day Gauteng Courier",
    avgSpeedKmh: 35,
  },
  ram: {
    routeColor: "#DC2626",
    glowColor: "rgba(220, 38, 38, 0.25)",
    vehicleLabel: "RAM Hand-to-Hand Van",
    serviceBadge: "Signed Hand-to-Hand",
    avgSpeedKmh: 35,
  },
  fastway: {
    routeColor: "#1E40AF",
    glowColor: "rgba(30, 64, 175, 0.25)",
    vehicleLabel: "Fastway Regional Van",
    serviceBadge: "Regional Parcel Route",
    avgSpeedKmh: 34,
  },
  aramex: {
    routeColor: "#E11D48",
    glowColor: "rgba(225, 29, 72, 0.25)",
    vehicleLabel: "Aramex Express Van",
    serviceBadge: "Express Store-to-Door",
    avgSpeedKmh: 35,
  },
  pudo: {
    routeColor: "#D97706",
    glowColor: "rgba(217, 119, 6, 0.25)",
    vehicleLabel: "PUDO Smart Locker Van",
    serviceBadge: "24/7 Smart Locker Drop",
    avgSpeedKmh: 34,
  },
  pargo: {
    routeColor: "#CA8A04",
    glowColor: "rgba(202, 138, 4, 0.28)",
    vehicleLabel: "Pargo Pickup Van",
    serviceBadge: "Click & Collect Partner Point",
    avgSpeedKmh: 34,
  },
  local_courier: {
    routeColor: "#57534E",
    glowColor: "rgba(87, 83, 78, 0.25)",
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
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

function resolveInitialDestCoords(address: string): [number, number] {
  const normalized = address
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Sort keys longest-first so "johannesburg south" matches before "johannesburg"
  const sortedSuburbs = Object.keys(SA_SUBURB_COORDS).sort((a, b) => b.length - a.length);
  for (const sub of sortedSuburbs) {
    if (normalized.includes(sub)) {
      return SA_SUBURB_COORDS[sub];
    }
  }

  // Fallback by detected zone radius in Johannesburg
  const { zoneNumber } = calculateZoneDetails(address);
  const zoneDefaults: Record<number, [number, number]> = {
    1: [-26.2522, 28.0547], // Rosettenville
    2: [-26.2782, 28.0668], // Bassonia / Glenvista
    3: [-26.1929, 28.0305], // Braamfontein
    4: [-26.1076, 28.0567], // Sandton
    5: [-25.9992, 28.1263], // Midrand
    6: [-25.8603, 28.1894], // Centurion
  };
  return zoneDefaults[zoneNumber] || zoneDefaults[3];
}

function buildCurvedFallbackRoute(start: [number, number], end: [number, number], steps = 28): [number, number][] {
  const pts: [number, number][] = [];
  const dLat = end[0] - start[0];
  const dLng = end[1] - start[1];
  // Slight perpendicular offset to mimic urban arterial highway curvature
  const perpLat = -dLng * 0.1;
  const perpLng = dLat * 0.1;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const arch = Math.sin(Math.PI * t);
    pts.push([
      start[0] + dLat * t + perpLat * arch,
      start[1] + dLng * t + perpLng * arch,
    ]);
  }
  return pts;
}

function getProgressFraction(status?: string, liveTick = 0): number {
  const s = (status || "pending").toLowerCase();
  if (s === "completed" || s === "delivered") return 1;
  if (s === "out_for_delivery" || s === "in_transit" || s === "picked_up" || s === "shipped") {
    // Gentle live motion between 60% and 76% along the real street polyline
    return 0.6 + ((liveTick % 17) * 0.01);
  }
  if (s === "driver_assigned" || s === "driver_arriving") return 0.24;
  if (s === "ready" || s === "ready_for_delivery" || s === "courier_requested") return 0.15;
  if (s === "preparing" || s === "confirmed" || s === "processing") return 0.07;
  return 0;
}

function interpolateAlongPolyline(pts: [number, number][], fraction: number): {
  point: [number, number];
  splitIndex: number;
} {
  if (pts.length === 0) return { point: BAKERY_COORDS, splitIndex: 0 };
  if (pts.length === 1 || fraction <= 0) return { point: pts[0], splitIndex: 0 };
  if (fraction >= 1) return { point: pts[pts.length - 1], splitIndex: pts.length - 1 };

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
  const providerMeta = useMemo(() => getProviderMeta(deliveryProvider), [deliveryProvider]);
  const theme = PROVIDER_THEMES[providerMeta.id] || PROVIDER_THEMES.own_delivery;
  const displayProviderName = deliveryServiceName || providerMeta.name;

  const destinationQuery = pickupLocation?.trim()
    ? `${pickupLocation.trim()}, ${customerAddress}`
    : customerAddress;

  const [destCoords, setDestCoords] = useState<[number, number]>(() =>
    deliveryMethod === "pickup" ? BAKERY_COORDS : resolveInitialDestCoords(destinationQuery)
  );
  const [routePoints, setRoutePoints] = useState<[number, number][]>(() =>
    deliveryMethod === "pickup"
      ? [BAKERY_COORDS]
      : buildCurvedFallbackRoute(BAKERY_COORDS, resolveInitialDestCoords(destinationQuery))
  );
  const [roadDistanceKm, setRoadDistanceKm] = useState<number>(() => {
    if (deliveryMethod === "pickup") return 0;
    const initial = resolveInitialDestCoords(destinationQuery);
    return Math.max(1.2, haversineKm(BAKERY_COORDS, initial) * 1.28);
  });
  const [driveMinutes, setDriveMinutes] = useState<number | null>(null);
  const [liveTick, setLiveTick] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Subtle live tick when courier is actively en route
  useEffect(() => {
    const activeStatuses = ["out_for_delivery", "in_transit", "picked_up", "shipped", "driver_assigned", "driver_arriving"];
    if (!activeStatuses.includes((status || "").toLowerCase())) return;
    const timer = window.setInterval(() => setLiveTick((t) => t + 1), 3500);
    return () => window.clearInterval(timer);
  }, [status]);

  // Step 1: Resolve destination coordinates (instant suburb match + Nominatim street refinement)
  useEffect(() => {
    if (deliveryMethod === "pickup" || !destinationQuery.trim()) {
      setDestCoords(BAKERY_COORDS);
      setRoutePoints([BAKERY_COORDS]);
      setRoadDistanceKm(0);
      return;
    }

    const instant = resolveInitialDestCoords(destinationQuery);
    setDestCoords(instant);
    setRoutePoints(buildCurvedFallbackRoute(BAKERY_COORDS, instant));
    setRoadDistanceKm(Math.max(1.2, haversineKm(BAKERY_COORDS, instant) * 1.28));

    const controller = new AbortController();
    const q = destinationQuery.toLowerCase().includes("south africa")
      ? destinationQuery
      : `${destinationQuery}, Gauteng, South Africa`;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=za&limit=1&q=${encodeURIComponent(q)}`,
      { signal: controller.signal, headers: { Accept: "application/json" } }
    )
      .then((r) => (r.ok ? r.json() : []))
      .then((results) => {
        if (Array.isArray(results) && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          // Sanity check within broader Gauteng / surrounding region
          if (!Number.isNaN(lat) && !Number.isNaN(lon) && lat < -24.5 && lat > -27.5 && lon > 26.5 && lon < 29.5) {
            setDestCoords([lat, lon]);
          }
        }
      })
      .catch(() => {
        // Suburb fallback coordinates remain active
      });

    return () => controller.abort();
  }, [destinationQuery, deliveryMethod]);

  // Step 2: Fetch real street driving polyline & road distance from OSRM
  useEffect(() => {
    if (deliveryMethod === "pickup") return;

    const fallbackPts = buildCurvedFallbackRoute(BAKERY_COORDS, destCoords);
    const approxKm = Math.max(1.2, haversineKm(BAKERY_COORDS, destCoords) * 1.28);
    setRoutePoints(fallbackPts);
    setRoadDistanceKm(approxKm);
    setDriveMinutes(Math.max(6, Math.round((approxKm / theme.avgSpeedKmh) * 60)));

    const controller = new AbortController();
    const url = `https://router.project-osrm.org/route/v1/driving/${BAKERY_COORDS[1]},${BAKERY_COORDS[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;

    fetch(url, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const route = data?.routes?.[0];
        const coords = route?.geometry?.coordinates;
        if (Array.isArray(coords) && coords.length > 1) {
          const latLngs: [number, number][] = coords.map((c: [number, number]) => [c[1], c[0]]);
          setRoutePoints(latLngs);
          if (typeof route.distance === "number" && route.distance > 0) {
            const km = Math.max(0.8, route.distance / 1000);
            setRoadDistanceKm(km);
            setDriveMinutes(Math.max(5, Math.round((km / theme.avgSpeedKmh) * 60)));
          }
        }
      })
      .catch(() => {
        // Curved fallback route already active
      });

    return () => controller.abort();
  }, [destCoords, deliveryMethod, theme.avgSpeedKmh]);

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: BAKERY_COORDS,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    const group = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = group;

    // Ensure proper sizing if container animates in
    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 250);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  const progress = deliveryMethod === "pickup" ? 0 : getProgressFraction(status, liveTick);
  const remainingKm = Math.max(0, roadDistanceKm * (1 - progress));

  const { zoneNumber } = useMemo(
    () => calculateZoneDetails(customerAddress || "Johannesburg"),
    [customerAddress]
  );

  const etaSummary = useMemo(() => {
    if (deliveryMethod === "pickup") return "Ready for store collection";
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "delivered") return "Delivered";
    if (s === "out_for_delivery" || s === "in_transit" || s === "picked_up" || s === "shipped") {
      const remMins = Math.max(4, Math.round(((driveMinutes || 20) * (1 - progress)) + 3));
      return `~${remMins} min remaining`;
    }
    const [minEta, maxEta] = providerMeta.zoneEtas[zoneNumber] || providerMeta.zoneEtas[3] || [30, 55];
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
    if (s === "out_for_delivery" || s === "in_transit" || s === "picked_up" || s === "shipped") {
      return `${displayProviderName} is on the road — ${remainingKm.toFixed(1)} km from your drop-off`;
    }
    if (s === "driver_assigned" || s === "driver_arriving") {
      return `${displayProviderName} driver assigned — heading to Portugal Bakery (${roadDistanceKm.toFixed(1)} km route)`;
    }
    if (s === "ready" || s === "ready_for_delivery" || s === "courier_requested") {
      return `Order packed & ready at Portugal Bakery — handing over to ${displayProviderName}`;
    }
    return `Freshly preparing at Portugal Bakery · ${displayProviderName} route ready (${roadDistanceKm.toFixed(1)} km)`;
  }, [deliveryMethod, status, displayProviderName, remainingKm, roadDistanceKm]);

  // Draw markers, route polylines, and branded courier pin whenever route/status changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const bakeryLogo = getBakeryLogoSrc();
    const courierLogo = getProviderLogoSrc(providerMeta.id) || bakeryLogo;

    // 1. Bakery Origin Pin
    const bakeryIcon = L.divIcon({
      className: "pb-custom-leaflet-pin",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
          <div style="background:#fff;border:2.5px solid #D97706;border-radius:14px;padding:3px;box-shadow:0 6px 16px rgba(0,0,0,0.22);width:38px;height:38px;overflow:hidden;">
            <img src="${bakeryLogo}" alt="Portugal Bakery" style="width:100%;height:100%;object-fit:cover;border-radius:9px;" />
          </div>
          <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #D97706;margin-top:-1px;"></div>
          <span style="margin-top:2px;background:rgba(17,24,39,0.88);color:#fff;font-size:10px;font-weight:700;padding:1px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);">
            Portugal Bakery
          </span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    L.marker(BAKERY_COORDS, { icon: bakeryIcon })
      .bindPopup(`<strong>Portugal Bakery</strong><br/>245 Johannesburg Rd, La Rochelle`)
      .addTo(group);

    if (deliveryMethod === "pickup") {
      map.setView(BAKERY_COORDS, 15);
      return;
    }

    // 2. Route Polylines (solid traveled + vibrant remaining route)
    if (routePoints.length > 1) {
      // Soft outer halo along full route
      L.polyline(routePoints, {
        color: theme.routeColor,
        weight: 10,
        opacity: 0.16,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(group);

      const { point: courierPoint, splitIndex } = interpolateAlongPolyline(routePoints, progress);
      const traveledSegment = [...routePoints.slice(0, splitIndex + 1), courierPoint];
      const remainingSegment = [courierPoint, ...routePoints.slice(splitIndex + 1)];

      if (progress > 0.01 && traveledSegment.length > 1) {
        L.polyline(traveledSegment, {
          color: theme.routeColor,
          weight: 5,
          opacity: 0.45,
          lineCap: "round",
        }).addTo(group);
      }

      if (remainingSegment.length > 1) {
        L.polyline(remainingSegment, {
          color: theme.routeColor,
          weight: 5,
          opacity: 0.95,
          dashArray: progress > 0 && progress < 1 ? "10, 7" : undefined,
          lineCap: "round",
        }).addTo(group);
      }

      // 3. Destination Pin (Customer Door / Locker)
      const destLabel =
        providerMeta.id === "pudo"
          ? "PUDO Locker"
          : providerMeta.id === "pargo"
            ? "Pargo Point"
            : "Your Address";

      const destIcon = L.divIcon({
        className: "pb-custom-leaflet-pin",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
            <div style="background:${theme.routeColor};color:#fff;border:2.5px solid #fff;border-radius:999px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,0.25);font-size:15px;">
              📍
            </div>
            <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid ${theme.routeColor};margin-top:-1px;"></div>
            <span style="margin-top:2px;background:#fff;color:#111827;border:1px solid rgba(0,0,0,0.12);font-size:10px;font-weight:700;padding:1px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.14);">
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

      // 4. Live Chosen Delivery Company Marker on the Route
      const courierIcon = L.divIcon({
        className: "pb-custom-leaflet-pin",
        html: `
          <div style="position:relative;display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
            <div style="position:absolute;width:54px;height:54px;border-radius:999px;background:${theme.glowColor};animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative;background:#fff;border:3px solid ${theme.routeColor};border-radius:14px;width:44px;height:44px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,0.28);">
              <img src="${courierLogo}" alt="${displayProviderName}" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <span style="position:relative;margin-top:3px;background:${theme.routeColor};color:#fff;font-size:10px;font-weight:800;padding:1.5px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 3px 8px rgba(0,0,0,0.24);">
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
            progress >= 1 ? "Delivered!" : `${remainingKm.toFixed(1)} km to destination`
          }`
        )
        .addTo(group);

      const bounds = L.latLngBounds([BAKERY_COORDS, destCoords, ...routePoints]);
      map.fitBounds(bounds, { padding: compact ? [36, 36] : [48, 48], maxZoom: 15 });
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
      map.setView(BAKERY_COORDS, 15, { animate: true });
      return;
    }
    const bounds = L.latLngBounds([BAKERY_COORDS, destCoords, ...routePoints]);
    map.fitBounds(bounds, { padding: [44, 44], maxZoom: 15, animate: true });
  };

  const isDelivered = ["completed", "delivered"].includes((status || "").toLowerCase());

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card overflow-hidden shadow-soft text-left",
        className
      )}
    >
      {/* Top Branded Courier Header */}
      <div className="p-4 sm:p-5 border-b border-border bg-gradient-to-r from-muted/50 via-background to-muted/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <DeliveryProviderLogo
              providerId={deliveryMethod === "pickup" ? "own_delivery" : providerMeta.id}
              alt={displayProviderName}
              size={compact ? "md" : "lg"}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading font-bold text-foreground text-base sm:text-lg leading-tight">
                  {deliveryMethod === "pickup" ? "Portugal Bakery Store Pickup" : displayProviderName}
                </h3>
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: theme.routeColor }}
                >
                  {isDelivered ? (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Delivered
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3" />
                      {deliveryMethod === "pickup" ? "La Rochelle Store" : theme.serviceBadge}
                    </>
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
                Live Order Map
              </span>
              <span className="text-sm font-bold text-primary">{orderNumber}</span>
            </div>
          )}
        </div>

        {/* Distance & ETA Telemetry Pills */}
        {deliveryMethod === "delivery" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4">
            <div className="rounded-xl bg-background/90 border border-border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Navigation className="h-3.5 w-3.5 text-primary" />
                How Far Away
              </div>
              <p className="text-base sm:text-lg font-extrabold text-foreground mt-0.5">
                {isDelivered ? "0.0 km" : `${remainingKm.toFixed(1)} km`}
                {progress > 0 && progress < 1 && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    of {roadDistanceKm.toFixed(1)} km
                  </span>
                )}
              </p>
            </div>

            <div className="rounded-xl bg-background/90 border border-border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Est. Arrival
              </div>
              <p className="text-base sm:text-lg font-extrabold text-foreground mt-0.5">
                {etaSummary}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl bg-background/90 border border-border px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <Truck className="h-3.5 w-3.5 text-primary" />
                Courier Mode
              </div>
              <p className="text-xs sm:text-sm font-bold text-foreground mt-1 truncate">
                {driverDetails?.vehicle || theme.vehicleLabel}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Real-World Leaflet Map */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className={cn(
            "w-full z-0 bg-muted/40",
            compact ? "h-[250px] sm:h-[280px]" : "h-[320px] sm:h-[390px]"
          )}
        />

        {/* Floating Map Recenter Button */}
        <button
          type="button"
          onClick={handleRecenter}
          className="absolute top-3 right-3 z-[400] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/95 backdrop-blur-md text-foreground border border-border shadow-md text-xs font-semibold hover:bg-background transition-all"
        >
          <LocateFixed className="h-3.5 w-3.5 text-primary" />
          Fit Route
        </button>
      </div>

      {/* Route Origin -> Destination Footer */}
      <div className="p-3.5 sm:p-4 bg-muted/25 border-t border-border space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start gap-2 min-w-0">
            <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-600 shrink-0" />
            <span className="text-muted-foreground truncate">
              <strong className="text-foreground">From:</strong> {BAKERY_LABEL}
            </span>
          </div>
          {deliveryMethod === "delivery" && (
            <div className="flex items-start gap-2 min-w-0">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: theme.routeColor }} />
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
                    <a href={`tel:${driverDetails.phone}`} className="text-primary hover:underline font-medium">
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
