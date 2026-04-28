"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsForm({
  defaultName,
  defaultCompany,
}: {
  defaultName: string;
  defaultCompany: string | null;
}) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      toast.error(data.error || "Unable to update settings.");
      return;
    }

    toast.success("Settings updated.");
  }

  return (
    <section className="surface-strong rounded-[2.3rem] p-6 md:p-7">
      <Badge variant="accent">Workspace identity</Badge>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em]">Keep the people and company details current.</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        These details shape how reports and exports feel when they move across teams.
      </p>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" name="name" defaultValue={defaultName} placeholder="Your name" className="h-[3.25rem]" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={defaultCompany || ""} placeholder="Your company" className="h-[3.25rem]" />
        </div>
        <Button disabled={isSaving} size="lg">
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </section>
  );
}
