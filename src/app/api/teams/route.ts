import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const user = await requireUser();

  return NextResponse.json({
    team: {
      owner: user.name,
      email: user.email,
      plan: user.plan,
      seatsEnabled: user.plan === "BUSINESS",
    },
  });
}
