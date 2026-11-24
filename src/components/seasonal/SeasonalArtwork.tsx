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
    case "freedom_day":
      // Stylized South African Flag Y-motif emblem
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="3.5" fill="#007A4D" />
          <path d="M9 4H22V9.5H13L9 4Z" fill="#E03C31" />
          <path d="M9 20H22V14.5H13L9 20Z" fill="#001489" />
          <path d="M2 7L8.5 12L2 17V7Z" fill="#111827" stroke="#FFB81C" strokeWidth="1.5" />
          <path d="M7.5 12H22" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );

    case "heritage_day":
      // Ndebele diamond emblem
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <polygon points="12,2 22,12 12,22 2,12" fill="#F59E0B" />
          <polygon points="12,5.5 18.5,12 12,18.5 5.5,12" fill="#DC2626" />
          <polygon points="12,9 15,12 12,15 9,12" fill="#047857" />
        </svg>
      );

    case "womens_day":
    case "mothers_day":
      // Crowned South African King Protea icon
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 3L15 10L20 6L18 15H6L4 6L9 10L12 3Z" fill="#DB2777" />
          <ellipse cx="12" cy="14.5" rx="5.5" ry="4" fill="#FBCFE8" />
          <path d="M8 18C10 20.5 14 20.5 16 18" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "valentines":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 20.5C12 20.5 3.5 15 3.5 8.8C3.5 5.9 5.8 3.8 8.4 3.8C10.1 3.8 11.4 4.7 12 5.8C12.6 4.7 13.9 3.8 15.6 3.8C18.2 3.8 20.5 5.9 20.5 8.8C20.5 15 12 20.5 12 20.5Z"
            fill="#E11D48"
          />
        </svg>
      );

    case "youth_day":
    case "mandela_day":
    case "new_year":
      // Rising South African sun + rays
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="13" r="5" fill="#F59E0B" />
          <g stroke="#EA580C" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="3" x2="12" y2="5.5" />
            <line x1="5" y1="6.5" x2="6.8" y2="8.3" />
            <line x1="19" y1="6.5" x2="17.2" y2="8.3" />
            <line x1="2.5" y1="13" x2="5" y2="13" />
            <line x1="19" y1="13" x2="21.5" y2="13" />
          </g>
          <path d="M3 19H21" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "human_rights_day":
    case "reconciliation_day":
    case "workers_day":
      // Olive & wheat branch symbol
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M5 19C9 14 14 9 19 5" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="9.5" cy="11" rx="2.2" ry="4" transform="rotate(-30 9.5 11)" fill="#10B981" />
          <ellipse cx="14.5" cy="7" rx="2.2" ry="4" transform="rotate(-30 14.5 7)" fill="#F59E0B" />
          <ellipse cx="13" cy="14.5" rx="2.2" ry="4" transform="rotate(55 13 14.5)" fill="#0D9488" />
        </svg>
      );

    case "easter":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3C8 3 5.5 8.5 5.5 13.5C5.5 17.8 8.4 20.8 12 20.8C15.6 20.8 18.5 17.8 18.5 13.5C18.5 8.5 16 3 12 3Z"
            fill="#8B5CF6"
          />
          <path d="M6.2 12.5Q12 9.5 17.8 12.5" stroke="#FBBF24" strokeWidth="2" fill="none" />
          <circle cx="12" cy="15.8" r="1.8" fill="#FDE68A" />
        </svg>
      );

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
 * Freedom Day Corner (27 April): Flowing South African Rainbow Nation ribbons + blooming King Protea.
 */
function FreedomDayCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-60 md:h-60" : "w-56 h-56 md:w-80 md:h-80",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      {/* Flowing SA Flag Color Ribbons */}
      <path d="M-12 18 C 70 24, 150 68, 248 168" stroke="#007A4D" strokeOpacity="0.46" strokeWidth="10" strokeLinecap="round" />
      <path d="M-12 34 C 66 40, 142 84, 234 182" stroke="#FFB81C" strokeOpacity="0.52" strokeWidth="6" strokeLinecap="round" />
      <path d="M18 -10 C 48 64, 98 130, 198 220" stroke="#E03C31" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
      <path d="M-10 62 C 56 76, 118 122, 186 212" stroke="#001489" strokeOpacity="0.34" strokeWidth="5" strokeLinecap="round" />

      {/* Crowned South African King Protea */}
      <g transform="translate(106, 94)">
        {[-52, -26, 0, 26, 52].map((deg) => (
          <path
            key={deg}
            d="M0 0 L-12 -42 L0 -56 L12 -42 Z"
            transform={`rotate(${deg})`}
            fill={Math.abs(deg) === 26 ? "#FFB81C" : "#E03C31"}
            fillOpacity="0.62"
          />
        ))}
        <ellipse cx="0" cy="-12" rx="24" ry="18" fill="#FEF3C7" fillOpacity="0.88" />
        <path d="M-26 -4 C -14 18, 14 18, 26 -4 Z" fill="#007A4D" fillOpacity="0.68" />
      </g>

      {/* Celebratory Rainbow Stars */}
      <path d="M204 58L209 70L221 75L209 80L204 92L199 80L187 75L199 70L204 58Z" fill="#FFB81C" fillOpacity="0.7" />
      <circle cx="64" cy="168" r="6" fill="#007A4D" fillOpacity="0.5" />
    </svg>
  );
}

/**
 * Heritage Day Corner (24 September): Ndebele geometric triangles/diamonds + golden artisan wheat.
 */
function HeritageDayCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      className={cn(
        "pointer-events-none select-none",
        compact ? "w-44 h-44 md:w-60 md:h-60" : "w-56 h-56 md:w-80 md:h-80",
        flip && "rotate-180"
      )}
      aria-hidden="true"
    >
      {/* Ndebele Geometric Chevrons & Diamonds */}
      <g opacity="0.58">
        <polygon points="0,0 74,0 0,74" fill="#F59E0B" />
        <polygon points="74,0 132,0 74,58" fill="#DC2626" />
        <polygon points="132,0 184,0 132,52" fill="#047857" />
        <polygon points="0,74 58,74 0,132" fill="#1D4ED8" />
        <polygon points="56,56 96,96 56,136 16,96" fill="#D97706" stroke="#78350F" strokeWidth="2.5" />
        <polygon points="56,74 78,96 56,118 34,96" fill="#FEF3C7" />
      </g>

      {/* Warm Artisan Bakery Wheat Sheaf */}
      <path d="M74 114 C 122 146, 166 184, 212 232" stroke="#B45309" strokeOpacity="0.52" strokeWidth="3" strokeLinecap="round" />
      {[
        { x: 112, y: 142 },
        { x: 142, y: 168 },
        { x: 172, y: 196 },
      ].map((pt, idx) => (
        <g key={idx} transform={`translate(${pt.x}, ${pt.y}) rotate(-42)`}>
          <ellipse cx="-8" cy="0" rx="5" ry="11" fill="#F59E0B" fillOpacity="0.62" />
          <ellipse cx="8" cy="0" rx="5" ry="11" fill="#D97706" fillOpacity="0.62" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Women's Day & Mother's Day Corner: Blooming South African King Protea + botanical sage & peonies.
 */
function KingProteaCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
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
        animation: "gentle-sway 9.5s ease-in-out infinite",
        transformOrigin: flip ? "bottom right" : "top left",
      }}
      aria-hidden="true"
    >
      <path d="M-10 22 C 64 42, 132 88, 212 178" stroke="#15803D" strokeOpacity="0.45" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M44 64 C 24 96, 34 134, 64 148 C 78 124, 72 90, 44 64 Z" fill="#16A34A" fillOpacity="0.42" />
      <path d="M138 42 C 166 22, 198 30, 206 56 C 180 68, 154 62, 138 42 Z" fill="#15803D" fillOpacity="0.4" />

      {/* Large Regal King Protea */}
      <g transform="translate(104, 96)">
        {[-64, -42, -20, 0, 20, 42, 64].map((deg) => (
          <path
            key={deg}
            d="M0 4 L-11 -44 L0 -60 L11 -44 Z"
            transform={`rotate(${deg})`}
            fill={Math.abs(deg) % 40 === 0 ? "#DB2777" : "#F472B6"}
            fillOpacity="0.65"
          />
        ))}
        <ellipse cx="0" cy="-14" rx="26" ry="19" fill="#FDF2F8" fillOpacity="0.9" />
        <ellipse cx="0" cy="-14" rx="18" ry="12" fill="#FBCFE8" fillOpacity="0.85" />
        <path d="M-28 -2 C -14 22, 14 22, 28 -2 Z" fill="#15803D" fillOpacity="0.58" />
      </g>

      {/* Secondary Orchid / Rose Bud */}
      <g transform="translate(194, 134) scale(0.74)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-16" rx="11" ry="15" transform={`rotate(${deg})`} fill="#EC4899" fillOpacity="0.55" />
        ))}
        <circle cx="0" cy="0" r="6.5" fill="#FBBF24" />
      </g>
    </svg>
  );
}

/**
 * Youth Day, Mandela Day & New Year Corner: Radiant South African sunrise, Ubuntu olive sprigs & golden sparks.
 */
function UbuntuSunriseCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
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
      <circle cx="24" cy="24" r="102" fill="#FBBF24" fillOpacity="0.24" />
      <circle cx="24" cy="24" r="60" fill="#F59E0B" fillOpacity="0.3" />
      {[10, 26, 42, 58, 74, 86].map((deg) => (
        <line
          key={deg}
          x1="24"
          y1="24"
          x2={24 + Math.cos((deg * Math.PI) / 180) * 225}
          y2={24 + Math.sin((deg * Math.PI) / 180) * 225}
          stroke="#EA580C"
          strokeOpacity="0.34"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      ))}
      {/* Peace Olive Branch */}
      <path d="M58 134 C 108 148, 154 176, 196 216" stroke="#047857" strokeOpacity="0.5" strokeWidth="2.8" strokeLinecap="round" />
      <ellipse cx="106" cy="144" rx="6" ry="13" transform="rotate(-48 106 144)" fill="#10B981" fillOpacity="0.55" />
      <ellipse cx="144" cy="168" rx="6" ry="13" transform="rotate(-42 144 168)" fill="#059669" fillOpacity="0.55" />
      <path d="M178 58L183 70L195 75L183 80L178 92L173 80L161 75L173 70L178 58Z" fill="#F59E0B" fillOpacity="0.72" />
    </svg>
  );
}

/**
 * Human Rights Day, Reconciliation Day & Workers' Day Corner: Olive branches, harmony arcs & golden wheat.
 */
function HarmonyOliveCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
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
      <circle cx="30" cy="30" r="126" stroke="#0D9488" strokeOpacity="0.28" strokeWidth="2" strokeDasharray="6 8" />
      <path d="M-6 28 C 66 46, 134 92, 206 176" stroke="#0F766E" strokeOpacity="0.48" strokeWidth="3.2" strokeLinecap="round" />
      {[
        { x: 58, y: 48, r: -35, c: "#14B8A6" },
        { x: 98, y: 74, r: 38, c: "#0D9488" },
        { x: 136, y: 108, r: -30, c: "#F59E0B" },
        { x: 170, y: 142, r: 34, c: "#10B981" },
      ].map((lf, i) => (
        <ellipse
          key={i}
          cx={lf.x}
          cy={lf.y}
          rx="7"
          ry="16"
          transform={`rotate(${lf.r} ${lf.x} ${lf.y})`}
          fill={lf.c}
          fillOpacity="0.54"
        />
      ))}
    </svg>
  );
}

/**
 * Easter & Family Day Corner: Pastel violet/gold blossoms & festive Easter motifs.
 */
function EasterBlossomCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
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
      <path d="M-8 24 C 66 42, 136 86, 208 172" stroke="#16A34A" strokeOpacity="0.44" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(88, 76)">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse key={deg} cx="0" cy="-18" rx="10" ry="16" transform={`rotate(${deg})`} fill="#A78BFA" fillOpacity="0.62" />
        ))}
        <circle cx="0" cy="0" r="8" fill="#FBBF24" />
      </g>
      {/* Decorative Folar / Easter Egg Ornament */}
      <g transform="translate(166, 98) rotate(18)">
        <path
          d="M0 -22 C -14 -22, -20 -4, -20 8 C -20 20, -11 28, 0 28 C 11 28, 20 20, 20 8 C 20 -4, 14 -22, 0 -22 Z"
          fill="#F59E0B"
          fillOpacity="0.56"
        />
        <path d="M-18 4 Q 0 -6 18 4" stroke="#7C3AED" strokeWidth="3" fill="none" />
      </g>
    </svg>
  );
}

/**
 * Valentine's Corner: Velvet crimson botanical roses & floating sweetheart petals.
 */
function ValentinesRoseCorner({ flip = false, compact = false }: { flip?: boolean; compact?: boolean }) {
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
      <path d="M-8 22 C 64 42, 132 88, 198 168" stroke="#15803D" strokeOpacity="0.44" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(88, 76)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-18" rx="13" ry="17" transform={`rotate(${deg})`} fill="#E11D48" fillOpacity="0.62" />
        ))}
        <circle cx="0" cy="0" r="10" fill="#BE123C" fillOpacity="0.72" />
      </g>
      <path
        d="M172 96C172 96 150 82 150 67C150 59 156 54 163 54C167.5 54 170.5 56.5 172 59.5C173.5 56.5 176.5 54 181 54C188 54 194 59 194 67C194 82 172 96 172 96Z"
        fill="#FB7185"
        fillOpacity="0.62"
      />
    </svg>
  );
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
      <path
        d="M-10 18 C 58 34, 122 76, 198 162 C 224 192, 246 224, 266 258"
        stroke="#15803D"
        strokeOpacity="0.48"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M64 48 C 112 32, 162 40, 214 68" stroke="#15803D" strokeOpacity="0.38" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M92 84 C 72 132, 80 178, 106 220" stroke="#15803D" strokeOpacity="0.36" strokeWidth="2.3" strokeLinecap="round" />

      <path d="M46 40 C 58 14, 88 12, 98 32 C 76 46, 58 48, 46 40 Z" fill="#22C55E" fillOpacity="0.46" />
      <path d="M132 46 C 150 22, 178 24, 186 44 C 164 56, 144 56, 132 46 Z" fill="#16A34A" fillOpacity="0.42" />
      <path d="M80 130 C 52 136, 46 164, 64 178 C 82 164, 88 146, 80 130 Z" fill="#22C55E" fillOpacity="0.42" />

      <g transform="translate(88, 72)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-20" rx="13.5" ry="19" transform={`rotate(${deg})`} fill="#FB7185" fillOpacity="0.62" />
        ))}
        {[36, 108, 180, 252, 324].map((deg) => (
          <ellipse key={deg} cx="0" cy="-13" rx="9" ry="13" transform={`rotate(${deg})`} fill="#F43F5E" fillOpacity="0.58" />
        ))}
        <circle cx="0" cy="0" r="8" fill="#FBBF24" />
      </g>

      <g transform="translate(190, 68) scale(0.82)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="0" cy="-18" rx="12" ry="16.5" transform={`rotate(${deg})`} fill="#EC4899" fillOpacity="0.56" />
        ))}
        <circle cx="0" cy="0" r="7" fill="#F59E0B" />
      </g>
    </svg>
  );
}

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
      <g transform="translate(132, 96)">
        <path d="M-8 -16 C 4 -30, 26 -26, 28 -10 C 12 -4, 0 -8, -8 -16 Z" fill="#16A34A" fillOpacity="0.5" />
        <circle cx="0" cy="4" r="18" fill="#FB923C" fillOpacity="0.58" />
      </g>
    </svg>
  );
}

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
      <circle cx="88" cy="68" r="8.5" fill="#E11D48" fillOpacity="0.78" />
      <circle cx="102" cy="76" r="7.5" fill="#BE123C" fillOpacity="0.78" />
      <circle cx="86" cy="84" r="7.5" fill="#F43F5E" fillOpacity="0.78" />
      <path d="M168 42L173 56L187 61L173 66L168 80L163 66L149 61L163 56L168 42Z" fill="#F59E0B" fillOpacity="0.68" />
    </svg>
  );
}

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
      <path d="M-8 26 C 68 48, 134 94, 206 184" stroke="#9A3412" strokeOpacity="0.44" strokeWidth="3" strokeLinecap="round" />
      {[
        { x: 58, y: 48, r: -22, c: "#EA580C", s: 1.15 },
        { x: 112, y: 76, r: 28, c: "#D97706", s: 1.1 },
        { x: 162, y: 122, r: -16, c: "#C2410C", s: 1.05 },
        { x: 82, y: 122, r: 46, c: "#E11D48", s: 0.92 },
      ].map((leaf, idx) => (
        <g key={idx} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r}) scale(${leaf.s})`}>
          <path d="M0 -22 C 16 -12, 18 10, 0 24 C -18 10, -16 -12, 0 -22 Z" fill={leaf.c} fillOpacity="0.52" />
          <line x1="0" y1="-18" x2="0" y2="22" stroke="#7C2D12" strokeOpacity="0.48" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

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
      <g transform="translate(78, 76)" stroke="#2563EB" strokeOpacity="0.46" strokeWidth="2.4" strokeLinecap="round">
        <line x1="0" y1="-32" x2="0" y2="32" />
        <line x1="-28" y1="-16" x2="28" y2="16" />
        <line x1="28" y1="-16" x2="-28" y2="16" />
        <circle cx="0" cy="0" r="6" fill="#F59E0B" fillOpacity="0.75" stroke="none" />
      </g>
      <path d="M24 116 C 68 142, 112 174, 152 214" stroke="#D97706" strokeOpacity="0.48" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function DriftingParticle({ seasonId, index }: { seasonId: SASeasonId; index: number }) {
  if (seasonId === "freedom_day") {
    const saColors = ["#007A4D", "#FFB81C", "#E03C31", "#001489"];
    const fill = saColors[index % saColors.length];
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path d="M10 1L12.3 7.7L19 10L12.3 12.3L10 19L7.7 12.3L1 10L7.7 7.7L10 1Z" fill={fill} fillOpacity="0.58" />
      </svg>
    );
  }

  if (seasonId === "heritage_day") {
    const ndebeleColors = ["#F59E0B", "#DC2626", "#047857", "#1D4ED8"];
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <polygon points="10,2 18,10 10,18 2,10" fill={ndebeleColors[index % ndebeleColors.length]} fillOpacity="0.52" />
      </svg>
    );
  }

  if (seasonId === "valentines") {
    return (
      <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
        <path
          d="M12 20C12 20 4 14.8 4 9C4 6.2 6.2 4.2 8.7 4.2C10.3 4.2 11.5 5 12 6C12.5 5 13.7 4.2 15.3 4.2C17.8 4.2 20 6.2 20 9C20 14.8 12 20 12 20Z"
          fill={index % 2 === 0 ? "#E11D48" : "#FB7185"}
          fillOpacity="0.52"
        />
      </svg>
    );
  }

  if (seasonId === "spring" || seasonId === "womens_day" || seasonId === "mothers_day" || seasonId === "easter") {
    const petalColor =
      seasonId === "easter"
        ? "#8B5CF6"
        : index % 2 === 0
        ? "#EC4899"
        : "#FB7185";
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
            fill={petalColor}
            fillOpacity="0.6"
          />
        ))}
        <circle cx="12" cy="12" r="2.5" fill="#FBBF24" />
      </svg>
    );
  }

  if (seasonId === "summer" || seasonId === "youth_day" || seasonId === "mandela_day" || seasonId === "new_year") {
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

  if (
    seasonId === "autumn" ||
    seasonId === "workers_day" ||
    seasonId === "human_rights_day" ||
    seasonId === "reconciliation_day"
  ) {
    const leafFill =
      seasonId === "human_rights_day" || seasonId === "reconciliation_day"
        ? "#0D9488"
        : "#EA580C";
    return (
      <svg viewBox="0 0 20 20" className="w-full h-full" fill="none">
        <path d="M16 3C11 3 5.5 6 4 13C9 14.5 15 10 16 3Z" fill={leafFill} fillOpacity="0.52" />
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
  switch (seasonId) {
    case "freedom_day":
      return <FreedomDayCorner flip={flip} compact={compact} />;
    case "heritage_day":
      return <HeritageDayCorner flip={flip} compact={compact} />;
    case "womens_day":
    case "mothers_day":
      return <KingProteaCorner flip={flip} compact={compact} />;
    case "youth_day":
    case "mandela_day":
    case "new_year":
      return <UbuntuSunriseCorner flip={flip} compact={compact} />;
    case "human_rights_day":
    case "reconciliation_day":
    case "workers_day":
      return <HarmonyOliveCorner flip={flip} compact={compact} />;
    case "easter":
      return <EasterBlossomCorner flip={flip} compact={compact} />;
    case "valentines":
      return <ValentinesRoseCorner flip={flip} compact={compact} />;
    case "spring":
      return <SpringBotanicalCorner flip={flip} compact={compact} />;
    case "summer":
      return <SummerCorner flip={flip} compact={compact} />;
    case "festive_summer":
      return <FestiveCorner flip={flip} compact={compact} />;
    case "autumn":
      return <AutumnCorner flip={flip} compact={compact} />;
    case "winter":
    default:
      return <WinterCorner flip={flip} compact={compact} />;
  }
}

/**
 * Global ambient seasonal/SA-event frame mounted once at the App root so EVERY screen
 * displays tasteful Light-Mode botanicals & South African event motifs without blocking clicks.
 */
export function GlobalSeasonalFrame() {
  const { season } = useSeason();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
      <div className="absolute top-14 -left-6 opacity-75">
        <SeasonCornerGraphic seasonId={season.id} compact />
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-75">
        <SeasonCornerGraphic seasonId={season.id} flip compact />
      </div>

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
                  backgroundColor:
                    i % 3 === 0 ? "#E11D48" : i % 3 === 1 ? "#F59E0B" : "#10B981",
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
