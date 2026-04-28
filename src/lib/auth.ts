import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { type User } from "@prisma/client";
import { getEnv } from "@/lib/env";
import { getPrisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "webintel.session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = Pick<
  User,
  "id" | "email" | "name" | "plan" | "role" | "company" | "avatarUrl"
>;

type SessionPayload = SessionUser & {
  sub: string;
};

function getSessionSecret() {
  return new TextEncoder().encode(getEnv().SESSION_SECRET);
}

export async function signSessionToken(user: SessionUser) {
  return new SignJWT({
    ...user,
    sub: user.id,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const verified = await jwtVerify<SessionPayload>(token, getSessionSecret());
    return verified.payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function setSession(user: SessionUser) {
  const store = await cookies();
  const token = await signSessionToken(user);

  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.sub) {
    return null;
  }

  return getPrisma().user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      email: true,
      name: true,
      plan: true,
      role: true,
      company: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return user;
}
