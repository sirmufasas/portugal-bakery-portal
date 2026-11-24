// src/utils/seasons.ts
// Automatic South African National Events, Public Holidays & Seasons Theme Engine.
// Permanently Light Mode — refined, grounded Portuguese Artisan Bakery palettes
// with warm alabaster/linen surfaces and mature culinary & heritage accents.
// Theme switching is strictly Admin-only.

export type SASeasonId =
  // 4 Baseline South African Seasons
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  // 13 South African Public Holidays & Major Cultural Events
  | "new_year"
  | "valentines"
  | "human_rights_day"
  | "easter"
  | "freedom_day"
  | "workers_day"
  | "mothers_day"
  | "youth_day"
  | "mandela_day"
  | "womens_day"
  | "heritage_day"
  | "reconciliation_day"
  | "festive_summer";

export interface SASeasonTheme {
  id: SASeasonId;
  category: "season" | "sa_event";
  dateLabel: string;
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

export const SEASON_BASELINE_IDS: SASeasonId[] = [
  "spring",
  "summer",
  "autumn",
  "winter",
];

export const SA_EVENT_IDS: SASeasonId[] = [
  "freedom_day",
  "heritage_day",
  "womens_day",
  "youth_day",
  "mandela_day",
  "human_rights_day",
  "workers_day",
  "reconciliation_day",
  "easter",
  "mothers_day",
  "valentines",
  "festive_summer",
  "new_year",
];

export const SEASON_ORDER: SASeasonId[] = [
  ...SA_EVENT_IDS,
  ...SEASON_BASELINE_IDS,
];

export const SEASON_THEMES: Record<SASeasonId, SASeasonTheme> = {
  // ==================== 4 BASELINE SA SEASONS ====================
  spring: {
    id: "spring",
    category: "season",
    dateLabel: "Sep – Nov",
    shortLabel: "Spring Harvest",
    name: "Spring Artisan Season",
    heroBadge: "Spring Season · Fresh Sourdough & Artisan Pastries",
    eyebrow: "Spring Bakery Selection",
    heading: "Freshly Baked Morning Classics",
    subtitle:
      "Crisp sunlit mornings pair naturally with flaky laminated pastries, golden pastéis de nata, and slow-fermented artisan loaves baked from dawn.",
    cardRibbon: "SPRING BAKE",
    themeColorHex: "#326249",
    topBarGradient: "from-emerald-800 via-amber-700 to-stone-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f4] to-emerald-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#1c1917]/88 via-[#1f2922]/68 to-transparent",
    heroGlowClass: "from-emerald-800/18 via-amber-600/12 to-transparent",
    pillClass: "bg-emerald-950/5 text-emerald-900 border-emerald-800/25",
  },

  summer: {
    id: "summer",
    category: "season",
    dateLabel: "Dec – Feb",
    shortLabel: "Golden Summer",
    name: "Golden Summer",
    heroBadge: "Summer Season · Caramelised Nata & Artisan Breads",
    eyebrow: "Summer Bakery Table",
    heading: "Sun-Warmed Portuguese Classics",
    subtitle:
      "Celebrate warm summer days with blistered pastéis de nata, airy buttery croissants, and crusty Portuguese rolls straight from our deck ovens.",
    cardRibbon: "SUMMER FRESH",
    themeColorHex: "#A1561C",
    topBarGradient: "from-amber-700 via-yellow-700 to-stone-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#fbf9f5] to-amber-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241a11]/88 via-[#332417]/66 to-transparent",
    heroGlowClass: "from-amber-600/20 via-yellow-600/12 to-transparent",
    pillClass: "bg-amber-950/5 text-amber-900 border-amber-800/25",
  },

  autumn: {
    id: "autumn",
    category: "season",
    dateLabel: "Mar – May",
    shortLabel: "Autumn Harvest",
    name: "Autumn Harvest",
    heroBadge: "Autumn Harvest · Spiced & Oven-Warm Loaves",
    eyebrow: "Autumn Harvest",
    heading: "Golden Harvest Creations",
    subtitle:
      "Cooler autumn mornings call for slow-fermented rustic loaves, dark chocolate ganache cakes, and warm cinnamon-dusted pastries.",
    cardRibbon: "HARVEST",
    themeColorHex: "#8F4223",
    topBarGradient: "from-amber-900 via-orange-800 to-stone-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf7f2] to-orange-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#261710]/90 via-[#382117]/68 to-transparent",
    heroGlowClass: "from-orange-800/20 via-amber-700/14 to-transparent",
    pillClass: "bg-orange-950/5 text-orange-950 border-orange-900/25",
  },

  winter: {
    id: "winter",
    category: "season",
    dateLabel: "Jun – Aug",
    shortLabel: "Winter Hearth",
    name: "Winter Hearth",
    heroBadge: "Winter Hearth · Crisp Mornings & Oven-Warm Breads",
    eyebrow: "Winter Warmers",
    heading: "Oven-Warm Winter Comforts",
    subtitle:
      "Savour the comfort of crusty hearth breads, rich buttery layers, and traditional Portuguese classics alongside freshly brewed espresso.",
    cardRibbon: "OVEN WARM",
    themeColorHex: "#294D7A",
    topBarGradient: "from-slate-800 via-blue-900 to-amber-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#f9f8f6] to-slate-100/55",
    heroOverlayClass:
      "bg-gradient-to-r from-[#131d2b]/90 via-[#1c2b3f]/68 to-transparent",
    heroGlowClass: "from-blue-900/20 via-amber-700/14 to-transparent",
    pillClass: "bg-slate-900/5 text-slate-900 border-slate-700/25",
  },

  // ==================== SOUTH AFRICAN PUBLIC HOLIDAYS & BIG EVENTS ====================
  freedom_day: {
    id: "freedom_day",
    category: "sa_event",
    dateLabel: "27 April",
    shortLabel: "Freedom Day",
    name: "Freedom Day (27 Apr)",
    heroBadge: "Commemorating South Africa's Freedom Day · 27 April",
    eyebrow: "27 April · Unity & Table Sharing",
    heading: "Artisan Loaves & Platters Made to Share",
    subtitle:
      "Marking 27 April with generous sharing platters, crusty Portuguese rolls, golden pastéis de nata, and celebratory family cakes.",
    cardRibbon: "FREEDOM DAY",
    themeColorHex: "#1B6044",
    topBarGradient: "from-[#1B6044] via-[#B47B1C] to-[#1E3A5F]",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f4] to-emerald-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#12241c]/90 via-[#1a3328]/68 to-transparent",
    heroGlowClass: "from-emerald-800/22 via-amber-600/14 to-transparent",
    pillClass: "bg-emerald-950/5 text-emerald-950 border-emerald-800/30",
  },

  heritage_day: {
    id: "heritage_day",
    category: "sa_event",
    dateLabel: "24 September",
    shortLabel: "Heritage Day",
    name: "Heritage Day (24 Sep)",
    heroBadge: "Heritage Day · 24 September · Braai Rolls & Artisan Table",
    eyebrow: "24 September · South African Heritage",
    heading: "Crusty Rolls, Sourdough & Heritage Classics",
    subtitle:
      "Celebrate Heritage Day around the fire and family table with freshly baked Portuguese prego rolls, garlic sourdough, and custard tarts.",
    cardRibbon: "HERITAGE DAY",
    themeColorHex: "#954B1E",
    topBarGradient: "from-amber-800 via-stone-800 to-emerald-900",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f3] to-amber-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241810]/90 via-[#362317]/68 to-transparent",
    heroGlowClass: "from-amber-700/22 via-emerald-800/14 to-transparent",
    pillClass: "bg-amber-950/5 text-amber-950 border-amber-800/30",
  },

  womens_day: {
    id: "womens_day",
    category: "sa_event",
    dateLabel: "9 August",
    shortLabel: "Women's Day",
    name: "National Women's Day (9 Aug)",
    heroBadge: "National Women's Day · 9 August · Signature Patisserie",
    eyebrow: "9 August · Honouring South Africa's Women",
    heading: "Handcrafted Cakes & Fine Patisserie",
    subtitle:
      "Commemorating 9 August with refined layer cakes, artisan tartlets, and thoughtfully boxed bakery selections crafted from scratch.",
    cardRibbon: "9 AUGUST",
    themeColorHex: "#864331",
    topBarGradient: "from-stone-800 via-amber-800 to-emerald-900",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f5] to-amber-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241815]/90 via-[#36241f]/68 to-transparent",
    heroGlowClass: "from-amber-800/20 via-stone-700/14 to-transparent",
    pillClass: "bg-stone-900/5 text-stone-900 border-stone-700/25",
  },

  youth_day: {
    id: "youth_day",
    category: "sa_event",
    dateLabel: "16 June",
    shortLabel: "Youth Day",
    name: "Youth Day (16 Jun)",
    heroBadge: "Commemorating Youth Day · 16 June · Fresh Holiday Bakes",
    eyebrow: "16 June Public Holiday",
    heading: "Warm Pastries & Sharing Boxes",
    subtitle:
      "Honouring 16 June with oven-warm winter pastries, freshly glazed brioche, and handcrafted treats made for gathering together.",
    cardRibbon: "16 JUNE",
    themeColorHex: "#9E561E",
    topBarGradient: "from-amber-800 via-slate-800 to-stone-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f4] to-slate-100/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#1f1914]/90 via-[#2d241c]/68 to-transparent",
    heroGlowClass: "from-amber-700/20 via-slate-700/14 to-transparent",
    pillClass: "bg-amber-950/5 text-amber-950 border-amber-800/25",
  },

  mandela_day: {
    id: "mandela_day",
    category: "sa_event",
    dateLabel: "18 July",
    shortLabel: "Mandela Day",
    name: "Mandela Day (18 Jul)",
    heroBadge: "Nelson Mandela International Day · 18 July · Spirit of Ubuntu",
    eyebrow: "18 July · Generosity & Community",
    heading: "Warm Loaves & Platters Crafted for Sharing",
    subtitle:
      "Honouring Madiba's legacy with freshly baked loaves, generous office & community platters, and comforting winter bakes.",
    cardRibbon: "UBUNTU · 18 JUL",
    themeColorHex: "#98631B",
    topBarGradient: "from-amber-700 via-stone-800 to-emerald-900",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#fbf9f4] to-amber-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241c10]/90 via-[#362a18]/68 to-transparent",
    heroGlowClass: "from-amber-600/20 via-emerald-800/12 to-transparent",
    pillClass: "bg-amber-950/5 text-amber-950 border-amber-800/30",
  },

  human_rights_day: {
    id: "human_rights_day",
    category: "sa_event",
    dateLabel: "21 March",
    shortLabel: "Human Rights Day",
    name: "Human Rights Day (21 Mar)",
    heroBadge: "Human Rights Day · 21 March · Dignity & Community",
    eyebrow: "21 March Public Holiday",
    heading: "Gather Around Freshly Baked Tradition",
    subtitle:
      "Marking South Africa's 21 March holiday with slow-fermented sourdough loaves, family pastry boxes, and traditional cakes.",
    cardRibbon: "21 MARCH",
    themeColorHex: "#266469",
    topBarGradient: "from-teal-900 via-stone-700 to-amber-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#f9f8f5] to-teal-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#122224]/90 via-[#1b3336]/68 to-transparent",
    heroGlowClass: "from-teal-800/18 via-amber-700/12 to-transparent",
    pillClass: "bg-teal-950/5 text-teal-950 border-teal-800/25",
  },

  workers_day: {
    id: "workers_day",
    category: "sa_event",
    dateLabel: "1 May",
    shortLabel: "Workers' Day",
    name: "Workers' Day (1 May)",
    heroBadge: "Workers' Day · 1 May · Honouring Honest Craft",
    eyebrow: "1 May Public Holiday",
    heading: "Time-Honoured Craft in Every Loaf",
    subtitle:
      "Celebrating South Africa's workforce and traditional baking craftsmanship with crusty hearth breads, savoury bakes, and holiday pastries.",
    cardRibbon: "1 MAY CRAFT",
    themeColorHex: "#782B33",
    topBarGradient: "from-[#782B33] via-stone-800 to-amber-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f5] to-amber-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241315]/90 via-[#361d20]/68 to-transparent",
    heroGlowClass: "from-amber-800/18 via-stone-700/14 to-transparent",
    pillClass: "bg-stone-900/5 text-stone-900 border-stone-700/25",
  },

  easter: {
    id: "easter",
    category: "sa_event",
    dateLabel: "Easter Weekend",
    shortLabel: "Easter & Family Day",
    name: "Easter & Family Day",
    heroBadge: "Easter & Family Day · Traditional Folar da Páscoa & Spiced Buns",
    eyebrow: "Easter Weekend Specialties",
    heading: "Portuguese Folar da Páscoa & Family Table Bakes",
    subtitle:
      "Celebrate Good Friday through Family Day with authentic Portuguese Easter Folar, warm cinnamon-spiced buns, and custard tarts.",
    cardRibbon: "EASTER SPECIAL",
    themeColorHex: "#8C5125",
    topBarGradient: "from-amber-800 via-stone-700 to-emerald-900",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#fbf9f4] to-amber-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241a12]/90 via-[#36271b]/68 to-transparent",
    heroGlowClass: "from-amber-700/20 via-emerald-800/12 to-transparent",
    pillClass: "bg-amber-950/5 text-amber-950 border-amber-800/25",
  },

  mothers_day: {
    id: "mothers_day",
    category: "sa_event",
    dateLabel: "2nd Sun of May",
    shortLabel: "Mother's Day",
    name: "Mother's Day",
    heroBadge: "Mother's Day Weekend · Signature Cakes & Gift Boxes",
    eyebrow: "Mother's Day Selection",
    heading: "Handcrafted Cakes & Pastries for Mom",
    subtitle:
      "Celebrate Mother's Day with rich Belgian chocolate ganache cakes, flaky French-butter croissants, and ribbon-tied pastry boxes.",
    cardRibbon: "MOTHER'S DAY",
    themeColorHex: "#864331",
    topBarGradient: "from-stone-800 via-amber-800 to-emerald-900",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f5] to-amber-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241815]/90 via-[#36241f]/68 to-transparent",
    heroGlowClass: "from-amber-700/20 via-stone-700/12 to-transparent",
    pillClass: "bg-stone-900/5 text-stone-900 border-stone-700/25",
  },

  valentines: {
    id: "valentines",
    category: "sa_event",
    dateLabel: "14 February",
    shortLabel: "14 Feb Reserve",
    name: "Valentine's Reserve (14 Feb)",
    heroBadge: "14 February · Dark Chocolate Ganache & Artisan Patisserie",
    eyebrow: "14 February Patisserie",
    heading: "Rich Cocoa, Espresso & Custard Indulgences",
    subtitle:
      "Crafted with dark couverture chocolate, slow-roasted espresso, and caramelised custard pastry made to share.",
    cardRibbon: "14 FEB SPECIAL",
    themeColorHex: "#782B33",
    topBarGradient: "from-[#6E252D] via-stone-800 to-amber-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f5] to-stone-200/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241215]/90 via-[#361b1f]/68 to-transparent",
    heroGlowClass: "from-[#782B33]/20 via-amber-700/12 to-transparent",
    pillClass: "bg-stone-900/5 text-stone-900 border-stone-700/25",
  },

  reconciliation_day: {
    id: "reconciliation_day",
    category: "sa_event",
    dateLabel: "16 December",
    shortLabel: "Reconciliation Day",
    name: "Day of Reconciliation (16 Dec)",
    heroBadge: "Day of Reconciliation · 16 December · Unity & Summer Table",
    eyebrow: "16 December Public Holiday",
    heading: "Summer Holiday Loaves & Sharing Platters",
    subtitle:
      "Bringing neighbours, friends, and families together around one table with fresh summer loaves and Portuguese classics.",
    cardRibbon: "16 DECEMBER",
    themeColorHex: "#266469",
    topBarGradient: "from-teal-900 via-emerald-900 to-amber-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#f9f8f5] to-teal-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#122224]/90 via-[#1b3336]/68 to-transparent",
    heroGlowClass: "from-teal-800/18 via-amber-700/12 to-transparent",
    pillClass: "bg-teal-950/5 text-teal-950 border-teal-800/25",
  },

  festive_summer: {
    id: "festive_summer",
    category: "sa_event",
    dateLabel: "18 – 31 Dec",
    shortLabel: "Festive Season",
    name: "Festive & Christmas Season",
    heroBadge: "Festive Season · Traditional Bolo Rei & Holiday Platters",
    eyebrow: "Festive Bakery Tradition",
    heading: "Traditional Bolo Rei & Holiday Table Favorites",
    subtitle:
      "Gather around the holiday table with authentic Portuguese Bolo Rei, artisanal loaves, and celebratory cakes baked fresh daily.",
    cardRibbon: "FESTIVE",
    themeColorHex: "#245A41",
    topBarGradient: "from-emerald-900 via-[#782B33] to-amber-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#faf8f4] to-emerald-50/40",
    heroOverlayClass:
      "bg-gradient-to-r from-[#14241c]/90 via-[#1f362b]/68 to-transparent",
    heroGlowClass: "from-emerald-900/20 via-amber-700/14 to-transparent",
    pillClass: "bg-emerald-950/5 text-emerald-950 border-emerald-800/30",
  },

  new_year: {
    id: "new_year",
    category: "sa_event",
    dateLabel: "1 – 2 January",
    shortLabel: "New Year",
    name: "New Year's Celebration",
    heroBadge: "Happy New Year · Fresh Beginnings & Golden Pastries",
    eyebrow: "New Year Bakery Table",
    heading: "Start the Year with Fresh Artisan Bakes",
    subtitle:
      "Welcome the new year in South Africa with celebratory cakes, flaky golden croissants, and warm pastéis de nata.",
    cardRibbon: "NEW YEAR",
    themeColorHex: "#98631B",
    topBarGradient: "from-amber-700 via-stone-800 to-slate-800",
    sectionSurfaceClass:
      "bg-gradient-to-br from-stone-100/90 via-[#fbf9f4] to-amber-50/45",
    heroOverlayClass:
      "bg-gradient-to-r from-[#241c10]/90 via-[#362a18]/68 to-transparent",
    heroGlowClass: "from-amber-700/20 via-stone-700/12 to-transparent",
    pillClass: "bg-amber-950/5 text-amber-950 border-amber-800/30",
  },
};

/**
 * Extract year, month (1..12), and day (1..31) in Africa/Johannesburg timezone.
 */
function getSAParts(date: Date): { year: number; month: number; day: number } {
  try {
    const parts = new Intl.DateTimeFormat("en-ZA", {
      timeZone: "Africa/Johannesburg",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).formatToParts(date);
    const year = Number(parts.find((p) => p.type === "year")?.value);
    const month = Number(parts.find((p) => p.type === "month")?.value);
    const day = Number(parts.find((p) => p.type === "day")?.value);
    if (year && month && day) return { year, month, day };
  } catch {
    // Fallback to local clock
  }
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/**
 * Butcher's Gregorian Easter Sunday algorithm (returns UTC Date at noon).
 */
function getEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=Mar, 4=Apr
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/**
 * Check if (year, month, day) is within [daysBefore, daysAfter] of a fixed SA public holiday,
 * respecting South Africa's Public Holidays Act (if holiday falls on Sunday, Monday is observed).
 */
function matchesSAHolidayWindow(
  currentUtcMs: number,
  year: number,
  holidayMonth: number,
  holidayDay: number,
  daysBefore = 2,
  daysAfter = 0
): boolean {
  const holidayUtc = new Date(
    Date.UTC(year, holidayMonth - 1, holidayDay, 12, 0, 0)
  );
  const extraObservedDay = holidayUtc.getUTCDay() === 0 ? 1 : 0;
  const startMs = holidayUtc.getTime() - daysBefore * 86400000;
  const endMs =
    holidayUtc.getTime() + (daysAfter + extraObservedDay) * 86400000;
  return currentUtcMs >= startMs && currentUtcMs <= endMs;
}

/**
 * Automatically resolves today's South African Event OR Baseline Season (Africa/Johannesburg):
 *  1. Checks major SA public holidays & cultural events first (with 1–2 day bakery lead-up window).
 *  2. Falls back to the active Southern Hemisphere SA Season (Spring, Summer, Autumn, Winter).
 */
export function getCalendarSASeasonId(date: Date = new Date()): SASeasonId {
  const { year, month, day } = getSAParts(date);
  const currentUtcMs = Date.UTC(year, month - 1, day, 12, 0, 0);

  // 1. New Year's Day (Jan 1–2)
  if (month === 1 && day <= 2) return "new_year";

  // 2. Valentine's Celebration (Feb 10–14)
  if (month === 2 && day >= 10 && day <= 14) return "valentines";

  // 3. Human Rights Day (21 March, window Mar 19–21 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 3, 21, 2, 0)) {
    return "human_rights_day";
  }

  // 4. Easter Weekend — Good Friday (-2d) through Family Day Monday (+1d), plus 1 day lead-in (-3d)
  const easterSundayMs = getEasterSunday(year).getTime();
  if (
    currentUtcMs >= easterSundayMs - 3 * 86400000 &&
    currentUtcMs <= easterSundayMs + 1 * 86400000
  ) {
    return "easter";
  }

  // 5. Freedom Day (27 April, window Apr 25–27 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 4, 27, 2, 0)) {
    return "freedom_day";
  }

  // 6. Workers' Day (1 May, window Apr 30–May 1 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 5, 1, 1, 0)) {
    return "workers_day";
  }

  // 7. Mother's Day in SA (2nd Sunday of May — Fri to Sun window)
  if (month === 5) {
    const mayFirstDayOfWeek = new Date(Date.UTC(year, 4, 1, 12, 0, 0)).getUTCDay();
    const firstSunday = mayFirstDayOfWeek === 0 ? 1 : 8 - mayFirstDayOfWeek;
    const mothersDay = firstSunday + 7;
    if (day >= mothersDay - 2 && day <= mothersDay) {
      return "mothers_day";
    }
  }

  // 8. Youth Day (16 June, window Jun 14–16 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 6, 16, 2, 0)) {
    return "youth_day";
  }

  // 9. Nelson Mandela International Day (18 July, window Jul 16–18)
  if (matchesSAHolidayWindow(currentUtcMs, year, 7, 18, 2, 0)) {
    return "mandela_day";
  }

  // 10. National Women's Day (9 August, window Aug 7–9 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 8, 9, 2, 0)) {
    return "womens_day";
  }

  // 11. Heritage Day / Braai Day (24 September, window Sep 21–24 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 9, 24, 3, 0)) {
    return "heritage_day";
  }

  // 12. Day of Reconciliation (16 December, window Dec 14–16 + observed Monday)
  if (matchesSAHolidayWindow(currentUtcMs, year, 12, 16, 2, 0)) {
    return "reconciliation_day";
  }

  // 13. Festive & Christmas Season (Dec 18–31)
  if (month === 12 && day >= 18) {
    return "festive_summer";
  }

  // Baseline South African Southern Hemisphere Seasons
  if (month === 12 || month === 1 || month === 2) return "summer";
  if (month >= 3 && month <= 5) return "autumn";
  if (month >= 6 && month <= 8) return "winter";
  return "spring"; // Sep, Oct, Nov
}

export function getCurrentSASeason(date: Date = new Date()): SASeasonTheme {
  return SEASON_THEMES[getCalendarSASeasonId(date)];
}
