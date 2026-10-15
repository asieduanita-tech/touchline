import { NextResponse } from "next/server";
import { anonymiseDataset, fallbackRawDataset, normaliseDataset } from "@/lib/touchline-data";

// Public portfolio edition: only bundled fictional data; no private storage or admin routes.
export async function GET() {
  return NextResponse.json({
    data: anonymiseDataset(normaliseDataset(fallbackRawDataset)),
    meta: {
      versionId: "portfolio-demo",
      updatedAt: "2026-09-22T00:00:00.000Z",
      updatedBy: "Touchline demo",
      sourceFiles: [],
      pendingScorers: true,
      persistent: false
    }
  }, { headers: { "Cache-Control": "public, max-age=300" } });
}
