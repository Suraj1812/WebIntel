"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircle, Sparkles } from "lucide-react";
import type { ScanStepKey, ScanStreamEvent } from "@/types/report";
import { SCAN_STEPS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function ScanWorkbench({ initialUrl = "" }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [activeStep, setActiveStep] = useState<ScanStepKey>("fetching");
  const [statusMessage, setStatusMessage] = useState("Waiting to start.");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const currentIndex = useMemo(
    () => SCAN_STEPS.findIndex((step) => step.key === activeStep),
    [activeStep],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsPending(true);
      setStatusMessage("Connecting to the scan pipeline.");
      const response = await fetch("/api/scans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Unable to start the scan.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const eventPayload = JSON.parse(line) as ScanStreamEvent;
          if (eventPayload.type === "progress") {
            setActiveStep(eventPayload.step);
            setStatusMessage(eventPayload.message);
          }

          if (eventPayload.type === "error") {
            throw new Error(eventPayload.message);
          }

          if (eventPayload.type === "complete") {
            toast.success("Report ready.");
            router.push(`/reports/${eventPayload.reportId}`);
            return;
          }
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Scan failed.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Scan any public website</CardTitle>
          <CardDescription>
            WebIntel AI will validate the URL, render the site, capture screenshots, inspect its tech stack, and generate a saved intelligence report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              type="url"
              name="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="h-14 text-base"
              required
            />
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Analyzing website
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Start analysis
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live progress</CardTitle>
          <CardDescription>{statusMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {SCAN_STEPS.map((step, index) => {
            const isActive = step.key === activeStep;
            const isComplete = index < currentIndex;

            return (
              <div
                key={step.key}
                className={cn(
                  "rounded-3xl border p-4 transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/8"
                    : isComplete
                      ? "border-border bg-background/50"
                      : "border-border/70 bg-background/30",
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-medium">{step.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{step.description}</div>
                  </div>
                  <div
                    className={cn(
                      "h-3 w-3 rounded-full",
                      isActive
                        ? "bg-primary shadow-[0_0_0_8px_rgba(15,118,110,0.12)]"
                        : isComplete
                          ? "bg-chart-2"
                          : "bg-border",
                    )}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
