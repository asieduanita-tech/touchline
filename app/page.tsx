"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clipboard,
  FileUp,
  LockKeyhole,
  RotateCcw,
  Shield,
  ShieldCheck,
  Target,
  X
} from "lucide-react";

type Result = {
  date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  division?: number;
  season?: string;
};

type Fixture = { date: string; home_team: string; away_team: string };
type Scorer = { team: string; player: string; goals: number };
type Dataset = { results: Result[]; fixtures: Fixture[]; scorers: Scorer[]; archive?: Result[] };
type FormMatch = Result & { gf: number; ga: number; opponent: string; venue: "H" | "A"; outcome: "W" | "D" | "L" };

const suppliedData: Dataset = {
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

const STORAGE_KEY = "touchline-city-goals-v3";

function normaliseHeader(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "_");
}

function parseCSV(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
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
  if (rows.length < 2) throw new Error("The file needs a header row and at least one data row.");
  const headers = rows[0].map(normaliseHeader);
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

function validDate(value: string) {
  return !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
}

function goalLabel(goals: number) {
  return `${goals} ${goals === 1 ? "goal" : "goals"}`;
}

function formatDate(date: string, short = false) {
  const value = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", short
    ? { day: "numeric", month: "short" }
    : { weekday: "short", day: "numeric", month: "short" }
  ).format(value);
}

function teamMatches(results: Result[], team: string): FormMatch[] {
  return results
    .filter((match) => match.home_team === team || match.away_team === team)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((match) => {
      const home = match.home_team === team;
      const gf = home ? match.home_score : match.away_score;
      const ga = home ? match.away_score : match.home_score;
      return {
        ...match,
        gf,
        ga,
        venue: home ? "H" : "A",
        opponent: home ? match.away_team : match.home_team,
        outcome: gf > ga ? "W" : gf < ga ? "L" : "D"
      };
    });
}

function summarise(matches: FormMatch[]) {
  const games = matches.length;
  const gf = matches.reduce((sum, match) => sum + match.gf, 0);
  const ga = matches.reduce((sum, match) => sum + match.ga, 0);
  const points = matches.reduce((sum, match) => sum + (match.outcome === "W" ? 3 : match.outcome === "D" ? 1 : 0), 0);
  return {
    games,
    gf,
    ga,
    points,
    ppg: games ? points / games : 0,
    avgGf: games ? gf / games : 0,
    avgGa: games ? ga / games : 0,
    scoringGames: matches.filter((match) => match.gf > 0).length,
    concededGames: matches.filter((match) => match.ga > 0).length,
    cleanSheets: matches.filter((match) => match.ga === 0).length,
    wins: matches.filter((match) => match.outcome === "W").length
  };
}

function ordinal(value: number) {
  const mod100 = value % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${value}th`;
  if (value % 10 === 1) return `${value}st`;
  if (value % 10 === 2) return `${value}nd`;
  if (value % 10 === 3) return `${value}rd`;
  return `${value}th`;
}

function monthsBetween(earlier: string, later: string) {
  const start = new Date(`${earlier}T12:00:00`);
  const end = new Date(`${later}T12:00:00`);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export default function Home() {
  const [data, setData] = useState<Dataset>(suppliedData);
  const [draftData, setDraftData] = useState<Dataset>(suppliedData);
  const [myTeam, setMyTeam] = useState("Electric Flamingos FC");
  const [opponent, setOpponent] = useState("Velvet Thunder FC");
  const [showImport, setShowImport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingScorers, setPendingScorers] = useState(true);
  const [importState, setImportState] = useState<Record<string, { name: string; count: number }>>({});
  const [error, setError] = useState("");
  const inputRefs = {
    results: useRef<HTMLInputElement>(null),
    fixtures: useRef<HTMLInputElement>(null),
    scorers: useRef<HTMLInputElement>(null)
  };

  useEffect(() => {
    let active = true;
    fetch("/api/dataset", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Shared data is unavailable.");
        return response.json() as Promise<{ data: Dataset; meta: { pendingScorers: boolean } }>;
      })
      .then((response) => {
        if (!active) return;
        setData(response.data);
        setDraftData(response.data);
        setPendingScorers(response.meta.pendingScorers);
        const nextFixture = response.data.fixtures
          .filter((match) => match.home_team === "Electric Flamingos FC" || match.away_team === "Electric Flamingos FC")
          .sort((a, b) => a.date.localeCompare(b.date))[0];
        if (nextFixture) {
          setOpponent(nextFixture.home_team === "Electric Flamingos FC" ? nextFixture.away_team : nextFixture.home_team);
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const teams = useMemo(() => {
    const all = new Set<string>();
    data.results.forEach((match) => { all.add(match.home_team); all.add(match.away_team); });
    data.fixtures.forEach((match) => { all.add(match.home_team); all.add(match.away_team); });
    data.scorers.forEach((scorer) => all.add(scorer.team));
    return [...all].sort();
  }, [data]);

  const upcoming = useMemo(() => data.fixtures
    .filter((match) => match.home_team === myTeam || match.away_team === myTeam)
    .sort((a, b) => a.date.localeCompare(b.date)), [data.fixtures, myTeam]);

  const opponents = useMemo(() => {
    const scheduled = upcoming.map((match) => match.home_team === myTeam ? match.away_team : match.home_team);
    return scheduled.length ? [...new Set(scheduled)] : teams.filter((team) => team !== myTeam);
  }, [myTeam, teams, upcoming]);

  useEffect(() => {
    if (!opponents.includes(opponent)) setOpponent(opponents[0] ?? "");
  }, [opponent, opponents]);

  const selectedFixture = upcoming.find((match) => match.home_team === opponent || match.away_team === opponent);
  const opponentMatches = useMemo(() => teamMatches(data.results, opponent), [data.results, opponent]);
  const myMatches = useMemo(() => teamMatches(data.results, myTeam), [data.results, myTeam]);
  const recentOpponentMatches = opponentMatches.slice(0, 5);
  const recentMyMatches = myMatches.slice(0, 5);
  const oppSeason = useMemo(() => summarise(opponentMatches), [opponentMatches]);
  const myRecent = useMemo(() => summarise(recentMyMatches), [recentMyMatches]);
  const oppRecent = useMemo(() => summarise(recentOpponentMatches), [recentOpponentMatches]);

  const leagueAttack = useMemo(() => teams
    .map((team) => ({ team, ...summarise(teamMatches(data.results, team)) }))
    .filter((row) => row.games > 0)
    .sort((a, b) => b.avgGf - a.avgGf || b.gf - a.gf || a.team.localeCompare(b.team)), [data.results, teams]);
  const attackRank = Math.max(1, leagueAttack.findIndex((row) => row.team === opponent) + 1);

  const allOpponentScorers = useMemo(() => data.scorers
    .filter((row) => row.team === opponent)
    .sort((a, b) => b.goals - a.goals || a.player.localeCompare(b.player)), [data.scorers, opponent]);
  const topScorers = allOpponentScorers.slice(0, 5);
  const topScorer = allOpponentScorers[0];
  const topScorerShare = topScorer && oppSeason.gf > 0 ? Math.round((topScorer.goals / oppSeason.gf) * 100) : 0;
  const topScorerIsMinimum = Boolean(topScorer && pendingScorers);
  const formDifference = oppRecent.points - myRecent.points;
  const formEdgeLabel = formDifference === 0 ? "Level recent form" : `Form edge: ${formDifference > 0 ? "them" : "us"}`;
  const matchPlanInsight = topScorer && oppSeason.gf > 0
    ? topScorerIsMinimum
      ? `${topScorer.player} has at least ${goalLabel(topScorer.goals)} recorded, so limit the supply into their leading scorer. ${opponent} concede ${oppSeason.avgGa.toFixed(1)} per match; use that rate to calibrate how aggressively to commit numbers forward.`
      : `${topScorer.player} represents ${topScorerShare}% of their recorded goals, so limit the supply into their leading scorer. ${opponent} concede ${oppSeason.avgGa.toFixed(1)} per match; use that rate to calibrate how aggressively to commit numbers forward.`
    : `${opponent} concede ${oppSeason.avgGa.toFixed(1)} per match. Protect team shape without overcommitting to an unsupported individual threat, then use the concession rate to calibrate risk.`;

  const rankText = attackRank === 1
    ? `the highest rate among ${leagueAttack.length} teams with results`
    : `${ordinal(attackRank)} of ${leagueAttack.length} teams with results`;

  const attackInsight = oppSeason.games === 0
    ? `${opponent} have no completed current-season matches, so no scoring rate can be calculated.`
    : oppSeason.gf === 0
      ? `${opponent} have scored 0 goals in ${oppSeason.games} matches (0.0 per game), the lowest attacking return in the current dataset.`
      : `${opponent} have scored ${oppSeason.gf} goals in ${oppSeason.games} matches (${oppSeason.avgGf.toFixed(1)} per game), ${rankText}. They scored in ${oppSeason.scoringGames} of those ${oppSeason.games} matches.`;

  const defenceInsight = oppSeason.games === 0
    ? `There is no current-season defensive sample for ${opponent}.`
    : `${opponent} have conceded ${oppSeason.ga} goals in ${oppSeason.games} matches (${oppSeason.avgGa.toFixed(1)} per game), keeping ${oppSeason.cleanSheets} clean sheet${oppSeason.cleanSheets === 1 ? "" : "s"}.`;

  const threatInsight = oppSeason.gf === 0
    ? `No attacking concentration can be calculated because ${opponent} have 0 recorded team goals.`
    : topScorer
      ? topScorerIsMinimum
        ? `${topScorer.player} has at least ${topScorer.goals} of ${opponent}’s ${oppSeason.gf} goals (${topScorerShare}%). Denying service to one player could therefore remove ${topScorerShare}% of their recorded output.`
        : `${topScorer.player} has ${topScorer.goals} of ${opponent}’s ${oppSeason.gf} goals (${topScorerShare}%). Denying service to one player could therefore remove ${topScorerShare}% of their recorded output.`
      : `${opponent} have ${oppSeason.gf} recorded team goals, but no goalscorer rows were supplied, so individual threat concentration cannot be calculated.`;

  const openingInsight = oppSeason.games === 0
    ? `No defensive opening can be supported without a completed match.`
    : `${opponent} conceded in ${oppSeason.concededGames} of ${oppSeason.games} matches at a rate of ${oppSeason.avgGa.toFixed(1)} per game. ${oppSeason.avgGa >= 1.5 ? "Sustained pressure is supported by the concession rate." : "The low concession rate makes set pieces and high-quality chances especially valuable."}`;

  const report = useMemo(() => {
    const fixtureLine = selectedFixture
      ? `${formatDate(selectedFixture.date)} · ${selectedFixture.home_team === myTeam ? "Home" : "Away"}`
      : "Fixture date and venue not supplied";
    const formLine = recentOpponentMatches.map((match) => match.outcome).join("–") || "No completed matches";
    return [
      `TOUCHLINE PRE-MATCH DOSSIER`,
      `${myTeam.toUpperCase()} vs ${opponent.toUpperCase()}`,
      fixtureLine,
      "",
      `FORM: ${opponent} ${formLine}; ${oppRecent.points} points from ${oppRecent.games} recent matches (${oppRecent.ppg.toFixed(1)} per game). ${myTeam} have ${myRecent.points} points from ${myRecent.games} (${myRecent.ppg.toFixed(1)} per game).`,
      `ATTACK: ${attackInsight}`,
      `DEFENCE: ${defenceInsight}`,
      `PRIMARY THREAT: ${threatInsight}`,
      `OPPORTUNITY: ${openingInsight}`,
      "",
      `SUGGESTED FOCUS`,
      topScorer && oppSeason.gf > 0
        ? topScorerIsMinimum
          ? `• ${topScorer.player} has at least ${goalLabel(topScorer.goals)} recorded; restrict the supply line into their leading scorer.`
          : `• ${topScorer.player} represents ${topScorerShare}% of recorded goals; restrict the supply line into their leading scorer.`
        : `• With 0 recorded team goals or no scorer rows, prioritise shape over marking an unsupported individual threat.`,
      `• ${opponent} concede ${oppSeason.avgGa.toFixed(1)} per game; use that rate to decide how aggressively to commit numbers forward.`,
      "",
      `Source: ${data.results.length} current results, ${data.fixtures.length} scheduled fixtures and ${data.scorers.length} scorer records.`
    ].filter(Boolean).join("\n");
  }, [attackInsight, data.fixtures.length, data.results.length, data.scorers.length, defenceInsight, myRecent, myTeam, openingInsight, opponent, oppRecent, oppSeason.avgGa, oppSeason.gf, recentOpponentMatches, selectedFixture, threatInsight, topScorer, topScorerIsMinimum, topScorerShare]);

  function handleTeamChange(nextTeam: string) {
    setMyTeam(nextTeam);
    const firstFixture = data.fixtures
      .filter((match) => match.home_team === nextTeam || match.away_team === nextTeam)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (firstFixture) setOpponent(firstFixture.home_team === nextTeam ? firstFixture.away_team : firstFixture.home_team);
  }

  function openImport() {
    setDraftData(data);
    setImportState({});
    setError("");
    setShowImport(true);
  }

  async function handleFile(type: "results" | "fixtures" | "scorers", file?: File) {
    if (!file) return;
    setError("");
    try {
      const rows = parseCSV(await file.text());
      if (type === "results") {
        const required = ["date", "home_team", "away_team", "home_score", "away_score"];
        if (!required.every((key) => key in rows[0])) throw new Error(`Results needs: ${required.join(", ")}`);
        const parsed = rows.map((row) => ({
          date: row.date,
          home_team: row.home_team,
          away_team: row.away_team,
          home_score: Number(row.home_score),
          away_score: Number(row.away_score),
          division: row.division ? Number(row.division) : undefined
        }));
        if (parsed.some((row) => !validDate(row.date) || !row.home_team || !row.away_team || !Number.isFinite(row.home_score) || !Number.isFinite(row.away_score))) throw new Error("Some result rows have an invalid date, team name or score.");
        setDraftData((current) => ({ ...current, results: parsed }));
      }
      if (type === "fixtures") {
        const required = ["date", "home_team", "away_team"];
        if (!required.every((key) => key in rows[0])) throw new Error(`Fixtures needs: ${required.join(", ")}`);
        const parsed = rows.map((row) => ({ date: row.date, home_team: row.home_team, away_team: row.away_team }));
        if (parsed.some((row) => !validDate(row.date) || !row.home_team || !row.away_team)) throw new Error("Some fixture rows have an invalid date or missing team.");
        setDraftData((current) => ({ ...current, fixtures: parsed }));
      }
      if (type === "scorers") {
        const required = ["team", "player", "goals"];
        if (!required.every((key) => key in rows[0])) throw new Error(`Goalscorers needs: ${required.join(", ")}`);
        const parsed = rows.map((row) => ({ team: row.team, player: row.player, goals: Number(row.goals) }));
        if (parsed.some((row) => !row.team || !row.player || !Number.isFinite(row.goals))) throw new Error("Some goalscorer rows have a missing team, player or invalid goals total.");
        setDraftData((current) => ({ ...current, scorers: parsed }));
      }
      setImportState((current) => ({ ...current, [type]: { name: file.name, count: rows.length } }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That file could not be read.");
    }
  }

  function applyImports() {
    const nextTeams = new Set<string>();
    draftData.results.forEach((match) => { nextTeams.add(match.home_team); nextTeams.add(match.away_team); });
    draftData.fixtures.forEach((match) => { nextTeams.add(match.home_team); nextTeams.add(match.away_team); });
    const selectedTeam = nextTeams.has(myTeam) ? myTeam : [...nextTeams][0] ?? myTeam;
    const nextFixture = draftData.fixtures
      .filter((match) => match.home_team === selectedTeam || match.away_team === selectedTeam)
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    const selectedOpponent = nextFixture
      ? (nextFixture.home_team === selectedTeam ? nextFixture.away_team : nextFixture.home_team)
      : [...nextTeams].find((team) => team !== selectedTeam) ?? opponent;
    setData(draftData);
    setMyTeam(selectedTeam);
    setOpponent(selectedOpponent);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: draftData, myTeam: selectedTeam, opponent: selectedOpponent }));
    setShowImport(false);
  }

  function restoreBundledData() {
    setData(suppliedData);
    setDraftData(suppliedData);
    setMyTeam("Electric Flamingos FC");
    setOpponent("Velvet Thunder FC");
    setImportState({});
    setError("");
    window.localStorage.removeItem(STORAGE_KEY);
    setShowImport(false);
  }

  async function copyReport() {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const fixtureLabel = selectedFixture
    ? `${formatDate(selectedFixture.date)} · ${selectedFixture.home_team === myTeam ? "Home" : "Away"}`
    : "Fixture date TBC";

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Touchline home">
          <span className="brand-ball" aria-hidden="true" />
          <span>Touchline</span>
          <small>Match intelligence</small>
        </a>
        <div className="top-actions">
          <span className="privacy"><LockKeyhole size={13} /> Anonymised workspace</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="edition-line">
          <span>Sunday League Demo</span>
          <span>Pre-match dossier</span>
          <span>{selectedFixture ? formatDate(selectedFixture.date) : "Date TBC"}</span>
        </div>
        <div className="fixture-title">
          <div className="fixture-team"><span>Our side</span><h1>{myTeam}</h1></div>
          <div className="versus">v</div>
          <div className="fixture-team away"><span>Opposition</span><h1>{opponent}</h1></div>
        </div>
        <div className="fixture-deck">
          <p>{fixtureLabel}. Built from current-season results, scheduled fixtures and recorded goalscorers.</p>
          <div className="hero-controls">
            <label>
              <span>Current team</span>
              <div className="select-wrap">
                <select value={myTeam} onChange={(event) => handleTeamChange(event.target.value)}>
                  {teams.map((team) => <option key={team}>{team}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
            <label>
              <span>Upcoming opponent</span>
              <div className="select-wrap">
                <select value={opponent} onChange={(event) => setOpponent(event.target.value)}>
                  {opponents.map((team) => <option key={team}>{team}</option>)}
                </select>
                <ChevronDown size={15} />
              </div>
            </label>
          </div>
        </div>
      </section>

      <div className="data-strip">
        <span><Check size={14} /> Fictional identities, real match data</span>
        <span>{data.results.length} completed results</span>
        <span>{data.fixtures.length} scheduled fixtures</span>
        <span>{pendingScorers ? "Goalscorers awaiting league update" : `${data.scorers.length} scorer records`}</span>
      </div>

      <section className="analysis" aria-label="Opponent scouting analysis">
        <header className="dashboard-heading">
          <div>
            <span className="dashboard-meta">{fixtureLabel}</span>
            <h2>{opponent}</h2>
          </div>
          <div className="form-badges" aria-label={`${opponent} recent form`}>
            <span>Last {recentOpponentMatches.length}</span>
            {recentOpponentMatches.map((match) => <b className={match.outcome.toLowerCase()} key={`${match.date}-${match.opponent}`}>{match.outcome}</b>)}
          </div>
        </header>

        <div className="dashboard-grid">
          <article className="dashboard-card results-card">
            <div className="card-heading"><h3>Recent results</h3><span>Latest first</span></div>
            <div className="result-list">
              {recentOpponentMatches.length ? recentOpponentMatches.map((match) => {
                const ourMatch = myMatches.find((ours) => ours.opponent === match.opponent);
                const isDirectMatch = match.opponent === myTeam || myMatches.some((ours) => ours.date === match.date && ours.opponent === opponent);
                return (
                  <div className="result-row" key={`${match.date}-${match.opponent}`}>
                    <b className={`result-badge ${match.outcome.toLowerCase()}`}>{match.outcome}</b>
                    <span className="result-date">{formatDate(match.date, true)}</span>
                    <span className="venue-badge">{match.venue}</span>
                    <div className="result-team">
                      <strong>{match.opponent}</strong>
                      {!isDirectMatch && <span className={ourMatch ? `our-result ${ourMatch.outcome.toLowerCase()}` : "our-result"}>{ourMatch ? `Our result: ${ourMatch.outcome} ${ourMatch.gf}–${ourMatch.ga}` : "Our result: not played yet"}</span>}
                    </div>
                    <em>{match.gf} – {match.ga}</em>
                  </div>
                );
              }) : <p className="empty-state">No completed results for this team.</p>}
            </div>
          </article>

          <article className="dashboard-card pattern-card">
            <div className="card-heading"><h3>Scoring pattern</h3><span>Up to five matches</span></div>
            <div className="pattern-metrics">
              <div><Target size={22} /><strong>{oppRecent.avgGf.toFixed(1)}</strong><span>Goals / match</span></div>
              <div><Shield size={22} /><strong>{oppRecent.avgGa.toFixed(1)}</strong><span>Conceded / match</span></div>
            </div>
            <div className="pattern-bars">
              <div className="pattern-bar-label"><span>Scored in</span><strong>{oppRecent.scoringGames} of {oppRecent.games}</strong></div>
              <div className="pattern-track"><i style={{ width: `${oppRecent.games ? (oppRecent.scoringGames / oppRecent.games) * 100 : 0}%` }} /></div>
              <div className="pattern-bar-label"><span>Clean sheets</span><strong>{oppRecent.cleanSheets} of {oppRecent.games}</strong></div>
              <div className="pattern-track"><i style={{ width: `${oppRecent.games ? (oppRecent.cleanSheets / oppRecent.games) * 100 : 0}%` }} /></div>
            </div>
          </article>

          <article className="dashboard-card threats-card">
            <div className="card-heading"><h3>Goal threats</h3><span>League totals</span></div>
            <div className="threat-list">
              {topScorers.length ? topScorers.map((player, index) => {
                const share = oppSeason.gf > 0 ? Math.round((player.goals / oppSeason.gf) * 100) : 0;
                const isMinimum = pendingScorers;
                return (
                  <div className="threat-row" key={player.player}>
                    <span className="threat-rank">{String(index + 1).padStart(2, "0")}</span>
                    <div><strong>{player.player}</strong><small>{isMinimum ? `At least ${goalLabel(player.goals)}` : `${share}% of team goals`}</small></div>
                    <span className="threat-track"><i style={{ width: `${Math.min(100, share)}%` }} /></span>
                    <b>{isMinimum ? `${player.goals}+` : player.goals}</b>
                  </div>
                );
              }) : <p className="empty-state">No scorer recorded. Team total: {oppSeason.gf} goals.</p>}
            </div>
          </article>

          <article className="dashboard-card comparison-card">
            <div className="card-heading"><h3>Form comparison</h3><span>Up to five matches</span></div>
            <div className="comparison-teams">
              <div><span>Us</span><strong>{myTeam}</strong></div>
              <em>vs</em>
              <div><span>Them</span><strong>{opponent}</strong></div>
            </div>
            {[
              ["Points", myRecent.points, oppRecent.points],
              ["Goals for", myRecent.gf, oppRecent.gf],
              ["Goals against", myRecent.ga, oppRecent.ga],
              ["Wins", myRecent.wins, oppRecent.wins]
            ].map(([label, us, them]) => (
              <div className="comparison-row" key={label}><strong>{us}</strong><span>{label}</span><strong>{them}</strong></div>
            ))}
            <div className={classNames("form-edge", formDifference > 0 ? "edge-them" : formDifference < 0 ? "edge-us" : "edge-level")}>
              <span>↘</span><strong>{formEdgeLabel}</strong><b>{formDifference === 0 ? "Even" : `${Math.abs(formDifference)} pt${Math.abs(formDifference) === 1 ? "" : "s"}`}</b>
            </div>
          </article>
        </div>

        <article className="schedule-card">
          <div className="card-heading"><h3>Upcoming fixtures</h3><span>Select to scout</span></div>
          <div className="schedule-list">
            {upcoming.slice(0, 4).map((fixture) => {
              const other = fixture.home_team === myTeam ? fixture.away_team : fixture.home_team;
              const home = fixture.home_team === myTeam;
              return (
                <button className={classNames("schedule-fixture", other === opponent && "selected")} key={`${fixture.date}-${other}`} onClick={() => setOpponent(other)}>
                  <span>{formatDate(fixture.date, true)}</span><strong>{other}</strong><b>{home ? "H" : "A"}</b>
                </button>
              );
            })}
            {!upcoming.length && <p className="empty-state">No scheduled fixtures for {myTeam}.</p>}
          </div>
        </article>
      </section>

      <section className="report-section" id="report">
        <div className="brief-layout">
          <aside className="brief-intro">
            <span className="brief-kicker">◎ Matchday brief</span>
            <h2>Your pre-match<br />scouting report.</h2>
            <p>Generated from the current-season results, fixtures and goalscorer records on this page.</p>
            <button className="brief-copy" onClick={copyReport}>{copied ? <Check size={18} /> : <Clipboard size={18} />}{copied ? "Copied" : "Copy team brief"}</button>
          </aside>

          <article className="brief-paper">
            <header className="paper-meta">
              <div><span>Pre-match report</span><small>{selectedFixture ? formatDate(selectedFixture.date) : "Date TBC"}</small></div>
              <b>TL</b>
            </header>
            <h2>{myTeam} <i>vs</i> {opponent}</h2>
            <div className="paper-facts">
              <div><span>Their form</span><strong>{recentOpponentMatches.map((match) => match.outcome).join(" · ") || "No results"}</strong></div>
              <div><span>Goals / game</span><strong>{oppSeason.avgGf.toFixed(1)}</strong></div>
              <div><span>Top threat</span><strong>{topScorer ? topScorer.player : "Not recorded"}</strong></div>
            </div>
            <div className="brief-points">
              <div><span>01</span><p><strong>Read the threat</strong>{threatInsight}</p></div>
              <div><span>02</span><p><strong>How to create chances</strong>{openingInsight}</p></div>
              <div><span>03</span><p><strong>Simple match plan</strong>{matchPlanInsight}</p></div>
            </div>
            <footer className="paper-source"><CalendarDays size={15} /> Generated from {data.results.length} current results, {data.fixtures.length} fixtures and {data.scorers.length} scorer records.</footer>
          </article>
        </div>
      </section>

      <footer className="site-footer"><span>TOUCHLINE · ANONYMISED</span><span>All team and player names are fictional · Match data remains unchanged</span></footer>

      {showImport && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowImport(false); }}>
          <section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
            <div className="modal-head">
              <div><span className="kicker">Data room</span><h2 id="import-title">Replace data tables</h2></div>
              <button className="icon-button" onClick={() => setShowImport(false)} aria-label="Close data replacement"><X size={20} /></button>
            </div>
            <p className="modal-copy">Each CSV replaces that entire table. Tables you do not upload remain unchanged. Nothing is appended or merged.</p>
            <div className="import-list">
              {([
                ["results", "Replace match results", "date, home_team, away_team, home_score, away_score"],
                ["fixtures", "Replace scheduled fixtures", "date, home_team, away_team"],
                ["scorers", "Replace goalscorers", "team, player, goals"]
              ] as const).map(([type, title, columns]) => (
                <button className={classNames("import-row", importState[type] && "complete")} key={type} onClick={() => inputRefs[type].current?.click()}>
                  <input ref={inputRefs[type]} type="file" accept=".csv,text/csv" hidden onChange={(event) => handleFile(type, event.target.files?.[0])} />
                  <span className="file-icon">{importState[type] ? <Check size={19} /> : <FileUp size={19} />}</span>
                  <span><strong>{title}</strong><small>{importState[type] ? `${importState[type].name} · ${importState[type].count} rows` : columns}</small></span>
                  <span className="upload-label">{importState[type] ? "Choose another" : "Choose CSV"}</span>
                </button>
              ))}
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="import-note"><ShieldCheck size={16} /><span><strong>Replacement is local to this browser.</strong> Advanced stats such as assists, cards and goal timings are not required.</span></div>
            <div className="modal-actions">
              <button className="text-button" onClick={restoreBundledData}><RotateCcw size={15} /> Restore bundled data</button>
              <button className="solid-button" onClick={applyImports} disabled={!Object.keys(importState).length}>Replace selected tables</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
