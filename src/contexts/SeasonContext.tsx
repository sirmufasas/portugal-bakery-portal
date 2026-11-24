import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCalendarSASeasonId,
  SASeasonId,
  SASeasonTheme,
  SEASON_THEMES,
} from "@/utils/seasons";
import { useAuth } from "@/contexts/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "https://bakerybackend-i7wj.onrender.com";

export type SeasonMode = "auto" | SASeasonId;

interface SeasonContextValue {
  mode: SeasonMode;
  setMode: (mode: SeasonMode) => Promise<void>;
  season: SASeasonTheme;
  calendarSeasonId: SASeasonId;
  canManageTheme: boolean;
  isSavingTheme: boolean;
}

const SeasonContext = createContext<SeasonContextValue | undefined>(undefined);

const ADMIN_CACHE_KEY = "pb_global_theme_mode";

export const SeasonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();
  const canManageTheme = user?.role === "admin";
  const calendarSeasonId = getCalendarSASeasonId();

  const [mode, setModeState] = useState<SeasonMode>(() => {
    try {
      // Remove any legacy per-user session override
      sessionStorage.removeItem("pb_season_mode");
      const cachedGlobal = localStorage.getItem(
        ADMIN_CACHE_KEY
      ) as SeasonMode | null;
      if (cachedGlobal && (cachedGlobal === "auto" || cachedGlobal in SEASON_THEMES)) {
        return cachedGlobal;
      }
    } catch {
      // ignore storage errors
    }
    return "auto";
  });

  const [isSavingTheme, setIsSavingTheme] = useState(false);

  // Sync the global portal theme configured by Admin from backend
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings/theme`);
        if (!res.ok) return;
        const data = await res.json();
        const remoteMode = data?.themeMode as SeasonMode | undefined;
        if (
          active &&
          remoteMode &&
          (remoteMode === "auto" || remoteMode in SEASON_THEMES)
        ) {
          setModeState(remoteMode);
          try {
            localStorage.setItem(ADMIN_CACHE_KEY, remoteMode);
          } catch {
            // ignore storage errors
          }
        }
      } catch {
        // Offline / waking up — fall back to cached or automatic SA calendar
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const activeSeasonId: SASeasonId =
    mode === "auto" || !(mode in SEASON_THEMES) ? calendarSeasonId : mode;
  const season = SEASON_THEMES[activeSeasonId];

  // Strictly Admin-only theme mutation
  const setMode = async (next: SeasonMode) => {
    if (user?.role !== "admin") {
      return;
    }

    setModeState(next);
    try {
      localStorage.setItem(ADMIN_CACHE_KEY, next);
    } catch {
      // ignore storage errors
    }

    const authToken = token || localStorage.getItem("token");
    if (!authToken) return;

    try {
      setIsSavingTheme(true);
      await fetch(`${API_URL}/api/admin/settings/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ themeMode: next }),
      });
    } catch (err) {
      console.error("Failed to save global portal theme:", err);
    } finally {
      setIsSavingTheme(false);
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
    <SeasonContext.Provider
      value={{
        mode,
        setMode,
        season,
        calendarSeasonId,
        canManageTheme,
        isSavingTheme,
      }}
    >
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
      setMode: async () => {},
      season: SEASON_THEMES[calendarSeasonId],
      calendarSeasonId,
      canManageTheme: false,
      isSavingTheme: false,
    };
  }
  return ctx;
}
