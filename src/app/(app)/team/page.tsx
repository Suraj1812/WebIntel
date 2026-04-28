import { requireUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TeamPage() {
  const user = await requireUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team workspace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-[26px] border border-border bg-background/45 p-4">
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        <div className="rounded-[26px] border border-border bg-background/45 p-4 text-sm text-muted-foreground">
          Team seats are enabled through the Business plan and can share reports, scans, and exports from a single workspace.
        </div>
      </CardContent>
    </Card>
  );
}
