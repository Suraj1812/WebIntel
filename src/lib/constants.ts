import type { ScanStep, SubscriptionPlan } from "@/types/report";

export const APP_NAME = "WebIntel AI";
export const APP_TAGLINE = "Know Any Website Before Anyone Else.";

export const PLAN_CONFIG: Record<SubscriptionPlan, {
  id: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  bullets: string[];
  monthlyScanCap: number | null;
  cadenceTarget: number;
}> = {
  FREE: {
    id: "FREE",
    name: "Free",
    price: "$0",
    description: "For founders and marketers who need a fast first read on a website.",
    bullets: ["3 scans monthly", "Saved reports", "Core intelligence report"],
    monthlyScanCap: 3,
    cadenceTarget: 3,
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: "$39",
    description: "For consultants, agencies, and operators who audit sites every week.",
    bullets: ["Unlimited scans", "White-label PDF exports", "Compare mode and history"],
    monthlyScanCap: null,
    cadenceTarget: 20,
  },
  BUSINESS: {
    id: "BUSINESS",
    name: "Business",
    price: "$149",
    description: "For revenue teams that need a durable benchmark and reporting workspace.",
    bullets: ["Team workspace", "API access dashboard", "Priority exports and benchmarks"],
    monthlyScanCap: null,
    cadenceTarget: 60,
  },
};

export const SUBSCRIPTION_PLANS: Array<{
  id: SubscriptionPlan;
  name: string;
  price: string;
  description: string;
  bullets: string[];
}> = [
  PLAN_CONFIG.FREE,
  PLAN_CONFIG.PRO,
  PLAN_CONFIG.BUSINESS,
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
