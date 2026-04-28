import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HistoryPage() {
  const user = await requireUser();
  const reports = await getPrisma().report.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical scans</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reports.map((report: (typeof reports)[number]) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="flex items-center justify-between rounded-[26px] border border-border bg-background/45 p-4"
          >
            <div>
              <div className="font-semibold">{report.domain}</div>
              <div className="text-sm text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm font-medium">{report.scoreOverall}</div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
