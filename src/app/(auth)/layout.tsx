import { BarChart3, Radar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BrandLockup } from "@/components/shared/brand-lockup";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell grid min-h-screen items-center py-6">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-strong hidden rounded-[2.6rem] p-8 xl:flex xl:flex-col xl:justify-between">
          <div>
            <Link href="/" className="inline-flex">
              <BrandLockup />
            </Link>
            <div className="mt-10 max-w-xl">
              <div className="eyebrow">Website audits that look board-ready</div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em]">
                Scan, compare, and benchmark websites without the usual tooling sprawl.
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-8 text-muted-foreground">
                WebIntel AI turns one public URL into evidence, scorecards, and executive-grade recommendations that teams actually reuse.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Radar,
                title: "Visual proof",
                copy: "Full-page, desktop, and mobile captures for every audit.",
              },
              {
                icon: BarChart3,
                title: "Benchmark memory",
                copy: "Saved reports and history keep every review comparable.",
              },
              {
                icon: ShieldCheck,
                title: "Private by default",
                copy: "Auth-protected workspaces with guarded scan inputs.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-[1.8rem] border border-border bg-background/72 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="mt-4 text-lg font-semibold tracking-[-0.03em]">{item.title}</div>
                  <div className="mt-2 text-sm leading-7 text-muted-foreground">{item.copy}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
