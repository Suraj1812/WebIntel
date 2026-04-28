import { ArrowUpRight, Bookmark, Clock3, ScanSearch, TrendingUp } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { formatRelativeDate } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();
  const prisma = getPrisma();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [reports, savedCount] = await Promise.all([
    prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.savedReport.count({
      where: { userId: user.id },
    }),
  ]);

  const monthlyScans = reports.filter((report) => report.createdAt >= startOfMonth).length;
  const averageScore = reports.length
    ? Math.round(reports.reduce((acc, report) => acc + report.scoreOverall, 0) / reports.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly scans"
          value={`${monthlyScans}`}
          helper="Usage for the current billing month."
          icon={<ScanSearch className="h-5 w-5" />}
        />
        <StatCard
          label="Average score"
          value={`${averageScore}`}
          helper="Average overall report quality score."
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Saved reports"
          value={`${savedCount}`}
          helper="Pinned reports ready for comparison."
          icon={<Bookmark className="h-5 w-5" />}
        />
        <StatCard
          label="Plan"
          value={user.plan}
          helper="Current workspace subscription level."
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent scans</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Review recent analyses, rerun them, or open a saved report.
            </p>
          </div>
          <Button asChild href="/scan">
            New scan
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {reports.length ? (
            reports.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="flex flex-col gap-3 rounded-[26px] border border-border bg-background/45 p-4 transition-colors hover:border-primary/30 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="font-semibold">{report.domain}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{report.url}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="muted">{report.status}</Badge>
                  <Badge>{report.scoreOverall}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    {formatRelativeDate(report.createdAt)}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[26px] border border-dashed border-border p-8 text-center text-muted-foreground">
              No reports yet. Run your first scan to start building a history.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
