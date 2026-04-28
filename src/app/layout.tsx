import type { Metadata } from "next";
import Script from "next/script";
import { AppProviders } from "@/components/providers/app-providers";
import { DEFAULT_THEME, ENABLE_SYSTEM_THEME, getThemeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://webintel-ai.local"),
  title: {
    default: "WebIntel AI",
    template: "%s | WebIntel AI",
  },
  description: "Know Any Website Before Anyone Else.",
  applicationName: "WebIntel AI",
  keywords: [
    "website intelligence",
    "seo audit",
    "website analyzer",
    "website screenshot tool",
    "tech stack detection",
    "ai website report",
  ],
};

const themeInitScript = getThemeInitScript({
  defaultTheme: DEFAULT_THEME,
  enableSystem: ENABLE_SYSTEM_THEME,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full"
    >
      <body className="noise-bg min-h-full bg-background text-foreground antialiased">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
        >
          {themeInitScript}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
