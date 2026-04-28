"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      toast.error(data.error || "Unable to create your account.");
      return;
    }

    toast.success("Account created.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="surface-strong rounded-[2.3rem] p-7 md:p-8">
      <Badge variant="accent">Create workspace</Badge>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Start with a real audit, not a template tour.</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Create your workspace and save the first reports you actually want to compare again next week.
      </p>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" required className="h-[3.25rem]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" className="h-[3.25rem]" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="h-[3.25rem]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} className="h-[3.25rem]" />
        </div>
        <Button className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
