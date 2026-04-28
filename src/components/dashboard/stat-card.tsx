import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}
