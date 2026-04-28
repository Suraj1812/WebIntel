"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DARK_THEME_CLASS,
  DEFAULT_THEME,
  ENABLE_SYSTEM_THEME,
  THEME_MEDIA_QUERY,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
  isTheme,
} from "@/lib/theme";

type ThemeProviderProps = {
  attribute?: "class";
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
};

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(mediaQueryList?: MediaQueryList): ResolvedTheme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME === "light" ? "light" : "dark";
  }

  return (mediaQueryList ?? window.matchMedia(THEME_MEDIA_QUERY)).matches ? "dark" : "light";
}

function readStoredTheme() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(storedTheme) ? storedTheme : null;
  } catch {
    return null;
  }
}

function getInitialTheme(defaultTheme: Theme) {
  return readStoredTheme() ?? defaultTheme;
}

function resolveTheme(theme: Theme, enableSystem: boolean, mediaQueryList?: MediaQueryList): ResolvedTheme {
  if (theme === "system" && enableSystem) {
    return getSystemTheme(mediaQueryList);
  }

  return theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: ResolvedTheme, attribute: "class") {
  if (typeof document === "undefined") {
    return;
  }

  if (attribute === "class") {
    document.documentElement.classList.toggle(DARK_THEME_CLASS, theme === "dark");
  }

  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
  attribute = "class",
  children,
  defaultTheme = DEFAULT_THEME,
  enableSystem = ENABLE_SYSTEM_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme(defaultTheme));
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(getInitialTheme(defaultTheme), enableSystem),
  );

  useEffect(() => {
    applyTheme(resolvedTheme, attribute);
  }, [attribute, resolvedTheme]);

  useEffect(() => {
    if (!enableSystem || typeof window === "undefined") {
      return;
    }

    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);
    const handleSystemThemeChange = () => {
      if (theme !== "system") {
        return;
      }

      const nextResolvedTheme = resolveTheme(theme, enableSystem, mediaQueryList);
      setResolvedTheme(nextResolvedTheme);
    };

    mediaQueryList.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQueryList.removeEventListener("change", handleSystemThemeChange);
    };
  }, [enableSystem, theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) {
        return;
      }

      const nextTheme = readStoredTheme() ?? defaultTheme;
      const nextResolvedTheme = resolveTheme(nextTheme, enableSystem);

      setThemeState(nextTheme);
      setResolvedTheme(nextResolvedTheme);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [defaultTheme, enableSystem]);

  const setTheme = useCallback((nextTheme: Theme) => {
    const nextResolvedTheme = resolveTheme(nextTheme, enableSystem);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Ignore storage write failures so the in-memory theme still updates.
    }

    setThemeState(nextTheme);
    setResolvedTheme(nextResolvedTheme);
  }, [enableSystem]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [resolvedTheme, setTheme, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
