"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Camera, Globe2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { APP_TAGLINE, SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: Globe2,
    title: "Full-stack website intelligence",
    copy: "Inspect design systems, SEO structure, business positioning, media, performance signals, and security posture from a single scan.",
  },
  {
    icon: Camera,
    title: "Dynamic screenshots and evidence",
    copy: "Capture desktop, mobile, and full-page screenshots from static and JavaScript-heavy websites with one workflow.",
  },
  {
    icon: Bot,
    title: "AI reasoning that sounds like strategy",
    copy: "Turn raw signals into monetization hypotheses, trust gaps, conversion feedback, and actionable growth recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Production-grade guardrails",
    copy: "Built-in URL validation, SSRF prevention, rate limits, auth protection, and durable report storage.",
  },
];

const testimonials = [
  {
    name: "Mina Patel",
    role: "Growth Consultant",
    quote:
      "WebIntel AI replaced three browser extensions, a manual SEO checklist, and our first-pass competitor teardown.",
  },
  {
    name: "Jordan Brooks",
    role: "Agency Founder",
    quote:
      "The report feels premium enough to send to clients without editing, and the side-by-side comparisons close projects faster.",
  },
  {
    name: "Avery Kim",
    role: "Product Marketer",
    quote:
      "We use it to benchmark launch pages before campaigns go live. The trust and conversion insights are consistently sharp.",
  },
];

export function LandingPage() {
  return (
    <div className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-8"
        >
          <Badge>Website intelligence for operators, agencies, and growth teams</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-balance text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-7xl">
              Know any website before anyone else.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              {APP_TAGLINE} WebIntel AI turns a public URL into screenshots, SEO audits, stack detection, business insights, and a polished client-ready report.
            </p>
          </div>
          <form
            action="/scan"
            className="glass flex flex-col gap-3 rounded-[28px] border border-border p-3 shadow-lg md:flex-row"
          >
            <Input
              name="url"
              placeholder="Enter a public website URL"
              className="h-14 rounded-[22px] border-0 bg-transparent text-base shadow-none focus:ring-0"
            />
            <Button type="submit" className="h-14 rounded-[22px] px-7 text-base">
              Analyze website
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-background/50 p-4">
              <div className="font-semibold text-foreground">18 report modules</div>
              <p className="mt-1">Everything from screenshots to trust, performance, and monetization.</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/50 p-4">
              <div className="font-semibold text-foreground">Built for modern sites</div>
              <p className="mt-1">Playwright rendering handles React, Next.js, Shopify, and JS-heavy pages.</p>
            </div>
            <div className="rounded-3xl border border-border bg-background/50 p-4">
              <div className="font-semibold text-foreground">Premium export flow</div>
              <p className="mt-1">Generate a polished PDF report you can keep, share, or white-label.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="relative"
          id="reports"
        >
          <Card className="overflow-hidden p-0">
            <div className="grid-bg relative overflow-hidden rounded-[28px] border border-border/50 bg-background/40 p-6">
              <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-primary/8 to-transparent" />
              <div className="relative z-10 grid gap-4">
                <div className="flex items-center justify-between rounded-3xl border border-border bg-background/70 p-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Live report preview
                    </div>
                    <div className="mt-2 text-2xl font-semibold">linear.app</div>
                  </div>
                  <Badge variant="accent">Overall score 88</Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: "SEO", value: 91 },
                    { label: "Design", value: 89 },
                    { label: "Trust", value: 86 },
                    { label: "Conversion", value: 84 },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-3xl border border-border bg-background/70 p-4"
                    >
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                      <div className="mt-3 flex items-end justify-between">
                        <div className="text-3xl font-semibold">{metric.value}</div>
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-3xl border border-border bg-background/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">AI recommendation snapshot</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Strong positioning and visual clarity, but the primary CTA needs more urgency and social proof.
                      </p>
                    </div>
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <Badge variant="muted">What the platform covers</Badge>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            Every signal you need before you pitch, invest, redesign, or compete.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.copy}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name}>
              <CardHeader>
                <CardDescription className="text-base leading-7 text-foreground">
                  “{item.quote}”
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.role}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <Badge variant="muted">Pricing</Badge>
            <h2 className="mt-4 text-4xl font-semibold">Start free, scale when the signal gets valuable.</h2>
          </div>
          <Button asChild variant="outline" href="/pricing">
            See full pricing
          </Button>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card key={plan.id} className={plan.id === "PRO" ? "border-primary/30" : ""}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-2 text-4xl font-semibold">{plan.price}</div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-border bg-background/45 px-4 py-3 text-sm">
                    {bullet}
                  </div>
                ))}
                <Button asChild className="mt-4 w-full" href="/signup">
                  Start with {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <Badge>Ready to scan</Badge>
              <h2 className="mt-4 text-4xl font-semibold">Run your first intelligence report in minutes.</h2>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                Go from a plain URL to a strategic report with screenshots, audit scores, and AI insights you can act on immediately.
              </p>
            </div>
            <Button asChild size="lg" href="/signup">
              Start Free
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
