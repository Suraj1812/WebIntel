import { ReportStatus } from "@prisma/client";
import { getEnv } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";
import { assertSafePublicUrl } from "@/lib/security";
import type { ScanStepKey, WebsiteReport } from "@/types/report";
import { generateAiInsights } from "@/services/openai/report-insights";
import { calculateScorecards } from "@/services/reports/scoring";
import { buildScraperAssetUrl } from "@/services/storage/local-storage";
import { logUsage } from "@/services/usage";

type ScraperAsset = {
  url: string;
  label: string;
  type: "image" | "video";
  alt?: string | null;
};

type ScraperPayload = {
  url: string;
  normalized_url: string;
  domain: string;
  fetched_at: string;
  title: string;
  meta_description: string;
  language: string | null;
  country_estimate: string | null;
  favicon_url: string | null;
  https: boolean;
  html_excerpt: string;
  meta_tags: Record<string, string>;
  screenshots: {
    desktop: string | null;
    mobile: string | null;
    full: string | null;
  };
  colors: string[];
  fonts: string[];
  ui_summary: string;
  mobile_friendly: boolean;
  layout_quality_score: number;
  freshness: "modern" | "mixed" | "dated";
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  links: Array<{
    href: string;
    text: string;
    kind: "internal" | "external";
  }>;
  images: Array<{
    src: string;
    alt?: string | null;
    loading?: string | null;
    role?: string | null;
  }>;
  scripts: string[];
  stylesheets: string[];
  frameworks: string[];
  styles: string[];
  infrastructure: string[];
  analytics: string[];
  payments: string[];
  evidence: string[];
  performance: {
    image_count: number;
    script_count: number;
    stylesheet_count: number;
    lazy_loading_detected: boolean;
    speed_notes: string[];
    heavy_asset_warnings: string[];
  };
  security_headers: Record<string, string>;
  mixed_content_warnings: string[];
  public_form_risk_notes: string[];
  content: {
    niche: string;
    target_audience: string;
    business_model: string;
    has_blog: boolean;
    primary_cta: string;
    tone: string;
    summary: string;
  };
  media: {
    logo: ScraperAsset | null;
    hero_images: ScraperAsset[];
    social_preview: ScraperAsset | null;
    videos: ScraperAsset[];
  };
};

export async function enforcePlanScanLimit(userId: string, plan: string) {
  if (plan !== "FREE") {
    return;
  }

  const prisma = getPrisma();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const usedScans = await prisma.report.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth,
      },
      status: {
        not: ReportStatus.FAILED,
      },
    },
  });

  if (usedScans >= getEnv().FREE_PLAN_MONTHLY_SCANS) {
    throw new Error("Free plan usage limit reached. Upgrade to Pro for unlimited scans.");
  }
}

export async function runScanPipeline({
  userId,
  userPlan,
  inputUrl,
  onProgress,
}: {
  userId: string;
  userPlan: string;
  inputUrl: string;
  onProgress: (step: ScanStepKey, message: string) => Promise<void> | void;
}) {
  await enforcePlanScanLimit(userId, userPlan);
  const safeUrl = await assertSafePublicUrl(inputUrl);
  const prisma = getPrisma();

  const report = await prisma.report.create({
    data: {
      userId,
      url: inputUrl,
      normalizedUrl: safeUrl.toString(),
      domain: safeUrl.hostname,
      status: ReportStatus.PROCESSING,
      progressStep: "fetching",
    },
  });

  await logUsage(userId, "SCAN_STARTED", {
    reportId: report.id,
    url: safeUrl.toString(),
  });

  try {
    await emitProgress(prisma, report.id, "fetching", "Target validated and request accepted.", onProgress);
    await emitProgress(prisma, report.id, "rendering", "Rendering the website inside a browser context.", onProgress);
    const scraperPayload = await fetchScraperPayload(safeUrl.toString());
    await emitProgress(prisma, report.id, "screenshots", "Desktop, mobile, and full-page captures completed.", onProgress);
    await emitProgress(prisma, report.id, "parsing", "Parsing page structure, content, and metadata.", onProgress);

    const baseReport = buildReportFromScraper(scraperPayload);
    await emitProgress(prisma, report.id, "stack", "Mapping frameworks, analytics, and infrastructure clues.", onProgress);
    await emitProgress(prisma, report.id, "seo", "Scoring discoverability and content structure.", onProgress);
    await emitProgress(prisma, report.id, "media", "Curating the strongest media and screenshot evidence.", onProgress);

    const scorecards = calculateScorecards(baseReport);
    const reportDraft = {
      ...baseReport,
      scorecards,
    };

    await emitProgress(prisma, report.id, "ai", "Generating AI business, trust, and growth insights.", onProgress);
    const aiInsights = await generateAiInsights(reportDraft);

    const finalReport: WebsiteReport = {
      ...reportDraft,
      aiInsights,
    };

    await emitProgress(prisma, report.id, "ready", "Saving the finished report.", onProgress);

    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: ReportStatus.COMPLETE,
        progressStep: "ready",
        rawData: scraperPayload as unknown as object,
        reportData: finalReport as unknown as object,
        aiSummary: finalReport.aiInsights.whatBusinessDoes,
        scoreOverall: finalReport.scorecards.overall,
        screenshotDesktop: scraperPayload.screenshots.desktop,
        screenshotMobile: scraperPayload.screenshots.mobile,
        screenshotFull: scraperPayload.screenshots.full,
      },
    });

    await logUsage(userId, "SCAN_COMPLETED", {
      reportId: report.id,
      domain: finalReport.domain,
      overall: finalReport.scorecards.overall,
    });

    return report.id;
  } catch (error) {
    await prisma.report.update({
      where: { id: report.id },
      data: {
        status: ReportStatus.FAILED,
        errorMessage: error instanceof Error ? error.message : "Unknown scan failure.",
      },
    });

    await logUsage(userId, "SCAN_FAILED", {
      reportId: report.id,
      message: error instanceof Error ? error.message : "Unknown failure",
    });

    throw error;
  }
}

async function emitProgress(
  prisma: ReturnType<typeof getPrisma>,
  reportId: string,
  step: ScanStepKey,
  message: string,
  onProgress: (step: ScanStepKey, message: string) => Promise<void> | void,
) {
  await prisma.report.update({
    where: { id: reportId },
    data: {
      progressStep: step,
    },
  });

  await onProgress(step, message);
}

async function fetchScraperPayload(url: string): Promise<ScraperPayload> {
  const response = await fetch(`${getEnv().SCRAPER_SERVICE_URL}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Scraper request failed: ${payload}`);
  }

  return response.json() as Promise<ScraperPayload>;
}

function buildReportFromScraper(scrape: ScraperPayload): Omit<WebsiteReport, "aiInsights"> {
  const internalLinks = scrape.links.filter((link) => link.kind === "internal").length;
  const externalLinks = scrape.links.filter((link) => link.kind === "external").length;
  const imagesWithAlt = scrape.images.filter((image) => image.alt?.trim()).length;
  const imagesWithoutAlt = scrape.images.length - imagesWithAlt;
  const securityHeaderEntries = Object.entries(scrape.security_headers);

  const draft: Omit<WebsiteReport, "aiInsights"> = {
    url: scrape.url,
    normalizedUrl: scrape.normalized_url,
    domain: scrape.domain,
    generatedAt: scrape.fetched_at,
    overview: {
      siteTitle: scrape.title,
      metaDescription: scrape.meta_description,
      https: scrape.https,
      language: scrape.language,
      countryEstimate: scrape.country_estimate,
      firstSeenAt: scrape.fetched_at,
      faviconUrl: scrape.favicon_url,
      screenshotDesktop: buildScraperAssetUrl(scrape.screenshots.desktop),
      screenshotMobile: buildScraperAssetUrl(scrape.screenshots.mobile),
      screenshotFull: buildScraperAssetUrl(scrape.screenshots.full),
    },
    design: {
      primaryColors: scrape.colors,
      fontFamilies: scrape.fonts,
      uiStyleSummary: scrape.ui_summary,
      mobileFriendly: scrape.mobile_friendly,
      layoutQualityScore: scrape.layout_quality_score,
      freshness: scrape.freshness,
    },
    seo: {
      titleStatus: scrape.title ? "Present" : "Missing",
      metaDescriptionQuality: scrape.meta_description ? "Present" : "Missing",
      headings: {
        h1: scrape.headings.h1.length,
        h2: scrape.headings.h2.length,
        h3: scrape.headings.h3.length,
      },
      imageAltCoverage: {
        withAlt: imagesWithAlt,
        withoutAlt: imagesWithoutAlt,
      },
      canonical: scrape.meta_tags.canonical || null,
      sitemapFound: Boolean(scrape.meta_tags.sitemap),
      robotsFound: Boolean(scrape.meta_tags.robots_txt),
      internalLinks,
      externalLinks,
      score: 0,
    },
    techStack: {
      frameworks: scrape.frameworks,
      styles: scrape.styles,
      infrastructure: scrape.infrastructure,
      analytics: scrape.analytics,
      payments: scrape.payments,
      evidence: scrape.evidence,
    },
    performance: {
      totalImages: scrape.performance.image_count,
      scriptCount: scrape.performance.script_count,
      stylesheetCount: scrape.performance.stylesheet_count,
      lazyLoadingDetected: scrape.performance.lazy_loading_detected,
      speedNotes: scrape.performance.speed_notes,
      heavyAssetWarnings: scrape.performance.heavy_asset_warnings,
    },
    security: {
      https: scrape.https,
      headers: securityHeaderEntries.map(([header, value]) => ({
        header,
        present: Boolean(value),
        value,
      })),
      hasCsp: Boolean(scrape.security_headers["content-security-policy"]),
      hasHsts: Boolean(scrape.security_headers["strict-transport-security"]),
      mixedContentWarnings: scrape.mixed_content_warnings,
      publicFormRiskNotes: scrape.public_form_risk_notes,
    },
    content: {
      niche: scrape.content.niche,
      targetAudience: scrape.content.target_audience,
      businessModel: scrape.content.business_model,
      hasBlog: scrape.content.has_blog,
      primaryCta: scrape.content.primary_cta,
      tone: scrape.content.tone,
      summary: scrape.content.summary,
    },
    media: {
      logo: mapMediaAsset(scrape.media.logo),
      heroImages: scrape.media.hero_images.map(mapMediaAsset).filter(Boolean) as WebsiteReport["media"]["heroImages"],
      socialPreview: mapMediaAsset(scrape.media.social_preview),
      videos: scrape.media.videos.map(mapMediaAsset).filter(Boolean) as WebsiteReport["media"]["videos"],
    },
    scorecards: {
      seo: 0,
      design: 0,
      trust: 0,
      conversion: 0,
      speed: 0,
      overall: 0,
    },
    raw: {
      title: scrape.title,
      htmlExcerpt: scrape.html_excerpt,
      metaTags: scrape.meta_tags,
      headings: [
        ...scrape.headings.h1,
        ...scrape.headings.h2,
        ...scrape.headings.h3,
      ],
      links: scrape.links.map((link) => link.href),
      images: scrape.images.map((image) => image.src),
      scripts: scrape.scripts,
      stylesheets: scrape.stylesheets,
    },
  };

  draft.scorecards = calculateScorecards(draft);
  draft.seo.score = draft.scorecards.seo;

  return draft;
}

function mapMediaAsset(asset: ScraperAsset | null) {
  if (!asset) {
    return null;
  }

  return {
    ...asset,
    url: asset.url.startsWith("http") ? asset.url : buildScraperAssetUrl(asset.url) || asset.url,
  };
}
