import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import type { WebsiteReport } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const leftReport = reports.find((report: (typeof reports)[number]) => report.id === left);
  const rightReport = reports.find((report: (typeof reports)[number]) => report.id === right);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare two reports</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <Input name="left" defaultValue={left} placeholder="Left report id" list="report-options" />
            <Input name="right" defaultValue={right} placeholder="Right report id" list="report-options" />
            <Button type="submit">Compare</Button>
            <datalist id="report-options">
              {reports.map((report: (typeof reports)[number]) => (
                <option key={report.id} value={report.id}>
                  {report.domain}
                </option>
              ))}
            </datalist>
          </form>
          <div className="mt-3 text-sm text-muted-foreground">
            Paste report ids or pick from browser suggestions, then reload with query params such as
            {" "}
            <Link href={reports[0] ? `/compare?left=${reports[0].id}&right=${reports[1]?.id || reports[0].id}` : "/compare"} className="text-primary hover:underline">
              this example
            </Link>
            .
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <CompareReportCard report={leftReport?.reportData as WebsiteReport | undefined} label="Left report" />
        <CompareReportCard report={rightReport?.reportData as WebsiteReport | undefined} label="Right report" />
      </div>
    </div>
  );
}

function CompareReportCard({
  report,
  label,
}: {
  report?: WebsiteReport;
  label: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {report ? (
          <>
            <div>
              <div className="text-sm text-muted-foreground">Domain</div>
              <div className="text-lg font-semibold">{report.domain}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>SEO {report.scorecards.seo}</Badge>
              <Badge>Design {report.scorecards.design}</Badge>
              <Badge>Trust {report.scorecards.trust}</Badge>
              <Badge>Conversion {report.scorecards.conversion}</Badge>
              <Badge>Speed {report.scorecards.speed}</Badge>
            </div>
            <div className="rounded-[24px] border border-border bg-background/45 p-4 text-sm text-muted-foreground">
              {report.aiInsights.whatBusinessDoes}
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Pick a completed report to compare.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
