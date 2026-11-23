import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCalendarSASeasonId,
  SASeasonId,
  SASeasonTheme,
  SEASON_THEMES,
} from "@/utils/seasons";

export type SeasonMode = "auto" | SASeasonId;

interface SeasonContextValue {
  mode: SeasonMode;
  setMode: (mode: SeasonMode) => void;
  season: SASeasonTheme;
  calendarSeasonId: SASeasonId;
}

const SeasonContext = createContext<SeasonContextValue | undefined>(undefined);

const STORAGE_KEY = "pb_season_mode";

export const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const calendarSeasonId = getCalendarSASeasonId();

  const [mode, setModeState] = useState<SeasonMode>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) as SeasonMode | null;
      if (saved && (saved === "auto" || saved in SEASON_THEMES)) {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return "auto";
  });

  const activeSeasonId: SASeasonId = mode === "auto" ? calendarSeasonId : mode;
  const season = SEASON_THEMES[activeSeasonId];

  const setMode = (next: SeasonMode) => {
    setModeState(next);
    try {
      sessionStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-season", activeSeasonId);
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", season.themeColorHex);
    }
  }, [activeSeasonId, season.themeColorHex]);

  return (
    <SeasonContext.Provider value={{ mode, setMode, season, calendarSeasonId }}>
      {children}
    </SeasonContext.Provider>
  );
};

export function useSeason(): SeasonContextValue {
  const ctx = useContext(SeasonContext);
  if (!ctx) {
    const calendarSeasonId = getCalendarSASeasonId();
    return {
      mode: "auto",
      setMode: () => {},
      season: SEASON_THEMES[calendarSeasonId],
      calendarSeasonId,
    };
  }
  return ctx;
}
