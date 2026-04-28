"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookImage, Clock3, Globe2, ImageIcon, Radar, SearchCheck, ShieldCheck, SplitSquareHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { REPORT_SECTIONS } from "@/lib/constants";
import type { WebsiteReport } from "@/types/report";
import { ScoreRing } from "@/components/report/score-ring";
import { ReportExportButton } from "@/components/report/report-export-button";
import { SaveReportButton } from "@/components/report/save-report-button";
import { ShareReportButton } from "@/components/report/share-report-button";
import { ScoreBar } from "@/components/shared/score-bar";

const labels: Record<(typeof REPORT_SECTIONS)[number], string> = {
  overview: "Overview",
  design: "Design intelligence",
  seo: "SEO audit",
  stack: "Tech stack",
  performance: "Performance",
  security: "Security",
  content: "Content",
  media: "Media",
  insights: "AI insights",
  scores: "Scorecards",
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

  useEffect(() => {
    const elements = REPORT_SECTIONS.map((section) =>
      document.getElementById(`report-${section}`),
    ).filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];

        if (visible?.target instanceof HTMLElement) {
          setActiveSection(visible.target.dataset.section as (typeof REPORT_SECTIONS)[number]);
        }
      },
      {
        rootMargin: "-18% 0px -60% 0px",
        threshold: [0.18, 0.45],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const sections = useMemo(
    () => [
      {
        id: "overview" as const,
        label: labels.overview,
        content: (
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard label="Domain" value={report.domain} />
            <MetricCard label="Site title" value={report.overview.siteTitle || "Not detected"} />
            <MetricCard label="Meta description" value={report.overview.metaDescription || "Not detected"} />
            <MetricCard label="Language" value={report.overview.language || "Unknown"} />
            <MetricCard label="Country estimate" value={report.overview.countryEstimate || "Unknown"} />
            <MetricCard label="HTTPS" value={report.overview.https ? "Enabled" : "Not detected"} />
            <MetricCard label="First seen" value={new Date(createdAt).toLocaleString()} />
            <MetricCard label="Favicon" value={report.overview.faviconUrl || "Not found"} />
          </div>
        ),
      },
      {
        id: "design" as const,
        label: labels.design,
        content: (
          <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <section className="space-y-4">
              <MetricCard label="UI style" value={report.design.uiStyleSummary} />
              <MetricCard label="Modernity" value={report.design.freshness} />
              <MetricCard label="Layout quality" value={`${report.design.layoutQualityScore}/100`} />
              <MetricCard label="Mobile friendliness" value={report.design.mobileFriendly ? "Likely responsive" : "Needs a manual mobile check"} />
            </section>
            <section className="space-y-4">
              <SurfaceBlock title="Primary colors">
                <div className="flex flex-wrap gap-3">
                  {report.design.primaryColors.length ? (
                    report.design.primaryColors.map((color) => (
                      <div key={color} className="flex items-center gap-3 rounded-full border border-border bg-background/72 px-4 py-2 text-sm">
                        <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: color }} />
                        {color}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No dominant palette detected.</div>
                  )}
                </div>
              </SurfaceBlock>
              <SurfaceBlock title="Font families">
                <div className="flex flex-wrap gap-3">
                  {report.design.fontFamilies.length ? (
                    report.design.fontFamilies.map((font) => (
                      <div key={font} className="rounded-full border border-border bg-background/72 px-4 py-2 text-sm">
                        {font}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">No reliable font family signal extracted.</div>
                  )}
                </div>
              </SurfaceBlock>
            </section>
          </div>
        ),
      },
      {
        id: "seo" as const,
        label: labels.seo,
        content: (
          <div className="space-y-5">
            <ScoreBar label="SEO score" score={report.seo.score} detail="Structure, discoverability, and crawl-readiness." />
            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard label="Title tag" value={report.seo.titleStatus} />
              <MetricCard label="Meta description quality" value={report.seo.metaDescriptionQuality} />
              <MetricCard label="Headings" value={`H1 ${report.seo.headings.h1} · H2 ${report.seo.headings.h2} · H3 ${report.seo.headings.h3}`} />
              <MetricCard label="Image alt coverage" value={`${report.seo.imageAltCoverage.withAlt} with alt · ${report.seo.imageAltCoverage.withoutAlt} missing`} />
              <MetricCard label="Canonical tag" value={report.seo.canonical || "Not found"} />
              <MetricCard label="Sitemap and robots" value={`${report.seo.sitemapFound ? "Sitemap found" : "No sitemap"} · ${report.seo.robotsFound ? "robots.txt found" : "No robots.txt"}`} />
              <MetricCard label="Internal links" value={`${report.seo.internalLinks}`} />
              <MetricCard label="External links" value={`${report.seo.externalLinks}`} />
            </div>
          </div>
        ),
      },
      {
        id: "stack" as const,
        label: labels.stack,
        content: (
          <div className="grid gap-4 md:grid-cols-2">
            <TechStackGroup title="Frameworks" items={report.techStack.frameworks} />
            <TechStackGroup title="Styles" items={report.techStack.styles} />
            <TechStackGroup title="Infrastructure" items={report.techStack.infrastructure} />
            <TechStackGroup title="Analytics" items={report.techStack.analytics} />
            <TechStackGroup title="Payments" items={report.techStack.payments} />
            <TechStackGroup title="Detection evidence" items={report.techStack.evidence} />
          </div>
        ),
      },
      {
        id: "performance" as const,
        label: labels.performance,
        content: (
          <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard label="Images" value={`${report.performance.totalImages}`} />
              <MetricCard label="Scripts" value={`${report.performance.scriptCount}`} />
              <MetricCard label="Stylesheets" value={`${report.performance.stylesheetCount}`} />
              <MetricCard label="Lazy loading" value={report.performance.lazyLoadingDetected ? "Detected" : "Not detected"} />
            </div>
            <div className="space-y-4">
              <SurfaceBlock title="Speed notes">
                <ListRows items={report.performance.speedNotes} emptyLabel="No speed notes captured." />
              </SurfaceBlock>
              <SurfaceBlock title="Heavy asset warnings">
                <ListRows items={report.performance.heavyAssetWarnings} emptyLabel="No heavy asset warnings detected." />
              </SurfaceBlock>
            </div>
          </div>
        ),
      },
      {
        id: "security" as const,
        label: labels.security,
        content: (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <MetricCard label="HTTPS" value={report.security.https ? "Enabled" : "Not detected"} />
              <MetricCard label="Protection headers" value={`${report.security.hasCsp ? "CSP present" : "CSP missing"} · ${report.security.hasHsts ? "HSTS present" : "HSTS missing"}`} />
            </div>
            <SurfaceBlock title="Security headers">
              <ListRows
                items={report.security.headers.map(
                  (item) => `${item.header}: ${item.present ? item.value || "Present" : "Missing"}`,
                )}
                emptyLabel="No header evidence captured."
              />
            </SurfaceBlock>
            <div className="grid gap-4 md:grid-cols-2">
              <SurfaceBlock title="Mixed content warnings">
                <ListRows items={report.security.mixedContentWarnings} emptyLabel="No mixed content issues found." />
              </SurfaceBlock>
              <SurfaceBlock title="Public form risk notes">
                <ListRows items={report.security.publicFormRiskNotes} emptyLabel="No public form risks noted." />
              </SurfaceBlock>
            </div>
          </div>
        ),
      },
      {
        id: "content" as const,
        label: labels.content,
        content: (
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard label="Niche" value={report.content.niche} />
            <MetricCard label="Target audience" value={report.content.targetAudience} />
            <MetricCard label="Business model" value={report.content.businessModel} />
            <MetricCard label="Primary CTA" value={report.content.primaryCta} />
            <MetricCard label="Tone" value={report.content.tone} />
            <MetricCard label="Blog" value={report.content.hasBlog ? "Detected" : "Not found"} />
            <div className="md:col-span-2">
              <MetricCard label="Summary" value={report.content.summary} />
            </div>
          </div>
        ),
      },
      {
        id: "media" as const,
        label: labels.media,
        content: (
          <div className="space-y-4">
            <SurfaceBlock title="Logo">
              <MediaRows items={report.media.logo ? [report.media.logo] : []} emptyLabel="No logo asset detected." />
            </SurfaceBlock>
            <SurfaceBlock title="Hero images">
              <MediaRows items={report.media.heroImages} emptyLabel="No hero images detected." />
            </SurfaceBlock>
            <SurfaceBlock title="Social preview">
              <MediaRows items={report.media.socialPreview ? [report.media.socialPreview] : []} emptyLabel="No social preview image detected." />
            </SurfaceBlock>
            <SurfaceBlock title="Videos">
              <MediaRows items={report.media.videos} emptyLabel="No video embeds detected." />
            </SurfaceBlock>
          </div>
        ),
      },
      {
        id: "insights" as const,
        label: labels.insights,
        content: (
          <div className="space-y-4">
            <MetricCard label="What this business does" value={report.aiInsights.whatBusinessDoes} />
            <MetricCard label="Monetization model" value={report.aiInsights.monetizationModel} />
            <MetricCard label="Conversion assessment" value={report.aiInsights.conversionAssessment} />
            <MetricCard label="Brand positioning" value={report.aiInsights.brandPositioning} />
            <div className="grid gap-4 md:grid-cols-2">
              <SurfaceBlock title="Improvement priorities">
                <ListRows items={report.aiInsights.improvements} emptyLabel="No improvements listed." />
              </SurfaceBlock>
              <SurfaceBlock title="Growth opportunities">
                <ListRows items={report.aiInsights.growthOpportunities} emptyLabel="No growth opportunities listed." />
              </SurfaceBlock>
              <SurfaceBlock title="Trust issues">
                <ListRows items={report.aiInsights.trustIssues} emptyLabel="No trust issues surfaced." />
              </SurfaceBlock>
              <SurfaceBlock title="Competitor suggestions">
                <ListRows items={report.aiInsights.competitorSuggestions} emptyLabel="No competitor suggestions listed." />
              </SurfaceBlock>
            </div>
          </div>
        ),
      },
      {
        id: "scores" as const,
        label: labels.scores,
        content: (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ScoreRing label="SEO" score={report.scorecards.seo} />
            <ScoreRing label="Design" score={report.scorecards.design} />
            <ScoreRing label="Trust" score={report.scorecards.trust} />
            <ScoreRing label="Conversion" score={report.scorecards.conversion} />
            <ScoreRing label="Speed" score={report.scorecards.speed} />
            <ScoreRing label="Overall" score={report.scorecards.overall} />
          </div>
        ),
      },
    ],
    [createdAt, report],
  );

  return (
    <div className="space-y-6">
      <section className="surface-strong rounded-[2.5rem] p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{report.domain}</Badge>
              <Badge variant="outline">
                <Clock3 className="mr-1 h-3.5 w-3.5" />
                {new Date(createdAt).toLocaleString()}
              </Badge>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl">
                {report.overview.siteTitle || report.domain}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
                {report.overview.metaDescription || report.content.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <SaveReportButton reportId={reportId} initialSaved={isSaved} />
              <ShareReportButton />
              <ReportExportButton reportId={reportId} />
              <ReportExportButton reportId={reportId} whiteLabel />
              <Button asChild variant="outline" href={`/compare?left=${reportId}`}>
                <SplitSquareHorizontal className="h-4 w-4" />
                Compare
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryChip icon={Globe2} label="Language" value={report.overview.language || "Unknown"} />
              <SummaryChip icon={SearchCheck} label="SEO score" value={`${report.scorecards.seo}`} />
              <SummaryChip icon={ShieldCheck} label="Trust score" value={`${report.scorecards.trust}`} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-background/78 p-4">
            {report.overview.screenshotDesktop ? (
              <Image
                src={report.overview.screenshotDesktop}
                alt={`${report.domain} desktop screenshot`}
                width={1400}
                height={920}
                unoptimized
                className="h-full max-h-[24rem] w-full rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="flex min-h-[20rem] items-center justify-center rounded-[1.5rem] border border-dashed border-border bg-background/66 text-sm text-muted-foreground">
                Screenshot unavailable for this scan.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <div className="surface-panel sticky top-6 rounded-[2rem] p-5">
            <div className="text-sm font-medium text-muted-foreground">Overall score</div>
            <div className="mt-3 text-5xl font-semibold tracking-[-0.06em]">{report.scorecards.overall}</div>
            <div className="mt-2 text-sm leading-7 text-muted-foreground">
              A fast read on how this site performs across the report.
            </div>
            <div className="mt-6 space-y-4">
              <ScoreBar label="SEO" score={report.scorecards.seo} />
              <ScoreBar label="Design" score={report.scorecards.design} />
              <ScoreBar label="Trust" score={report.scorecards.trust} />
              <ScoreBar label="Conversion" score={report.scorecards.conversion} />
              <ScoreBar label="Speed" score={report.scorecards.speed} />
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-4">
            <div className="text-sm font-medium text-muted-foreground">Jump to section</div>
            <div className="mt-3 space-y-1.5">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    document.getElementById(`report-${section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`flex w-full items-center justify-between rounded-[1.2rem] px-3 py-3 text-sm transition duration-200 ${
                    activeSection === section.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground"
                  }`}
                >
                  <span>{section.label}</span>
                  <span className="font-mono text-[0.72rem]">
                    {section.label.slice(0, 2).toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="surface-panel rounded-[2rem] p-5">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Radar className="h-4 w-4" />
              Keep the loop going
            </div>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
              <p>Save this report if it should become part of your benchmark set.</p>
              <p>Compare it against a competitor next so positioning and trust gaps are easier to discuss.</p>
              <p>Rerun it later to see whether changes move the score for the right reasons.</p>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={`report-${section.id}`}
              data-section={section.id}
              className="surface-panel report-anchor rounded-[2.3rem] p-6 md:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">{section.label}</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{section.label}</h2>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <Separator className="my-5" />
              {section.content}
              {section.id === "overview" ? (
                <>
                  <Separator className="my-5" />
                  <ScreenshotGallery report={report} />
                </>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Globe2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-border bg-background/72 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-3 text-lg font-semibold tracking-[-0.03em]">{value}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.8rem] border border-border bg-background/72 p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-medium leading-7">{value}</div>
    </div>
  );
}

function SurfaceBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-border bg-background/72 p-4">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TechStackGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <SurfaceBlock title={title}>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <Badge key={item} variant="outline">
              {item}
            </Badge>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">None detected.</div>
        )}
      </div>
    </SurfaceBlock>
  );
}

function ListRows({
  items,
  emptyLabel,
}: {
  items: string[];
  emptyLabel: string;
}) {
  return items.length ? (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="rounded-[1.2rem] bg-card px-3 py-3 text-sm leading-6">
          {item}
        </div>
      ))}
    </div>
  ) : (
    <div className="text-sm text-muted-foreground">{emptyLabel}</div>
  );
}

function MediaRows({
  items,
  emptyLabel,
}: {
  items: Array<{ url: string; label: string; type: string }>;
  emptyLabel: string;
}) {
  return items.length ? (
    <div className="space-y-2">
      {items.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-start justify-between rounded-[1.2rem] border border-border bg-card px-4 py-3 text-sm transition duration-200 hover:-translate-y-px"
        >
          <div className="pr-4">
            <div className="font-medium">{item.label}</div>
            <div className="mt-1 text-muted-foreground">{item.url}</div>
          </div>
          {item.type === "video" ? <BookImage className="mt-1 h-4 w-4 text-muted-foreground" /> : <ImageIcon className="mt-1 h-4 w-4 text-muted-foreground" />}
        </a>
      ))}
    </div>
  ) : (
    <div className="text-sm text-muted-foreground">{emptyLabel}</div>
  );
}

function ScreenshotGallery({ report }: { report: WebsiteReport }) {
  const screenshots = [
    { label: "Desktop", src: report.overview.screenshotDesktop },
    { label: "Mobile", src: report.overview.screenshotMobile },
    { label: "Full page", src: report.overview.screenshotFull },
  ].filter((item): item is { label: string; src: string } => Boolean(item.src));

  return screenshots.length ? (
    <div className="grid gap-4 md:grid-cols-3">
      {screenshots.map((shot) => (
        <div key={shot.label} className="overflow-hidden rounded-[1.8rem] border border-border bg-background/72">
          <div className="border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">{shot.label}</div>
          <Image
            src={shot.src}
            alt={shot.label}
            width={1280}
            height={900}
            unoptimized
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      ))}
    </div>
  ) : (
    <div className="rounded-[1.8rem] border border-dashed border-border bg-background/72 px-4 py-6 text-sm text-muted-foreground">
      No screenshots were captured for this scan.
    </div>
  );
}
