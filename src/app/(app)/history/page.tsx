import { ArrowUpRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { Badge } from "@/components/ui/badge";
import { formatUtcDateTime } from "@/lib/utils";

export default async function HistoryPage() {
  const user = await requireUser();
  const reports = await getPrisma().report.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const previousScores = new Map<string, number>();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Historical scans"
        title="Use history to see whether the site is actually improving."
        description="Chronology matters. History turns a stack of audits into a movement log for quality, trust, and conversion."
        metadata={[{ label: "Entries", value: `${reports.length}` }]}
      />

      {reports.length ? (
        <div className="space-y-4">
          {reports.map((report) => {
            const previousScore = previousScores.get(report.domain);
            previousScores.set(report.domain, report.scoreOverall);
            const delta = previousScore === undefined ? null : report.scoreOverall - previousScore;

            return (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="surface-panel flex flex-col gap-4 rounded-[2rem] p-5 transition duration-200 hover:-translate-y-px md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="text-lg font-semibold tracking-[-0.03em]">{report.domain}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{formatUtcDateTime(report.createdAt)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{report.scoreOverall}</Badge>
                  {delta !== null ? (
                    <Badge variant={delta >= 0 ? "success" : "warning"}>
                      {delta >= 0 ? `+${delta}` : `${delta}`}
                    </Badge>
                  ) : (
                    <Badge variant="muted">First entry</Badge>
                  )}
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Clock3 className="h-5 w-5" />}
          title="No history yet"
          description="Rerunning important domains over time is how this workspace becomes a real benchmark system."
          actionLabel="Run an audit"
          actionHref="/scan"
        />
      )}
    </div>
  );
}
