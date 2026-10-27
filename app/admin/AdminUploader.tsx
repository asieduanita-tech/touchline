"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Database, FileSpreadsheet, LockKeyhole, Upload } from "lucide-react";
import type { Dataset, DatasetResponse, Fixture, Result, Scorer } from "@/lib/touchline-data";

type TableName = "results" | "fixtures" | "scorers";
type ParsedTables = Partial<Pick<Dataset, TableName>>;
type SelectedFile = { name: string; count: number };

function normaliseHeader(value: string) {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) throw new Error("The CSV needs a header row and at least one data row.");
  const headers = rows[0].map(normaliseHeader);
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function needColumns(rows: Record<string, string>[], columns: string[], label: string) {
  const missing = columns.filter((column) => !(column in rows[0]));
  if (missing.length) throw new Error(`${label} is missing: ${missing.join(", ")}.`);
}

function wholeNumber(value: string, label: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) throw new Error(`${label} must be a whole number of 0 or more.`);
  return number;
}

function tableFromRows(type: TableName, rows: Record<string, string>[]) {
  if (type === "results") {
    needColumns(rows, ["date", "home_team", "away_team", "home_score", "away_score"], "Results CSV");
    return rows.map((row, index): Result => ({
      date: row.date,
      home_team: row.home_team,
      away_team: row.away_team,
      home_score: wholeNumber(row.home_score, `Row ${index + 2} home score`),
      away_score: wholeNumber(row.away_score, `Row ${index + 2} away score`),
      ...(row.division ? { division: wholeNumber(row.division, `Row ${index + 2} division`) } : {}),
      ...(row.season ? { season: row.season } : {})
    }));
  }
  if (type === "fixtures") {
    needColumns(rows, ["date", "home_team", "away_team"], "Fixtures CSV");
    return rows.map((row): Fixture => ({ date: row.date, home_team: row.home_team, away_team: row.away_team }));
  }
  needColumns(rows, ["team", "player"], "Goalscorers CSV");
  if (!("goals" in rows[0]) && !("number_of_goals" in rows[0])) {
    throw new Error("Goalscorers CSV is missing: goals or number_of_goals.");
  }
  return rows.map((row, index): Scorer => ({
    team: row.team,
    player: row.player,
    goals: wholeNumber(row.goals ?? row.number_of_goals, `Row ${index + 2} goals`)
  }));
}

export default function AdminUploader() {
  const [current, setCurrent] = useState<DatasetResponse | null>(null);
  const [parsed, setParsed] = useState<ParsedTables>({});
  const [files, setFiles] = useState<Partial<Record<TableName, SelectedFile>>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<DatasetResponse | null>(null);

  useEffect(() => {
    fetch("/api/dataset", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Current data could not be loaded.");
        return response.json() as Promise<DatasetResponse>;
      })
      .then(setCurrent)
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Current data could not be loaded."));
  }, []);

  const selectedCount = Object.keys(files).length;
  const active = saved ?? current;
  const summary = useMemo(() => active ? [
    ["Results", active.data.results.length],
    ["Fixtures", active.data.fixtures.length],
    ["Scorers", active.data.scorers.length]
  ] : [], [active]);

  async function chooseFile(type: TableName, file?: File) {
    setSaved(null);
    setError("");
    if (!file) return;
    if (file.name.toLowerCase().endsWith(".numbers")) {
      setError("That is a Numbers workbook. In Numbers, export the relevant sheet as CSV, then upload the CSV here.");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please choose a CSV file.");
      return;
    }
    try {
      const rows = parseCSV(await file.text());
      const table = tableFromRows(type, rows);
      setParsed((value) => ({ ...value, [type]: table }));
      setFiles((value) => ({ ...value, [type]: { name: file.name, count: table.length } }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That CSV could not be read.");
    }
  }

  async function publish() {
    setError("");
    setSaved(null);
    setSaving(true);
    try {
      const response = await fetch("/api/admin/dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partial: parsed,
          sourceFiles: Object.values(files).map((file) => file.name),
          scorersIncluded: Boolean(parsed.scorers)
        })
      });
      const body = await response.json() as DatasetResponse & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The update could not be published.");
      setSaved(body);
      setCurrent(body);
      setParsed({});
      setFiles({});
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The update could not be published.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-nav">
        <Link href="/" className="admin-back"><ArrowLeft size={15} /> Back to scout</Link>
        <span><LockKeyhole size={14} /> Owner-only data admin</span>
      </header>

      <section className="admin-hero">
        <span className="admin-kicker">Touchline data</span>
        <h1>Update the scouting dataset.</h1>
        <p>Upload whichever league tables have changed. Touchline validates the rows, keeps any tables you leave blank, and publishes one new version to the anonymised site.</p>
      </section>

      <section className="admin-grid">
        <article className="admin-panel admin-current">
          <div className="admin-heading">
            <div><Database size={20} /><h2>Current shared dataset</h2></div>
            <span>{active?.meta.persistent ? "Saved in private storage" : "Bundled starting data"}</span>
          </div>
          <div className="admin-counts">
            {summary.map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
          {active && <p className="admin-meta">Last updated {new Date(active.meta.updatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}. {active.meta.pendingScorers ? "Goalscorers are still using the previously supplied league list." : "All three tables were supplied in the latest update."}</p>}
        </article>

        <article className="admin-panel admin-lesson">
          <span className="admin-kicker">What the code does</span>
          <ol>
            <li><b>Read</b><span>The browser turns each CSV row into a JavaScript object.</span></li>
            <li><b>Validate</b><span>The server checks dates, scores, required columns and duplicates.</span></li>
            <li><b>Persist</b><span>A new version is saved in private Vercel storage and becomes the site source.</span></li>
          </ol>
        </article>

        <article className="admin-panel admin-upload">
          <div className="admin-heading">
            <div><Upload size={20} /><h2>Choose updated CSV files</h2></div>
            <span>{selectedCount} selected</span>
          </div>
          <p className="admin-instruction">Your attachment today is a Numbers workbook. For future updates, open each changed sheet in Numbers and choose File → Export To → CSV.</p>
          <div className="admin-file-list">
            {([
              ["results", "Results", "date, home_team, away_team, home_score, away_score"],
              ["fixtures", "Fixtures", "date, home_team, away_team"],
              ["scorers", "Goalscorers", "player, team, number_of_goals"]
            ] as const).map(([type, label, columns]) => (
              <label className={files[type] ? "admin-file selected" : "admin-file"} key={type}>
                <input type="file" accept=".csv,text/csv" onChange={(event) => chooseFile(type, event.target.files?.[0])} />
                <FileSpreadsheet size={22} />
                <span><strong>{label}</strong><small>{files[type] ? `${files[type]?.name} · ${files[type]?.count} rows` : columns}</small></span>
                {files[type] ? <Check size={18} /> : <b>Choose CSV</b>}
              </label>
            ))}
          </div>
          <div className="admin-template-links">
            <span>Example files:</span>
            <a href="/results-template.csv" download>results</a>
            <a href="/fixtures-template.csv" download>fixtures</a>
            <a href="/goalscorers-template.csv" download>goalscorers</a>
          </div>
          {error && <p className="admin-error" role="alert">{error}</p>}
          {saved && <p className="admin-success" role="status"><Check size={17} /> Update published. The scouting site now uses this dataset.</p>}
          <button className="admin-publish" disabled={!selectedCount || saving} onClick={publish}>
            {saving ? "Publishing…" : "Publish shared update"}
          </button>
        </article>
      </section>
    </main>
  );
}
