import type { Prisma, UsageAction } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

export async function logUsage(
  userId: string,
  action: UsageAction,
  metadata?: Prisma.InputJsonValue,
) {
  try {
    await getPrisma().usageLog.create({
      data: {
        userId,
        action,
        metadata,
      },
    });
  } catch (error) {
    console.error("Failed to write usage log", error);
  }
}
