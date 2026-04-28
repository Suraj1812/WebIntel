import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { logUsage } from "@/services/usage";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ reportId: string }> },
) {
  const user = await requireUser();
  const { reportId } = await params;
  const prisma = getPrisma();

  const existing = await prisma.savedReport.findUnique({
    where: {
      userId_reportId: {
        userId: user.id,
        reportId,
      },
    },
  });

  if (existing) {
    await prisma.savedReport.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ saved: false });
  }

  await prisma.savedReport.create({
    data: {
      userId: user.id,
      reportId,
    },
  });

  await logUsage(user.id, "REPORT_SAVED", { reportId });

  return NextResponse.json({ saved: true });
}
