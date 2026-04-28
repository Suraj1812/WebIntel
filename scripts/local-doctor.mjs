import fs from "node:fs";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { Client } from "pg";

const cwd = process.cwd();
const envPath = [".env", ".env.local"].map((file) => path.join(cwd, file)).find(fs.existsSync);

function parseEnv(source) {
  const entries = {};

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^"(.*)"$/, "$1");
    entries[key] = value;
  }

  return entries;
}

if (envPath) {
  const parsedEnv = parseEnv(fs.readFileSync(envPath, "utf8"));
  for (const [key, value] of Object.entries(parsedEnv)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const checks = [];

function pushCheck(status, label, detail) {
  checks.push({ status, label, detail });
  const symbol = status === "ok" ? "OK" : status === "warn" ? "WARN" : "ERR";
  console.log(`${symbol}  ${label} - ${detail}`);
}

if (!envPath) {
  pushCheck("error", "Environment", "No .env or .env.local file found.");
} else {
  pushCheck("ok", "Environment", `Loaded ${path.basename(envPath)}.`);
}

const requiredEnv = ["DATABASE_URL", "SESSION_SECRET", "SCRAPER_SERVICE_URL", "APP_URL"];

for (const key of requiredEnv) {
  if (!process.env[key]?.trim()) {
    pushCheck("error", key, `${key} is missing.`);
  } else {
    pushCheck("ok", key, "Present.");
  }
}

if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 24) {
  pushCheck("error", "SESSION_SECRET", "Must be at least 24 characters long.");
}

if (process.env.DATABASE_URL) {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    await client.query("select 1");
    pushCheck("ok", "Database", "Postgres accepted a connection.");
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to reach Postgres.";

    pushCheck(
      "error",
      "Database",
      `${message} Start Docker Desktop and run npm run db:start, or point DATABASE_URL at a running Postgres instance.`,
    );
  } finally {
    await client.end().catch(() => undefined);
  }
}

if (process.env.SCRAPER_SERVICE_URL) {
  try {
    const response = await fetch(`${process.env.SCRAPER_SERVICE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Scraper returned ${response.status}.`);
    }

    pushCheck("ok", "Scraper", "Health endpoint responded.");
  } catch (error) {
    pushCheck(
      "warn",
      "Scraper",
      error instanceof Error
        ? `${error.message} Install scraper dependencies with npm run scraper:install and start it with npm run scraper:dev.`
        : "Scraper health check failed.",
    );
  }
}

for (const relativePath of ["storage", "storage/screenshots", "storage/exports"]) {
  const target = path.join(cwd, relativePath);
  await mkdir(target, { recursive: true });
  pushCheck("ok", `Storage ${relativePath}`, "Ready.");
}

const hasErrors = checks.some((check) => check.status === "error");

if (hasErrors) {
  console.log("\nLocal stack is not ready yet.");
  process.exitCode = 1;
} else {
  console.log("\nLocal stack looks ready.");
}
