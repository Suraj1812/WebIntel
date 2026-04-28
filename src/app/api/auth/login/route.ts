import { type NextRequest, NextResponse } from "next/server";
import { assertValidEmail, applyRateLimit, getClientIpFromHeaders } from "@/lib/security";
import { getPrisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { verifyPassword } from "@/services/auth/password";
import { logUsage } from "@/services/usage";

export async function POST(request: NextRequest) {
  try {
    const rate = await applyRateLimit(`login:${getClientIpFromHeaders(request.headers)}`);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many login attempts. Please try again." }, { status: 429 });
    }

    const body = (await request.json()) as { email?: string; password?: string };
    const email = assertValidEmail(body.email || "");
    const password = body.password?.trim() || "";

    const user = await getPrisma().user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      avatarUrl: user.avatarUrl,
      plan: user.plan,
      role: user.role,
    });

    await logUsage(user.id, "LOGIN", { email: user.email });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to log in." },
      { status: 400 },
    );
  }
}
