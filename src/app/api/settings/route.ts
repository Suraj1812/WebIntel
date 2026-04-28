import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { logUsage } from "@/services/usage";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json()) as { name?: string; company?: string };
  const name = body.name?.trim() || user.name;
  const company = body.company?.trim() || null;

  const updated = await getPrisma().user.update({
    where: { id: user.id },
    data: {
      name,
      company,
    },
  });

  await logUsage(user.id, "SETTINGS_UPDATED", {
    name: updated.name,
    company: updated.company,
  });

  return NextResponse.json({ user: updated });
}
