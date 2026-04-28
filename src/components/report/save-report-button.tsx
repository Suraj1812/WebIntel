"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SaveReportButton({
  reportId,
  initialSaved,
}: {
  reportId: string;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const response = await fetch(`/api/reports/${reportId}/save`, {
          method: "POST",
        });
        const data = await response.json();
        setLoading(false);

        if (!response.ok) {
          toast.error(data.error || "Unable to update saved state.");
          return;
        }

        setSaved(Boolean(data.saved));
        toast.success(data.saved ? "Report saved." : "Removed from saved reports.");
      }}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save report"}
    </Button>
  );
}
