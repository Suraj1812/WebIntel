import type { ScanStep, SubscriptionPlan } from "@/types/report";

export const APP_NAME = "WebIntel AI";
export const APP_TAGLINE = "Know Any Website Before Anyone Else.";

export const SUBSCRIPTION_PLANS: Array<{
  id: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  bullets: string[];
}> = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    description: "A lightweight entry point for founders and marketers validating sites.",
    bullets: ["3 scans monthly", "1 saved comparison", "Core intelligence report"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$39",
    description: "Built for agencies and consultants who need unlimited recurring audits.",
    bullets: ["Unlimited scans", "White-label PDF exports", "Compare mode + history"],
  },
  {
    id: "BUSINESS",
    name: "Business",
    price: "$149",
    description: "For revenue teams that need a durable intelligence workspace.",
    bullets: ["Team seats", "Priority AI analysis", "API access and usage insights"],
  },
];

export const SCAN_STEPS: ScanStep[] = [
  { key: "fetching", label: "Fetching website", description: "Validating the target and gathering headers." },
  { key: "rendering", label: "Rendering page", description: "Opening a browser context for dynamic content." },
  { key: "screenshots", label: "Taking screenshots", description: "Capturing desktop, mobile, and full-page evidence." },
  { key: "parsing", label: "Parsing HTML", description: "Extracting metadata, headings, links, images, and signals." },
  { key: "stack", label: "Detecting stack", description: "Reviewing assets, frameworks, analytics, and payment tooling." },
  { key: "seo", label: "SEO audit", description: "Scoring structure, discoverability, and content quality." },
  { key: "media", label: "Media extraction", description: "Pulling logos, hero art, social previews, and videos." },
  { key: "ai", label: "AI thinking", description: "Generating business, trust, and conversion insights." },
  { key: "ready", label: "Final report ready", description: "Packaging every section into a saved report." },
];

export const REPORT_SECTIONS = [
  "overview",
  "design",
  "seo",
  "stack",
  "performance",
  "security",
  "content",
  "media",
  "insights",
  "scores",
] as const;
