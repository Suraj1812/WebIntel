"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportExportButton({
  reportId,
  whiteLabel,
}: {
  reportId: string;
  whiteLabel?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        window.open(
          `/api/reports/${reportId}/export${whiteLabel ? "?whiteLabel=1" : ""}`,
          "_blank",
        );
      }}
    >
      <Download className="h-4 w-4" />
      Export PDF
    </Button>
  );
}
