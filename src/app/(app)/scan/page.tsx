import { ScanWorkbench } from "@/components/scan/scan-workbench";

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const params = await searchParams;

  return <ScanWorkbench initialUrl={params.url || ""} />;
}
