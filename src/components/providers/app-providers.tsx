"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { DEFAULT_THEME, ENABLE_SYSTEM_THEME } from "@/lib/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      enableSystem={ENABLE_SYSTEM_THEME}
    >
      {children}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
