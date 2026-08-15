import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "pokedex.theme-preference";

interface ThemeContextValue {
  preference: ThemePreference;
  choose: (next: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// NativeWind's own colorScheme state is in-memory only (resets to "system"
// on reload), so the chosen preference is persisted here and reapplied on boot.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      const value = (stored as ThemePreference | null) ?? "system";
      setPreference(value);
      setColorScheme(value);
    });
  }, [setColorScheme]);

  function choose(next: ThemePreference) {
    setPreference(next);
    setColorScheme(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }

  return <ThemeContext.Provider value={{ preference, choose }}>{children}</ThemeContext.Provider>;
}

export function useThemePreference(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemePreference must be used within a ThemeProvider");
  return ctx;
}
