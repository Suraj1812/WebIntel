import { requireUser } from "@/lib/auth";
import { SettingsForm } from "@/components/settings/settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <SettingsForm defaultName={user.name} defaultCompany={user.company} />
      <Card>
        <CardHeader>
          <CardTitle>Plan capabilities</CardTitle>
          <CardDescription>Feature access is enforced by your current subscription level.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm">Free users can run 3 scans monthly.</div>
          <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm">Pro unlocks unlimited scans, compare mode, and exports.</div>
          <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm">Business is ready for team seats and API workflows.</div>
        </CardContent>
      </Card>
    </div>
  );
}
