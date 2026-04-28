import { promises as fs } from "node:fs";
import path from "node:path";
import { getEnv } from "@/lib/env";

export function getStorageRoot() {
  return path.resolve(process.cwd(), getEnv().STORAGE_ROOT);
}

export async function ensureStoragePath(...segments: string[]) {
  const target = path.join(getStorageRoot(), ...segments);
  await fs.mkdir(target, { recursive: true });
  return target;
}

export async function writeExportFile(filename: string, bytes: Uint8Array) {
  const exportDir = await ensureStoragePath("exports");
  const targetPath = path.join(exportDir, filename);
  await fs.writeFile(targetPath, bytes);
  return targetPath;
}

export function buildScraperAssetUrl(relativePath: string | null | undefined) {
  if (!relativePath) {
    return null;
  }

  const normalized = relativePath.replace(/^\/+/, "");
  return `${getEnv().SCRAPER_SERVICE_URL}/assets/${normalized}`;
}
