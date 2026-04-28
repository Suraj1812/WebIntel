import type { NextConfig } from "next";

type RemotePattern = Exclude<
  NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number],
  URL
>;

function toRemotePattern(url: string): RemotePattern {
  const parsed = new URL(url);

  return {
    protocol: parsed.protocol === "https:" ? "https" : "http",
    hostname: parsed.hostname,
    port: parsed.port,
    pathname: "/assets/**",
  };
}

const scraperOrigins = [
  "http://127.0.0.1:8001",
  "http://localhost:8001",
  process.env.SCRAPER_SERVICE_URL,
]
  .filter((value): value is string => Boolean(value))
  .flatMap((value) => {
    try {
      return [toRemotePattern(value)];
    } catch {
      return [];
    }
  });

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: scraperOrigins,
  },
};

export default nextConfig;
