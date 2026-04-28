"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Workspace settings</CardTitle>
        <CardDescription>Update your identity details and default workspace preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Display name</Label>
            <Input id="name" name="name" defaultValue={defaultName} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" defaultValue={defaultCompany || ""} placeholder="Your company" />
          </div>
          <Button disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
