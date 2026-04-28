import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SavedPage() {
  const user = await requireUser();
  const savedReports = await getPrisma().savedReport.findMany({
    where: { userId: user.id },
    include: { report: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved reports</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        {savedReports.map((savedReport) => (
          <Link
            key={savedReport.id}
            href={`/reports/${savedReport.reportId}`}
            className="rounded-[26px] border border-border bg-background/45 p-4"
          >
            <div className="font-semibold">{savedReport.report.domain}</div>
            <div className="mt-1 text-sm text-muted-foreground">{savedReport.report.url}</div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
