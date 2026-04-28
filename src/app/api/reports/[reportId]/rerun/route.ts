import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { runScanPipeline } from "@/services/reports/pipeline";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const user = await requireUser();
  const { reportId } = await params;
  const original = await getPrisma().report.findFirst({
    where: {
      id: reportId,
      userId: user.id,
    },
  });

  if (!original) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  const newReportId = await runScanPipeline({
    userId: user.id,
    userPlan: user.plan,
    inputUrl: original.normalizedUrl,
    onProgress() {},
  });

  return NextResponse.json({ reportId: newReportId });
}
