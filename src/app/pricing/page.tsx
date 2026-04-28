import { MarketingHeader } from "@/components/layout/marketing-header";
import { SUBSCRIPTION_PLANS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
  return (
    <>
      <MarketingHeader />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-semibold tracking-tight">Pricing that grows with your intelligence pipeline.</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start on Free, move to Pro for recurring work, and unlock Business when your team needs seats, exports, and API workflows.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-2 text-4xl font-semibold">
                  {plan.price}
                  <span className="ml-2 text-base font-normal text-muted-foreground">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-border bg-background/45 px-4 py-3 text-sm">
                    {bullet}
                  </div>
                ))}
                <Button asChild className="mt-4 w-full" href="/signup">
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
