// src/utils/seasons.ts
// Automatic Southern Hemisphere seasonal theme engine for Portugal Bakery.
// Dynamically adapts system-wide palette tokens, botanical/seasonal artwork,
// and editorial copy throughout the year.

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
  topBarGradient: string;
  sectionSurfaceClass: string;
  heroGlowClass: string;
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
    shortLabel: "Spring",
    name: "Spring in Bloom",
    heroBadge: "Spring in Bloom · Baked Fresh Daily",
    eyebrow: "Spring Collection",
    heading: "Freshly Blossomed Favorites",
    subtitle:
      "Bright, sunlit mornings call for delicate flaky pastries, fresh berry cakes, and golden-crust sourdough baked fresh from dawn.",
    cardRibbon: "SPRING BLOOM",
    topBarGradient: "from-rose-400 via-pink-500 to-emerald-500",
    sectionSurfaceClass:
      "bg-gradient-to-br from-rose-50/90 via-amber-50/50 to-emerald-50/60 dark:from-[#1c1015] dark:via-[#191216] dark:to-[#101a15]",
    heroGlowClass: "from-rose-500/20 via-amber-300/10 to-transparent",
  },

  summer: {
    id: "summer",
    shortLabel: "Summer",
    name: "Golden Summer",
    heroBadge: "Summer Sunshine · Baked Fresh Daily",
    eyebrow: "Summer Collection",
    heading: "Sun-Kissed Bakery Favorites",
    subtitle:
      "Celebrate warm, sunny days with caramelized pastéis de nata, light buttery croissants, and refreshing fruit-topped confections.",
    cardRibbon: "SUMMER FRESH",
    topBarGradient: "from-amber-400 via-orange-500 to-sky-500",
    sectionSurfaceClass:
      "bg-gradient-to-br from-amber-50/95 via-yellow-50/70 to-sky-50/50 dark:from-[#1b140c] dark:via-[#19130d] dark:to-[#0e171d]",
    heroGlowClass: "from-amber-400/25 via-orange-400/10 to-transparent",
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
    topBarGradient: "from-red-600 via-amber-400 to-emerald-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-red-50/70 via-amber-50/80 to-emerald-50/50 dark:from-[#1d0f12] dark:via-[#1a140e] dark:to-[#0f1914]",
    heroGlowClass: "from-red-500/20 via-amber-400/15 to-transparent",
  },

  autumn: {
    id: "autumn",
    shortLabel: "Autumn",
    name: "Autumn Harvest",
    heroBadge: "Autumn Harvest · Warm From The Oven",
    eyebrow: "Autumn Harvest",
    heading: "Golden Harvest Creations",
    subtitle:
      "Crisp autumn days pair effortlessly with slow-fermented rustic loaves, rich chocolate ganache, and warm spiced pastries.",
    cardRibbon: "HARVEST",
    topBarGradient: "from-orange-600 via-amber-600 to-red-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-orange-50/90 via-amber-50/70 to-stone-100/90 dark:from-[#1b110c] dark:via-[#18120e] dark:to-[#141110]",
    heroGlowClass: "from-orange-500/20 via-amber-600/10 to-transparent",
  },

  winter: {
    id: "winter",
    shortLabel: "Winter",
    name: "Winter Hearth",
    heroBadge: "Winter Warmers · Straight From The Oven",
    eyebrow: "Winter Warmers",
    heading: "Oven-Warm Comforts",
    subtitle:
      "Savor the comfort of oven-warm crusty breads, rich buttery layers, and timeless Portuguese classics alongside a hot cup of coffee.",
    cardRibbon: "OVEN WARM",
    topBarGradient: "from-amber-700 via-stone-600 to-rose-900",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100 via-amber-50/60 to-rose-50/40 dark:from-[#140e0b] dark:via-[#18110d] dark:to-[#190f12]",
    heroGlowClass: "from-amber-600/20 via-stone-500/10 to-transparent",
  },
};

/**
 * Returns the active Southern Hemisphere season for a given date:
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
