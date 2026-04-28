import { Scale, SplitSquareHorizontal } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import type { WebsiteReport } from "@/types/report";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { ScoreBar } from "@/components/shared/score-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ left?: string; right?: string }>;
}) {
  const user = await requireUser();
  const prisma = getPrisma();
  const reports = await prisma.report.findMany({
    where: { userId: user.id, status: "COMPLETE" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const { left, right } = await searchParams;
  const leftReport = reports.find((report) => report.id === left);
  const rightReport = reports.find((report) => report.id === right);
  const compared = [leftReport, rightReport].every(Boolean);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Competitor compare"
        title="Put two audits in the same frame so tradeoffs are obvious."
        description="Use compare mode for pitch prep, launch reviews, and competitor study. The point is not just to collect two reports. It is to make the decision easier."
        actions={
          <Button asChild href="/reports">
            Browse reports
          </Button>
        }
      />

      <section className="surface-panel rounded-[2.3rem] p-6 md:p-7">
        <form className="grid gap-5 lg:grid-cols-[1fr_1fr_auto]">
          <Input name="left" defaultValue={left} placeholder="Left report id" list="report-options" />
          <Input name="right" defaultValue={right} placeholder="Right report id" list="report-options" />
          <Button type="submit">Compare</Button>
        </form>
        <datalist id="report-options">
          {reports.map((report) => (
            <option key={report.id} value={report.id}>
              {report.domain}
            </option>
          ))}
        </datalist>
        {reports.length >= 2 ? (
          <div className="mt-4 text-sm leading-7 text-muted-foreground">
            Need a quick start?{" "}
            <Link
              href={`/compare?left=${reports[0].id}&right=${reports[1].id}`}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Compare your two newest completed audits
            </Link>
            .
          </div>
        ) : null}
      </section>

      {compared ? (
        <div className="space-y-6">
          <section className="surface-strong rounded-[2.3rem] p-6 md:p-7">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <Scale className="h-4 w-4" />
              Headline comparison
            </div>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              {leftReport!.domain} vs {rightReport!.domain}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <CompareReportCard label="Left report" report={leftReport!.reportData as WebsiteReport} />
              <CompareReportCard label="Right report" report={rightReport!.reportData as WebsiteReport} />
            </div>
          </section>

          <section className="surface-panel rounded-[2.3rem] p-6 md:p-7">
            <div className="text-sm font-medium text-muted-foreground">Score breakdown</div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <ScoreBar label={`${leftReport!.domain} SEO`} score={leftReport!.scoreOverall} detail="Overall strength based on the left audit." />
                <ScoreBar label={`${leftReport!.domain} Design`} score={(leftReport!.reportData as WebsiteReport).scorecards.design} />
                <ScoreBar label={`${leftReport!.domain} Trust`} score={(leftReport!.reportData as WebsiteReport).scorecards.trust} />
              </div>
              <div className="space-y-4">
                <ScoreBar label={`${rightReport!.domain} SEO`} score={rightReport!.scoreOverall} detail="Overall strength based on the right audit." />
                <ScoreBar label={`${rightReport!.domain} Design`} score={(rightReport!.reportData as WebsiteReport).scorecards.design} />
                <ScoreBar label={`${rightReport!.domain} Trust`} score={(rightReport!.reportData as WebsiteReport).scorecards.trust} />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <EmptyState
          icon={<SplitSquareHorizontal className="h-5 w-5" />}
          title="Pick two completed audits"
          description="Compare mode shines when you have two real reports to put side by side. Choose them above and this screen turns into a focused review workspace."
        />
      )}
    </div>
  );
}

function CompareReportCard({
  report,
  label,
}: {
  report: WebsiteReport;
  label: string;
}) {
  return (
    <div className="rounded-[2rem] border border-border bg-background/72 p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.05em]">{report.domain}</div>
      <div className="mt-3 text-sm leading-7 text-muted-foreground">{report.aiInsights.whatBusinessDoes}</div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="outline">SEO {report.scorecards.seo}</Badge>
        <Badge variant="outline">Design {report.scorecards.design}</Badge>
        <Badge variant="outline">Trust {report.scorecards.trust}</Badge>
        <Badge variant="outline">Conversion {report.scorecards.conversion}</Badge>
      </div>
    </div>
  );
}
