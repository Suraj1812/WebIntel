import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import type { WebsiteReport } from "@/types/report";
import { ReportShell } from "@/components/report/report-shell";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const user = await requireUser();
  const { reportId } = await params;

  const prisma = getPrisma();
  const report = await prisma.report.findFirst({
    where: { id: reportId, userId: user.id },
  });
  const savedReport = await prisma.savedReport.findUnique({
    where: {
      userId_reportId: {
        userId: user.id,
        reportId,
      },
    },
  });

  if (!report || !report.reportData) {
    notFound();
  }

  return (
    <ReportShell
      reportId={report.id}
      report={report.reportData as WebsiteReport}
      createdAt={report.createdAt.toISOString()}
      isSaved={Boolean(savedReport)}
    />
  );
}
