import dns from "node:dns/promises";
import { headers } from "next/headers";
import { z } from "zod";
import { getEnv } from "@/lib/env";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const memoryRateLimiter = new Map<string, RateLimitEntry>();

const privateIpv4Ranges = [
  /^10\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^192\.168\./,
  /^0\./,
];

const privateIpv6Ranges = [/^::1$/, /^fc/i, /^fd/i, /^fe80:/i];

export function normalizeWebsiteUrl(input: string) {
  const normalizedInput = input.startsWith("http") ? input : `https://${input}`;
  const url = new URL(normalizedInput);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only http and https URLs are allowed.");
  }

  url.hash = "";

  return url;
}

export function getClientIpFromHeaders(inputHeaders: Headers) {
  const forwarded = inputHeaders.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return inputHeaders.get("x-real-ip") || "unknown";
}

export async function applyRateLimit(key: string) {
  const env = getEnv();
  const now = Date.now();
  const existing = memoryRateLimiter.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryRateLimiter.set(key, {
      count: 1,
      resetAt: now + env.RATE_LIMIT_WINDOW_MS,
    });

    return { allowed: true, remaining: env.RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (existing.count >= env.RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: existing.resetAt - now,
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: env.RATE_LIMIT_MAX_REQUESTS - existing.count };
}

export function assertValidEmail(email: string) {
  return z.string().email().parse(email.trim().toLowerCase());
}

export async function assertSafePublicUrl(input: string) {
  const url = normalizeWebsiteUrl(input);
  const hostname = url.hostname.toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new Error("Local or private hostnames are not allowed.");
  }

  const addresses = await dns.lookup(hostname, { all: true });
  for (const result of addresses) {
    if (isPrivateIp(result.address)) {
      throw new Error("Private network targets are not allowed.");
    }
  }

  return url;
}

function isPrivateIp(address: string) {
  if (address.includes(".")) {
    return privateIpv4Ranges.some((pattern) => pattern.test(address));
  }

  return privateIpv6Ranges.some((pattern) => pattern.test(address));
}

export async function getRequestContextKey(scope: string) {
  const requestHeaders = await headers();
  const ip = getClientIpFromHeaders(requestHeaders);
  return `${scope}:${ip}`;
}
