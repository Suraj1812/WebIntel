"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle, ScanSearch, ShieldCheck, Sparkles } from "lucide-react";
import type { ScanStepKey, ScanStreamEvent } from "@/types/report";
import { SCAN_STEPS } from "@/lib/constants";
import { PageIntro } from "@/components/shared/page-intro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const exampleUrls = [
  "https://linear.app",
  "https://www.notion.so",
  "https://vercel.com",
];

export function ScanWorkbench({ initialUrl = "" }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl);
  const [activeStep, setActiveStep] = useState<ScanStepKey>("fetching");
  const [statusMessage, setStatusMessage] = useState("Drop in a public URL to start the audit.");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const currentIndex = useMemo(
    () => Math.max(0, SCAN_STEPS.findIndex((step) => step.key === activeStep)),
    [activeStep],
  );

  const progress = Math.round(((currentIndex + 1) / SCAN_STEPS.length) * 100);

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
    <div className="space-y-6">
      <PageIntro
        eyebrow="New audit"
        title="Run a fresh website review with evidence built in."
        description="Drop in a public URL and WebIntel handles rendering, screenshots, structure checks, stack detection, and the written review."
        metadata={[
          { label: "Output", value: "Saved report" },
          { label: "Evidence", value: "Desktop, mobile, full page" },
          { label: "Compare ready", value: "Yes" },
        ]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <section className="surface-strong rounded-[2.4rem] p-6 md:p-7">
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <ScanSearch className="h-4 w-4" />
            Scan target
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
            Audit any public website in one pass.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
            The output is designed to be reused. Screenshots, scorecards, narrative findings, and compare-ready data all land in the workspace automatically.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <Input
              type="url"
              name="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com"
              className="h-[3.5rem] text-base"
              required
            />
            <div className="flex flex-wrap gap-2">
              {exampleUrls.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setUrl(example)}
                  className="rounded-full border border-border bg-background/68 px-4 py-2 text-sm text-muted-foreground transition duration-200 hover:text-foreground"
                >
                  {example.replace("https://", "")}
                </button>
              ))}
            </div>
            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Auditing website
                </>
              ) : (
                <>
                  Run audit
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                icon: ShieldCheck,
                title: "Input guardrails",
                copy: "URL validation and scan safety checks run before the heavy work begins.",
              },
              {
                icon: Sparkles,
                title: "Executive-ready output",
                copy: "Each scan becomes a report that can be saved, compared, and exported without manual cleanup.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[1.7rem] border border-border bg-background/72 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 text-lg font-semibold tracking-[-0.03em]">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-muted-foreground">{item.copy}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="surface-panel rounded-[2.4rem] p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pipeline progress</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Live scan status</h2>
            </div>
            <BadgeLabel value={`${progress}%`} />
          </div>
          <div className="mt-5 metric-track h-2.5">
            <div className="metric-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-4 text-sm leading-7 text-muted-foreground">{statusMessage}</div>

          <div className="mt-6 space-y-3">
            {SCAN_STEPS.map((step, index) => {
              const isActive = step.key === activeStep;
              const isComplete = index < currentIndex;

              return (
                <div
                  key={step.key}
                  className={cn(
                    "rounded-[1.7rem] border px-4 py-4 transition duration-200",
                    isActive
                      ? "border-primary/18 bg-primary/6"
                      : isComplete
                        ? "border-border bg-background/74"
                        : "border-border bg-background/52",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{step.label}</div>
                      <div className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</div>
                    </div>
                    <div
                      className={cn(
                        "mt-1 h-3.5 w-3.5 rounded-full",
                        isActive
                          ? "bg-accent shadow-[0_0_0_8px_rgba(15,118,110,0.12)]"
                          : isComplete
                            ? "bg-primary"
                            : "bg-border",
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function BadgeLabel({ value }: { value: string }) {
  return (
    <div className="rounded-full border border-border bg-background/72 px-3 py-1.5 text-sm font-semibold">
      {value}
    </div>
  );
}
