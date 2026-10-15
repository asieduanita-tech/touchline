import { z } from "zod";

export type Result = {
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  division?: number;
  season?: string;
};

export type Fixture = {
  date: string;
  home_team: string;
  away_team: string;
};

export type Scorer = {
  team: string;
  player: string;
  goals: number;
};

export type Dataset = {
  results: Result[];
  fixtures: Fixture[];
  scorers: Scorer[];
  archive?: Result[];
};

export type DatasetMeta = {
  versionId: string;
  updatedAt: string;
  updatedBy: string;
  sourceFiles: string[];
  pendingScorers: boolean;
  persistent: boolean;
};

export type DatasetResponse = {
  data: Dataset;
  meta: DatasetMeta;
};

export const fallbackRawDataset: Dataset = {
  results: [
    { date: "2026-08-16", home_team: "Parallel Lines FC", away_team: "Neon Borough FC", home_score: 0, away_score: 2, division: 2 },
    { date: "2026-08-16", home_team: "Electric Flamingos FC", away_team: "Calamity Athletic", home_score: 0, away_score: 1, division: 2 },
    { date: "2026-08-23", home_team: "Parallel Lines FC", away_team: "Calamity Athletic", home_score: 2, away_score: 0, division: 2 },
    { date: "2026-08-23", home_team: "Electric Flamingos FC", away_team: "Neon Borough FC", home_score: 2, away_score: 2, division: 2 },
    { date: "2026-08-23", home_team: "Velvet Thunder FC", away_team: "The Plot Twists", home_score: 0, away_score: 3, division: 2 },
    { date: "2026-09-06", home_team: "Velvet Thunder FC", away_team: "Neon Borough FC", home_score: 1, away_score: 2, division: 2 },
    { date: "2026-09-06", home_team: "The Plot Twists", away_team: "Calamity Athletic", home_score: 2, away_score: 6, division: 2 },
    { date: "2026-09-06", home_team: "Parallel Lines FC", away_team: "Moonshot United", home_score: 3, away_score: 0, division: 2 },
    { date: "2026-09-13", home_team: "Electric Flamingos FC", away_team: "Parallel Lines FC", home_score: 2, away_score: 1, division: 2 },
    { date: "2026-09-13", home_team: "Moonshot United", away_team: "Velvet Thunder FC", home_score: 0, away_score: 3, division: 2 },
    { date: "2026-09-13", home_team: "Neon Borough FC", away_team: "The Plot Twists", home_score: 4, away_score: 2, division: 2 },
    { date: "2026-09-20", home_team: "Calamity Athletic", away_team: "Neon Borough FC", home_score: 1, away_score: 2, division: 2 },
    { date: "2026-09-20", home_team: "Velvet Thunder FC", away_team: "Electric Flamingos FC", home_score: 0, away_score: 6, division: 2 },
    { date: "2026-09-20", home_team: "The Plot Twists", away_team: "Moonshot United", home_score: 3, away_score: 0, division: 2 },
    { date: "2026-09-27", home_team: "The Plot Twists", away_team: "Electric Flamingos FC", home_score: 1, away_score: 4, division: 2 },
    { date: "2026-09-27", home_team: "Velvet Thunder FC", away_team: "Parallel Lines FC", home_score: 2, away_score: 8, division: 2 },
    { date: "2026-09-27", home_team: "Calamity Athletic", away_team: "Moonshot United", home_score: 3, away_score: 0, division: 2 }
  ],
  fixtures: [
    { date: "2026-10-04", home_team: "Moonshot United", away_team: "Neon Borough FC" },
    { date: "2026-10-04", home_team: "Calamity Athletic", away_team: "Velvet Thunder FC" },
    { date: "2026-10-04", home_team: "Parallel Lines FC", away_team: "The Plot Twists" },
    { date: "2026-10-11", home_team: "Calamity Athletic", away_team: "Parallel Lines FC" },
    { date: "2026-10-11", home_team: "Neon Borough FC", away_team: "Electric Flamingos FC" },
    { date: "2026-10-11", home_team: "The Plot Twists", away_team: "Velvet Thunder FC" },
    { date: "2026-10-18", home_team: "Electric Flamingos FC", away_team: "Moonshot United" },
    { date: "2026-10-18", home_team: "Velvet Thunder FC", away_team: "Calamity Athletic" },
    { date: "2026-10-18", home_team: "Neon Borough FC", away_team: "Parallel Lines FC" },
    { date: "2026-10-25", home_team: "Moonshot United", away_team: "Parallel Lines FC" },
    { date: "2026-10-25", home_team: "Calamity Athletic", away_team: "The Plot Twists" },
    { date: "2026-10-25", home_team: "Neon Borough FC", away_team: "Velvet Thunder FC" },
    { date: "2026-11-01", home_team: "Velvet Thunder FC", away_team: "Moonshot United" },
    { date: "2026-11-01", home_team: "Parallel Lines FC", away_team: "Electric Flamingos FC" },
    { date: "2026-11-01", home_team: "The Plot Twists", away_team: "Neon Borough FC" },
    { date: "2026-11-08", home_team: "Electric Flamingos FC", away_team: "Velvet Thunder FC" },
    { date: "2026-11-08", home_team: "Neon Borough FC", away_team: "Calamity Athletic" },
    { date: "2026-11-08", home_team: "Moonshot United", away_team: "The Plot Twists" },
    { date: "2026-11-15", home_team: "Electric Flamingos FC", away_team: "The Plot Twists" },
    { date: "2026-11-15", home_team: "Moonshot United", away_team: "Calamity Athletic" },
    { date: "2026-11-15", home_team: "Parallel Lines FC", away_team: "Velvet Thunder FC" },
    { date: "2026-11-22", home_team: "Neon Borough FC", away_team: "Moonshot United" },
    { date: "2026-11-22", home_team: "The Plot Twists", away_team: "Parallel Lines FC" },
    { date: "2026-11-22", home_team: "Calamity Athletic", away_team: "Electric Flamingos FC" },
    { date: "2026-11-29", home_team: "Moonshot United", away_team: "Electric Flamingos FC" }
  ],
  scorers: [
    { player: "Nova", team: "Calamity Athletic", goals: 4 },
    { player: "Vesper", team: "Neon Borough FC", goals: 4 },
    { player: "Comet", team: "The Plot Twists", goals: 3 },
    { player: "Glitch", team: "Parallel Lines FC", goals: 2 },
    { player: "Aster", team: "Electric Flamingos FC", goals: 1 },
    { player: "Blaze", team: "Neon Borough FC", goals: 1 },
    { player: "Echo", team: "Calamity Athletic", goals: 1 },
    { player: "Ember", team: "Neon Borough FC", goals: 1 },
    { player: "Eclipse", team: "Calamity Athletic", goals: 1 },
    { player: "Jet", team: "Velvet Thunder FC", goals: 1 },
    { player: "Juniper", team: "The Plot Twists", goals: 1 },
    { player: "Karma", team: "Neon Borough FC", goals: 1 },
    { player: "Lux", team: "Electric Flamingos FC", goals: 1 },
    { player: "Nebula", team: "Electric Flamingos FC", goals: 1 },
    { player: "Nimbus", team: "Neon Borough FC", goals: 1 },
    { player: "Sol", team: "Electric Flamingos FC", goals: 1 },
    { player: "Sonic", team: "Neon Borough FC", goals: 1 },
    { player: "Storm", team: "Neon Borough FC", goals: 1 },
    { player: "Tempo", team: "Parallel Lines FC", goals: 1 },
    { player: "Zenith", team: "Calamity Athletic", goals: 1 }
  ],
  archive: [
    { date: "2026-04-26", home_team: "Neon Borough FC", away_team: "Electric Flamingos FC", home_score: 4, away_score: 1, division: 1, season: "2025/26" },
    { date: "2026-06-14", home_team: "Electric Flamingos FC", away_team: "Neon Borough FC", home_score: 2, away_score: 7, division: 1, season: "2025/26" }
  ]
};

const TEAM_ALIASES: Record<string, string> = {
  "Electric Flamingos FC": "Electric Flamingos FC",
  "Calamity Athletic": "Calamity Athletic",
  "Moonshot United": "Moonshot United",
  "The Plot Twists": "The Plot Twists",
  "Neon Borough FC": "Neon Borough FC",
  "Velvet Thunder FC": "Velvet Thunder FC",
  "Parallel Lines FC": "Parallel Lines FC"
};

const PLAYER_ALIASES: Record<string, string> = {
  Nova: "Nova",
  Vesper: "Vesper",
  Comet: "Comet",
  Glitch: "Glitch",
  Aster: "Aster",
  Blaze: "Blaze",
  Echo: "Echo",
  Ember: "Ember",
  Eclipse: "Eclipse",
  Jet: "Jet",
  Juniper: "Juniper",
  Karma: "Karma",
  Lux: "Lux",
  Nebula: "Nebula",
  Nimbus: "Nimbus",
  Sol: "Sol",
  Sonic: "Sonic",
  Storm: "Storm",
  Tempo: "Tempo",
  Zenith: "Zenith"
};

const TEAM_CANONICAL: Record<string, string> = {
  "black footy babes": "Electric Flamingos FC",
  "Electric Flamingos FC": "Electric Flamingos FC",
  "chaos": "Calamity Athletic",
  "Calamity Athletic": "Calamity Athletic",
  "cgl": "Moonshot United",
  "Moonshot United": "Moonshot United",
  "ex-girlfriend": "The Plot Twists",
  "The Plot Twists": "The Plot Twists",
  "Neon Borough FC": "Neon Borough FC",
  "Velvet Thunder FC": "Velvet Thunder FC",
  "sonder": "Parallel Lines FC",
  "Parallel Lines FC": "Parallel Lines FC"
};

const resultSchema = z.object({
  date: z.string().min(1),
  home_team: z.string().min(1),
  away_team: z.string().min(1),
  home_score: z.number().int().nonnegative(),
  away_score: z.number().int().nonnegative(),
  division: z.number().int().positive().optional(),
  season: z.string().min(1).optional()
});

const fixtureSchema = z.object({
  date: z.string().min(1),
  home_team: z.string().min(1),
  away_team: z.string().min(1)
});

const scorerSchema = z.object({
  team: z.string().min(1),
  player: z.string().min(1),
  goals: z.number().int().nonnegative()
});

function stableHash(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function privateTeamAlias(team: string) {
  if (TEAM_ALIASES[team]) return TEAM_ALIASES[team];
  const nouns = ["Comets", "Foxes", "Kites", "Meteors", "Otters", "Rockets"];
  const adjectives = ["Cosmic", "Electric", "Midnight", "Solar", "Velvet", "Wild"];
  const hash = stableHash(team);
  return `${adjectives[hash % adjectives.length]} ${nouns[Math.floor(hash / adjectives.length) % nouns.length]} ${String(hash % 97).padStart(2, "0")}`;
}

function privatePlayerAlias(player: string) {
  if (PLAYER_ALIASES[player]) return PLAYER_ALIASES[player];
  const names = ["Orbit", "Pixel", "Quasar", "Riff", "Spark", "Tempo"];
  const hash = stableHash(player);
  return `${names[hash % names.length]} ${String(hash % 97).padStart(2, "0")}`;
}

export function canonicalTeamName(value: string) {
  const cleaned = value.trim().replace(/\s+/g, " ");
  return TEAM_CANONICAL[cleaned.toLowerCase()] ?? cleaned;
}

export function normaliseDate(value: string) {
  const cleaned = value.trim();
  let year: number;
  let month: number;
  let day: number;
  const iso = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const uk = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);
  if (iso) {
    year = Number(iso[1]);
    month = Number(iso[2]);
    day = Number(iso[3]);
  } else if (uk) {
    day = Number(uk[1]);
    month = Number(uk[2]);
    year = Number(uk[3]);
    if (year < 100) year += 2000;
  } else {
    throw new Error(`Date “${value}” must be YYYY-MM-DD or DD/MM/YYYY.`);
  }
  const checked = new Date(Date.UTC(year, month - 1, day));
  if (checked.getUTCFullYear() !== year || checked.getUTCMonth() !== month - 1 || checked.getUTCDate() !== day) {
    throw new Error(`Date “${value}” is not a valid calendar date.`);
  }
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function normaliseDataset(input: Dataset): Dataset {
  const results = z.array(resultSchema).parse(input.results).map((row) => ({
    ...row,
    date: normaliseDate(row.date),
    home_team: canonicalTeamName(row.home_team),
    away_team: canonicalTeamName(row.away_team)
  }));
  const fixtures = z.array(fixtureSchema).parse(input.fixtures).map((row) => ({
    ...row,
    date: normaliseDate(row.date),
    home_team: canonicalTeamName(row.home_team),
    away_team: canonicalTeamName(row.away_team)
  }));
  const scorers = z.array(scorerSchema).parse(input.scorers).map((row) => ({
    ...row,
    team: canonicalTeamName(row.team),
    player: row.player.trim()
  }));
  const archive = z.array(resultSchema).parse(input.archive ?? []).map((row) => ({
    ...row,
    date: normaliseDate(row.date),
    home_team: canonicalTeamName(row.home_team),
    away_team: canonicalTeamName(row.away_team)
  }));

  for (const match of [...results, ...fixtures, ...archive]) {
    if (match.home_team === match.away_team) throw new Error(`A match on ${match.date} lists the same team twice.`);
  }

  const seenResults = new Set<string>();
  for (const match of results) {
    const key = `${match.date}|${match.home_team}|${match.away_team}`;
    if (seenResults.has(key)) throw new Error(`Duplicate result: ${match.date}, ${match.home_team} vs ${match.away_team}.`);
    seenResults.add(key);
  }

  const resultKeys = new Set(results.map((match) => `${match.date}|${match.home_team}|${match.away_team}`));
  const seenFixtures = new Set<string>();
  const remainingFixtures = fixtures.filter((match) => {
    const key = `${match.date}|${match.home_team}|${match.away_team}`;
    if (seenFixtures.has(key)) throw new Error(`Duplicate fixture: ${match.date}, ${match.home_team} vs ${match.away_team}.`);
    seenFixtures.add(key);
    return !resultKeys.has(key);
  });

  const seenScorers = new Set<string>();
  for (const scorer of scorers) {
    const key = `${scorer.team}|${scorer.player}`.toLowerCase();
    if (seenScorers.has(key)) throw new Error(`Duplicate scorer: ${scorer.player}, ${scorer.team}.`);
    seenScorers.add(key);
  }

  return {
    results: results.sort((a, b) => a.date.localeCompare(b.date)),
    fixtures: remainingFixtures.sort((a, b) => a.date.localeCompare(b.date)),
    scorers: scorers.sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player)),
    archive: archive.sort((a, b) => a.date.localeCompare(b.date))
  };
}

export function anonymiseDataset(input: Dataset): Dataset {
  const data = normaliseDataset(input);
  const mapResult = (match: Result): Result => ({
    ...match,
    home_team: privateTeamAlias(match.home_team),
    away_team: privateTeamAlias(match.away_team)
  });
  return {
    results: data.results.map(mapResult),
    fixtures: data.fixtures.map((match) => ({
      ...match,
      home_team: privateTeamAlias(match.home_team),
      away_team: privateTeamAlias(match.away_team)
    })),
    scorers: data.scorers.map((scorer) => ({
      ...scorer,
      team: privateTeamAlias(scorer.team),
      player: privatePlayerAlias(scorer.player)
    })),
    archive: (data.archive ?? []).map(mapResult)
  };
}
