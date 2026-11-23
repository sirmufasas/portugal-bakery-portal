// src/utils/seasons.ts
// Automatic South African (Southern Hemisphere) seasonal theme engine for Portugal Bakery.
// Drives system-wide light-mode color palettes, botanical/seasonal vector illustrations,
// and editorial accents across every page in the portal.

export type SASeasonId = "spring" | "summer" | "festive_summer" | "autumn" | "winter";

export interface SASeasonTheme {
  id: SASeasonId;
  shortLabel: string;
  name: string;
  heroBadge: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  cardRibbon: string;
  themeColorHex: string;
  topBarGradient: string;
  sectionSurfaceClass: string;
  heroOverlayClass: string;
  heroGlowClass: string;
  pillClass: string;
}

export const SEASON_ORDER: SASeasonId[] = [
  "spring",
  "summer",
  "festive_summer",
  "autumn",
  "winter",
];

export const SEASON_THEMES: Record<SASeasonId, SASeasonTheme> = {
  spring: {
    id: "spring",
    shortLabel: "Spring Bloom",
    name: "Spring in Bloom",
    heroBadge: "Spring in Bloom · Fresh Floral & Berry Bakes",
    eyebrow: "Spring Collection",
    heading: "Freshly Blossomed Favorites",
    subtitle:
      "Bright, sunlit mornings call for delicate flaky pastries, fresh berry cakes, and golden-crust sourdough baked fresh from dawn.",
    cardRibbon: "SPRING BLOOM",
    themeColorHex: "#E11D64",
    topBarGradient: "from-pink-500 via-rose-400 to-emerald-500",
    sectionSurfaceClass:
      "bg-gradient-to-br from-rose-100/80 via-pink-50/70 to-emerald-50/75",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3b1022]/85 via-[#4a162b]/60 to-rose-500/20",
    heroGlowClass: "from-pink-400/35 via-amber-200/20 to-emerald-300/20",
    pillClass: "bg-rose-100 text-rose-800 border-rose-300",
  },

  summer: {
    id: "summer",
    shortLabel: "Summer Sun",
    name: "Golden Summer",
    heroBadge: "Summer Sunshine · Citrus & Golden Nata",
    eyebrow: "Summer Collection",
    heading: "Sun-Kissed Bakery Favorites",
    subtitle:
      "Celebrate warm, sunny days with caramelized pastéis de nata, light buttery croissants, and refreshing fruit-topped confections.",
    cardRibbon: "SUMMER FRESH",
    themeColorHex: "#EA580C",
    topBarGradient: "from-amber-400 via-orange-500 to-sky-500",
    sectionSurfaceClass:
      "bg-gradient-to-br from-amber-100/80 via-yellow-50/85 to-sky-100/65",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3d2008]/85 via-[#522c0c]/60 to-amber-400/20",
    heroGlowClass: "from-amber-400/35 via-yellow-300/20 to-sky-400/20",
    pillClass: "bg-amber-100 text-amber-900 border-amber-300",
  },

  festive_summer: {
    id: "festive_summer",
    shortLabel: "Festive",
    name: "Festive Season",
    heroBadge: "Festive Season · Holiday Bakes & Bolo Rei",
    eyebrow: "Festive Specialties",
    heading: "Holiday Table Favorites",
    subtitle:
      "Gather around the table with traditional Portuguese festive bakes, signature Bolo Rei, and celebratory cakes crafted with love.",
    cardRibbon: "FESTIVE",
    themeColorHex: "#C81E3A",
    topBarGradient: "from-red-600 via-amber-400 to-emerald-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-red-100/70 via-amber-50/85 to-emerald-100/65",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3a0d16]/88 via-[#47141e]/62 to-amber-500/20",
    heroGlowClass: "from-red-500/30 via-amber-400/25 to-emerald-500/20",
    pillClass: "bg-red-100 text-red-900 border-red-300",
  },

  autumn: {
    id: "autumn",
    shortLabel: "Autumn Harvest",
    name: "Autumn Harvest",
    heroBadge: "Autumn Harvest · Spiced & Oven-Warm",
    eyebrow: "Autumn Harvest",
    heading: "Golden Harvest Creations",
    subtitle:
      "Crisp autumn days pair effortlessly with slow-fermented rustic loaves, rich chocolate ganache, and warm cinnamon-spiced pastries.",
    cardRibbon: "HARVEST",
    themeColorHex: "#C2410C",
    topBarGradient: "from-orange-600 via-amber-500 to-rose-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-orange-100/85 via-amber-50/80 to-rose-100/55",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3b180c]/88 via-[#4f2211]/64 to-orange-500/20",
    heroGlowClass: "from-orange-500/32 via-amber-500/20 to-rose-500/15",
    pillClass: "bg-orange-100 text-orange-900 border-orange-300",
  },

  winter: {
    id: "winter",
    shortLabel: "Winter Azulejo",
    name: "Winter Hearth",
    heroBadge: "Winter Season · Crisp Morning & Warm Pastries",
    eyebrow: "Winter Warmers",
    heading: "Oven-Warm Winter Comforts",
    subtitle:
      "Savor the comfort of oven-warm crusty breads, rich buttery layers, and timeless Portuguese classics alongside a hot cup of coffee.",
    cardRibbon: "OVEN WARM",
    themeColorHex: "#1E5BB8",
    topBarGradient: "from-blue-600 via-sky-400 to-amber-500",
    sectionSurfaceClass:
      "bg-gradient-to-br from-sky-100/80 via-blue-50/70 to-amber-50/70",
    heroOverlayClass:
      "bg-gradient-to-r from-[#10233f]/88 via-[#183156]/65 to-amber-500/20",
    heroGlowClass: "from-sky-400/30 via-blue-400/15 to-amber-400/20",
    pillClass: "bg-sky-100 text-blue-900 border-sky-300",
  },
};

/**
 * Returns the active South African (Southern Hemisphere) season for a given date:
 *  - Spring: Sep (8), Oct (9), Nov (10)
 *  - Summer: Dec (11), Jan (0), Feb (1) — with Festive Season Dec 10–31
 *  - Autumn: Mar (2), Apr (3), May (4)
 *  - Winter: Jun (5), Jul (6), Aug (7)
 */
export function getCalendarSASeasonId(date: Date = new Date()): SASeasonId {
  const month = date.getMonth();
  const day = date.getDate();

  if (month === 11 && day >= 10) {
    return "festive_summer";
  }
  if (month === 11 || month === 0 || month === 1) {
    return "summer";
  }
  if (month >= 2 && month <= 4) {
    return "autumn";
  }
  if (month >= 5 && month <= 7) {
    return "winter";
  }
  return "spring";
}

export function getCurrentSASeason(date: Date = new Date()): SASeasonTheme {
  return SEASON_THEMES[getCalendarSASeasonId(date)];
}
