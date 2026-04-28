"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { REPORT_SECTIONS } from "@/lib/constants";
import type { WebsiteReport } from "@/types/report";
import { ScoreRing } from "@/components/report/score-ring";
import { ReportExportButton } from "@/components/report/report-export-button";
import { SaveReportButton } from "@/components/report/save-report-button";

const labels: Record<(typeof REPORT_SECTIONS)[number], string> = {
  overview: "Overview",
  design: "Design",
  seo: "SEO",
  stack: "Tech Stack",
  performance: "Performance",
  security: "Security",
  content: "Content",
  media: "Media",
  insights: "AI Insights",
  scores: "Scores",
};

export function ReportShell({
  reportId,
  report,
  createdAt,
  isSaved,
}: {
  reportId: string;
  report: WebsiteReport;
  createdAt: string;
  isSaved: boolean;
}) {
  const [activeSection, setActiveSection] =
    useState<(typeof REPORT_SECTIONS)[number]>("overview");

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <DataRow label="Domain" value={report.domain} />
            <DataRow label="Site title" value={report.overview.siteTitle} />
            <DataRow label="Meta description" value={report.overview.metaDescription} />
            <DataRow label="Language" value={report.overview.language || "Unknown"} />
            <DataRow label="Country estimate" value={report.overview.countryEstimate || "Unknown"} />
            <DataRow label="HTTPS" value={report.overview.https ? "Enabled" : "Not detected"} />
            <DataRow label="First seen" value={new Date(createdAt).toLocaleString()} />
            <DataRow label="Favicon" value={report.overview.faviconUrl || "Not found"} />
          </div>
        );
      case "design":
        return (
          <div className="space-y-4">
            <DataRow label="UI style" value={report.design.uiStyleSummary} />
            <DataRow label="Mobile friendliness" value={report.design.mobileFriendly ? "Likely responsive" : "Needs validation"} />
            <DataRow label="Modernity assessment" value={report.design.freshness} />
            <DataRow label="Layout score" value={`${report.design.layoutQualityScore}/100`} />
            <div className="flex flex-wrap gap-2">
              {report.design.primaryColors.map((color) => (
                <div key={color} className="flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm">
                  <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: color }} />
                  {color}
                </div>
              ))}
            </div>
          </div>
        );
      case "seo":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <DataRow label="Title tag" value={report.seo.titleStatus} />
            <DataRow label="Meta description" value={report.seo.metaDescriptionQuality} />
            <DataRow label="Headings" value={`H1 ${report.seo.headings.h1} · H2 ${report.seo.headings.h2} · H3 ${report.seo.headings.h3}`} />
            <DataRow label="Image alt tags" value={`${report.seo.imageAltCoverage.withAlt} with alt / ${report.seo.imageAltCoverage.withoutAlt} missing`} />
            <DataRow label="Canonical" value={report.seo.canonical || "Not found"} />
            <DataRow label="Sitemap.xml" value={report.seo.sitemapFound ? "Found" : "Missing"} />
            <DataRow label="robots.txt" value={report.seo.robotsFound ? "Found" : "Missing"} />
            <DataRow label="Links" value={`${report.seo.internalLinks} internal · ${report.seo.externalLinks} external`} />
          </div>
        );
      case "stack":
        return (
          <TechStackSection
            groups={[
              ["Frameworks", report.techStack.frameworks],
              ["Styles", report.techStack.styles],
              ["Infrastructure", report.techStack.infrastructure],
              ["Analytics", report.techStack.analytics],
              ["Payments", report.techStack.payments],
            ]}
          />
        );
      case "performance":
        return (
          <div className="space-y-4">
            <DataRow label="Images" value={`${report.performance.totalImages}`} />
            <DataRow label="Scripts / styles" value={`${report.performance.scriptCount} scripts · ${report.performance.stylesheetCount} stylesheets`} />
            <DataRow label="Lazy loading" value={report.performance.lazyLoadingDetected ? "Detected" : "Not detected"} />
            <ListBlock title="Speed notes" items={report.performance.speedNotes} />
            <ListBlock title="Heavy asset warnings" items={report.performance.heavyAssetWarnings} />
          </div>
        );
      case "security":
        return (
          <div className="space-y-4">
            <DataRow label="HTTPS" value={report.security.https ? "Enabled" : "Not detected"} />
            <DataRow label="CSP / HSTS" value={`${report.security.hasCsp ? "CSP present" : "CSP missing"} · ${report.security.hasHsts ? "HSTS present" : "HSTS missing"}`} />
            <ListBlock title="Security headers" items={report.security.headers.map((item) => `${item.header}: ${item.present ? item.value || "Present" : "Missing"}`)} />
            <ListBlock title="Mixed content warnings" items={report.security.mixedContentWarnings} />
            <ListBlock title="Public form risks" items={report.security.publicFormRiskNotes} />
          </div>
        );
      case "content":
        return (
          <div className="space-y-4">
            <DataRow label="Niche" value={report.content.niche} />
            <DataRow label="Target audience" value={report.content.targetAudience} />
            <DataRow label="Selling" value={report.content.businessModel} />
            <DataRow label="Primary CTA" value={report.content.primaryCta} />
            <DataRow label="Tone" value={report.content.tone} />
            <DataRow label="Blog" value={report.content.hasBlog ? "Detected" : "Not found"} />
            <DataRow label="Summary" value={report.content.summary} />
          </div>
        );
      case "media":
        return (
          <div className="space-y-5">
            <MediaBlock title="Logo" items={report.media.logo ? [report.media.logo] : []} />
            <MediaBlock title="Hero images" items={report.media.heroImages} />
            <MediaBlock
              title="Social preview"
              items={report.media.socialPreview ? [report.media.socialPreview] : []}
            />
            <MediaBlock title="Videos" items={report.media.videos} />
          </div>
        );
      case "insights":
        return (
          <div className="space-y-5">
            <DataRow label="What the business does" value={report.aiInsights.whatBusinessDoes} />
            <DataRow label="Monetization model" value={report.aiInsights.monetizationModel} />
            <DataRow label="Conversion assessment" value={report.aiInsights.conversionAssessment} />
            <DataRow label="Brand positioning" value={report.aiInsights.brandPositioning} />
            <ListBlock title="Top improvements" items={report.aiInsights.improvements} />
            <ListBlock title="Growth opportunities" items={report.aiInsights.growthOpportunities} />
            <ListBlock title="Trust issues" items={report.aiInsights.trustIssues} />
            <ListBlock title="Competitor suggestions" items={report.aiInsights.competitorSuggestions} />
          </div>
        );
      case "scores":
        return (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ScoreRing label="SEO" score={report.scorecards.seo} />
            <ScoreRing label="Design" score={report.scorecards.design} />
            <ScoreRing label="Trust" score={report.scorecards.trust} />
            <ScoreRing label="Conversion" score={report.scorecards.conversion} />
            <ScoreRing label="Speed" score={report.scorecards.speed} />
            <ScoreRing label="Overall" score={report.scorecards.overall} />
          </div>
        );
      default:
        return null;
    }
  }, [activeSection, createdAt, report]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge>{report.domain}</Badge>
            <CardTitle className="mt-4 text-4xl">{report.overview.siteTitle || report.domain}</CardTitle>
            <CardDescription className="mt-2 max-w-3xl text-base">
              {report.overview.metaDescription || report.content.summary}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="accent">Overall {report.scorecards.overall}</Badge>
            <SaveReportButton reportId={reportId} initialSaved={isSaved} />
            <ReportExportButton reportId={reportId} />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[240px_1fr]">
        <Card className="h-fit">
          <CardContent className="space-y-2 p-4">
            {REPORT_SECTIONS.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm ${
                  activeSection === section
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{labels[section]}</span>
                <span className="font-mono text-xs">{labels[section].slice(0, 2).toUpperCase()}</span>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-5 p-6">
            {sectionContent}
            <Separator />
            <div className="grid gap-4 md:grid-cols-3">
              {report.overview.screenshotDesktop && (
                <ScreenshotCard title="Desktop" src={report.overview.screenshotDesktop} />
              )}
              {report.overview.screenshotMobile && (
                <ScreenshotCard title="Mobile" src={report.overview.screenshotMobile} />
              )}
              {report.overview.screenshotFull && (
                <ScreenshotCard title="Full page" src={report.overview.screenshotFull} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[26px] border border-border bg-background/45 p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-medium leading-7">{value}</div>
    </div>
  );
}

function TechStackSection({
  groups,
}: {
  groups: Array<[string, string[]]>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {groups.map(([label, items]) => (
        <div key={label} className="rounded-[26px] border border-border bg-background/45 p-4">
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {items.length ? items.map((item) => <Badge key={item}>{item}</Badge>) : <Badge variant="muted">None detected</Badge>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[26px] border border-border bg-background/45 p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-3 space-y-2">
        {items.length ? (
          items.map((item) => (
            <div key={item} className="rounded-2xl bg-background/65 px-3 py-2 text-sm">
              {item}
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No issues detected.</div>
        )}
      </div>
    </div>
  );
}

function MediaBlock({
  title,
  items,
}: {
  title: string;
  items: Array<{ url: string; label: string; type: string }>;
}) {
  return (
    <div className="space-y-3 rounded-[26px] border border-border bg-background/45 p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-[24px] border border-border bg-background/75 p-4 transition-colors hover:border-primary/30"
            >
              <div className="font-medium">{item.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{item.url}</div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No assets detected.</div>
      )}
    </div>
  );
}

function ScreenshotCard({ title, src }: { title: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-[26px] border border-border bg-background/45">
      <div className="border-b border-border px-4 py-3 text-sm text-muted-foreground">{title}</div>
      <img src={src} alt={title} className="aspect-[4/3] w-full object-cover" />
    </div>
  );
}
