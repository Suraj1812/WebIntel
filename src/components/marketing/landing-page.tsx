"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BellRing,
  Bookmark,
  CheckCircle2,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  SplitSquareHorizontal,
} from "lucide-react";
import { APP_TAGLINE, SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ecosystem = ["Next.js", "Shopify", "WordPress", "Webflow", "HubSpot", "Framer"];

const proofPoints = [
  {
    title: "From screenshot to strategy",
    copy: "You get design, SEO, trust, performance, and business observations in one report instead of five disconnected tools.",
  },
  {
    title: "Built for work that repeats",
    copy: "Saved reports, history, compare mode, and exports turn a one-off audit into a reusable operating system.",
  },
  {
    title: "Evidence, not vibes",
    copy: "Every conclusion is grounded in rendered screenshots, extracted metadata, stack signals, and page structure.",
  },
];

const useCases = [
  {
    title: "Pitch prep",
    copy: "Walk into client and investor meetings with a real teardown, not a page of loose notes.",
    metric: "10-minute prep cycle",
    icon: Radar,
  },
  {
    title: "Competitor watch",
    copy: "Track how peers evolve positioning, design quality, trust cues, and conversion patterns over time.",
    metric: "Compare mode + history",
    icon: SplitSquareHorizontal,
  },
  {
    title: "Pre-launch review",
    copy: "Pressure test a launch page before paid traffic arrives and catch weak CTAs, missing trust, or structural SEO issues.",
    metric: "Scorecards before spend",
    icon: ScanSearch,
  },
  {
    title: "Diligence support",
    copy: "Get a sharp first pass on the quality of a company’s web presence before deeper commercial analysis starts.",
    metric: "Faster first read",
    icon: ShieldCheck,
  },
];

const comparisonRows = [
  ["Rendered screenshots", "Desktop, mobile, and full page", "Usually one view", "Rarely included", "Manual capture"],
  ["Business analysis", "Included in every report", "Not included", "Surface-level at best", "Depends on reviewer"],
  ["Compare history", "Built into the workspace", "No memory layer", "Usually export-only", "Spreadsheet work"],
  ["Export quality", "Client-ready PDF", "Screenshot archive", "CSV or score export", "Manual formatting"],
];

const reportModules = [
  "Overview and screenshots",
  "Design intelligence and color extraction",
  "SEO structure and score",
  "Tech stack and infrastructure signals",
  "Security posture and header checks",
  "AI recommendations for growth and trust",
];

const faqs = [
  {
    question: "What makes WebIntel different from an SEO tool?",
    answer:
      "SEO is only one layer. WebIntel combines rendered screenshots, stack detection, trust cues, content analysis, and business recommendations into a single report.",
  },
  {
    question: "Can it handle JavaScript-heavy websites?",
    answer:
      "Yes. The scan pipeline uses Playwright to render modern frontends before extraction, so React, Next.js, Shopify, and similar stacks are part of the intended use case.",
  },
  {
    question: "Who gets the most value from it?",
    answer:
      "Agencies, growth teams, product marketers, CRO specialists, founders, and diligence teams tend to get the fastest return because they audit sites repeatedly.",
  },
  {
    question: "What happens after the first scan?",
    answer:
      "That is where the product gets sticky. Saved reports, compare mode, history, exports, and workspace usage all make the next audit faster and more comparable.",
  },
];

const reveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.35 },
} as const;

export function LandingPage() {
  const router = useRouter();
  const [heroUrl, setHeroUrl] = useState("");
  const [isRouting, setIsRouting] = useState(false);

  async function handleHeroSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUrl = heroUrl.trim();

    if (!trimmedUrl || isRouting) {
      return;
    }

    setIsRouting(true);

    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const payload = (await response.json().catch(() => ({ user: null }))) as {
        user?: { id: string } | null;
      };

      const scanPath = `/scan?url=${encodeURIComponent(trimmedUrl)}`;
      const destination = payload.user
        ? scanPath
        : `/signup?next=${encodeURIComponent(scanPath)}`;

      router.push(destination);
    } finally {
      setIsRouting(false);
    }
  }

  return (
    <div className="pb-24">
      <section className="marketing-shell section-shell pt-10">
        <div className="grid gap-10 xl:grid-cols-[1.03fr_0.97fr]">
          <motion.div {...reveal} className="space-y-8">
            <div className="eyebrow">Website intelligence for teams that audit for a living</div>
            <div className="space-y-5">
              <h1 className="display-title max-w-5xl text-balance">
                Know what a website gets right before you spend money copying it or fixing it.
              </h1>
              <p className="lead-copy">
                {APP_TAGLINE} WebIntel AI turns a public URL into screenshots, scorecards, stack signals, and sharp recommendations you can keep, compare, and ship.
              </p>
            </div>

            <form
              onSubmit={handleHeroSubmit}
              className="surface-strong rounded-[2rem] p-3 md:flex md:items-center md:gap-3"
            >
              <Input
                name="url"
                type="url"
                value={heroUrl}
                onChange={(event) => setHeroUrl(event.target.value)}
                placeholder="Enter a public website URL"
                className="h-14 border-0 bg-transparent text-base shadow-none focus:ring-0"
                required
              />
              <div className="mt-3 flex gap-3 md:mt-0">
                <Button type="submit" size="lg" className="min-w-[12rem]" disabled={isRouting}>
                  Run audit
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline" size="lg" href="/pricing">
                  See pricing
                </Button>
              </div>
            </form>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                "Rendered evidence for modern websites",
                "Saved reports and competitor compare mode",
                "Private workspace with export-ready outputs",
              ].map((line) => (
                <div key={line} className="surface-muted rounded-[1.6rem] px-4 py-4 text-sm leading-6 text-muted-foreground">
                  {line}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.4, delay: 0.06 }} className="xl:pl-4">
            <div className="surface-strong grid-bg rounded-[2.4rem] p-5 md:p-6">
              <div className="rounded-[1.5rem] border border-border bg-background/76 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Live product preview
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">linear.app</div>
                  </div>
                  <Badge variant="accent">Overall 88</Badge>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.84fr_1.16fr]">
                <div className="space-y-4">
                  <div className="rounded-[1.8rem] border border-border bg-background/78 p-4">
                    <div className="text-sm font-semibold">Scan pipeline</div>
                    <div className="mt-4 space-y-3">
                      {[
                        ["Rendering", "Desktop and mobile evidence ready"],
                        ["Signals", "Stack, SEO, and trust checks parsed"],
                        ["AI review", "Narrative findings written"],
                      ].map(([title, copy], index) => (
                        <div key={title} className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{title}</div>
                            <div className="text-sm leading-6 text-muted-foreground">{copy}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.8rem] border border-border bg-background/78 p-4">
                    <div className="text-sm font-semibold">Top recommendation</div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Strong visual discipline and product clarity. The biggest lift would come from adding proof near the first CTA and reducing friction around trial intent.
                    </p>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Executive snapshot</div>
                      <div className="mt-1 text-xl font-semibold tracking-[-0.04em]">Why this page converts</div>
                    </div>
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {[
                      ["SEO", "91"],
                      ["Design", "89"],
                      ["Trust", "86"],
                      ["Conversion", "84"],
                    ].map(([label, score]) => (
                      <div key={label} className="rounded-[1.4rem] bg-muted/70 px-4 py-4">
                        <div className="text-sm text-muted-foreground">{label}</div>
                        <div className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{score}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-[1.6rem] border border-border bg-background/72 p-4">
                    <div className="flex items-center gap-3 text-sm font-semibold">
                      <BellRing className="h-4 w-4 text-accent" />
                      Suggested retention loop
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      Save this report, compare it against your closest competitor, and rerun weekly to track whether headline clarity and trust cues improve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="marketing-shell">
        <div className="surface-panel rounded-[2rem] px-5 py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Works across the stack</span>
            {ecosystem.map((item) => (
              <span key={item} className="rounded-full border border-border bg-background/72 px-3 py-2">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="why-webintel" className="marketing-shell section-shell">
        <div className="grid gap-8 xl:grid-cols-[1fr_1.05fr]">
          <motion.div {...reveal} className="space-y-5">
            <Badge variant="accent">Why teams stick with it</Badge>
            <h2 className="section-title max-w-2xl">
              Most audit tools stop at one layer. Real decisions need the full picture.
            </h2>
            <p className="lead-copy">
              The product is designed around repeat work: pitch prep, launch review, competitive teardowns, and benchmark tracking. That is why the workspace matters as much as the first report.
            </p>
          </motion.div>
          <div className="grid gap-4">
            {proofPoints.map((item, index) => (
              <motion.div
                key={item.title}
                {...reveal}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="surface-panel rounded-[2rem] px-6 py-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{item.copy}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="marketing-shell section-shell pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="muted">Common use cases</Badge>
            <h2 className="section-title mt-4 max-w-3xl">
              Built for work that needs both speed and judgment.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            These are the moments where teams usually bounce between screenshots, SEO tools, spreadsheets, and loose notes. WebIntel keeps them in one system.
          </p>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {useCases.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                {...reveal}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className={`surface-panel rounded-[2rem] p-6 ${index === 0 ? "lg:col-span-2" : ""}`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.copy}</p>
                  </div>
                  <div className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm font-medium text-foreground">
                    {item.metric}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="compare" className="marketing-shell section-shell pt-0">
        <div className="surface-strong rounded-[2.5rem] p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[0.84fr_1.16fr]">
            <div>
              <Badge variant="accent">Where it wins</Badge>
              <h2 className="section-title mt-4">
                It closes the gap between surface-level tooling and a real teardown.
              </h2>
              <p className="mt-4 text-base leading-8 text-muted-foreground">
                Most alternatives solve one narrow part of the problem. WebIntel is built for the moment you need the whole story in a form a team can actually use.
              </p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-border bg-background/72">
              <div className="grid grid-cols-[1.1fr_repeat(4,0.8fr)] gap-px bg-border text-sm">
                {["Capability", "WebIntel AI", "Screenshot tools", "SEO tools", "Manual audit"].map((cell, index) => (
                  <div key={cell} className={`bg-background/94 px-4 py-4 ${index === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {cell}
                  </div>
                ))}
                {comparisonRows.map((row, rowIndex) =>
                  row.map((cell, index) => (
                    <div
                      key={`${row[0]}-${rowIndex}-${index}`}
                      className={`bg-background/80 px-4 py-4 leading-6 ${index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      {cell}
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-shell section-shell pt-0">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
          <motion.div {...reveal} className="surface-panel rounded-[2.4rem] p-7">
            <Badge variant="muted">What ships in every audit</Badge>
            <h2 className="section-title mt-4">A report structure designed to be reused, not skimmed once and forgotten.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {reportModules.map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-border bg-background/74 px-4 py-4 text-sm leading-7">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.35, delay: 0.04 }} className="surface-panel rounded-[2.4rem] p-7">
            <Badge variant="muted">Signals that increase retention</Badge>
            <h2 className="section-title mt-4">The workspace gets better once you have more than one report.</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  icon: Bookmark,
                  title: "Saved benchmarks",
                  copy: "Pin the sites you always reference so future audits are grounded in something consistent.",
                },
                {
                  icon: BellRing,
                  title: "Weekly review rhythm",
                  copy: "Rerun key pages on a schedule and track whether score movement matches your intent.",
                },
                {
                  icon: SplitSquareHorizontal,
                  title: "Competitor compare",
                  copy: "Put two reports side by side so positioning, trust, and conversion gaps are obvious to the room.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-[1.6rem] border border-border bg-background/74 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold tracking-[-0.03em]">{item.title}</div>
                      <div className="mt-2 text-sm leading-7 text-muted-foreground">{item.copy}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="pricing" className="marketing-shell section-shell pt-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="accent">Pricing</Badge>
            <h2 className="section-title mt-4">Start with one audit. Stay for the benchmark system.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">
            The value compounds when teams save, compare, rerun, and export reports regularly. Pricing is set around that behavior.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan, index) => (
            <div
              key={plan.id}
              className={`rounded-[2.2rem] p-[1px] ${index === 1 ? "bg-gradient-to-b from-primary/60 to-accent/30" : "bg-border"}`}
            >
              <div className={`h-full rounded-[2.1rem] ${index === 1 ? "surface-strong" : "surface-panel"} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold tracking-[-0.03em]">{plan.name}</div>
                    <div className="mt-2 text-sm leading-7 text-muted-foreground">{plan.description}</div>
                  </div>
                  {index === 1 ? <Badge variant="accent">Best fit</Badge> : null}
                </div>
                <div className="mt-6 text-5xl font-semibold tracking-[-0.06em]">
                  {plan.price}
                  <span className="ml-2 text-base font-medium text-muted-foreground">/ month</span>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-[1.4rem] border border-border bg-background/72 px-4 py-3 text-sm">
                      {bullet}
                    </div>
                  ))}
                </div>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={index === 1 ? "default" : "secondary"}
                  href="/signup"
                  prefetch={false}
                >
                  Choose {plan.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="marketing-shell section-shell pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((item, index) => (
            <motion.div
              key={item.question}
              {...reveal}
              transition={{ duration: 0.35, delay: index * 0.03 }}
              className="surface-panel rounded-[2rem] p-6"
            >
              <h3 className="text-xl font-semibold tracking-[-0.03em]">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="marketing-shell pt-4">
        <div className="surface-strong rounded-[2.6rem] px-7 py-9 text-center">
          <Badge variant="accent">Ready to audit</Badge>
          <h2 className="section-title mt-4">
            Run the first report, save the important ones, and build a benchmark library your team actually revisits.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
            This is the difference between a screenshot tool and a product. WebIntel helps you remember what good looked like last week, last quarter, and against the competitor you care about most.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" href="/signup" prefetch={false}>
              Start free
            </Button>
            <Button asChild size="lg" variant="outline" href="/scan">
              Try a live audit
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
