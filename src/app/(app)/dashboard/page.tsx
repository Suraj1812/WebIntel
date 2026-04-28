import { ArrowUpRight, BellRing, Bookmark, Clock3, Radar, ScanSearch, Sparkles, SplitSquareHorizontal } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { PLAN_CONFIG } from "@/lib/constants";
import { getPrisma } from "@/lib/prisma";
import { formatRelativeDate, formatScore } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { ScoreBar } from "@/components/shared/score-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export default async function DashboardPage() {
  const user = await requireUser();
  const prisma = getPrisma();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [reports, savedReports, monthlyScans] = await Promise.all([
    prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.savedReport.findMany({
      where: { userId: user.id },
      include: { report: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.report.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
  ]);

  const plan = PLAN_CONFIG[user.plan];
  const averageScore = average(reports.map((report) => report.scoreOverall));
  const recentAverage = average(reports.slice(0, 3).map((report) => report.scoreOverall));
  const previousAverage = average(reports.slice(3, 6).map((report) => report.scoreOverall));
  const scoreMomentum = recentAverage - previousAverage;
  const trackedDomains = new Set(reports.map((report) => report.domain)).size;
  const compareCandidate = reports.length >= 2 ? reports.slice(0, 2) : [];
  const watchlist = Array.from(
    new Map(
      reports
        .filter((report) => report.status === "COMPLETE")
        .map((report) => [report.domain, report]),
    ).values(),
  ).slice(0, 4);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Workspace overview"
        title="Keep your benchmark library sharp."
        description="The product gets more useful every time you save, compare, and rerun a report. This dashboard is built around that loop."
        actions={
          <>
            <Button asChild variant="outline" href="/compare">
              Compare websites
            </Button>
            <Button asChild href="/scan">
              New audit
            </Button>
          </>
        }
        metadata={[
          { label: "Plan", value: user.plan },
          { label: "Tracked domains", value: `${trackedDomains}` },
          { label: "Saved benchmarks", value: `${savedReports.length}` },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="surface-strong rounded-[2.3rem] p-6 md:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Audit rhythm</div>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
                  A better benchmark library starts with consistent scans.
                </h2>
              </div>
              <ProgressMeter
                label={plan.monthlyScanCap ? "Monthly scan allowance" : "Healthy monthly cadence"}
                value={monthlyScans}
                max={plan.monthlyScanCap ?? plan.cadenceTarget}
                helper={
                  plan.monthlyScanCap
                    ? `${monthlyScans} of ${plan.monthlyScanCap} scans used this month.`
                    : `${monthlyScans} audits this month. ${plan.cadenceTarget}+ keeps competitor and launch reviews fresh.`
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Average report quality",
                  value: `${formatScore(averageScore)}`,
                  helper: scoreMomentum >= 0 ? `Up ${scoreMomentum} points vs prior batch` : `${scoreMomentum} points vs prior batch`,
                },
                {
                  label: "Recent scans",
                  value: `${reports.length}`,
                  helper: "Most recent reports visible in the workspace.",
                },
                {
                  label: "Saved benchmarks",
                  value: `${savedReports.length}`,
                  helper: "Pinned reports ready for comparison and exports.",
                },
                {
                  label: "Tracked domains",
                  value: `${trackedDomains}`,
                  helper: "Unique websites already scanned in this workspace.",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.8rem] border border-border bg-background/72 p-4">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{item.value}</div>
                  <div className="mt-3 text-sm leading-6 text-muted-foreground">{item.helper}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-panel rounded-[2.3rem] p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Suggested next move</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Turn one report into a workflow.</h2>
            </div>
            <Badge variant="accent">Retention</Badge>
          </div>
          {compareCandidate.length >= 2 ? (
            <div className="mt-6 rounded-[1.9rem] border border-border bg-background/76 p-5">
              <div className="text-sm text-muted-foreground">Quick compare recommendation</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                {compareCandidate[0].domain} vs {compareCandidate[1].domain}
              </div>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Compare your two freshest reports while details are still recent. It is the fastest route from audit to actual decision-making.
              </p>
              <Button asChild className="mt-5" href={`/compare?left=${compareCandidate[0].id}&right=${compareCandidate[1].id}`}>
                Open compare
              </Button>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.9rem] border border-border bg-background/76 p-5 text-sm leading-7 text-muted-foreground">
              Run at least two scans and this workspace starts surfacing compare-ready pairs automatically.
            </div>
          )}
          <div className="mt-6 space-y-3">
            {[
              {
                icon: Bookmark,
                title: "Save the important reports",
                copy: "Pinned benchmarks keep future reviews grounded.",
              },
              {
                icon: SplitSquareHorizontal,
                title: "Compare before you decide",
                copy: "Spot differences in trust, positioning, and design quality quickly.",
              },
              {
                icon: BellRing,
                title: "Revisit on a schedule",
                copy: "Historical scans make movement visible over time.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex gap-4 rounded-[1.5rem] border border-border bg-background/68 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm leading-6 text-muted-foreground">{item.copy}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="surface-panel rounded-[2.3rem] p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Recent scans</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Latest audits in the workspace</h2>
            </div>
            <Button asChild variant="outline" href="/reports">
              View all
            </Button>
          </div>
          <div className="mt-6 space-y-3">
            {reports.length ? (
              reports.slice(0, 6).map((report) => (
                <Link
                  key={report.id}
                  href={`/reports/${report.id}`}
                  className="flex flex-col gap-4 rounded-[1.8rem] border border-border bg-background/70 p-4 transition duration-200 hover:-translate-y-px hover:border-foreground/14"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold tracking-[-0.03em]">{report.domain}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{report.url}</div>
                    </div>
                    <Badge variant={report.status === "COMPLETE" ? "success" : "muted"}>{report.status}</Badge>
                  </div>
                  <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                    <ScoreBar label="Overall signal" score={report.scoreOverall} />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock3 className="h-4 w-4" />
                      {formatRelativeDate(report.createdAt)}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                icon={<ScanSearch className="h-5 w-5" />}
                title="No audits yet"
                description="Run the first website audit and the workspace will start building history, compare candidates, and saved benchmarks from there."
                actionLabel="Run first audit"
                actionHref="/scan"
              />
            )}
          </div>
        </section>

        <div className="space-y-6">
          <section className="surface-panel rounded-[2.3rem] p-6 md:p-7">
            <div className="text-sm font-medium text-muted-foreground">Watchlist</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Domains worth revisiting</h2>
            <div className="mt-6 space-y-4">
              {watchlist.length ? (
                watchlist.map((report) => (
                  <div key={report.id} className="rounded-[1.6rem] border border-border bg-background/72 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-semibold">{report.domain}</div>
                      <Badge variant="outline">{report.scoreOverall}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Last scanned {formatRelativeDate(report.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.6rem] border border-border bg-background/72 p-4 text-sm leading-7 text-muted-foreground">
                  As soon as you scan a few important domains, this area becomes your lightweight watchlist.
                </div>
              )}
            </div>
          </section>

          <section className="surface-panel rounded-[2.3rem] p-6 md:p-7">
            <div className="text-sm font-medium text-muted-foreground">Saved benchmarks</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Reports you already decided matter</h2>
            <div className="mt-6 space-y-3">
              {savedReports.length ? (
                savedReports.map((item) => (
                  <Link
                    key={item.id}
                    href={`/reports/${item.reportId}`}
                    className="flex items-center justify-between rounded-[1.5rem] border border-border bg-background/72 px-4 py-4 transition duration-200 hover:-translate-y-px"
                  >
                    <div>
                      <div className="font-semibold">{item.report.domain}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.report.url}</div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.6rem] border border-border bg-background/72 p-4 text-sm leading-7 text-muted-foreground">
                  Save the reports you reference most often and they become the backbone of your benchmark library.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: BellRing,
            title: "Historical rhythm",
            copy: "History makes score movement visible. That is the start of a real review cycle, not a one-time audit.",
          },
          {
            icon: Radar,
            title: "Shareable outputs",
            copy: "Saved reports and exports turn a private audit into something a wider team can act on quickly.",
          },
          {
            icon: Sparkles,
            title: "API and extensions",
            copy: "Business workspaces are positioned for programmatic reviews, recurring ops, and future browser-based collection flows.",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <section key={item.title} className="surface-panel rounded-[2rem] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.copy}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
