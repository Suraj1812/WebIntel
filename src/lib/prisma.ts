import { PrismaClient } from "@prisma/client";

declare global {
  var __webintelPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.__webintelPrisma) {
    globalThis.__webintelPrisma = new PrismaClient();
  }

  return globalThis.__webintelPrisma;
}
