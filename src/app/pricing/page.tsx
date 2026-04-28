import { CheckCircle2 } from "lucide-react";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const featureMatrix = [
  ["Monthly scans", "3", "Unlimited", "Unlimited"],
  ["Saved reports", "Included", "Included", "Included"],
  ["Compare mode", "Basic", "Full", "Full"],
  ["White-label exports", "—", "Included", "Included"],
  ["Team workspace", "—", "Light", "Included"],
  ["API access", "—", "—", "Included"],
];

export default function PricingPage() {
  return (
    <>
      <MarketingHeader />
      <div className="marketing-shell pb-24 pt-10">
        <section className="section-shell pt-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="accent">Pricing built around repeated use</Badge>
            <h1 className="display-title mt-5 text-balance">
              The first report is valuable. The benchmark library is what makes teams stay.
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Choose the plan that matches how often you audit. Free is for quick validation. Pro is for recurring review. Business is for teams that need reporting, seats, and API coverage.
            </p>
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="grid gap-5 lg:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((plan, index) => (
              <div
                key={plan.id}
                className={`rounded-[2.2rem] p-[1px] ${index === 1 ? "bg-gradient-to-b from-primary/60 to-accent/30" : "bg-border"}`}
              >
                <div className={`h-full rounded-[2.1rem] ${index === 1 ? "surface-strong" : "surface-panel"} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold tracking-[-0.03em]">{plan.name}</div>
                    {index === 1 ? <Badge variant="accent">Most teams</Badge> : null}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-muted-foreground">{plan.description}</div>
                  <div className="mt-6 text-5xl font-semibold tracking-[-0.06em]">
                    {plan.price}
                    <span className="ml-2 text-base font-medium text-muted-foreground">/ month</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    {plan.bullets.map((bullet) => (
                      <div key={bullet} className="flex items-start gap-3 rounded-[1.4rem] border border-border bg-background/72 px-4 py-3 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                  <Button asChild className="mt-6 w-full" variant={index === 1 ? "default" : "secondary"} href="/signup">
                    Start with {plan.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-shell pt-0">
          <div className="surface-panel overflow-hidden rounded-[2.4rem]">
            <div className="border-b border-border px-6 py-6">
              <Badge variant="muted">Feature matrix</Badge>
              <h2 className="section-title mt-4">Choose based on how much audit memory your team needs.</h2>
            </div>
            <div className="grid grid-cols-[1.2fr_repeat(3,0.8fr)] gap-px bg-border text-sm">
              {["Capability", "Free", "Pro", "Business"].map((item, index) => (
                <div key={item} className={`bg-background/92 px-4 py-4 ${index === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {item}
                </div>
              ))}
              {featureMatrix.map((row) =>
                row.map((item, index) => (
                  <div key={`${row[0]}-${item}`} className={`bg-background/74 px-4 py-4 leading-6 ${index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {item}
                  </div>
                )),
              )}
            </div>
          </div>
        </section>

        <section className="pt-2">
          <div className="surface-strong rounded-[2.4rem] px-7 py-8 text-center">
            <h2 className="section-title">Need a tighter buying loop?</h2>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
              Start free, run a real audit, save the report, and decide whether compare mode, history, exports, and team access would earn their seat in your workflow.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" href="/signup">
                Create workspace
              </Button>
              <Button asChild size="lg" variant="outline" href="/scan">
                Try a live audit
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
