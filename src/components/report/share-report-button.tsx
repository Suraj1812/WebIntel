"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareReportButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Report link copied.");
        } catch {
          toast.error("Unable to copy the report link.");
        }
      }}
    >
      <Share2 className="h-4 w-4" />
      Copy link
    </Button>
  );
}
