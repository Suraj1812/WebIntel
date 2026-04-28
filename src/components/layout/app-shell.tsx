"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bookmark, Clock3, LayoutDashboard, Settings2, SplitSquareHorizontal, Sparkles } from "lucide-react";
import { type ReactNode } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scan", label: "New Scan", icon: Sparkles },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/compare", label: "Compare", icon: SplitSquareHorizontal },
  { href: "/history", label: "History", icon: Clock3 },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

export function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: {
    name: string;
    email: string;
    plan: string;
  };
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="glass hidden w-76 rounded-[32px] border border-border/80 p-4 lg:flex lg:flex-col">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-3xl px-3 py-3">
            <img src="/brand/logo.svg" alt="WebIntel AI" className="h-10 w-auto" />
          </Link>
          <div className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-auto rounded-[28px] border border-border bg-background/40 p-4">
            <div className="text-sm font-semibold">{user.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{user.email}</div>
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="default">{user.plan}</Badge>
              <Button asChild variant="outline" size="sm" href="/pricing">
                Upgrade
              </Button>
            </div>
          </div>
        </aside>
        <div className="flex flex-1 flex-col gap-4">
          <div className="glass flex items-center justify-between rounded-[28px] border border-border/80 px-5 py-4">
            <div>
              <div className="text-sm text-muted-foreground">Operational workspace</div>
              <div className="text-xl font-semibold">Website intelligence cockpit</div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button asChild size="sm" href="/scan">
                New analysis
              </Button>
            </div>
          </div>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
