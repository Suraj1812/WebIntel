import { ArrowUpRight, ScanSearch } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { ScoreBar } from "@/components/shared/score-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatUtcDate } from "@/lib/utils";

export default async function ReportsPage() {
  const user = await requireUser();
  const reports = await getPrisma().report.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const completeCount = reports.filter((report) => report.status === "COMPLETE").length;

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Report library"
        title="Every audit stays usable after the moment it is created."
        description="This is the report memory of the workspace: recent audits, saved evidence, and the reports you will reuse in future reviews."
        actions={
          <Button asChild href="/scan">
            New audit
          </Button>
        }
        metadata={[
          { label: "Total reports", value: `${reports.length}` },
          { label: "Completed", value: `${completeCount}` },
        ]}
      />

      {reports.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="surface-panel rounded-[2rem] p-5 transition duration-200 hover:-translate-y-px hover:border-foreground/14"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold tracking-[-0.04em]">{report.domain}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">{report.url}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-5 space-y-4">
                <ScoreBar label="Overall signal" score={report.scoreOverall} />
                <div className="flex flex-wrap gap-2">
                  <Badge variant={report.status === "COMPLETE" ? "success" : "muted"}>{report.status}</Badge>
                  <Badge variant="outline">{formatUtcDate(report.createdAt)}</Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ScanSearch className="h-5 w-5" />}
          title="Your report library is empty"
          description="Run the first audit and this becomes a searchable record of the websites you review most often."
          actionLabel="Run first audit"
          actionHref="/scan"
        />
      )}
    </div>
  );
}
