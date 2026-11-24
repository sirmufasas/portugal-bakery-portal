import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  Maximize2,
  Minimize2,
  Crosshair,
  Search,
  X,
  Move,
} from "lucide-react";
import {
  DeliveryProviderLogo,
  getBakeryLogoSrc,
  getProviderLogoSrc,
} from "@/components/delivery/DeliveryProviderLogo";
import { formatEtaLabel, getProviderMeta } from "@/utils/deliveryProviders";
import {
  BAKERY_ORIGIN_COORDS,
  calculateZoneDetails,
} from "@/utils/deliveryZones";
import {
  GAUTENG_SUBURB_COORDS,
  getCurrentLiveGPS,
  haversineKm,
  LiveGPSPosition,
  reverseGeocodeSAPoint,
  SAAddressSuggestion,
  searchSAAddressSuggestions,
} from "@/utils/saAddressGeocoder";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_URL =
  import.meta.env.VITE_API_URL || "https://bakerybackend-i7wj.onrender.com";

export interface PinnedLocationUpdate {
  lat: number;
  lng: number;
  address: string;
  source: "pin" | "gps" | "search";
}

export interface OrderTrackingMapProps {
  orderNumber?: string;
  status?: string;
  customerAddress: string;
  customerCoords?: [number, number] | null;
  editablePin?: boolean;
  onLocationChange?: (update: PinnedLocationUpdate) => void;
  fullscreenOpen?: boolean;
  onFullscreenOpenChange?: (open: boolean) => void;
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

const BAKERY_COORDS: [number, number] = BAKERY_ORIGIN_COORDS;
const BAKERY_LABEL = "Portugal Bakery · 245 Johannesburg Rd, La Rochelle";

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
    accentColor: "#9A521B",
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

  const sortedSuburbs = Object.keys(GAUTENG_SUBURB_COORDS).sort(
    (a, b) => b.length - a.length
  );
  for (const sub of sortedSuburbs) {
    if (normalized.includes(sub)) {
      return GAUTENG_SUBURB_COORDS[sub];
    }
  }

  const { zoneNumber } = calculateZoneDetails(address);
  const zoneDefaults: Record<number, [number, number]> = {
    1: [-26.2522, 28.0547],
    2: [-26.2782, 28.0668],
    3: [-26.1929, 28.0305],
    4: [-26.1076, 28.0567],
    5: [-25.9992, 28.1263],
    6: [-25.8603, 28.1894],
  };
  return zoneDefaults[zoneNumber] || zoneDefaults[1];
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
  for (let i = 0; i < pts.length; i++) {
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

function applyTileLayers(group: L.LayerGroup, style: "street" | "satellite") {
  group.clearLayers();
  if (style === "satellite") {
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
        maxZoom: 19,
      }
    ).addTo(group);

    L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.9 }
    ).addTo(group);

    L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.95 }
    ).addTo(group);
  } else {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(group);
  }
}

export function OrderTrackingMap({
  orderNumber,
  status = "confirmed",
  customerAddress,
  customerCoords = null,
  editablePin = false,
  onLocationChange,
  fullscreenOpen,
  onFullscreenOpenChange,
  deliveryMethod = "delivery",
  deliveryProvider,
  deliveryServiceName,
  pickupLocation,
  trackingUrl,
  driverDetails,
  compact = false,
  className,
}: OrderTrackingMapProps) {
  const { toast } = useToast();

  const providerMeta = useMemo(
    () => getProviderMeta(deliveryProvider),
    [deliveryProvider]
  );
  const theme = PROVIDER_THEMES[providerMeta.id] || PROVIDER_THEMES.own_delivery;
  const displayProviderName = deliveryServiceName || providerMeta.name;

  const destinationQuery = pickupLocation?.trim()
    ? `${pickupLocation.trim()}, ${customerAddress}`
    : customerAddress;

  const [destCoords, setDestCoords] = useState<[number, number]>(() => {
    if (deliveryMethod === "pickup") return BAKERY_COORDS;
    if (customerCoords) return customerCoords;
    return resolveInitialDestCoords(destinationQuery);
  });

  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [turnSteps, setTurnSteps] = useState<RouteTurnStep[]>([]);
  const [viaStreets, setViaStreets] = useState<string[]>([]);
  const [routingLoading, setRoutingLoading] = useState<boolean>(
    deliveryMethod === "delivery"
  );
  const [reverseGeocodingPin, setReverseGeocodingPin] = useState(false);
  const [locatingLiveGps, setLocatingLiveGps] = useState(false);
  const [liveUserGps, setLiveUserGps] = useState<LiveGPSPosition | null>(null);

  const [roadDistanceKm, setRoadDistanceKm] = useState<number>(() => {
    if (deliveryMethod === "pickup") return 0;
    const initial =
      customerCoords || resolveInitialDestCoords(destinationQuery);
    return Math.max(0.4, haversineKm(BAKERY_COORDS, initial) * 1.24);
  });
  const [driveMinutes, setDriveMinutes] = useState<number | null>(null);
  const [mapStyle, setMapStyle] = useState<"street" | "satellite">("street");
  const [showDirections, setShowDirections] = useState(false);
  const [liveTick, setLiveTick] = useState(0);

  // Internal + controlled fullscreen state
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const isFullscreen =
    fullscreenOpen !== undefined ? fullscreenOpen : internalFullscreen;

  const setFullscreen = useCallback(
    (next: boolean) => {
      if (onFullscreenOpenChange) onFullscreenOpenChange(next);
      setInternalFullscreen(next);
    },
    [onFullscreenOpenChange]
  );

  // Fullscreen Uber-style search state
  const [fsSearchQuery, setFsSearchQuery] = useState("");
  const [fsSuggestions, setFsSuggestions] = useState<SAAddressSuggestion[]>([]);
  const [fsSearching, setFsSearching] = useState(false);

  // Inline Leaflet refs
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Fullscreen Leaflet refs
  const fsMapContainerRef = useRef<HTMLDivElement | null>(null);
  const fsMapInstanceRef = useRef<L.Map | null>(null);
  const fsTileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const fsRouteLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Keep latest callback ref so Leaflet click/drag handlers never go stale
  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  const handlePinMoved = useCallback(
    async (lat: number, lng: number, source: "pin" | "gps" = "pin") => {
      const clamped: [number, number] = [lat, lng];
      setDestCoords(clamped);
      setReverseGeocodingPin(true);
      try {
        const resolvedAddress = await reverseGeocodeSAPoint(lat, lng);
        onLocationChangeRef.current?.({
          lat,
          lng,
          address: resolvedAddress,
          source,
        });
      } finally {
        setReverseGeocodingPin(false);
      }
    },
    []
  );

  // Check Live Customer GPS Location ("My Location")
  const handleUseLiveLocation = useCallback(
    async (snapPinToGps = editablePin) => {
      setLocatingLiveGps(true);
      try {
        const gps = await getCurrentLiveGPS();
        setLiveUserGps(gps);

        if (snapPinToGps && deliveryMethod === "delivery") {
          await handlePinMoved(gps.lat, gps.lng, "gps");
          toast({
            title: "Live location pinned",
            description: `Locked onto your live GPS (±${gps.accuracyMeters}m) and updated your street address.`,
          });
        } else {
          // Pan active map(s) to show customer's live blue dot alongside the route
          const activeMap = fsMapInstanceRef.current || mapInstanceRef.current;
          if (activeMap) {
            const bounds = L.latLngBounds([
              [gps.lat, gps.lng],
              BAKERY_COORDS,
              destCoords,
            ]);
            activeMap.fitBounds(bounds, { padding: [55, 55], maxZoom: 17 });
          }
          toast({
            title: "Live GPS shown on map",
            description: `Showing your current position (±${gps.accuracyMeters}m accuracy).`,
          });
        }
      } catch (err: any) {
        toast({
          title: "Could not access live location",
          description:
            err?.message ||
            "Please allow browser location access or drag the red pin on the map.",
          variant: "destructive",
        });
      } finally {
        setLocatingLiveGps(false);
      }
    },
    [editablePin, deliveryMethod, destCoords, handlePinMoved, toast]
  );

  // Sync exact external coordinates immediately when customer picks an autocomplete item or GPS
  useEffect(() => {
    if (
      customerCoords &&
      Number.isFinite(customerCoords[0]) &&
      Number.isFinite(customerCoords[1])
    ) {
      setDestCoords((prev) =>
        Math.abs(prev[0] - customerCoords[0]) < 0.00001 &&
        Math.abs(prev[1] - customerCoords[1]) < 0.00001
          ? prev
          : customerCoords
      );
    }
  }, [customerCoords]);

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

  // Step 1: If no exact customerCoords were supplied, geocode the text address smartly
  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setDestCoords(BAKERY_COORDS);
      return;
    }
    if (
      customerCoords &&
      Number.isFinite(customerCoords[0]) &&
      Number.isFinite(customerCoords[1])
    ) {
      // Exact coordinates already locked via autocomplete, GPS, or dragged pin!
      return;
    }
    if (!destinationQuery.trim()) {
      setDestCoords(BAKERY_COORDS);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const matches = await searchSAAddressSuggestions(
          destinationQuery,
          liveUserGps ? [liveUserGps.lat, liveUserGps.lng] : null,
          controller.signal
        );
        if (matches.length > 0) {
          setDestCoords([matches[0].lat, matches[0].lng]);
        } else {
          setDestCoords(resolveInitialDestCoords(destinationQuery));
        }
      } catch {
        // ignore abort
      }
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [destinationQuery, customerCoords, deliveryMethod, liveUserGps]);

  // Step 2: Compute real street-by-street GeoJSON road polyline whenever destCoords changes
  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setRoutePoints([BAKERY_COORDS]);
      setTurnSteps([]);
      setViaStreets([]);
      setRoadDistanceKm(0);
      setRoutingLoading(false);
      return;
    }

    if (haversineKm(BAKERY_COORDS, destCoords) < 0.03) {
      setRoutePoints([BAKERY_COORDS]);
      setTurnSteps([]);
      setViaStreets([]);
      setRoadDistanceKm(0.1);
      setRoutingLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const computeStreetRoute = async () => {
      setRoutingLoading(true);
      const coordPair = `${BAKERY_COORDS[1]},${BAKERY_COORDS[0]};${destCoords[1]},${destCoords[0]}`;
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
                  (s.distance || 0) >= 35 || s.maneuver?.type === "arrive"
              )
              .map((s: any) => ({
                instruction: formatManeuverInstruction(s),
                road: s.name || s.ref || "Local street",
                distanceMeters: Math.round(s.distance || 0),
              }));

            const roadTotals = new Map<string, number>();
            for (const s of rawSteps) {
              const label = (
                s.ref && s.name
                  ? `${s.ref} (${s.name})`
                  : s.ref || s.name || ""
              ).trim();
              if (!label) continue;
              roadTotals.set(
                label,
                (roadTotals.get(label) || 0) + (s.distance || 0)
              );
            }
            const topRoads = [...roadTotals.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([r]) => r);

            const distKm = Math.max(0.2, route.distance / 1000);
            const durMin = Math.max(
              3,
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

      // Backend proxy fallback
      if (!resolvedRoute) {
        try {
          const proxyRes = await fetch(
            `${API_URL}/api/delivery/route?lat=${destCoords[0]}&lng=${destCoords[1]}&address=${encodeURIComponent(
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
          // ignore
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
          0.4,
          haversineKm(BAKERY_COORDS, destCoords) * 1.24
        );
        setRoutePoints([BAKERY_COORDS, destCoords]);
        setRoadDistanceKm(approxKm);
        setDriveMinutes(
          Math.max(4, Math.round((approxKm / theme.avgSpeedKmh) * 60))
        );
        setTurnSteps([]);
        setViaStreets([]);
      }

      setRoutingLoading(false);
    };

    computeStreetRoute();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [destCoords, deliveryMethod, destinationQuery, theme.avgSpeedKmh]);

  // Fullscreen address search autocomplete
  useEffect(() => {
    if (!isFullscreen || fsSearchQuery.trim().length < 2) {
      setFsSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      setFsSearching(true);
      try {
        const res = await searchSAAddressSuggestions(
          fsSearchQuery,
          liveUserGps ? [liveUserGps.lat, liveUserGps.lng] : null,
          controller.signal
        );
        setFsSuggestions(res);
      } finally {
        setFsSearching(false);
      }
    }, 240);
    return () => {
      window.clearTimeout(t);
      controller.abort();
    };
  }, [fsSearchQuery, isFullscreen, liveUserGps]);

  // Close Fullscreen on Escape key & lock body scroll while open
  useEffect(() => {
    if (!isFullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isFullscreen, setFullscreen]);

  // Initialize Inline Map
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
    applyTileLayers(tileGroup, mapStyle);

    const resizeTimer = window.setTimeout(() => map.invalidateSize(), 250);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
      tileLayerGroupRef.current = null;
      routeLayerGroupRef.current = null;
    };
  }, []);

  // Attach click-to-place-pin on Inline Map when editablePin is enabled
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !editablePin || deliveryMethod !== "delivery") return;

    const onMapClick = (e: L.LeafletMouseEvent) => {
      handlePinMoved(e.latlng.lat, e.latlng.lng, "pin");
    };
    map.on("click", onMapClick);
    return () => {
      map.off("click", onMapClick);
    };
  }, [editablePin, deliveryMethod, handlePinMoved]);

  // Initialize Fullscreen Map when opened
  useEffect(() => {
    if (!isFullscreen) {
      if (fsMapInstanceRef.current) {
        fsMapInstanceRef.current.remove();
        fsMapInstanceRef.current = null;
        fsTileLayerGroupRef.current = null;
        fsRouteLayerGroupRef.current = null;
      }
      return;
    }

    const initTimer = window.setTimeout(() => {
      if (!fsMapContainerRef.current || fsMapInstanceRef.current) return;

      const fsMap = L.map(fsMapContainerRef.current, {
        center: destCoords || BAKERY_COORDS,
        zoom: 15,
        zoomControl: false,
        scrollWheelZoom: true,
        attributionControl: true,
      });

      L.control.zoom({ position: "bottomright" }).addTo(fsMap);
      L.control.scale({ imperial: false, position: "bottomleft" }).addTo(fsMap);

      const fsTiles = L.layerGroup().addTo(fsMap);
      const fsRoutes = L.layerGroup().addTo(fsMap);

      fsMapInstanceRef.current = fsMap;
      fsTileLayerGroupRef.current = fsTiles;
      fsRouteLayerGroupRef.current = fsRoutes;

      applyTileLayers(fsTiles, mapStyle);

      if (editablePin && deliveryMethod === "delivery") {
        fsMap.on("click", (e: L.LeafletMouseEvent) => {
          handlePinMoved(e.latlng.lat, e.latlng.lng, "pin");
        });
      }

      fsMap.invalidateSize();
      const bounds = L.latLngBounds([
        BAKERY_COORDS,
        destCoords,
        ...routePoints,
      ]);
      fsMap.fitBounds(bounds, { padding: [80, 80], maxZoom: 17 });
    }, 40);

    return () => {
      window.clearTimeout(initTimer);
    };
  }, [isFullscreen]);

  // Update tiles on both Inline & Fullscreen maps when mapStyle changes
  useEffect(() => {
    if (tileLayerGroupRef.current) {
      applyTileLayers(tileLayerGroupRef.current, mapStyle);
    }
    if (fsTileLayerGroupRef.current) {
      applyTileLayers(fsTileLayerGroupRef.current, mapStyle);
    }
  }, [mapStyle, isFullscreen]);

  const progress =
    deliveryMethod === "pickup" ? 0 : getProgressFraction(status, liveTick);
  const remainingKm = Math.max(0, roadDistanceKm * (1 - progress));

  const { zoneNumber } = useMemo(
    () =>
      calculateZoneDetails(
        customerAddress || "Johannesburg",
        deliveryMethod === "delivery" ? destCoords : null
      ),
    [customerAddress, deliveryMethod, destCoords]
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

  // Shared Renderer for Route Casing, Pins, Draggable Drop-Off Pin & Live Customer GPS Dot
  const renderMapOverlays = useCallback(
    (
      map: L.Map | null,
      group: L.LayerGroup | null,
      fitPadding: [number, number],
      autoFit: boolean
    ) => {
      if (!map || !group) return;
      group.clearLayers();

      const bakeryLogo = getBakeryLogoSrc();
      const courierLogo = getProviderLogoSrc(providerMeta.id) || bakeryLogo;

      // 1. Bakery Origin Pin
      const bakeryIcon = L.divIcon({
        className: "pb-custom-leaflet-pin",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);">
            <div style="background:#fff;border:2.5px solid #9A521B;border-radius:12px;padding:3px;box-shadow:0 6px 16px rgba(0,0,0,0.28);width:38px;height:38px;overflow:hidden;">
              <img src="${bakeryLogo}" alt="Portugal Bakery" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />
            </div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #9A521B;margin-top:-1px;"></div>
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

      // Optional Live Customer GPS Blue Dot + Accuracy Ring
      if (liveUserGps) {
        L.circle([liveUserGps.lat, liveUserGps.lng], {
          radius: Math.min(250, Math.max(18, liveUserGps.accuracyMeters)),
          color: "#2563EB",
          weight: 1.5,
          fillColor: "#3B82F6",
          fillOpacity: 0.14,
          interactive: false,
        }).addTo(group);

        const gpsDotIcon = L.divIcon({
          className: "pb-custom-leaflet-pin",
          html: `
            <div style="position:relative;transform:translate(-50%,-50%);width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
              <span style="position:absolute;width:22px;height:22px;border-radius:999px;background:rgba(37,99,235,0.32);animation:ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></span>
              <span style="position:relative;width:13px;height:13px;border-radius:999px;background:#2563EB;border:2.5px solid #FFFFFF;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        L.marker([liveUserGps.lat, liveUserGps.lng], {
          icon: gpsDotIcon,
          zIndexOffset: 850,
        })
          .bindPopup(
            `<strong>Your Live GPS Location</strong><br/>Accuracy: ±${liveUserGps.accuracyMeters}m`
          )
          .addTo(group);
      }

      if (deliveryMethod === "pickup") {
        if (autoFit) map.setView(BAKERY_COORDS, 16);
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

        L.polyline(routePoints, {
          color: theme.routeCoreColor,
          weight: 14,
          opacity: 0.16,
          lineCap: "round",
          lineJoin: "round",
          interactive: false,
        }).addTo(group);

        if (traveledSegment.length > 1) {
          L.polyline(traveledSegment, {
            color: "#334155",
            weight: 8,
            opacity: 0.7,
            lineCap: "round",
            lineJoin: "round",
            interactive: false,
          }).addTo(group);
          L.polyline(traveledSegment, {
            color: "#94A3B8",
            weight: 4.5,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
            interactive: false,
          }).addTo(group);
        }

        if (activeSegment.length > 1) {
          L.polyline(activeSegment, {
            color: theme.routeCasingColor,
            weight: 9,
            opacity: 0.92,
            lineCap: "round",
            lineJoin: "round",
            interactive: false,
          }).addTo(group);

          L.polyline(activeSegment, {
            color: theme.routeCoreColor,
            weight: 5.5,
            opacity: 1,
            lineCap: "round",
            lineJoin: "round",
            interactive: false,
          }).addTo(group);

          const arrowCount = Math.min(
            6,
            Math.max(2, Math.floor(activeSegment.length / 65))
          );
          for (let a = 1; a <= arrowCount; a++) {
            const idx = Math.floor(
              (activeSegment.length - 2) * (a / (arrowCount + 1))
            );
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

        // Live Courier Vehicle Marker
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
      }

      // Destination Pin (Draggable when editablePin=true!)
      const destLabel =
        providerMeta.id === "pudo"
          ? "PUDO Locker"
          : providerMeta.id === "pargo"
          ? "Pargo Point"
          : editablePin
          ? "Drop-Off · Drag Pin"
          : "Drop-Off";

      const destIcon = L.divIcon({
        className: "pb-custom-leaflet-pin",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%);cursor:${
            editablePin ? "grab" : "pointer"
          };">
            <div style="background:#DC2626;color:#fff;border:2.5px solid #fff;border-radius:999px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(0,0,0,0.34);">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3" fill="#fff"/>
              </svg>
            </div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #DC2626;margin-top:-1px;"></div>
            <span style="margin-top:2px;background:#111827;color:#fff;font-size:10px;font-weight:700;padding:1.5px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);">
              ${destLabel}
            </span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const destMarker = L.marker(destCoords, {
        icon: destIcon,
        draggable: editablePin,
        zIndexOffset: 950,
      })
        .bindPopup(
          `<strong>${destLabel}</strong><br/>${
            destinationQuery || "Pinned delivery location"
          }${
            editablePin
              ? "<br/><em>Drag pin or click anywhere on the road to adjust</em>"
              : ""
          }`
        )
        .addTo(group);

      if (editablePin) {
        destMarker.on("dragend", () => {
          const pos = destMarker.getLatLng();
          handlePinMoved(pos.lat, pos.lng, "pin");
        });
      }

      if (autoFit) {
        const allPts: [number, number][] = [
          BAKERY_COORDS,
          destCoords,
          ...routePoints,
        ];
        if (liveUserGps) {
          allPts.push([liveUserGps.lat, liveUserGps.lng]);
        }
        const bounds = L.latLngBounds(allPts);
        map.fitBounds(bounds, {
          padding: fitPadding,
          maxZoom: 16,
        });
      }
    },
    [
      providerMeta.id,
      liveUserGps,
      deliveryMethod,
      routePoints,
      progress,
      theme,
      displayProviderName,
      remainingKm,
      editablePin,
      destCoords,
      destinationQuery,
      handlePinMoved,
    ]
  );

  // Sync overlays onto Inline Map
  useEffect(() => {
    renderMapOverlays(
      mapInstanceRef.current,
      routeLayerGroupRef.current,
      compact ? [38, 38] : [52, 52],
      true
    );
  }, [renderMapOverlays, compact]);

  // Sync overlays onto Fullscreen Map when open (without snapping zoom away while user inspects streets!)
  useEffect(() => {
    if (!isFullscreen) return;
    const timer = window.setTimeout(() => {
      renderMapOverlays(
        fsMapInstanceRef.current,
        fsRouteLayerGroupRef.current,
        [80, 80],
        false
      );
    }, 60);
    return () => window.clearTimeout(timer);
  }, [isFullscreen, renderMapOverlays]);

  const handleRecenter = (targetMap?: L.Map | null) => {
    const map =
      targetMap || fsMapInstanceRef.current || mapInstanceRef.current;
    if (!map) return;
    if (deliveryMethod === "pickup") {
      map.setView(BAKERY_COORDS, 16, { animate: true });
      return;
    }
    const pts: [number, number][] = [
      BAKERY_COORDS,
      destCoords,
      ...routePoints,
    ];
    if (liveUserGps) pts.push([liveUserGps.lat, liveUserGps.lng]);
    const bounds = L.latLngBounds(pts);
    map.fitBounds(bounds, { padding: [55, 55], maxZoom: 16, animate: true });
  };

  const handleSelectFsSuggestion = (item: SAAddressSuggestion) => {
    setDestCoords([item.lat, item.lng]);
    setFsSearchQuery(item.fullAddress);
    setFsSuggestions([]);
    onLocationChangeRef.current?.({
      lat: item.lat,
      lng: item.lng,
      address: item.fullAddress,
      source: "search",
    });
    if (fsMapInstanceRef.current) {
      fsMapInstanceRef.current.setView([item.lat, item.lng], 17, {
        animate: true,
      });
    }
  };

  const isDelivered = ["completed", "delivered"].includes(
    (status || "").toLowerCase()
  );

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${BAKERY_COORDS[0]},${BAKERY_COORDS[1]}&destination=${destCoords[0]},${destCoords[1]}&travelmode=driving`;

  const fullscreenModal =
    isFullscreen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[9999] bg-background flex flex-col">
            {/* Full-Screen Top Floating Navigation & Search Header */}
            <div className="relative z-20 border-b border-border bg-card/95 backdrop-blur-md px-3 sm:px-5 py-3 shadow-sm">
              <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <DeliveryProviderLogo
                      providerId={
                        deliveryMethod === "pickup"
                          ? "own_delivery"
                          : providerMeta.id
                      }
                      alt={displayProviderName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-foreground truncate">
                        {editablePin
                          ? "Full-Screen Road Map & Exact Pin Placement"
                          : `Live Street Route · ${displayProviderName}`}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {editablePin
                          ? "Zoom into your street, drag the red pin or tap your exact gate/entrance"
                          : statusHeadline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUseLiveLocation(editablePin)}
                      disabled={locatingLiveGps}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold shadow-xs transition-colors disabled:opacity-60"
                    >
                      {locatingLiveGps ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Crosshair className="h-3.5 w-3.5" />
                      )}
                      {editablePin ? "Pin My Live Location" : "My Live GPS"}
                    </button>

                    <div className="inline-flex rounded-lg bg-muted border border-border p-0.5 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setMapStyle("street")}
                        className={cn(
                          "px-2.5 py-1 rounded-md transition-colors",
                          mapStyle === "street"
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
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
                            ? "bg-card text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Layers className="h-3 w-3" />
                        Satellite
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRecenter(fsMapInstanceRef.current)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <LocateFixed className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Fit Route</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFullscreen(false)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <Minimize2 className="h-3.5 w-3.5" />
                      Close
                    </button>
                  </div>
                </div>

                {/* Fullscreen Uber-style Address Search Bar (when editablePin is enabled) */}
                {editablePin && deliveryMethod === "delivery" && (
                  <div className="relative">
                    <div className="relative flex items-center">
                      <Search className="h-4 w-4 text-muted-foreground absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        value={fsSearchQuery}
                        onChange={(e) => setFsSearchQuery(e.target.value)}
                        placeholder="Search street number, road, complex or suburb (e.g. 18 4th Street, La Rochelle)..."
                        className="w-full h-10 pl-9 pr-9 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {fsSearching && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground absolute right-3" />
                      )}
                      {!fsSearching && fsSearchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setFsSearchQuery("");
                            setFsSuggestions([]);
                          }}
                          className="absolute right-3 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {fsSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-11 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                        {fsSuggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelectFsSuggestion(s)}
                            className="w-full text-left px-3.5 py-2.5 hover:bg-muted/70 flex items-center justify-between gap-3 border-b border-border/60 last:border-0 transition-colors"
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                  {s.primaryText}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {s.secondaryText}
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground shrink-0">
                              {s.distanceFromBakeryKm} km
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Full-Screen Leaflet Canvas */}
            <div className="relative flex-1 w-full bg-stone-200">
              <div ref={fsMapContainerRef} className="w-full h-full z-0" />

              {(routingLoading || reverseGeocodingPin) && (
                <div className="absolute top-3 left-3 z-[500] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/95 backdrop-blur-md border border-border shadow-md text-xs font-semibold text-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  {reverseGeocodingPin
                    ? "Identifying street address at pin..."
                    : "Updating street-by-street route..."}
                </div>
              )}
            </div>

            {/* Full-Screen Bottom Pinned Location & Street Route Sheet */}
            <div className="relative z-20 border-t border-border bg-card px-4 py-3.5 shadow-lg">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-bold text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-red-600" />
                      {destinationQuery || "Tap map to choose delivery address"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-muted text-foreground font-semibold">
                      {roadDistanceKm.toFixed(1)} km · {etaSummary}
                    </span>
                  </div>
                  {viaStreets.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      <strong className="text-foreground">Via:</strong>{" "}
                      {viaStreets.join(" → ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setFullscreen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold shadow-sm hover:opacity-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {editablePin ? "Confirm Pin Location" : "Done"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {fullscreenModal}

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

          {/* Interactive Pin & Live GPS Hint Banner when editablePin=true */}
          {editablePin && deliveryMethod === "delivery" && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-background border border-border px-3 py-2 text-xs">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Move className="h-3.5 w-3.5 text-primary shrink-0" />
                Drag the red <strong className="text-foreground">Drop-Off pin</strong> or tap your exact gate on the map to adjust location.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUseLiveLocation(true)}
                  disabled={locatingLiveGps}
                  className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline disabled:opacity-60"
                >
                  {locatingLiveGps ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Crosshair className="h-3 w-3" />
                  )}
                  Use Live GPS
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={() => setFullscreen(true)}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <Maximize2 className="h-3 w-3" />
                  Full-Screen Map
                </button>
              </div>
            </div>
          )}

          {/* Distance & ETA Telemetry Pills */}
          {deliveryMethod === "delivery" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3.5">
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
              compact ? "h-[320px] sm:h-[360px]" : "h-[390px] sm:h-[450px]"
            )}
          />

          {/* Calculating Live Street Route / Reverse Geocoding Indicator */}
          {(routingLoading || reverseGeocodingPin) && (
            <div className="absolute top-3 left-3 z-[400] inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/95 backdrop-blur-md border border-border shadow-md text-xs font-medium text-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              {reverseGeocodingPin
                ? "Updating pinned street address..."
                : "Mapping exact street route..."}
            </div>
          )}

          {/* Top-Right Controls: My Location | Map/Satellite | Fit Route | Full Screen */}
          <div className="absolute top-3 right-3 z-[400] flex flex-wrap items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => handleUseLiveLocation(editablePin)}
              disabled={locatingLiveGps}
              title="Check my live GPS location"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background/95 backdrop-blur-md text-foreground border border-border shadow-md text-xs font-semibold hover:bg-background transition-all disabled:opacity-60"
            >
              {locatingLiveGps ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              ) : (
                <Crosshair className="h-3.5 w-3.5 text-blue-600" />
              )}
              <span className="hidden sm:inline">My Location</span>
            </button>

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
              onClick={() => handleRecenter(mapInstanceRef.current)}
              title="Fit full route"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background/95 backdrop-blur-md text-foreground border border-border shadow-md text-xs font-semibold hover:bg-background transition-all"
            >
              <LocateFixed className="h-3.5 w-3.5 text-primary" />
              <span className="hidden md:inline">Fit Route</span>
            </button>

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              title="Open full-screen road map"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-foreground text-background border border-foreground shadow-md text-xs font-semibold hover:opacity-90 transition-all"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Full Screen</span>
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
                    {showDirections
                      ? "Hide Directions"
                      : `Directions (${turnSteps.length})`}
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
                <strong className="text-foreground">From:</strong>{" "}
                {BAKERY_LABEL}
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
                  <span className="text-muted-foreground">
                    Assigned Driver:
                  </span>{" "}
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
    </>
  );
}

export default OrderTrackingMap;
