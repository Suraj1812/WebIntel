"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSafeRedirectPath } from "@/lib/utils";

function LoginCard({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const signupHref =
    nextPath === "/dashboard"
      ? "/signup"
      : `/signup?next=${encodeURIComponent(nextPath)}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        toast.error(data.error || "Unable to log in.");
        return;
      }

      toast.success("Welcome back.");
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="surface-strong rounded-[2.3rem] p-7 md:p-8">
      <Badge variant="accent">Welcome back</Badge>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Open your audit workspace.</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Sign in to review saved reports, compare competitors, and keep your benchmark history intact.
      </p>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required className="h-[3.25rem]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-[3.25rem]"
          />
        </div>
        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        No account yet?{" "}
        <Link href={signupHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const nextPath = getSafeRedirectPath(searchParams.get("next"));

  return <LoginCard nextPath={nextPath} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginCard nextPath="/dashboard" />}>
      <LoginContent />
    </Suspense>
  );
}
