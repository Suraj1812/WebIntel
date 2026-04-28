"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
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
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Workspace settings</CardTitle>
          <CardDescription>Update your identity details and default workspace preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" name="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" placeholder="Your company" />
            </div>
            <Button disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Plan capabilities</CardTitle>
          <CardDescription>Feature access is enforced by your current subscription level.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm">Free users can run 3 scans monthly.</div>
          <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm">Pro unlocks unlimited scans, compare mode, and exports.</div>
          <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm">Business is ready for team seats and API workflows.</div>
        </CardContent>
      </Card>
    </div>
  );
}
