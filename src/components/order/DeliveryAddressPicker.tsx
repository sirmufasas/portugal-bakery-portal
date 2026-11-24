import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Search,
  Crosshair,
  Loader2,
  CheckCircle2,
  Maximize2,
  X,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCurrentLiveGPS,
  reverseGeocodeSAPoint,
  SAAddressSuggestion,
  searchSAAddressSuggestions,
} from "@/utils/saAddressGeocoder";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface SelectedDeliveryLocation {
  address: string;
  coords: [number, number];
  source: "autocomplete" | "gps" | "pin";
}

interface DeliveryAddressPickerProps {
  address: string;
  coords: [number, number] | null;
  unitDetails?: string;
  onUnitDetailsChange?: (val: string) => void;
  onAddressTyped: (rawText: string) => void;
  onLocationVerified: (selection: SelectedDeliveryLocation) => void;
  onOpenFullscreenMap: () => void;
}

export function DeliveryAddressPicker({
  address,
  coords,
  unitDetails = "",
  onUnitDetailsChange,
  onAddressTyped,
  onLocationVerified,
  onOpenFullscreenMap,
}: DeliveryAddressPickerProps) {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [liveBiasCoords, setLiveBiasCoords] = useState<[number, number] | null>(
    null
  );
  const [suggestions, setSuggestions] = useState<SAAddressSuggestion[]>([]);
  const [highlightedIdx, setHighlightedIdx] = useState<number>(-1);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const suppressNextSearchRef = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Debounced Uber-style South African street address autocomplete
  useEffect(() => {
    if (suppressNextSearchRef.current) {
      suppressNextSearchRef.current = false;
      return;
    }

    const q = address.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const items = await searchSAAddressSuggestions(
          q,
          liveBiasCoords || coords,
          controller.signal
        );
        setSuggestions(items);
        setHighlightedIdx(items.length > 0 ? 0 : -1);
      } catch {
        // ignore abort
      } finally {
        setSearching(false);
      }
    }, 240);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [address, liveBiasCoords, coords]);

  const handleSelectSuggestion = (item: SAAddressSuggestion) => {
    suppressNextSearchRef.current = true;
    setIsOpen(false);
    setSuggestions([]);
    onLocationVerified({
      address: item.fullAddress,
      coords: [item.lat, item.lng],
      source: "autocomplete",
    });
  };

  const handleDetectLiveGps = async () => {
    setLocatingGps(true);
    try {
      const gps = await getCurrentLiveGPS();
      setLiveBiasCoords([gps.lat, gps.lng]);
      setGpsAccuracy(gps.accuracyMeters);

      const resolvedStreet = await reverseGeocodeSAPoint(gps.lat, gps.lng);
      suppressNextSearchRef.current = true;
      setIsOpen(false);
      onLocationVerified({
        address: resolvedStreet,
        coords: [gps.lat, gps.lng],
        source: "gps",
      });

      toast({
        title: "Current location detected",
        description: `${resolvedStreet} (±${gps.accuracyMeters}m GPS)`,
      });
    } catch (err: any) {
      toast({
        title: "Live location unavailable",
        description:
          err?.message ||
          "Please allow browser location permission or search your street address below.",
        variant: "destructive",
      });
    } finally {
      setLocatingGps(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightedIdx >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[highlightedIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor="customerAddress" className="text-sm font-semibold">
          Delivery Address
        </Label>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleDetectLiveGps}
            disabled={locatingGps}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/10 text-blue-700 hover:bg-blue-600/15 border border-blue-600/25 text-xs font-semibold transition-colors disabled:opacity-60"
          >
            {locatingGps ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Crosshair className="h-3.5 w-3.5" />
            )}
            Use My Current Location
          </button>

          <button
            type="button"
            onClick={onOpenFullscreenMap}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-foreground hover:bg-muted/80 border border-border text-xs font-semibold transition-colors"
          >
            <Maximize2 className="h-3 w-3 text-primary" />
            Pin on Full Map
          </button>
        </div>
      </div>

      {/* Uber-Style Search Input + Live Recommendations Dropdown */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
          <Input
            id="customerAddress"
            type="text"
            autoComplete="off"
            placeholder="Search street number & road (e.g. 18 4th Street, La Rochelle)..."
            value={address}
            onFocus={() => {
              if (address.trim().length >= 2) setIsOpen(true);
            }}
            onChange={(e) => {
              onAddressTyped(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 h-11 bg-background text-foreground text-sm"
          />
          {searching && (
            <Loader2 className="h-4 w-4 animate-spin text-primary absolute right-3.5" />
          )}
          {!searching && address && (
            <button
              type="button"
              onClick={() => {
                onAddressTyped("");
                setSuggestions([]);
                setIsOpen(false);
              }}
              aria-label="Clear address"
              className="absolute right-3.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown */}
        {isOpen && (suggestions.length > 0 || searching) && (
          <div className="absolute left-0 right-0 top-12 z-50 rounded-xl border border-border bg-card shadow-xl overflow-hidden">
            <div className="px-3 py-1.5 bg-muted/50 border-b border-border flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Select exact street address</span>
              <span>Distance from Bakery</span>
            </div>

            {searching && suggestions.length === 0 ? (
              <div className="px-4 py-4 text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Searching South African streets &amp; suburbs...
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-border/60">
                {suggestions.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onMouseEnter={() => setHighlightedIdx(idx)}
                    onClick={() => handleSelectSuggestion(item)}
                    className={cn(
                      "w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors",
                      idx === highlightedIdx
                        ? "bg-primary/8"
                        : "hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5 h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {item.primaryText}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.secondaryText || "Gauteng, South Africa"}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-foreground shrink-0">
                      {item.distanceFromBakeryKm} km
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verified Pin Status Badge */}
      {coords ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-emerald-950/5 border border-emerald-800/20 px-3 py-1.5 text-xs text-emerald-900">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
            Exact map pin locked
            {gpsAccuracy ? ` (Live GPS ±${gpsAccuracy}m)` : ""}
          </span>
          <button
            type="button"
            onClick={onOpenFullscreenMap}
            className="font-semibold underline hover:opacity-80"
          >
            Adjust Pin on Map
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Choose a suggested street from the dropdown, tap{" "}
          <strong>Use My Current Location</strong>, or fine-tune the red pin on
          the map below.
        </p>
      )}

      {/* Optional Apartment / Complex / Gate Instructions */}
      {onUnitDetailsChange && (
        <div className="relative flex items-center pt-0.5">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
          <Input
            type="text"
            placeholder="Apt / Complex / Estate / Gate Note (optional, e.g. Unit 4, Oak Estate)"
            value={unitDetails}
            onChange={(e) => onUnitDetailsChange(e.target.value)}
            className="pl-9 h-9 bg-background text-foreground text-xs"
          />
        </div>
      )}
    </div>
  );
}
