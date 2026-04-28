import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth";
import { PLAN_CONFIG } from "@/lib/constants";
import { getPrisma } from "@/lib/prisma";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const prisma = getPrisma();
  const startOfMonth = new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);

  const [reportCount, savedCount, monthlyScans] = await Promise.all([
    prisma.report.count({
      where: { userId: user.id },
    }),
    prisma.savedReport.count({
      where: { userId: user.id },
    }),
    prisma.report.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
        },
      },
    }),
  ]);

  const plan = PLAN_CONFIG[user.plan];

  return (
    <AppShell
      user={{
        name: user.name,
        email: user.email,
        plan: user.plan,
        company: user.company,
      }}
      workspace={{
        monthlyScans,
        reportCount,
        savedCount,
        usageTarget: plan.monthlyScanCap ?? plan.cadenceTarget,
        usageLabel: plan.monthlyScanCap ? "Monthly scan allowance" : "Healthy monthly cadence",
        usageHelper: plan.monthlyScanCap
          ? `${monthlyScans} of ${plan.monthlyScanCap} scans used this month.`
          : `${monthlyScans} scans logged this month. ${plan.cadenceTarget}+ keeps your benchmark library fresh.`,
      }}
    >
      {children}
    </AppShell>
  );
}
