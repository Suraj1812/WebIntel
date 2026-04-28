export type SubscriptionPlan = "FREE" | "PRO" | "BUSINESS";

export type ScanStepKey =
  | "fetching"
  | "rendering"
  | "screenshots"
  | "parsing"
  | "stack"
  | "seo"
  | "media"
  | "ai"
  | "ready";

export type ScanStep = {
  key: ScanStepKey;
  label: string;
  description: string;
};

export type SecurityHeaderInsight = {
  header: string;
  present: boolean;
  value?: string | null;
};

export type MediaAsset = {
  url: string;
  label: string;
  type: "image" | "video";
  alt?: string | null;
};

export type Scorecards = {
  seo: number;
  design: number;
  trust: number;
  conversion: number;
  speed: number;
  overall: number;
};

export type WebsiteReport = {
  url: string;
  normalizedUrl: string;
  domain: string;
  generatedAt: string;
  overview: {
    siteTitle: string;
    metaDescription: string;
    https: boolean;
    language: string | null;
    countryEstimate: string | null;
    firstSeenAt: string;
    faviconUrl: string | null;
    screenshotDesktop: string | null;
    screenshotMobile: string | null;
    screenshotFull: string | null;
  };
  design: {
    primaryColors: string[];
    fontFamilies: string[];
    uiStyleSummary: string;
    mobileFriendly: boolean;
    layoutQualityScore: number;
    freshness: "modern" | "mixed" | "dated";
  };
  seo: {
    titleStatus: string;
    metaDescriptionQuality: string;
    headings: { h1: number; h2: number; h3: number };
    imageAltCoverage: { withAlt: number; withoutAlt: number };
    canonical: string | null;
    sitemapFound: boolean;
    robotsFound: boolean;
    internalLinks: number;
    externalLinks: number;
    score: number;
  };
  techStack: {
    frameworks: string[];
    styles: string[];
    infrastructure: string[];
    analytics: string[];
    payments: string[];
    evidence: string[];
  };
  performance: {
    totalImages: number;
    scriptCount: number;
    stylesheetCount: number;
    lazyLoadingDetected: boolean;
    speedNotes: string[];
    heavyAssetWarnings: string[];
  };
  security: {
    https: boolean;
    headers: SecurityHeaderInsight[];
    hasCsp: boolean;
    hasHsts: boolean;
    mixedContentWarnings: string[];
    publicFormRiskNotes: string[];
  };
  content: {
    niche: string;
    targetAudience: string;
    businessModel: string;
    hasBlog: boolean;
    primaryCta: string;
    tone: string;
    summary: string;
  };
  media: {
    logo: MediaAsset | null;
    heroImages: MediaAsset[];
    socialPreview: MediaAsset | null;
    videos: MediaAsset[];
  };
  aiInsights: {
    whatBusinessDoes: string;
    monetizationModel: string;
    conversionAssessment: string;
    improvements: string[];
    growthOpportunities: string[];
    trustIssues: string[];
    brandPositioning: string;
    competitorSuggestions: string[];
  };
  scorecards: Scorecards;
  raw: {
    title: string;
    htmlExcerpt: string;
    metaTags: Record<string, string>;
    headings: string[];
    links: string[];
    images: string[];
    scripts: string[];
    stylesheets: string[];
  };
};

export type ScanStreamEvent =
  | { type: "progress"; step: ScanStepKey; message: string }
  | { type: "complete"; reportId: string }
  | { type: "error"; message: string };
