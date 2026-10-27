import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-auth";
import { anonymiseDataset, type Dataset } from "@/lib/touchline-data";
import { saveDatasetVersion } from "@/lib/touchline-store";

export const dynamic = "force-dynamic";

const uploadSchema = z.object({
  partial: z.object({
    results: z.array(z.unknown()).optional(),
    fixtures: z.array(z.unknown()).optional(),
    scorers: z.array(z.unknown()).optional()
  }),
  sourceFiles: z.array(z.string().min(1)).min(1),
  scorersIncluded: z.boolean()
});

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Only the Touchline owner can publish league data." }, { status: 403 });
  }
  try {
    const parsed = uploadSchema.parse(await request.json());
    if (!parsed.partial.results && !parsed.partial.fixtures && !parsed.partial.scorers) {
      return NextResponse.json({ error: "Choose at least one CSV file." }, { status: 400 });
    }
    const saved = await saveDatasetVersion({
      partial: parsed.partial as Partial<Dataset>,
      sourceFiles: parsed.sourceFiles,
      uploadedBy: "Touchline owner",
      scorersIncluded: parsed.scorersIncluded
    });
    return NextResponse.json(
      { ...saved, data: anonymiseDataset(saved.data) },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.issues[0]?.message ?? "The uploaded data is invalid."
      : error instanceof Error
        ? "The uploaded data did not pass validation."
        : "The uploaded data could not be saved.";
    console.error("Touchline dataset upload failed");
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
