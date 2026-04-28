import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { getEnv } from "@/lib/env";

declare global {
  var __webintelPrisma: PrismaClient | undefined;
}

export function getPrisma() {
  if (!globalThis.__webintelPrisma) {
    const adapter = new PrismaPg({
      connectionString: getEnv().DATABASE_URL,
    });

    globalThis.__webintelPrisma = new PrismaClient({ adapter });
  }

  return globalThis.__webintelPrisma;
}
