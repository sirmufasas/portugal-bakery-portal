// src/utils/seasons.ts
// Automatic South African (Southern Hemisphere) seasonal theme engine.
// Adapts colours, badges, and bakery copy dynamically throughout the year
// based on Johannesburg's calendar — no manual seasonal edits needed.

export type SASeasonId = "spring" | "summer" | "festive_summer" | "autumn" | "winter";

export interface SASeasonTheme {
  id: SASeasonId;
  name: string;
  heroBadge: string;
  eyebrow: string;
  heading: string;
  subtitle: string;
  cardRibbon: string;
  showFestiveLights: boolean;
  sectionBgClass: string;
  cardBorderClass: string;
  imageBgClass: string;
  accentTextClass: string;
  categoryPillClass: string;
  ribbonGradientClass: string;
  orderBtnClass: string;
  ctaBtnClass: string;
  particleSymbols: string[];
}

// Deterministic positions so ambient accents never jump on React re-renders.
export const AMBIENT_POSITIONS = [
  { left: "6%", top: "14%", size: 16, duration: 16, delay: 0 },
  { left: "18%", top: "76%", size: 14, duration: 19, delay: 1.5 },
  { left: "31%", top: "20%", size: 18, duration: 17, delay: 0.8 },
  { left: "46%", top: "84%", size: 15, duration: 21, delay: 2.2 },
  { left: "62%", top: "16%", size: 14, duration: 18, delay: 1.1 },
  { left: "77%", top: "74%", size: 17, duration: 20, delay: 2.7 },
  { left: "89%", top: "24%", size: 15, duration: 16, delay: 0.4 },
  { left: "93%", top: "64%", size: 14, duration: 22, delay: 1.9 },
];

const SEASON_THEMES: Record<SASeasonId, SASeasonTheme> = {
  spring: {
    id: "spring",
    name: "Johannesburg Spring",
    heroBadge: "Spring Season · Fresh Daily",
    eyebrow: "Jozi Spring Specialties",
    heading: "Featured Products",
    subtitle:
      "Bright Johannesburg spring mornings call for crisp sourdough crusts, flaky croissants, and warm pastéis de nata.",
    cardRibbon: "FRESH PICK",
    showFestiveLights: false,
    sectionBgClass:
      "bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-rose-50/60 dark:from-neutral-950 dark:via-amber-950/20 dark:to-stone-950",
    cardBorderClass: "border-amber-200/80 dark:border-amber-900/40",
    imageBgClass:
      "bg-gradient-to-br from-amber-50 to-rose-50/60 dark:from-amber-950/20 dark:to-stone-900",
    accentTextClass: "text-amber-700 dark:text-amber-400",
    categoryPillClass: "bg-amber-600 text-white",
    ribbonGradientClass: "from-amber-500 to-orange-500",
    orderBtnClass:
      "border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white",
    ctaBtnClass:
      "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white",
    particleSymbols: ["✦", "☀", "✿", "✦"],
  },

  summer: {
    id: "summer",
    name: "South African Summer",
    heroBadge: "Sunny SA Summer · Baked Fresh",
    eyebrow: "Summer Bakery Favorites",
    heading: "Featured Products",
    subtitle:
      "Sun-kissed South African summer days pair effortlessly with golden custard tarts, berry ganache cakes, and artisan loaves.",
    cardRibbon: "SUMMER PICK",
    showFestiveLights: false,
    sectionBgClass:
      "bg-gradient-to-br from-amber-50 via-yellow-50/70 to-orange-50 dark:from-neutral-950 dark:via-amber-950/25 dark:to-orange-950/20",
    cardBorderClass: "border-amber-200 dark:border-amber-800/50",
    imageBgClass:
      "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-950/20 dark:to-orange-950/20",
    accentTextClass: "text-amber-600 dark:text-amber-400",
    categoryPillClass: "bg-amber-600 text-white",
    ribbonGradientClass: "from-amber-500 to-yellow-500",
    orderBtnClass:
      "border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white",
    ctaBtnClass:
      "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white",
    particleSymbols: ["☀", "✦", "☀", "✧"],
  },

  festive_summer: {
    id: "festive_summer",
    name: "Sunny SA Festive Season",
    heroBadge: "Festive Summer · Bolo Rei & Holiday Treats",
    eyebrow: "Sunny Festive Specialties",
    heading: "Featured Products",
    subtitle:
      "Celebrate a warm South African festive season with authentic Portuguese holiday bakes, Bolo Rei, and fresh family platters.",
    cardRibbon: "FESTIVE",
    showFestiveLights: true,
    sectionBgClass:
      "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50/70 dark:from-neutral-950 dark:via-amber-950/20 dark:to-red-950/20",
    cardBorderClass: "border-amber-300/80 dark:border-amber-800/50",
    imageBgClass:
      "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-red-950/20",
    accentTextClass: "text-amber-600 dark:text-amber-400",
    categoryPillClass: "bg-red-600 text-white",
    ribbonGradientClass: "from-red-600 to-amber-600",
    orderBtnClass:
      "border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white",
    ctaBtnClass:
      "bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 text-white",
    particleSymbols: ["✨", "✦", "☀", "✨"],
  },

  autumn: {
    id: "autumn",
    name: "Johannesburg Autumn",
    heroBadge: "Autumn Harvest · Oven Warm",
    eyebrow: "Autumn Harvest Specialties",
    heading: "Featured Products",
    subtitle:
      "Crisp golden Jozi autumn days meet warm cinnamon notes, rich chocolate ganache, and slow-fermented sourdough.",
    cardRibbon: "HARVEST",
    showFestiveLights: false,
    sectionBgClass:
      "bg-gradient-to-br from-orange-50/90 via-amber-50 to-stone-100 dark:from-neutral-950 dark:via-orange-950/20 dark:to-stone-950",
    cardBorderClass: "border-orange-200/80 dark:border-orange-900/40",
    imageBgClass:
      "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-stone-900",
    accentTextClass: "text-orange-700 dark:text-amber-400",
    categoryPillClass: "bg-orange-700 text-white",
    ribbonGradientClass: "from-orange-600 to-amber-700",
    orderBtnClass:
      "border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white",
    ctaBtnClass:
      "bg-orange-700 hover:bg-orange-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white",
    particleSymbols: ["🍂", "✦", "🌾", "✦"],
  },

  winter: {
    id: "winter",
    name: "Johannesburg Winter",
    heroBadge: "Winter Warmers · Straight From The Oven",
    eyebrow: "Jozi Winter Warmers",
    heading: "Featured Products",
    subtitle:
      "Beat the crisp Highveld winter chill with oven-warm crusty breads, buttery pastries, and comforting Portuguese classics.",
    cardRibbon: "OVEN WARM",
    showFestiveLights: false,
    sectionBgClass:
      "bg-gradient-warm dark:bg-[#221611] dark:bg-none",
    cardBorderClass: "border-stone-200 dark:border-amber-900/40",
    imageBgClass:
      "bg-gradient-to-br from-stone-100 to-amber-50/70 dark:from-stone-900 dark:to-amber-950/20",
    accentTextClass: "text-primary dark:text-amber-400",
    categoryPillClass: "bg-primary text-primary-foreground",
    ribbonGradientClass: "from-amber-700 to-stone-700",
    orderBtnClass:
      "border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-500 dark:hover:text-white",
    ctaBtnClass:
      "bg-primary hover:bg-primary/90 text-primary-foreground",
    particleSymbols: ["☕", "✦", "🥐", "✦"],
  },
};

/**
 * Returns the active South African season theme for a given date (defaults to today).
 * Southern Hemisphere meteorological calendar:
 *  - Spring: Sep (8), Oct (9), Nov (10)
 *  - Summer: Dec (11), Jan (0), Feb (1) — with Sunny Festive Summer Dec 10–31
 *  - Autumn: Mar (2), Apr (3), May (4)
 *  - Winter: Jun (5), Jul (6), Aug (7)
 */
export function getCurrentSASeason(date: Date = new Date()): SASeasonTheme {
  const month = date.getMonth(); // 0-indexed (0 = Jan, 10 = Nov, 11 = Dec)
  const day = date.getDate();

  if (month === 11 && day >= 10) {
    return SEASON_THEMES.festive_summer;
  }
  if (month === 11 || month === 0 || month === 1) {
    return SEASON_THEMES.summer;
  }
  if (month >= 2 && month <= 4) {
    return SEASON_THEMES.autumn;
  }
  if (month >= 5 && month <= 7) {
    return SEASON_THEMES.winter;
  }
  return SEASON_THEMES.spring;
}
