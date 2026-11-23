import React from "react";
import { Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SASeasonId, SEASON_ORDER, SEASON_THEMES } from "@/utils/seasons";
import { useSeason } from "@/contexts/SeasonContext";

// Deterministic floating particle coordinates (never randomizes on re-render)
const DRIFT_POINTS = [
  { left: "4%", top: "16%", size: 22, duration: 15, delay: 0, rotate: 12 },
  { left: "14%", top: "74%", size: 18, duration: 18, delay: 1.4, rotate: -25 },
  { left: "26%", top: "12%", size: 16, duration: 16, delay: 0.7, rotate: 35 },
  { left: "38%", top: "86%", size: 20, duration: 20, delay: 2.1, rotate: -15 },
  { left: "52%", top: "10%", size: 15, duration: 17, delay: 1.1, rotate: 20 },
  { left: "66%", top: "82%", size: 22, duration: 19, delay: 2.5, rotate: -30 },
  { left: "78%", top: "18%", size: 18, duration: 16, delay: 0.5, rotate: 18 },
  { left: "88%", top: "68%", size: 20, duration: 21, delay: 1.8, rotate: -12 },
  { left: "94%", top: "28%", size: 16, duration: 17, delay: 0.9, rotate: 28 },
];

export function SeasonSymbolIcon({
  seasonId,
  className = "h-4 w-4",
}: {
  seasonId: SASeasonId;
  className?: string;
}) {
  switch (seasonId) {
    case "spring":
      // 5-petal blossom flower with golden center
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <g fill="currentColor" opacity="0.9">
            <ellipse cx="12" cy="5.5" rx="3.1" ry="4.2" />
            <ellipse cx="12" cy="5.5" rx="3.1" ry="4.2" transform="rotate(72 12 12)" />
            <ellipse cx="12" cy="5.5" rx="3.1" ry="4.2" transform="rotate(144 12 12)" />
            <ellipse cx="12" cy="5.5" rx="3.1" ry="4.2" transform="rotate(216 12 12)" />
            <ellipse cx="12" cy="5.5" rx="3.1" ry="4.2" transform="rotate(288 12 12)" />
          </g>
          <circle cx="12" cy="12" r="2.6" fill="#FBBF24" />
        </svg>
      );

    case "summer":
      // Radiant sun
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="4.5" />
            <line x1="12" y1="19.5" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4.5" y2="12" />
            <line x1="19.5" y1="12" x2="22" y2="12" />
            <line x1="4.9" y1="4.9" x2="6.7" y2="6.7" />
            <line x1="17.3" y1="17.3" x2="19.1" y2="19.1" />
            <line x1="19.1" y1="4.9" x2="17.3" y2="6.7" />
            <line x1="6.7" y1="17.3" x2="4.9" y2="19.1" />
          </g>
        </svg>
      );

    case "festive_summer":
      // 4-point faceted festive star
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z"
            fill="currentColor"
          />
          <circle cx="19" cy="5" r="1.3" fill="#FBBF24" />
          <circle cx="5" cy="19" r="1.1" fill="#FBBF24" />
        </svg>
      );

    case "autumn":
      // Botanical leaf
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M19.5 4.5C13 4.5 6.5 7.8 5 14.5C4.5 16.7 5.5 18.5 7 19.5C13.7 18 19.5 12.5 19.5 4.5Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M4 20L14.5 9.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "winter":
    default:
      // Artisan wheat & warm hearth glow
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 21V6M12 9C9.5 9 8 7.3 8 5.2C10.2 5.2 12 6.8 12 9ZM12 9C14.5 9 16 7.3 16 5.2C13.8 5.2 12 6.8 12 9ZM12 13.5C9.5 13.5 8 11.8 8 9.7C10.2 9.7 12 11.3 12 13.5ZM12 13.5C14.5 13.5 16 11.8 16 9.7C13.8 9.7 12 11.3 12 13.5ZM12 18C9.5 18 8 16.3 8 14.2C10.2 14.2 12 15.8 12 18ZM12 18C14.5 18 16 16.3 16 14.2C13.8 14.2 12 15.8 12 18Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

/**
 * Corner botanical sprig for Spring: multi-petal rose/almond blossoms, buds, and sage foliage.
 */
function SpringBotanicalCorner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={`w-52 h-52 md:w-72 md:h-72 pointer-events-none select-none ${
        flip ? "rotate-180" : ""
      }`}
      style={{ animation: "gentle-sway 9s ease-in-out infinite", transformOrigin: flip ? "bottom right" : "top left" }}
      aria-hidden="true"
    >
      {/* Curved botanical branch */}
      <path
        d="M-10 20 C 55 35, 115 75, 185 155 C 210 185, 232 215, 250 245"
        stroke="#2E7D5B"
        strokeOpacity="0.32"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M68 52 C 110 38, 152 44, 195 66"
        stroke="#2E7D5B"
        strokeOpacity="0.26"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M95 82 C 75 125, 82 168, 104 205"
        stroke="#2E7D5B"
        strokeOpacity="0.24"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Sage botanical leaves */}
      <path d="M52 42 C 62 18, 90 16, 98 34 C 78 46, 62 48, 52 42 Z" fill="#3B9B6E" fillOpacity="0.26" />
      <path d="M132 48 C 148 26, 174 28, 180 46 C 160 56, 142 56, 132 48 Z" fill="#3B9B6E" fillOpacity="0.24" />
      <path d="M84 128 C 58 134, 52 158, 68 170 C 84 158, 90 142, 84 128 Z" fill="#3B9B6E" fillOpacity="0.24" />
      <path d="M152 122 C 174 106, 198 114, 200 134 C 180 140, 162 134, 152 122 Z" fill="#3B9B6E" fillOpacity="0.22" />

      {/* Main Hero Blossom 1 */}
      <g transform="translate(88, 72)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-18"
            rx="12"
            ry="17"
            transform={`rotate(${deg})`}
            fill="#F43F6E"
            fillOpacity="0.24"
          />
        ))}
        {[36, 108, 180, 252, 324].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-12"
            rx="8"
            ry="12"
            transform={`rotate(${deg})`}
            fill="#FB7185"
            fillOpacity="0.32"
          />
        ))}
        <circle cx="0" cy="0" r="7" fill="#FBBF24" fillOpacity="0.65" />
        <circle cx="-3" cy="-3" r="1.5" fill="#FFFBEB" fillOpacity="0.8" />
      </g>

      {/* Secondary Blossom 2 */}
      <g transform="translate(182, 68) scale(0.75)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-16"
            rx="11"
            ry="15"
            transform={`rotate(${deg})`}
            fill="#EC4899"
            fillOpacity="0.24"
          />
        ))}
        <circle cx="0" cy="0" r="6" fill="#F59E0B" fillOpacity="0.6" />
      </g>

      {/* Tertiary Blossom 3 */}
      <g transform="translate(106, 178) scale(0.68)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-16"
            rx="11"
            ry="15"
            transform={`rotate(${deg})`}
            fill="#F43F6E"
            fillOpacity="0.22"
          />
        ))}
        <circle cx="0" cy="0" r="6" fill="#FBBF24" fillOpacity="0.6" />
      </g>

      {/* Delicate Blossom Buds */}
      <ellipse cx="215" cy="172" rx="7" ry="11" transform="rotate(35 215 172)" fill="#FB7185" fillOpacity="0.3" />
      <ellipse cx="232" cy="212" rx="6" ry="9" transform="rotate(25 232 212)" fill="#F43F6E" fillOpacity="0.25" />
    </svg>
  );
}

function SummerCorner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      className={`w-48 h-48 md:w-64 md:h-64 pointer-events-none select-none ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="95" fill="#F59E0B" fillOpacity="0.10" />
      <circle cx="24" cy="24" r="145" stroke="#F59E0B" strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="6 8" />
      <circle cx="24" cy="24" r="190" stroke="#0284C7" strokeOpacity="0.12" strokeWidth="1.2" strokeDasharray="3 9" />
      {[15, 35, 55, 75].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="24"
          x2={24 + Math.cos((deg * Math.PI) / 180) * 210}
          y2={24 + Math.sin((deg * Math.PI) / 180) * 210}
          stroke="#F59E0B"
          strokeOpacity="0.14"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function AutumnCorner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      className={`w-48 h-48 md:w-64 md:h-64 pointer-events-none select-none ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M0 30 C 70 50, 130 95, 190 175"
        stroke="#C2410C"
        strokeOpacity="0.25"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {[
        { x: 58, y: 48, r: -20, c: "#EA580C" },
        { x: 105, y: 78, r: 25, c: "#D97706" },
        { x: 148, y: 118, r: -15, c: "#B45309" },
        { x: 82, y: 115, r: 45, c: "#C2410C" },
      ].map((leaf, idx) => (
        <g key={idx} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r})`}>
          <path
            d="M0 -18 C 14 -10, 16 8, 0 20 C -16 8, -14 -10, 0 -18 Z"
            fill={leaf.c}
            fillOpacity="0.22"
          />
          <line x1="0" y1="-15" x2="0" y2="18" stroke={leaf.c} strokeOpacity="0.35" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  );
}

function WinterCorner({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 260 260"
      fill="none"
      className={`w-48 h-48 md:w-64 md:h-64 pointer-events-none select-none ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="120" fill="#B45309" fillOpacity="0.08" />
      <path
        d="M15 15 C 65 55, 120 110, 165 180"
        stroke="#92400E"
        strokeOpacity="0.24"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {[55, 90, 125, 155].map((d, idx) => (
        <g key={idx} transform={`translate(${d}, ${d}) rotate(-45)`}>
          <ellipse cx="-8" cy="0" rx="5" ry="11" fill="#B45309" fillOpacity="0.22" />
          <ellipse cx="8" cy="0" rx="5" ry="11" fill="#D97706" fillOpacity="0.22" />
        </g>
      ))}
    </svg>
  );
}

function DriftingParticle({ seasonId, index }: { seasonId: SASeasonId; index: number }) {
  if (seasonId === "spring") {
    // Alternating blossom petal and mini flower
    if (index % 3 === 0) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="12"
              cy="6"
              rx="3"
              ry="4.5"
              transform={`rotate(${deg} 12 12)`}
              fill="#FB7185"
              fillOpacity="0.45"
            />
          ))}
          <circle cx="12" cy="12" r="2.2" fill="#FBBF24" fillOpacity="0.7" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path
          d="M10 2 C 15 5, 16 12, 10 18 C 4 12, 5 5, 10 2 Z"
          fill={index % 2 === 0 ? "#F43F6E" : "#FDA4AF"}
          fillOpacity="0.38"
        />
      </svg>
    );
  }

  if (seasonId === "summer") {
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <circle cx="10" cy="10" r="4.5" fill="#F59E0B" fillOpacity="0.32" />
        <circle cx="10" cy="10" r="8" stroke="#FBBF24" strokeOpacity="0.25" strokeWidth="1.2" />
      </svg>
    );
  }

  if (seasonId === "festive_summer") {
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path
          d="M10 1L12 8L19 10L12 12L10 19L8 12L1 10L8 8L10 1Z"
          fill={index % 2 === 0 ? "#F59E0B" : "#E11D48"}
          fillOpacity="0.35"
        />
      </svg>
    );
  }

  if (seasonId === "autumn") {
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path
          d="M16 3C11 3 5.5 6 4 12C8.5 13.5 14.5 9.5 16 3Z"
          fill={index % 2 === 0 ? "#EA580C" : "#D97706"}
          fillOpacity="0.35"
        />
      </svg>
    );
  }

  // Winter warm golden hearth motes
  return (
    <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
      <circle cx="10" cy="10" r="3.5" fill="#D97706" fillOpacity="0.28" />
    </svg>
  );
}

/**
 * Full-bleed decorative backdrop for FeaturedProducts & seasonal sections.
 */
export function SeasonalSectionBackdrop({ seasonId }: { seasonId: SASeasonId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Festive warm champagne string lights (Dec 10–31 only) */}
      {seasonId === "festive_summer" && (
        <>
          <div className="absolute top-0 left-0 right-0 h-8 flex items-center justify-around z-10">
            {[...Array(18)].map((_, i) => (
              <div
                key={`light-${i}`}
                className="w-2.5 h-2.5 rounded-full animate-pulse shadow-md"
                style={{
                  backgroundColor: i % 3 === 0 ? "#E11D48" : i % 3 === 1 ? "#F59E0B" : "#10B981",
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.9s",
                }}
              />
            ))}
          </div>
          <div className="absolute top-4 left-0 right-0 h-px bg-amber-900/15 dark:bg-amber-300/20" />
        </>
      )}

      {/* Corner Botanical / Seasonal Vector Artwork */}
      <div className="absolute -top-4 -left-4 opacity-90 dark:opacity-55">
        {seasonId === "spring" && <SpringBotanicalCorner />}
        {seasonId === "summer" && <SummerCorner />}
        {seasonId === "festive_summer" && <SummerCorner />}
        {seasonId === "autumn" && <AutumnCorner />}
        {seasonId === "winter" && <WinterCorner />}
      </div>

      <div className="absolute -bottom-4 -right-4 opacity-90 dark:opacity-55">
        {seasonId === "spring" && <SpringBotanicalCorner flip />}
        {seasonId === "summer" && <SummerCorner flip />}
        {seasonId === "festive_summer" && <SummerCorner flip />}
        {seasonId === "autumn" && <AutumnCorner flip />}
        {seasonId === "winter" && <WinterCorner flip />}
      </div>

      {/* Gentle Drifting Vector Particles */}
      {DRIFT_POINTS.map((pt, i) => (
        <div
          key={`drift-${i}`}
          className="absolute"
          style={{
            left: pt.left,
            top: pt.top,
            width: `${pt.size}px`,
            height: `${pt.size}px`,
            animation: `petal-drift ${pt.duration}s ease-in-out infinite`,
            animationDelay: `${pt.delay}s`,
            transform: `rotate(${pt.rotate}deg)`,
          }}
        >
          <DriftingParticle seasonId={seasonId} index={i} />
        </div>
      ))}
    </div>
  );
}

/**
 * Subtle atmospheric overlay for the Hero banner.
 */
export function SeasonalHeroAtmosphere({ seasonId }: { seasonId: SASeasonId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]" aria-hidden="true">
      {DRIFT_POINTS.slice(0, 6).map((pt, i) => (
        <div
          key={`hero-drift-${i}`}
          className="absolute opacity-80"
          style={{
            left: pt.left,
            top: pt.top,
            width: `${pt.size + 4}px`,
            height: `${pt.size + 4}px`,
            animation: `petal-drift ${pt.duration + 2}s ease-in-out infinite`,
            animationDelay: `${pt.delay}s`,
          }}
        >
          <DriftingParticle seasonId={seasonId} index={i} />
        </div>
      ))}
    </div>
  );
}

/**
 * Compact, professional Navbar badge showing the active season and allowing
 * instant previewing of all 5 seasonal palettes (defaults to Automatic Calendar).
 */
export function SeasonBadgeControl() {
  const { mode, setMode, season, calendarSeasonId } = useSeason();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="Seasonal Theme"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-xs font-medium border border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
        >
          <SeasonSymbolIcon seasonId={season.id} className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden sm:inline">{season.shortLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-popover text-popover-foreground border border-border shadow-lg">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Bakery Seasonal Theme
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setMode("auto")}
          className="cursor-pointer flex items-center justify-between text-xs"
        >
          <span>Automatic ({SEASON_THEMES[calendarSeasonId].shortLabel})</span>
          {mode === "auto" && <Check className="h-3.5 w-3.5 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {SEASON_ORDER.map((id) => {
          const item = SEASON_THEMES[id];
          return (
            <DropdownMenuItem
              key={id}
              onClick={() => setMode(id)}
              className="cursor-pointer flex items-center justify-between text-xs"
            >
              <span className="inline-flex items-center gap-2">
                <SeasonSymbolIcon seasonId={id} className="h-3.5 w-3.5 text-primary" />
                {item.name}
              </span>
              {mode === id && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
