import { mkdir } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";
import { getStorageRoot } from "@/services/storage/local-storage";

type CheckState = {
  status: "ok" | "error";
  detail: string;
};

export async function GET() {
  let env;

  try {
    env = getEnv();
  } catch (error) {
    return NextResponse.json(
      {
        ready: false,
        checks: {
          env: {
            status: "error",
            detail:
              error instanceof Error ? error.message : "Environment variables are not configured.",
          },
        },
      },
      { status: 503 },
    );
  }

  const checks: Record<string, CheckState> = {
    env: {
      status: "ok",
      detail: "Environment variables loaded.",
    },
    database: {
      status: "ok",
      detail: "Database connection healthy.",
    },
    scraper: {
      status: "ok",
      detail: "Scraper service reachable.",
    },
    storage: {
      status: "ok",
      detail: "Local storage ready.",
    },
  };

  try {
    await getPrisma().$queryRaw`SELECT 1`;
  } catch (error) {
    checks.database = {
      status: "error",
      detail: error instanceof Error ? error.message : "Database check failed.",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4_000);
    const response = await fetch(`${env.SCRAPER_SERVICE_URL}/health`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Scraper returned ${response.status}.`);
    }
  } catch (error) {
    checks.scraper = {
      status: "error",
      detail: error instanceof Error ? error.message : "Scraper health check failed.",
    };
  }

  try {
    await mkdir(getStorageRoot(), { recursive: true });
  } catch (error) {
    checks.storage = {
      status: "error",
      detail: error instanceof Error ? error.message : "Storage path could not be prepared.",
    };
  }

  const ready = Object.values(checks).every((check) => check.status === "ok");

  return NextResponse.json(
    {
      ready,
      checks,
      config: {
        appUrl: env.APP_URL,
        scraperServiceUrl: env.SCRAPER_SERVICE_URL,
        freePlanMonthlyScans: env.FREE_PLAN_MONTHLY_SCANS,
      },
    },
    { status: ready ? 200 : 503 },
  );
}
