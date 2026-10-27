import { NextResponse } from "next/server";
import { anonymiseDataset } from "@/lib/touchline-data";
import { getCurrentDataset } from "@/lib/touchline-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const current = await getCurrentDataset();
  return NextResponse.json(
    {
      data: anonymiseDataset(current.data),
      meta: {
        ...current.meta,
        updatedBy: "Touchline admin",
        sourceFiles: []
      }
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
