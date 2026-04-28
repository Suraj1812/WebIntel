import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="noise-bg min-h-full bg-background text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
