import React from "react";
import { Check, ChevronDown } from "lucide-react";
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
import { cn } from "@/lib/utils";

const DRIFT_POINTS = [
  { left: "3%", top: "18%", size: 26, duration: 14, delay: 0, rotate: 12 },
  { left: "12%", top: "72%", size: 20, duration: 17, delay: 1.4, rotate: -25 },
  { left: "24%", top: "14%", size: 22, duration: 15, delay: 0.7, rotate: 35 },
  { left: "37%", top: "84%", size: 22, duration: 19, delay: 2.1, rotate: -15 },
  { left: "51%", top: "12%", size: 18, duration: 16, delay: 1.1, rotate: 20 },
  { left: "65%", top: "80%", size: 24, duration: 18, delay: 2.5, rotate: -30 },
  { left: "77%", top: "18%", size: 22, duration: 15, delay: 0.5, rotate: 18 },
  { left: "89%", top: "68%", size: 24, duration: 20, delay: 1.8, rotate: -12 },
  { left: "95%", top: "30%", size: 20, duration: 16, delay: 0.9, rotate: 28 },
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
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <g fill="#F43F6E">
            <ellipse cx="12" cy="5.5" rx="3.2" ry="4.4" />
            <ellipse cx="12" cy="5.5" rx="3.2" ry="4.4" transform="rotate(72 12 12)" />
            <ellipse cx="12" cy="5.5" rx="3.2" ry="4.4" transform="rotate(144 12 12)" />
            <ellipse cx="12" cy="5.5" rx="3.2" ry="4.4" transform="rotate(216 12 12)" />
            <ellipse cx="12" cy="5.5" rx="3.2" ry="4.4" transform="rotate(288 12 12)" />
          </g>
          <circle cx="12" cy="12" r="2.8" fill="#FBBF24" />
        </svg>
      );

    case "summer":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="4.8" fill="#F59E0B" />
          <g stroke="#EA580C" strokeWidth="2" strokeLinecap="round">
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
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 2L14.6 9.4L22 12L14.6 14.6L12 22L9.4 14.6L2 12L9.4 9.4L12 2Z"
            fill="#E11D48"
          />
          <circle cx="19" cy="5" r="1.6" fill="#F59E0B" />
          <circle cx="5" cy="19" r="1.4" fill="#10B981" />
        </svg>
      );

    case "autumn":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M19.5 4.5C13 4.5 6.5 7.8 5 14.5C4.5 16.7 5.5 18.5 7 19.5C13.7 18 19.5 12.5 19.5 4.5Z"
            fill="#EA580C"
          />
          <path
            d="M4 20L14.5 9.5"
            stroke="#9A3412"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case "winter":
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <g stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round">
            <line x1="12" y1="2.5" x2="12" y2="21.5" />
            <line x1="3.8" y1="7.2" x2="20.2" y2="16.8" />
            <line x1="20.2" y1="7.2" x2="3.8" y2="16.8" />
            <polyline points="9.5,5 12,7.2 14.5,5" />
            <polyline points="9.5,19 12,16.8 14.5,19" />
          </g>
          <circle cx="12" cy="12" r="2.2" fill="#F59E0B" />
        </svg>
      );
  }
}

/**
 * Spring Corner: Lush multi-petal cherry/peach blossoms, lavender jacaranda clusters & fresh garden leaves.
 */
function SpringBotanicalCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-60 md:h-60" : "w-56 h-56 md:w-80 md:h-80",
        flip && "rotate-180"
      )}
      style={{
        animation: "gentle-sway 9s ease-in-out infinite",
        transformOrigin: flip ? "bottom right" : "top left",
      }}
      aria-hidden="true"
    >
      {/* Botanical branches */}
      <path
        d="M-10 18 C 58 34, 122 76, 198 162 C 224 192, 246 224, 266 258"
        stroke="#15803D"
        strokeOpacity="0.48"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M64 48 C 112 32, 162 40, 214 68"
        stroke="#15803D"
        strokeOpacity="0.38"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M92 84 C 72 132, 80 178, 106 220"
        stroke="#15803D"
        strokeOpacity="0.36"
        strokeWidth="2.3"
        strokeLinecap="round"
      />

      {/* Fresh sage-emerald leaves */}
      <path d="M46 40 C 58 14, 88 12, 98 32 C 76 46, 58 48, 46 40 Z" fill="#22C55E" fillOpacity="0.46" />
      <path d="M132 46 C 150 22, 178 24, 186 44 C 164 56, 144 56, 132 46 Z" fill="#16A34A" fillOpacity="0.42" />
      <path d="M80 130 C 52 136, 46 164, 64 178 C 82 164, 88 146, 80 130 Z" fill="#22C55E" fillOpacity="0.42" />
      <path d="M154 124 C 178 106, 204 114, 208 136 C 186 144, 166 138, 154 124 Z" fill="#16A34A" fillOpacity="0.38" />

      {/* Main Blooming Flower 1 */}
      <g transform="translate(88, 72)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-20"
            rx="13.5"
            ry="19"
            transform={`rotate(${deg})`}
            fill="#FB7185"
            fillOpacity="0.62"
          />
        ))}
        {[36, 108, 180, 252, 324].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-13"
            rx="9"
            ry="13"
            transform={`rotate(${deg})`}
            fill="#F43F5E"
            fillOpacity="0.58"
          />
        ))}
        <circle cx="0" cy="0" r="8" fill="#FBBF24" />
        <circle cx="-2.5" cy="-2.5" r="2" fill="#FFFBEB" />
      </g>

      {/* Secondary Blossom 2 (Jacaranda Rose-Lilac) */}
      <g transform="translate(190, 68) scale(0.82)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-18"
            rx="12"
            ry="16.5"
            transform={`rotate(${deg})`}
            fill="#EC4899"
            fillOpacity="0.56"
          />
        ))}
        <circle cx="0" cy="0" r="7" fill="#F59E0B" />
      </g>

      {/* Tertiary Blossom 3 */}
      <g transform="translate(106, 184) scale(0.76)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-17"
            rx="11.5"
            ry="16"
            transform={`rotate(${deg})`}
            fill="#F472B6"
            fillOpacity="0.55"
          />
        ))}
        <circle cx="0" cy="0" r="6.5" fill="#FBBF24" />
      </g>

      {/* Fourth Mini Flower */}
      <g transform="translate(196, 166) scale(0.62)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-16"
            rx="11"
            ry="15"
            transform={`rotate(${deg})`}
            fill="#FB7185"
            fillOpacity="0.52"
          />
        ))}
        <circle cx="0" cy="0" r="6" fill="#FBBF24" />
      </g>

      {/* Spring Blossom Buds */}
      <ellipse cx="236" cy="204" rx="8" ry="12" transform="rotate(35 236 204)" fill="#F43F5E" fillOpacity="0.52" />
      <ellipse cx="252" cy="238" rx="6.5" ry="10" transform="rotate(25 252 238)" fill="#FB7185" fillOpacity="0.46" />
    </svg>
  );
}

/**
 * Summer Corner: Radiant golden sunbeams, citrus fruits, lush leaves & white citrus blossoms.
 */
function SummerCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-56 md:h-56" : "w-52 h-52 md:w-72 md:h-72",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <circle cx="26" cy="26" r="96" fill="#FBBF24" fillOpacity="0.24" />
      <circle cx="26" cy="26" r="56" fill="#F59E0B" fillOpacity="0.28" />
      <circle cx="26" cy="26" r="146" stroke="#F59E0B" strokeOpacity="0.34" strokeWidth="2" strokeDasharray="7 8" />
      <circle cx="26" cy="26" r="192" stroke="#0284C7" strokeOpacity="0.24" strokeWidth="1.6" strokeDasharray="4 9" />
      {[12, 30, 48, 66, 82].map((deg) => (
        <line
          key={deg}
          x1="26"
          y1="26"
          x2={26 + Math.cos((deg * Math.PI) / 180) * 220}
          y2={26 + Math.sin((deg * Math.PI) / 180) * 220}
          stroke="#F59E0B"
          strokeOpacity="0.32"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
      {/* Sun-ripened citrus accent */}
      <g transform="translate(132, 96)">
        <path d="M-8 -16 C 4 -30, 26 -26, 28 -10 C 12 -4, 0 -8, -8 -16 Z" fill="#16A34A" fillOpacity="0.5" />
        <circle cx="0" cy="4" r="18" fill="#FB923C" fillOpacity="0.58" />
        <circle cx="-5" cy="-1" r="4" fill="#FEF3C7" fillOpacity="0.7" />
      </g>
    </svg>
  );
}

/**
 * Festive Summer Corner: Evergreen pine boughs, ruby holly berries & golden stars.
 */
function FestiveCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-56 md:h-56" : "w-52 h-52 md:w-72 md:h-72",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <path d="M0 24 C 72 40, 138 82, 204 156" stroke="#15803D" strokeOpacity="0.48" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 36 C 66 12, 102 18, 108 42 C 82 52, 60 50, 44 36 Z" fill="#15803D" fillOpacity="0.46" />
      <path d="M98 70 C 124 48, 158 56, 162 80 C 136 88, 114 84, 98 70 Z" fill="#166534" fillOpacity="0.42" />
      <path d="M68 84 C 42 96, 40 128, 62 138 C 80 122, 82 102, 68 84 Z" fill="#15803D" fillOpacity="0.44" />
      {/* Ruby Holly Berries */}
      <circle cx="88" cy="68" r="8.5" fill="#E11D48" fillOpacity="0.78" />
      <circle cx="102" cy="76" r="7.5" fill="#BE123C" fillOpacity="0.78" />
      <circle cx="86" cy="84" r="7.5" fill="#F43F5E" fillOpacity="0.78" />
      {/* Golden Festive Stars */}
      <path d="M168 42L173 56L187 61L173 66L168 80L163 66L149 61L163 56L168 42Z" fill="#F59E0B" fillOpacity="0.68" />
      <path d="M124 144L128 154L138 158L128 162L124 172L120 162L110 158L120 154L124 144Z" fill="#FBBF24" fillOpacity="0.65" />
    </svg>
  );
}

/**
 * Autumn Corner: Copper, russet & golden harvest leaves + artisan wheat sprig.
 */
function AutumnCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-56 md:h-56" : "w-52 h-52 md:w-72 md:h-72",
        flip && "rotate-180"
      )}
      style={{
        animation: "gentle-sway 10s ease-in-out infinite",
        transformOrigin: flip ? "bottom right" : "top left",
      }}
      aria-hidden="true"
    >
      <path
        d="M-8 26 C 68 48, 134 94, 206 184"
        stroke="#9A3412"
        strokeOpacity="0.44"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {[
        { x: 58, y: 48, r: -22, c: "#EA580C", s: 1.15 },
        { x: 112, y: 76, r: 28, c: "#D97706", s: 1.1 },
        { x: 162, y: 122, r: -16, c: "#C2410C", s: 1.05 },
        { x: 82, y: 122, r: 46, c: "#E11D48", s: 0.92 },
        { x: 138, y: 168, r: 34, c: "#F59E0B", s: 0.9 },
      ].map((leaf, idx) => (
        <g key={idx} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}>
          <path
            d="M0 -22 C 16 -12, 18 10, 0 24 C -18 10, -16 -12, 0 -22 Z"
            fill={leaf.c}
            fillOpacity="0.52"
          />
          <line x1="0" y1="-18" x2="0" y2="22" stroke="#7C2D12" strokeOpacity="0.48" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Winter Corner: Crisp Azulejo cobalt snowflakes paired with warm golden bakery wheat.
 */
function WinterCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 280 280"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-56 md:h-56" : "w-52 h-52 md:w-72 md:h-72",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      <circle cx="28" cy="28" r="115" fill="#38BDF8" fillOpacity="0.16" />
      {/* Large Azulejo Snowflake */}
      <g transform="translate(78, 76)" stroke="#2563EB" strokeOpacity="0.46" strokeWidth="2.4" strokeLinecap="round">
        <line x1="0" y1="-32" x2="0" y2="32" />
        <line x1="-28" y1="-16" x2="28" y2="16" />
        <line x1="28" y1="-16" x2="-28" y2="16" />
        <circle cx="0" cy="0" r="6" fill="#F59E0B" fillOpacity="0.75" stroke="none" />
      </g>
      {/* Secondary Frost Crystal */}
      <g transform="translate(166, 62) scale(0.68)" stroke="#0284C7" strokeOpacity="0.42" strokeWidth="2.4" strokeLinecap="round">
        <line x1="0" y1="-28" x2="0" y2="28" />
        <line x1="-24" y1="-14" x2="24" y2="14" />
        <line x1="24" y1="-14" x2="-24" y2="14" />
      </g>
      {/* Warm Golden Bakery Wheat Stalk */}
      <path d="M24 116 C 68 142, 112 174, 152 214" stroke="#D97706" strokeOpacity="0.48" strokeWidth="2.5" strokeLinecap="round" />
      {[
        { x: 66, y: 142 },
        { x: 96, y: 164 },
        { x: 124, y: 188 },
      ].map((pt, idx) => (
        <g key={idx} transform={`translate(${pt.x}, ${pt.y}) rotate(-40)`}>
          <ellipse cx="-7" cy="0" rx="4.5" ry="10" fill="#F59E0B" fillOpacity="0.52" />
          <ellipse cx="7" cy="0" rx="4.5" ry="10" fill="#D97706" fillOpacity="0.52" />
        </g>
      ))}
    </svg>
  );
}

function DriftingParticle({ seasonId, index }: { seasonId: SASeasonId; index: number }) {
  if (seasonId === "spring") {
    if (index % 2 === 0) {
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="12"
              cy="5.8"
              rx="3.2"
              ry="4.8"
              transform={`rotate(${deg} 12 12)`}
              fill={index % 4 === 0 ? "#FB7185" : "#F472B6"}
              fillOpacity="0.65"
            />
          ))}
          <circle cx="12" cy="12" r="2.5" fill="#FBBF24" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path
          d="M10 2 C 15 5, 16 12, 10 18 C 4 12, 5 5, 10 2 Z"
          fill="#F43F5E"
          fillOpacity="0.52"
        />
      </svg>
    );
  }

  if (seasonId === "summer") {
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <circle cx="10" cy="10" r="4.8" fill="#F59E0B" fillOpacity="0.5" />
        <circle cx="10" cy="10" r="8.2" stroke="#FBBF24" strokeOpacity="0.45" strokeWidth="1.4" />
      </svg>
    );
  }

  if (seasonId === "festive_summer") {
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path
          d="M10 1L12.2 7.8L19 10L12.2 12.2L10 19L7.8 12.2L1 10L7.8 7.8L10 1Z"
          fill={index % 2 === 0 ? "#F59E0B" : "#E11D48"}
          fillOpacity="0.55"
        />
      </svg>
    );
  }

  if (seasonId === "autumn") {
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path
          d="M16 3C11 3 5.5 6 4 13C9 14.5 15 10 16 3Z"
          fill={index % 2 === 0 ? "#EA580C" : "#D97706"}
          fillOpacity="0.55"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
      <g stroke="#2563EB" strokeOpacity="0.48" strokeWidth="1.6" strokeLinecap="round">
        <line x1="10" y1="2" x2="10" y2="18" />
        <line x1="3" y1="6" x2="17" y2="14" />
        <line x1="17" y1="6" x2="3" y2="14" />
      </g>
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
  if (seasonId === "spring") return <SpringBotanicalCorner flip={flip} compact={compact} />;
  if (seasonId === "summer") return <SummerCorner flip={flip} compact={compact} />;
  if (seasonId === "festive_summer") return <FestiveCorner flip={flip} compact={compact} />;
  if (seasonId === "autumn") return <AutumnCorner flip={flip} compact={compact} />;
  return <WinterCorner flip={flip} compact={compact} />;
}

/**
 * Global ambient seasonal frame mounted once at the App root so EVERY screen
 * (Home, Menu, Order, TrackOrder, Login, Signup, and Admin) displays tasteful
 * corner botanicals/seasonal motifs in crisp light mode without blocking clicks.
 */
export function GlobalSeasonalFrame() {
  const { season } = useSeason();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
      {/* Top-Left & Bottom-Right Ambient Botanicals */}
      <div className="absolute top-14 -left-6 opacity-75">
        <SeasonCornerGraphic seasonId={season.id} compact />
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-75">
        <SeasonCornerGraphic seasonId={season.id} flip compact />
      </div>

      {/* Gentle Margin Drifting Petals / Leaves / Sun-Motes / Frost */}
      {DRIFT_POINTS.slice(0, 6).map((pt, i) => (
        <div
          key={`global-drift-${i}`}
          className="absolute opacity-75"
          style={{
            left: pt.left,
            top: pt.top,
            width: `${pt.size}px`,
            height: `${pt.size}px`,
            animation: `petal-drift ${pt.duration}s ease-in-out infinite`,
            animationDelay: `${pt.delay}s`,
          }}
        >
          <DriftingParticle seasonId={season.id} index={i} />
        </div>
      ))}
    </div>
  );
}

/**
 * Full-bleed decorative backdrop for FeaturedProducts, Menu Header, and Admin Banner.
 */
export function SeasonalSectionBackdrop({ seasonId }: { seasonId: SASeasonId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
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
          <div className="absolute top-4 left-0 right-0 h-px bg-amber-900/15" />
        </>
      )}

      <div className="absolute -top-4 -left-4 opacity-95">
        <SeasonCornerGraphic seasonId={seasonId} />
      </div>

      <div className="absolute -bottom-4 -right-4 opacity-95">
        <SeasonCornerGraphic seasonId={seasonId} flip />
      </div>

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
 * Atmospheric seasonal overlay for the Hero banner.
 */
export function SeasonalHeroAtmosphere({ seasonId }: { seasonId: SASeasonId }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]" aria-hidden="true">
      <div className="absolute top-16 -left-4 opacity-90">
        <SeasonCornerGraphic seasonId={seasonId} compact />
      </div>
      {DRIFT_POINTS.map((pt, i) => (
        <div
          key={`hero-drift-${i}`}
          className="absolute opacity-90"
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
 * Prominent Navbar badge showing the active South African season and letting
 * customers or staff preview all 5 seasonal palettes live in one click.
 */
export function SeasonBadgeControl() {
  const { mode, setMode, season, calendarSeasonId } = useSeason();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title="South African Seasonal Theme"
          className={cn(
            "inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border shadow-xs transition-all hover:opacity-90",
            season.pillClass
          )}
        >
          <SeasonSymbolIcon seasonId={season.id} className="h-3.5 w-3.5 shrink-0" />
          <span>{season.shortLabel}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover text-popover-foreground border border-border shadow-lg">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          SA Seasonal Theme (Auto Calendar)
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setMode("auto")}
          className="cursor-pointer flex items-center justify-between text-xs font-medium"
        >
          <span>Automatic ({SEASON_THEMES[calendarSeasonId].name})</span>
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
                <SeasonSymbolIcon seasonId={id} className="h-3.5 w-3.5" />
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
