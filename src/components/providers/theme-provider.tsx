"use client";

import { createContext, useContext } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextValue = {
  theme: "light";
  resolvedTheme: "light";
  setTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const value: ThemeContextValue = {
    theme: "light",
    resolvedTheme: "light",
    setTheme: () => {},
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider.");
  }

  return context;
}
