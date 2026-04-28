import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import type { WebsiteReport } from "@/types/report";

export async function POST(request: Request) {
  const user = await requireUser();
  const body = (await request.json()) as { leftId?: string; rightId?: string };

  if (!body.leftId || !body.rightId) {
    return NextResponse.json({ error: "Two report IDs are required." }, { status: 400 });
  }

  const reports = await getPrisma().report.findMany({
    where: {
      userId: user.id,
      id: { in: [body.leftId, body.rightId] },
    },
  });

  const left = reports.find((report) => report.id === body.leftId);
  const right = reports.find((report) => report.id === body.rightId);

  if (!left?.reportData || !right?.reportData) {
    return NextResponse.json({ error: "One or both reports were not found." }, { status: 404 });
  }

  const leftData = left.reportData as WebsiteReport;
  const rightData = right.reportData as WebsiteReport;

  return NextResponse.json({
    comparison: {
      left: {
        id: left.id,
        domain: left.domain,
        scores: leftData.scorecards,
      },
      right: {
        id: right.id,
        domain: right.domain,
        scores: rightData.scorecards,
      },
      deltas: {
        seo: leftData.scorecards.seo - rightData.scorecards.seo,
        design: leftData.scorecards.design - rightData.scorecards.design,
        trust: leftData.scorecards.trust - rightData.scorecards.trust,
        conversion: leftData.scorecards.conversion - rightData.scorecards.conversion,
        speed: leftData.scorecards.speed - rightData.scorecards.speed,
        overall: leftData.scorecards.overall - rightData.scorecards.overall,
      },
    },
  });
}
