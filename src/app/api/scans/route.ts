import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { applyRateLimit, getClientIpFromHeaders } from "@/lib/security";
import { runScanPipeline } from "@/services/reports/pipeline";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json()) as { url?: string };
  const url = body.url?.trim();

  if (!url) {
    return NextResponse.json({ error: "A public website URL is required." }, { status: 400 });
  }

  const rate = await applyRateLimit(`scan:${user.id}:${getClientIpFromHeaders(request.headers)}`);
  if (!rate.allowed) {
    return NextResponse.json({ error: "Scan rate limit reached. Please wait and retry." }, { status: 429 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));

      try {
        const reportId = await runScanPipeline({
          userId: user.id,
          userPlan: user.plan,
          inputUrl: url,
          onProgress(step, message) {
            send({ type: "progress", step, message });
          },
        });

        send({ type: "complete", reportId });
      } catch (error) {
        send({
          type: "error",
          message: error instanceof Error ? error.message : "Scan failed.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
