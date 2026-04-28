import { Gift, MonitorPlay, Users2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { PLAN_CONFIG } from "@/lib/constants";
import { PageIntro } from "@/components/shared/page-intro";
import { Badge } from "@/components/ui/badge";

export default async function TeamPage() {
  const user = await requireUser();
  const plan = PLAN_CONFIG[user.plan];

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Team workspace"
        title="Collaboration matters once audits become part of the operating rhythm."
        description="This screen frames how the workspace expands from one reviewer to a shared benchmark and reporting system."
        metadata={[{ label: "Current plan", value: plan.name }]}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-panel rounded-[2.2rem] p-6 md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Current member</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Workspace roster</h2>
            </div>
            <Badge variant="accent">{plan.name}</Badge>
          </div>
          <div className="mt-6 rounded-[1.8rem] border border-border bg-background/72 p-5">
            <div className="text-lg font-semibold tracking-[-0.03em]">{user.name}</div>
            <div className="mt-1 text-sm text-muted-foreground">{user.email}</div>
            <div className="mt-4 text-sm leading-7 text-muted-foreground">
              {user.company || "Personal workspace"} is ready to grow into a shared environment when report review becomes a team sport.
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {[
            {
              icon: Users2,
              title: "Shared audit memory",
              copy: "Team workspaces matter because saved reports, compare mode, and exports stay consistent across reviewers.",
            },
            {
              icon: MonitorPlay,
              title: "Extension-ready thinking",
              copy: "A browser extension layer makes sense when audits begin from live browsing instead of a saved URL list.",
            },
            {
              icon: Gift,
              title: "Referral rewards",
              copy: "The product is naturally referable when agencies and operators want clients or teammates looking at the same benchmark quality.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <section key={item.title} className="surface-panel rounded-[2rem] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="mt-5 text-xl font-semibold tracking-[-0.03em]">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.copy}</p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
