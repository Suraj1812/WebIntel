import slugify from "slugify";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { renderReportPdf } from "@/services/reports/pdf";
import { writeExportFile } from "@/services/storage/local-storage";
import { logUsage } from "@/services/usage";
import type { WebsiteReport } from "@/types/report";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const user = await requireUser();
  const { reportId } = await params;

  const report = await getPrisma().report.findFirst({
    where: {
      id: reportId,
      userId: user.id,
    },
  });

  if (!report?.reportData) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const searchParams = new URL(request.url).searchParams;
  const whiteLabel = searchParams.get("whiteLabel") === "1";
  const fileName = `${slugify(report.domain, { lower: true })}-${report.id}.pdf`;
  const buffer = await renderReportPdf(report.reportData as WebsiteReport, { whiteLabel });
  await writeExportFile(fileName, new Uint8Array(buffer));
  await logUsage(user.id, "REPORT_EXPORTED", { reportId, whiteLabel });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
