import type { WebsiteReport } from "@/types/report";

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateScorecards(
  report: Omit<WebsiteReport, "aiInsights">,
): WebsiteReport["scorecards"] {
  const seoBase =
    35 +
    (report.overview.siteTitle ? 12 : 0) +
    (report.overview.metaDescription ? 10 : 0) +
    Math.min(12, report.seo.headings.h1 * 8) +
    Math.min(8, report.seo.headings.h2 * 2) +
    (report.seo.canonical ? 5 : 0) +
    (report.seo.sitemapFound ? 6 : 0) +
    (report.seo.robotsFound ? 4 : 0) +
    Math.min(8, report.seo.imageAltCoverage.withAlt);

  const designBase =
    30 +
    Math.min(20, report.design.primaryColors.length * 4) +
    Math.min(15, report.design.fontFamilies.length * 4) +
    (report.design.mobileFriendly ? 15 : 0) +
    report.design.layoutQualityScore * 0.2 +
    (report.design.freshness === "modern"
      ? 10
      : report.design.freshness === "mixed"
        ? 5
        : 0);

  const trustBase =
    30 +
    (report.security.https ? 20 : 0) +
    (report.security.hasCsp ? 12 : 0) +
    (report.security.hasHsts ? 10 : 0) +
    (report.content.primaryCta ? 6 : 0) -
    report.security.publicFormRiskNotes.length * 5 -
    report.security.mixedContentWarnings.length * 6;

  const conversionBase =
    30 +
    (report.content.primaryCta ? 18 : 0) +
    (report.content.summary ? 10 : 0) +
    Math.min(10, report.media.heroImages.length * 4) +
    (report.content.hasBlog ? 5 : 0) +
    Math.max(0, 15 - report.performance.heavyAssetWarnings.length * 3);

  const speedBase =
    72 -
    report.performance.heavyAssetWarnings.length * 8 -
    Math.max(0, report.performance.totalImages - 25) * 1.2 -
    Math.max(0, report.performance.scriptCount - 18) * 1.6 +
    (report.performance.lazyLoadingDetected ? 10 : 0);

  const seo = clamp(seoBase);
  const design = clamp(designBase);
  const trust = clamp(trustBase);
  const conversion = clamp(conversionBase);
  const speed = clamp(speedBase);
  const overall = clamp(seo * 0.24 + design * 0.2 + trust * 0.2 + conversion * 0.18 + speed * 0.18);

  return { seo, design, trust, conversion, speed, overall };
}
