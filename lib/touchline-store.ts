import "server-only";

import { get, put } from "@vercel/blob";
import {
  Dataset,
  DatasetMeta,
  DatasetResponse,
  fallbackRawDataset,
  normaliseDataset
} from "./touchline-data";

const DATASET_PATH = "touchline/current-dataset.json";

const fallbackMeta: DatasetMeta = {
  versionId: "bundled-2026-09-22",
  updatedAt: "2026-09-22T00:00:00.000Z",
  updatedBy: "Touchline bundled data",
  sourceFiles: [],
  pendingScorers: true,
  persistent: false
};

export async function getCurrentDataset(): Promise<DatasetResponse> {
  try {
    const result = await get(DATASET_PATH, { access: "private" });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return { data: normaliseDataset(fallbackRawDataset), meta: fallbackMeta };
    }
    const stored = await new Response(result.stream).json() as DatasetResponse;
    return { data: normaliseDataset(stored.data), meta: stored.meta };
  } catch {
    console.error("Unable to load the current Touchline dataset");
    return { data: normaliseDataset(fallbackRawDataset), meta: fallbackMeta };
  }
}

export async function saveDatasetVersion(input: {
  partial: Partial<Dataset>;
  sourceFiles: string[];
  uploadedBy: string;
  scorersIncluded: boolean;
}) {
  const current = await getCurrentDataset();
  const merged = normaliseDataset({
    results: input.partial.results ?? current.data.results,
    fixtures: input.partial.fixtures ?? current.data.fixtures,
    scorers: input.partial.scorers ?? current.data.scorers,
    archive: input.partial.archive ?? current.data.archive ?? []
  });
  const uploadedAt = new Date().toISOString();
  const response: DatasetResponse = {
    data: merged,
    meta: {
      versionId: crypto.randomUUID(),
      updatedAt: uploadedAt,
      updatedBy: input.uploadedBy,
      sourceFiles: input.sourceFiles,
      pendingScorers: !input.scorersIncluded,
      persistent: true
    }
  };

  await put(DATASET_PATH, JSON.stringify(response), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });

  return response;
}
