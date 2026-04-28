import { BellRing, Code2, Palette, ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { PageIntro } from "@/components/shared/page-intro";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Settings"
        title="Tune the workspace around how your team reviews sites."
        description="Keep identity details current, set expectations around alerts and exports, and understand which higher-retention features are available on your plan."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SettingsForm defaultName={user.name} defaultCompany={user.company} />
        <div className="space-y-6">
          {[
            {
              icon: BellRing,
              title: "Alerts and review rhythm",
              copy: "Use historical scans to decide which sites deserve a weekly or monthly check-in cadence.",
            },
            {
              icon: Palette,
              title: "Export defaults",
              copy: "White-label exports are available when the report has to travel beyond the core workspace.",
            },
            {
              icon: Code2,
              title: "API access",
              copy: "Business workspaces are positioned for programmatic review flows and internal tooling handoff.",
            },
            {
              icon: ShieldCheck,
              title: "Guardrails",
              copy: "Scan validation, auth protection, and saved report controls stay on by default across the workspace.",
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
