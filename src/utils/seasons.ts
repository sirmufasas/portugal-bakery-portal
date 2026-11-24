// src/utils/seasons.ts
// Automatic South African National Events, Public Holidays & Seasons Theme Engine.
// Permanently Light Mode — drives system-wide palettes, bespoke vector artwork,
// and editorial accents across every screen. Theme switching is Admin-only.

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
    shortLabel: "Spring Bloom",
    name: "Spring in Bloom",
    heroBadge: "Spring in Bloom · Fresh Floral & Berry Bakes",
    eyebrow: "Spring Collection",
    heading: "Freshly Blossomed Favorites",
    subtitle:
      "Bright sunlit mornings call for delicate flaky pastries, fresh berry cakes, and golden-crust sourdough baked fresh from dawn.",
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
    category: "season",
    dateLabel: "Dec – Feb",
    shortLabel: "Summer Sun",
    name: "Golden Summer",
    heroBadge: "Summer Sunshine · Citrus & Golden Nata",
    eyebrow: "Summer Collection",
    heading: "Sun-Kissed Bakery Favorites",
    subtitle:
      "Celebrate warm sunny days with caramelized pastéis de nata, light buttery croissants, and refreshing fruit-topped confections.",
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

  autumn: {
    id: "autumn",
    category: "season",
    dateLabel: "Mar – May",
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
    category: "season",
    dateLabel: "Jun – Aug",
    shortLabel: "Winter Hearth",
    name: "Winter Hearth",
    heroBadge: "Winter Season · Crisp Mornings & Warm Pastries",
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

  // ==================== SOUTH AFRICAN PUBLIC HOLIDAYS & BIG EVENTS ====================
  freedom_day: {
    id: "freedom_day",
    category: "sa_event",
    dateLabel: "27 April",
    shortLabel: "Freedom Day",
    name: "Freedom Day (27 Apr)",
    heroBadge: "Celebrating South Africa's Freedom Day · 27 April",
    eyebrow: "Freedom Day · Unity & Celebration",
    heading: "Baked to Share Across Our Rainbow Nation",
    subtitle:
      "Commemorating 27 April with celebratory platters, freshly baked Portuguese rolls, golden pastéis de nata, and family cakes made for gathering together.",
    cardRibbon: "FREEDOM DAY",
    themeColorHex: "#007A4D",
    topBarGradient:
      "from-[#E03C31] via-[#FFB81C] via-45% to-[#007A4D]",
    sectionSurfaceClass:
      "bg-gradient-to-br from-emerald-100/80 via-amber-50/80 to-sky-100/70",
    heroOverlayClass:
      "bg-gradient-to-r from-[#072b1e]/88 via-[#0e3b2a]/65 to-[#FFB81C]/25",
    heroGlowClass: "from-emerald-500/35 via-amber-400/25 to-blue-600/20",
    pillClass: "bg-emerald-100 text-emerald-900 border-emerald-400",
  },

  heritage_day: {
    id: "heritage_day",
    category: "sa_event",
    dateLabel: "24 September",
    shortLabel: "Heritage Day",
    name: "Heritage Day (24 Sep)",
    heroBadge: "Happy Heritage Day · 24 September · Braai & Bakery Table",
    eyebrow: "South African Heritage & Braai Day",
    heading: "Artisan Loaves, Rolls & Sweet Heritage Classics",
    subtitle:
      "Celebrate South Africa's rich cultural tapestry with crusty garlic sourdough, Portuguese prego rolls, and celebratory tarts for every Heritage Day table.",
    cardRibbon: "HERITAGE DAY",
    themeColorHex: "#B45309",
    topBarGradient: "from-amber-500 via-red-600 to-emerald-700",
    sectionSurfaceClass:
      "bg-gradient-to-br from-amber-100/85 via-orange-50/80 to-emerald-100/60",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3b1d09]/88 via-[#54280c]/66 to-amber-500/25",
    heroGlowClass: "from-amber-500/35 via-red-500/20 to-emerald-500/20",
    pillClass: "bg-amber-100 text-amber-950 border-amber-400",
  },

  womens_day: {
    id: "womens_day",
    category: "sa_event",
    dateLabel: "9 August",
    shortLabel: "Women's Day",
    name: "National Women's Day (9 Aug)",
    heroBadge: "Happy National Women's Day · 9 August · King Protea Collection",
    eyebrow: "Honouring South Africa's Women",
    heading: "Handcrafted Cakes & Pastries in Full Protea Bloom",
    subtitle:
      "Wathint' Abafazi, Wathint' Imbokodo — celebrate the extraordinary women in your life with signature cakes, delicate pastries, and gift-wrapped treats.",
    cardRibbon: "WOMEN'S DAY",
    themeColorHex: "#BE185D",
    topBarGradient: "from-pink-600 via-fuchsia-500 to-amber-400",
    sectionSurfaceClass:
      "bg-gradient-to-br from-pink-100/85 via-rose-50/80 to-purple-100/65",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3d0e28]/88 via-[#521537]/64 to-pink-400/25",
    heroGlowClass: "from-pink-500/35 via-fuchsia-400/20 to-amber-300/20",
    pillClass: "bg-pink-100 text-pink-900 border-pink-300",
  },

  youth_day: {
    id: "youth_day",
    category: "sa_event",
    dateLabel: "16 June",
    shortLabel: "Youth Day",
    name: "Youth Day (16 Jun)",
    heroBadge: "Commemorating Youth Day · 16 June · Spirit of Courage & Hope",
    eyebrow: "South African Youth Day",
    heading: "Bold Flavors & Fresh Bakes for a Bright Future",
    subtitle:
      "Honouring the courage and energy of South Africa's youth with warm winter pastries, freshly glazed donuts, and artisan treats made to share.",
    cardRibbon: "YOUTH DAY",
    themeColorHex: "#D97706",
    topBarGradient: "from-orange-500 via-amber-400 to-blue-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-amber-100/80 via-orange-50/75 to-sky-100/70",
    heroOverlayClass:
      "bg-gradient-to-r from-[#2c1a08]/88 via-[#3d250d]/64 to-blue-500/25",
    heroGlowClass: "from-orange-400/35 via-amber-300/20 to-blue-500/25",
    pillClass: "bg-orange-100 text-orange-950 border-orange-300",
  },

  mandela_day: {
    id: "mandela_day",
    category: "sa_event",
    dateLabel: "18 July",
    shortLabel: "Mandela Day",
    name: "Mandela Day (18 Jul)",
    heroBadge: "Nelson Mandela International Day · 18 July · Spirit of Ubuntu",
    eyebrow: "67 Minutes of Kindness & Sharing",
    heading: "Warm Loaves & Sharing Platters Crafted with Ubuntu",
    subtitle:
      "Celebrate Madiba's legacy of generosity by sharing freshly baked bread, sweet pastries, and comforting winter boxes with community, colleagues, and loved ones.",
    cardRibbon: "UBUNTU · 18 JUL",
    themeColorHex: "#CA8A04",
    topBarGradient: "from-yellow-500 via-amber-500 to-emerald-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-yellow-100/80 via-amber-50/80 to-emerald-100/65",
    heroOverlayClass:
      "bg-gradient-to-r from-[#2f2306]/88 via-[#45340a]/64 to-emerald-500/22",
    heroGlowClass: "from-yellow-400/35 via-amber-300/25 to-emerald-400/20",
    pillClass: "bg-yellow-100 text-yellow-950 border-yellow-400",
  },

  human_rights_day: {
    id: "human_rights_day",
    category: "sa_event",
    dateLabel: "21 March",
    shortLabel: "Human Rights Day",
    name: "Human Rights Day (21 Mar)",
    heroBadge: "Human Rights Day · 21 March · Dignity, Equality & Community",
    eyebrow: "21 March Public Holiday",
    heading: "Gather Around Freshly Baked Tradition",
    subtitle:
      "Marking South Africa's Human Rights Day long weekend with slow-fermented loaves, family pastry boxes, and handcrafted cakes.",
    cardRibbon: "21 MARCH",
    themeColorHex: "#0F766E",
    topBarGradient: "from-teal-600 via-amber-400 to-emerald-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-teal-100/75 via-amber-50/80 to-emerald-50/75",
    heroOverlayClass:
      "bg-gradient-to-r from-[#0a2e2b]/88 via-[#11423e]/65 to-amber-400/22",
    heroGlowClass: "from-teal-400/32 via-amber-300/20 to-emerald-400/20",
    pillClass: "bg-teal-100 text-teal-950 border-teal-300",
  },

  workers_day: {
    id: "workers_day",
    category: "sa_event",
    dateLabel: "1 May",
    shortLabel: "Workers' Day",
    name: "Workers' Day (1 May)",
    heroBadge: "Happy Workers' Day · 1 May · Honouring Craft & Dedication",
    eyebrow: "1 May Public Holiday",
    heading: "Honest Artisan Craft in Every Loaf",
    subtitle:
      "Celebrating South Africa's workforce and timeless baking craftsmanship with golden-crust breads, savoury pies, and well-earned holiday treats.",
    cardRibbon: "WORKERS' DAY",
    themeColorHex: "#B91C1C",
    topBarGradient: "from-red-600 via-amber-500 to-orange-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-amber-100/80 via-orange-50/80 to-red-100/60",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3b1111]/88 via-[#521919]/64 to-amber-500/22",
    heroGlowClass: "from-red-500/28 via-amber-400/25 to-orange-400/20",
    pillClass: "bg-red-100 text-red-900 border-red-300",
  },

  easter: {
    id: "easter",
    category: "sa_event",
    dateLabel: "Easter Weekend",
    shortLabel: "Easter & Family Day",
    name: "Easter & Family Day",
    heroBadge: "Blessed Easter & Family Day · Traditional Folar & Spiced Buns",
    eyebrow: "Easter Weekend Specialties",
    heading: "Portuguese Folar da Páscoa & Family Table Treats",
    subtitle:
      "Celebrate Good Friday through Family Day with authentic Portuguese Easter Folar, warm spiced buns, custard tarts, and celebratory family cakes.",
    cardRibbon: "EASTER SPECIAL",
    themeColorHex: "#7C3AED",
    topBarGradient: "from-violet-500 via-amber-400 to-emerald-400",
    sectionSurfaceClass:
      "bg-gradient-to-br from-violet-100/75 via-amber-50/85 to-rose-50/70",
    heroOverlayClass:
      "bg-gradient-to-r from-[#281247]/86 via-[#381a63]/62 to-amber-400/25",
    heroGlowClass: "from-violet-400/32 via-amber-300/25 to-emerald-300/20",
    pillClass: "bg-violet-100 text-violet-900 border-violet-300",
  },

  mothers_day: {
    id: "mothers_day",
    category: "sa_event",
    dateLabel: "2nd Sun of May",
    shortLabel: "Mother's Day",
    name: "Mother's Day",
    heroBadge: "Happy Mother's Day · Luxury Cakes & Floral Pastry Boxes",
    eyebrow: "Mother's Day Gifting",
    heading: "Baked with Love for Mom",
    subtitle:
      "Spoil Mom this Mother's Day weekend with velvety ganache cakes, delicate cream pastries, and ribbon-wrapped confectionery boxes.",
    cardRibbon: "FOR MOM",
    themeColorHex: "#DB2777",
    topBarGradient: "from-rose-500 via-pink-400 to-amber-400",
    sectionSurfaceClass:
      "bg-gradient-to-br from-rose-100/85 via-pink-50/80 to-amber-50/75",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3d1024]/86 via-[#541732]/62 to-rose-400/25",
    heroGlowClass: "from-rose-400/35 via-pink-300/25 to-amber-300/20",
    pillClass: "bg-rose-100 text-rose-900 border-rose-300",
  },

  valentines: {
    id: "valentines",
    category: "sa_event",
    dateLabel: "14 February",
    shortLabel: "Valentine's",
    name: "Valentine's Celebration (14 Feb)",
    heroBadge: "Valentine's Celebration · Decadent Chocolate & Berry Confections",
    eyebrow: "Sweetheart Collection",
    heading: "Handcrafted Indulgences Made for Two",
    subtitle:
      "Share rich chocolate ganache cakes, strawberry-kissed pastries, and warm custard tarts baked with romance in every bite.",
    cardRibbon: "VALENTINE'S",
    themeColorHex: "#E11D48",
    topBarGradient: "from-rose-600 via-pink-500 to-red-500",
    sectionSurfaceClass:
      "bg-gradient-to-br from-rose-100/85 via-red-50/75 to-pink-100/75",
    heroOverlayClass:
      "bg-gradient-to-r from-[#3d0a18]/88 via-[#541022]/64 to-rose-500/25",
    heroGlowClass: "from-rose-500/35 via-red-400/25 to-pink-400/20",
    pillClass: "bg-rose-100 text-rose-900 border-rose-300",
  },

  reconciliation_day: {
    id: "reconciliation_day",
    category: "sa_event",
    dateLabel: "16 December",
    shortLabel: "Reconciliation Day",
    name: "Day of Reconciliation (16 Dec)",
    heroBadge: "Day of Reconciliation · 16 December · Peace, Unity & Togetherness",
    eyebrow: "16 December Public Holiday",
    heading: "Summer Holiday Loaves & Sharing Platters",
    subtitle:
      "Bringing friends, neighbours, and families together around one table with fresh summer bakes and traditional Portuguese favourites.",
    cardRibbon: "16 DECEMBER",
    themeColorHex: "#0284C7",
    topBarGradient: "from-sky-600 via-emerald-500 to-amber-400",
    sectionSurfaceClass:
      "bg-gradient-to-br from-sky-100/80 via-emerald-50/75 to-amber-50/75",
    heroOverlayClass:
      "bg-gradient-to-r from-[#0c293d]/86 via-[#123b57]/62 to-emerald-400/22",
    heroGlowClass: "from-sky-400/32 via-emerald-300/22 to-amber-300/20",
    pillClass: "bg-sky-100 text-sky-950 border-sky-300",
  },

  festive_summer: {
    id: "festive_summer",
    category: "sa_event",
    dateLabel: "18 – 31 Dec",
    shortLabel: "Festive Season",
    name: "Festive & Christmas Season",
    heroBadge: "Festive Season · Holiday Bakes & Traditional Bolo Rei",
    eyebrow: "Festive Specialties",
    heading: "Holiday Table Favorites",
    subtitle:
      "Gather around the summer holiday table with traditional Portuguese festive bakes, signature Bolo Rei, and celebratory cakes crafted with love.",
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

  new_year: {
    id: "new_year",
    category: "sa_event",
    dateLabel: "1 – 2 January",
    shortLabel: "New Year",
    name: "New Year's Celebration",
    heroBadge: "Happy New Year · Fresh Beginnings & Golden Pastries",
    eyebrow: "New Year Celebration",
    heading: "Start the Year with Fresh Artisan Bakes",
    subtitle:
      "Toast to a bright new year in South Africa with celebratory cakes, flaky golden croissants, and signature pastéis de nata.",
    cardRibbon: "NEW YEAR",
    themeColorHex: "#B45309",
    topBarGradient: "from-amber-400 via-yellow-500 to-indigo-600",
    sectionSurfaceClass:
      "bg-gradient-to-br from-amber-100/80 via-yellow-50/85 to-indigo-100/60",
    heroOverlayClass:
      "bg-gradient-to-r from-[#291d06]/88 via-[#3d2b0a]/64 to-amber-400/25",
    heroGlowClass: "from-amber-400/35 via-yellow-300/25 to-indigo-400/20",
    pillClass: "bg-amber-100 text-amber-950 border-amber-300",
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
  // SA Public Holidays Act: Sunday public holiday shifts observation to Monday as well
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
