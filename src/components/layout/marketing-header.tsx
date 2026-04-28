import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export async function MarketingHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-semibold">
          <img src="/brand/logo.svg" alt={APP_NAME} className="h-10 w-auto" />
          <div>
            <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              WebIntel
            </div>
            <div className="text-lg text-foreground">AI</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground">
            Features
          </Link>
          <Link href="#reports" className="hover:text-foreground">
            Demo
          </Link>
          <Link href="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <Button asChild href="/dashboard">
              Open Dashboard
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" href="/login">
                Log in
              </Button>
              <Button asChild href="/signup">
                Start Free
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
