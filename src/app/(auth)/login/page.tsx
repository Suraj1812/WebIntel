"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      toast.error(data.error || "Unable to log in.");
      return;
    }

    toast.success("Welcome back.");
    router.push("/dashboard");
    router.refresh();
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
          <Input id="email" name="email" type="email" required className="h-[3.25rem]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required className="h-[3.25rem]" />
        </div>
        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
