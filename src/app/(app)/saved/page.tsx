import { Bookmark } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { PageIntro } from "@/components/shared/page-intro";
import { Badge } from "@/components/ui/badge";

export default async function SavedPage() {
  const user = await requireUser();
  const savedReports = await getPrisma().savedReport.findMany({
    where: { userId: user.id },
    include: { report: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Saved benchmarks"
        title="Keep the important reports within one click."
        description="Saved reports are the pages you will compare against again, export again, and reference when new work lands."
        metadata={[{ label: "Saved", value: `${savedReports.length}` }]}
      />

      {savedReports.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {savedReports.map((item) => (
            <Link
              key={item.id}
              href={`/reports/${item.reportId}`}
              className="surface-panel rounded-[2rem] p-5 transition duration-200 hover:-translate-y-px hover:border-foreground/14"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold tracking-[-0.04em]">{item.report.domain}</div>
                  <div className="mt-2 text-sm leading-6 text-muted-foreground">{item.report.url}</div>
                </div>
                <Badge variant="accent">Saved</Badge>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge variant="outline">{item.report.scoreOverall}</Badge>
                <Badge variant="muted">{item.report.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Bookmark className="h-5 w-5" />}
          title="Nothing saved yet"
          description="When a report becomes part of your benchmark set, save it here so compare mode and future reviews start from the right references."
          actionLabel="Browse reports"
          actionHref="/reports"
        />
      )}
    </div>
  );
}
