"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bookmark,
  Clock3,
  LayoutDashboard,
  Radar,
  Settings2,
  SplitSquareHorizontal,
  Sparkles,
  Users2,
} from "lucide-react";
import { type ReactNode } from "react";
import { BrandLockup } from "@/components/shared/brand-lockup";
import { ProgressMeter } from "@/components/shared/progress-meter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/scan", label: "New audit", icon: Sparkles },
      { href: "/reports", label: "Report library", icon: BarChart3 },
      { href: "/compare", label: "Competitor compare", icon: SplitSquareHorizontal },
    ],
  },
  {
    label: "Retention",
    items: [
      { href: "/history", label: "Historical scans", icon: Clock3 },
      { href: "/saved", label: "Saved benchmarks", icon: Bookmark },
      { href: "/team", label: "Team workspace", icon: Users2 },
      { href: "/settings", label: "Settings", icon: Settings2 },
    ],
  },
];

export function AppShell({
  children,
  user,
  workspace,
}: {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    plan: string;
    company?: string | null;
  };
  workspace: {
    monthlyScans: number;
    reportCount: number;
    savedCount: number;
    usageTarget: number;
    usageLabel: string;
    usageHelper: string;
  };
}) {
  const pathname = usePathname();

  return (
    <div className="page-shell min-h-screen py-4 md:py-6">
      <div className="grid min-h-screen gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="surface-strong sticky top-6 rounded-[2.2rem] p-5">
            <Link href="/dashboard" className="block rounded-[1.6rem] px-1 py-1">
              <BrandLockup />
            </Link>

            <div className="mt-6 rounded-[1.8rem] bg-background/72 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Plan</div>
                  <div className="mt-1 text-lg font-semibold tracking-[-0.03em]">{user.plan}</div>
                </div>
                <Badge variant="accent">Live</Badge>
              </div>
              <div className="mt-4">
                <ProgressMeter
                  label={workspace.usageLabel}
                  value={workspace.monthlyScans}
                  max={workspace.usageTarget}
                  helper={workspace.usageHelper}
                />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className="px-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center justify-between rounded-[1.2rem] px-3 py-3 text-sm transition duration-200",
                            active
                              ? "bg-primary text-primary-foreground shadow-[0_12px_30px_-18px_rgba(15,24,39,0.85)]"
                              : "text-muted-foreground hover:bg-background/78 hover:text-foreground",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </span>
                          {active ? <Activity className="h-3.5 w-3.5" /> : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-[1.8rem] border border-border bg-background/68 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Radar className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Retention loops</div>
                  <div className="text-sm text-muted-foreground">
                    Benchmarks that make the workspace worth revisiting.
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.2rem] bg-card px-3 py-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Reports</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{workspace.reportCount}</div>
                </div>
                <div className="rounded-[1.2rem] bg-card px-3 py-3">
                  <div className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Saved</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{workspace.savedCount}</div>
                </div>
              </div>
              <Button asChild className="w-full" href="/scan">
                Run fresh audit
              </Button>
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-border bg-background/68 p-4">
              <div className="text-sm font-semibold">{user.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{user.email}</div>
              <div className="mt-3 text-sm text-muted-foreground">
                {user.company || "Personal workspace"}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="surface-panel rounded-[2rem] px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  {user.company || "Personal workspace"}
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
                  Website intelligence cockpit
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild variant="outline" href="/compare">
                  Compare websites
                </Button>
                <Button asChild href="/scan">
                  New audit
                </Button>
              </div>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto xl:hidden">
              {navGroups.flatMap((group) => group.items).map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm whitespace-nowrap transition duration-200",
                      active ? "bg-primary text-primary-foreground" : "bg-muted/70 text-muted-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
