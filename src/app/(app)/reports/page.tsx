import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ReportsPage() {
  const user = await requireUser();
  const reports = await getPrisma().report.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>All reports</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {reports.map((report: (typeof reports)[number]) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="rounded-[28px] border border-border bg-background/45 p-5 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold">{report.domain}</div>
              <Badge>{report.scoreOverall}</Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{report.url}</div>
            <div className="mt-4 flex gap-2">
              <Badge variant="muted">{report.status}</Badge>
              <Badge variant="outline">{new Date(report.createdAt).toLocaleDateString()}</Badge>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
