import { type NextRequest, NextResponse } from "next/server";
import { assertValidEmail, applyRateLimit, getClientIpFromHeaders } from "@/lib/security";
import { getPrisma } from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { createApiErrorResponse } from "@/lib/api-errors";
import { hashPassword } from "@/services/auth/password";
import { logUsage } from "@/services/usage";

export async function POST(request: NextRequest) {
  try {
    const rate = await applyRateLimit(`signup:${getClientIpFromHeaders(request.headers)}`);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many signup attempts. Please try again." }, { status: 429 });
    }

    const body = (await request.json()) as {
      name?: string;
      company?: string;
      email?: string;
      password?: string;
    };

    const name = body.name?.trim();
    const company = body.company?.trim() || null;
    const email = assertValidEmail(body.email || "");
    const password = body.password?.trim() || "";

    if (!name || password.length < 8) {
      return NextResponse.json(
        { error: "Name and an 8+ character password are required." },
        { status: 400 },
      );
    }

    const prisma = getPrisma();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        company,
        email,
        passwordHash,
        subscriptions: {
          create: {
            plan: "FREE",
            status: "TRIAL",
          },
        },
      },
    });

    await setSession({
      id: user.id,
      email: user.email,
      name: user.name,
      company: user.company,
      avatarUrl: user.avatarUrl,
      plan: user.plan,
      role: user.role,
    });

    await logUsage(user.id, "SIGNUP", { email: user.email });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    return createApiErrorResponse(error, "Unable to create account.");
  }
}
