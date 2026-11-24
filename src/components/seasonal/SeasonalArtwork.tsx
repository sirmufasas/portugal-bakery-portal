import React from "react";
import { Check, ChevronDown, Loader2, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SA_EVENT_IDS,
  SASeasonId,
  SEASON_BASELINE_IDS,
  SEASON_THEMES,
} from "@/utils/seasons";
import { useSeason } from "@/contexts/SeasonContext";
import { cn } from "@/lib/utils";

export function SeasonSymbolIcon({
  seasonId,
  className = "h-4 w-4",
}: {
  seasonId: SASeasonId;
  className?: string;
}) {
  switch (seasonId) {
    case "freedom_day":
      // Refined South African Flag Y-motif emblem
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="3.5" fill="#1B6044" />
          <path d="M9 4H22V9.5H13L9 4Z" fill="#B83B2E" />
          <path d="M9 20H22V14.5H13L9 20Z" fill="#1E3A5F" />
          <path d="M2 7L8.5 12L2 17V7Z" fill="#1C1917" stroke="#D49B2A" strokeWidth="1.5" />
          <path d="M7.5 12H22" stroke="#FAF8F4" strokeWidth="1.8" />
        </svg>
      );

    case "heritage_day":
      // Heritage ochre & sage geometric diamond
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <polygon points="12,2 22,12 12,22 2,12" fill="#B46822" />
          <polygon points="12,5.5 18.5,12 12,18.5 5.5,12" fill="#8C3D24" />
          <polygon points="12,9 15,12 12,15 9,12" fill="#2A6046" />
        </svg>
      );

    case "womens_day":
    case "mothers_day":
      // Terracotta & antique-gold South African King Protea
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 3L15 10L20 6L18 15H6L4 6L9 10L12 3Z" fill="#9A4E34" />
          <ellipse cx="12" cy="14.5" rx="5.5" ry="4" fill="#F3E5D0" />
          <path d="M8 18C10 20.5 14 20.5 16 18" stroke="#3D6B52" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "valentines":
      // Deep vintage burgundy emblem
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 20C12 20 4 14.8 4 8.9C4 6.2 6.1 4.2 8.6 4.2C10.2 4.2 11.4 5 12 6C12.6 5 13.8 4.2 15.4 4.2C17.9 4.2 20 6.2 20 8.9C20 14.8 12 20 12 20Z"
            fill="#782B33"
          />
        </svg>
      );

    case "youth_day":
    case "mandela_day":
    case "new_year":
      // Warm amber sun & horizon
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="13" r="4.8" fill="#B4721E" />
          <g stroke="#8F4C1A" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="3.2" x2="12" y2="5.6" />
            <line x1="5.2" y1="6.7" x2="6.9" y2="8.4" />
            <line x1="18.8" y1="6.7" x2="17.1" y2="8.4" />
            <line x1="2.8" y1="13" x2="5.2" y2="13" />
            <line x1="18.8" y1="13" x2="21.2" y2="13" />
          </g>
          <path d="M3.5 19H20.5" stroke="#326249" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case "human_rights_day":
    case "reconciliation_day":
    case "workers_day":
    case "spring":
      // Artisan olive & golden wheat sprig (grounded bakery symbol)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 19C9 14 14 9 19 5" stroke="#326249" strokeWidth="1.9" strokeLinecap="round" />
          <ellipse cx="9.5" cy="11" rx="2.1" ry="3.8" transform="rotate(-30 9.5 11)" fill="#3F7357" />
          <ellipse cx="14.5" cy="7" rx="2.1" ry="3.8" transform="rotate(-30 14.5 7)" fill="#B4721E" />
          <ellipse cx="13" cy="14.5" rx="2.1" ry="3.8" transform="rotate(55 13 14.5)" fill="#4D7C62" />
        </svg>
      );

    case "easter":
      // Spiced Folar bronze & honey wheat emblem
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3.2C8.2 3.2 5.8 8.6 5.8 13.5C5.8 17.6 8.5 20.5 12 20.5C15.5 20.5 18.2 17.6 18.2 13.5C18.2 8.6 15.8 3.2 12 3.2Z"
            fill="#8C5125"
          />
          <path d="M6.5 12.5Q12 9.8 17.5 12.5" stroke="#E2B15B" strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="15.6" r="1.6" fill="#F3E5D0" />
        </svg>
      );

    case "summer":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="4.6" fill="#B4721E" />
          <g stroke="#9A531B" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="4.8" />
            <line x1="12" y1="19.2" x2="12" y2="21.5" />
            <line x1="2.5" y1="12" x2="4.8" y2="12" />
            <line x1="19.2" y1="12" x2="21.5" y2="12" />
            <line x1="5.2" y1="5.2" x2="6.9" y2="6.9" />
            <line x1="17.1" y1="17.1" x2="18.8" y2="18.8" />
            <line x1="18.8" y1="5.2" x2="17.1" y2="6.9" />
            <line x1="6.9" y1="17.1" x2="5.2" y2="18.8" />
          </g>
        </svg>
      );

    case "festive_summer":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 2.5L14.4 9.6L21.5 12L14.4 14.4L12 21.5L9.6 14.4L2.5 12L9.6 9.6L12 2.5Z"
            fill="#245A41"
          />
          <circle cx="18.5" cy="5.5" r="1.5" fill="#B4721E" />
          <circle cx="5.5" cy="18.5" r="1.4" fill="#782B33" />
        </svg>
      );

    case "autumn":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M19.2 4.8C13 4.8 6.8 8 5.2 14.5C4.8 16.5 5.8 18.2 7.2 19.2C13.6 17.8 19.2 12.4 19.2 4.8Z"
            fill="#954423"
          />
          <path
            d="M4.2 19.8L14.5 9.5"
            stroke="#5C2814"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case "winter":
    default:
      // Portuguese Azulejo geometric star
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <g stroke="#294D7A" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="2.8" x2="12" y2="21.2" />
            <line x1="4" y1="7.4" x2="20" y2="16.6" />
            <line x1="20" y1="7.4" x2="4" y2="16.6" />
          </g>
          <circle cx="12" cy="12" r="2.2" fill="#B4721E" />
        </svg>
      );
  }
}

/**
 * Subtle Artisan Wheat & Olive Branch Watermark (used for Spring, Human Rights, Workers' Day, Reconciliation).
 */
function ArtisanWheatOliveCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      {/* Olive & Wheat Curved Stem */}
      <path
        d="M-8 22 C 62 38, 126 78, 196 158"
        stroke="#326249"
        strokeOpacity="0.24"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {[
        { x: 52, y: 42, r: -34, c: "#326249" },
        { x: 88, y: 66, r: 36, c: "#B4721E" },
        { x: 124, y: 96, r: -28, c: "#3F7357" },
        { x: 158, y: 128, r: 32, c: "#B4721E" },
      ].map((lf, i) => (
        <ellipse
          key={i}
          cx={lf.x}
          cy={lf.y}
          rx="5.5"
          ry="13"
          transform={`rotate(${lf.r} ${lf.x} ${lf.y})`}
          fill={lf.c}
          fillOpacity="0.2"
        />
      ))}
    </svg>
  );
}

/**
 * Freedom Day Corner (27 April): Subtle South African Heritage Ribbons & Protea Line-Art.
 */
function FreedomDayCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <path d="M-10 18 C 64 24, 138 64, 222 152" stroke="#1B6044" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round" />
      <path d="M-10 30 C 60 36, 130 76, 210 162" stroke="#B47B1C" strokeOpacity="0.24" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M16 -8 C 44 58, 90 116, 176 196" stroke="#9E3B2E" strokeOpacity="0.18" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Heritage Day Corner (24 September): Subtle Ochre Geometric Line-Art & Wheat.
 */
function HeritageDayCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <g opacity="0.22">
        <polygon points="0,0 64,0 0,64" fill="#B46822" />
        <polygon points="64,0 114,0 64,50" fill="#8C3D24" />
        <polygon points="48,48 84,84 48,120 12,84" stroke="#78350F" strokeWidth="2" fill="none" />
      </g>
      <path d="M68 104 C 112 134, 152 168, 192 210" stroke="#954B1E" strokeOpacity="0.24" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Terracotta & Sage King Protea Line-Art (Women's Day & Mother's Day — zero pink).
 */
function TerracottaProteaCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <path d="M-8 20 C 58 38, 118 78, 186 154" stroke="#3D6B52" strokeOpacity="0.22" strokeWidth="2.4" strokeLinecap="round" />
      <g transform="translate(88, 84)" opacity="0.24">
        {[-48, -24, 0, 24, 48].map((deg) => (
          <path
            key={deg}
            d="M0 2 L-9 -36 L0 -48 L9 -36 Z"
            transform={`rotate(${deg})`}
            fill={Math.abs(deg) === 24 ? "#B47B1C" : "#864331"}
          />
        ))}
        <ellipse cx="0" cy="-10" rx="20" ry="14" fill="#EFE4D2" />
      </g>
    </svg>
  );
}

/**
 * Warm Sunrise & Wheat Arc (Summer, Youth Day, Mandela Day, New Year, Easter).
 */
function WarmHarvestSunCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="88" stroke="#B4721E" strokeOpacity="0.18" strokeWidth="1.8" strokeDasharray="6 8" />
      <circle cx="20" cy="20" r="52" fill="#B4721E" fillOpacity="0.08" />
      {[15, 35, 55, 75].map((deg) => (
        <line
          key={deg}
          x1="20"
          y1="20"
          x2={20 + Math.cos((deg * Math.PI) / 180) * 165}
          y2={20 + Math.sin((deg * Math.PI) / 180) * 165}
          stroke="#9A531B"
          strokeOpacity="0.16"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/**
 * Portuguese Azulejo Tile Corner (Winter).
 */
function AzulejoCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="96" stroke="#294D7A" strokeOpacity="0.18" strokeWidth="1.8" />
      <g transform="translate(68, 68)" stroke="#294D7A" strokeOpacity="0.22" strokeWidth="1.8" strokeLinecap="round">
        <line x1="0" y1="-24" x2="0" y2="24" />
        <line x1="-21" y1="-12" x2="21" y2="12" />
        <line x1="21" y1="-12" x2="-21" y2="12" />
        <circle cx="0" cy="0" r="4.5" fill="#B4721E" fillOpacity="0.4" stroke="none" />
      </g>
    </svg>
  );
}

/**
 * Festive Pine & Gold Star Watermark (Festive Season & Autumn/Burgundy).
 */
function EvergreenCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-40 h-40 md:w-52 md:h-52" : "w-48 h-48 md:w-64 md:h-64",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <path d="M0 22 C 64 36, 124 74, 184 140" stroke="#245A41" strokeOpacity="0.24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="82" cy="64" r="5.5" fill="#782B33" fillOpacity="0.28" />
      <circle cx="94" cy="72" r="4.5" fill="#B4721E" fillOpacity="0.3" />
    </svg>
  );
}

function SeasonCornerGraphic({
  seasonId,
  flip = false,
  compact = false,
}: {
  seasonId: SASeasonId;
  flip?: boolean;
  compact?: boolean;
}) {
  switch (seasonId) {
    case "freedom_day":
      return <FreedomDayCorner flip={flip} compact={compact} />;
    case "heritage_day":
      return <HeritageDayCorner flip={flip} compact={compact} />;
    case "womens_day":
    case "mothers_day":
      return <TerracottaProteaCorner flip={flip} compact={compact} />;
    case "summer":
    case "youth_day":
    case "mandela_day":
    case "new_year":
    case "easter":
      return <WarmHarvestSunCorner flip={flip} compact={compact} />;
    case "winter":
      return <AzulejoCorner flip={flip} compact={compact} />;
    case "festive_summer":
      return <EvergreenCorner flip={flip} compact={compact} />;
    case "spring":
    case "autumn":
    case "valentines":
    case "workers_day":
    case "human_rights_day":
    case "reconciliation_day":
    default:
      return <ArtisanWheatOliveCorner flip={flip} compact={compact} />;
  }
}

/**
 * Restrained ambient corner watermark mounted at the App root — no floating confetti/petals.
 */
export function GlobalSeasonalFrame() {
  const { season } = useSeason();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
      <div className="absolute top-16 -left-8 opacity-45">
        <SeasonCornerGraphic seasonId={season.id} compact />
      </div>
      <div className="absolute -bottom-8 -right-8 opacity-45">
        <SeasonCornerGraphic seasonId={season.id} flip compact />
      </div>
    </div>
  );
}

/**
 * Subtle decorative backdrop for FeaturedProducts, Menu Header, and Admin Banner.
 */
export function SeasonalSectionBackdrop({ seasonId }: { seasonId: SASeasonId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div className="absolute -top-4 -left-4 opacity-70">
        <SeasonCornerGraphic seasonId={seasonId} />
      </div>
      <div className="absolute -bottom-4 -right-4 opacity-70">
        <SeasonCornerGraphic seasonId={seasonId} flip />
      </div>
    </div>
  );
}

/**
 * Atmospheric subtle watermark for the Hero banner.
 */
export function SeasonalHeroAtmosphere({ seasonId }: { seasonId: SASeasonId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]" aria-hidden="true">
      <div className="absolute top-16 -left-4 opacity-50">
        <SeasonCornerGraphic seasonId={seasonId} compact />
      </div>
    </div>
  );
}

/**
 * ADMIN-ONLY Theme & South African Big Events Controller.
 * Normal users and guests NEVER see or access this control (`canManageTheme === false` -> returns null).
 * Changes made here by an Admin apply globally across the entire portal.
 */
export function SeasonBadgeControl() {
  const { mode, setMode, season, calendarSeasonId, canManageTheme, isSavingTheme } =
    useSeason();

  // Strictly restricted to Admin accounts only
  if (!canManageTheme) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Admin Portal Theme Controller (SA Events & Seasons)"
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border shadow-xs transition-all hover:opacity-90",
            season.pillClass
          )}
        >
          {isSavingTheme ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          ) : (
            <SeasonSymbolIcon seasonId={season.id} className="h-3.5 w-3.5 shrink-0" />
          )}
          <span>Theme: {season.shortLabel}</span>
          {mode === "auto" && (
            <span className="text-[10px] opacity-75 font-normal">(Auto)</span>
          )}
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 max-h-[75vh] overflow-y-auto bg-popover text-popover-foreground border border-border shadow-lg"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 text-primary" />
          Admin Global Portal Theme (Light Mode)
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => setMode("auto")}
          className="cursor-pointer flex items-center justify-between text-xs font-semibold py-2"
        >
          <div className="flex flex-col">
            <span>Automatic SA Calendar</span>
            <span className="text-[11px] font-normal text-muted-foreground">
              Currently: {SEASON_THEMES[calendarSeasonId].name}
            </span>
          </div>
          {mode === "auto" && <Check className="h-4 w-4 text-primary shrink-0" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          South African Big Events &amp; Holidays
        </DropdownMenuLabel>
        {SA_EVENT_IDS.map((id) => {
          const item = SEASON_THEMES[id];
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setMode(id)}
              className="cursor-pointer flex items-center justify-between text-xs py-1.5"
            >
              <span className="inline-flex items-center gap-2 min-w-0">
                <SeasonSymbolIcon seasonId={id} className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{item.shortLabel}</span>
                <span className="text-[10px] text-muted-foreground">
                  · {item.dateLabel}
                </span>
              </span>
              {mode === id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          South African Seasons
        </DropdownMenuLabel>
        {SEASON_BASELINE_IDS.map((id) => {
          const item = SEASON_THEMES[id];
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setMode(id)}
              className="cursor-pointer flex items-center justify-between text-xs py-1.5"
            >
              <span className="inline-flex items-center gap-2">
                <SeasonSymbolIcon seasonId={id} className="h-3.5 w-3.5 shrink-0" />
                <span>{item.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  · {item.dateLabel}
                </span>
              </span>
              {mode === id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
