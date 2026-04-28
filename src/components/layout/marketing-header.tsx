import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { BrandLockup } from "@/components/shared/brand-lockup";
import { Button } from "@/components/ui/button";

export async function MarketingHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="marketing-shell surface-panel rounded-[2rem] px-4 py-3 backdrop-blur-md md:px-5">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="min-w-0">
            <BrandLockup />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex">
            <Link href="/#why-webintel" className="transition-colors hover:text-foreground">
              Why WebIntel
            </Link>
            <Link href="/#use-cases" className="transition-colors hover:text-foreground">
              Use cases
            </Link>
            <Link href="/#compare" className="transition-colors hover:text-foreground">
              Compare
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="outline" href="/reports">
                  Report library
                </Button>
                <Button asChild href="/dashboard">
                  Open workspace
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" href="/login">
                  Log in
                </Button>
                <Button asChild href="/signup">
                  Start free
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
