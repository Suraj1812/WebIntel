import { NextResponse } from "next/server";

const DATABASE_CONNECTION_PATTERNS = [
  /DATABASE_URL/i,
  /can't reach database server/i,
  /connect ECONNREFUSED/i,
  /Connection terminated unexpectedly/i,
  /connect ETIMEDOUT/i,
];

const DATABASE_SCHEMA_PATTERNS = [
  /relation .* does not exist/i,
  /table .* does not exist/i,
  /column .* does not exist/i,
  /enum .* does not exist/i,
];

const CLIENT_INPUT_PATTERNS = [
  /valid email/i,
  /8\+ character password/i,
  /Name and .* required/i,
  /Invalid email or password/i,
];

export function createApiErrorResponse(error: unknown, fallbackMessage: string) {
  const message = error instanceof Error ? error.message : fallbackMessage;

  if (DATABASE_CONNECTION_PATTERNS.some((pattern) => pattern.test(message))) {
    return NextResponse.json(
      {
        error:
          "Database unavailable. Start Postgres, confirm DATABASE_URL in .env, then run `npm run db:setup`.",
      },
      { status: 503 },
    );
  }

  if (DATABASE_SCHEMA_PATTERNS.some((pattern) => pattern.test(message))) {
    return NextResponse.json(
      {
        error: "Database schema is not ready. Run `npm run db:setup` before signing in.",
      },
      { status: 503 },
    );
  }

  if (CLIENT_INPUT_PATTERNS.some((pattern) => pattern.test(message))) {
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.json({ error: message || fallbackMessage }, { status: 500 });
}
