// ─── Data Normalization ────────────────────────────────
import type {
  RawMatch, RawTeam, RawGroup, RawGroupTeam, RawStadium,
  Match, Team, Group, GroupStanding, Stadium,
} from '@/types/worldcup';

function toNum(v: string | null | undefined): number {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function toNumOrNull(v: string | null | undefined): number | null {
  if (v === null || v === undefined || v === '' || v === 'null') return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function toBool(v: string | null | undefined): boolean {
  if (v === null || v === undefined) return false;
  return v.toUpperCase() === 'TRUE';
}

/**
 * Parse a scorer JSON string from the API.
 * The API returns MongoDB set-format strings like:
 *   "{\"Nestory Irankunda 27'\",\"C. Metcalfe 75'\"}"
 *   "{\"Breel Embolo 17' (p)\"}"
 * or the literal string "null".
 *
 * This format is NOT valid JSON (no key-value pairs, just quoted items
 * separated by commas inside curly braces), so JSON.parse fails.
 * We handle it by stripping the braces and splitting.
 *
 * Returns a cleaned, comma-separated string of scorer entries or null.
 */
export function parseScorers(raw: string | null | undefined): string | null {
  if (!raw || raw === 'null') return null;

  // Try valid JSON first (in case the API format changes)
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.join(', ');
    }
    if (typeof parsed === 'object' && parsed !== null) {
      return Object.keys(parsed).join(', ');
    }
    return String(parsed);
  } catch {
    // MongoDB set format: {"Item 1","Item 2"}
    // Strip outer braces and split by "," boundaries
    let cleaned = raw.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      cleaned = cleaned.slice(1, -1);
    }
    // Split on "," pattern (quote-comma-quote between items)
    const items = cleaned
      .split('","')
      .map((s) => s.replace(/^"/, '').replace(/"$/, '').trim())
      .filter(Boolean);
    return items.length > 0 ? items.join(', ') : null;
  }
}

export function normalizeMatch(raw: RawMatch): Match {
  return {
    id: toNum(raw.id),
    home_team_id: toNum(raw.home_team_id),
    away_team_id: toNum(raw.away_team_id),
    home_score: toNumOrNull(raw.home_score),
    away_score: toNumOrNull(raw.away_score),
    home_scorers: parseScorers(raw.home_scorers),
    away_scorers: parseScorers(raw.away_scorers),
    finished: toBool(raw.finished),
    time_elapsed: raw.time_elapsed === 'finished' ? null : raw.time_elapsed || null,
    group: raw.group || null,
    local_date: raw.local_date,
    utc_date: raw.local_date, // API doesn't provide utc_date separately
    stadium_id: toNum(raw.stadium_id),
    type: raw.type,
    matchday: toNumOrNull(raw.matchday),
    home_team_name_en: raw.home_team_name_en,
    away_team_name_en: raw.away_team_name_en,
  };
}

export function normalizeTeam(raw: RawTeam): Team {
  return {
    id: toNum(raw.id),
    name_en: raw.name_en,
    flag: raw.flag,
    fifa_code: raw.fifa_code,
    iso2: raw.iso2,
    groups: raw.groups,
  };
}

export function normalizeGroupStanding(raw: RawGroupTeam, teamsMap: Map<number, Team>, groupName: string): GroupStanding {
  const teamId = toNum(raw.team_id);
  const team = teamsMap.get(teamId);
  return {
    id: teamId,
    name_en: team?.name_en ?? `Team ${raw.team_id}`,
    flag: team?.flag ?? '',
    fifa_code: team?.fifa_code ?? '',
    mp: toNum(raw.mp),
    w: toNum(raw.w),
    d: toNum(raw.d),
    l: toNum(raw.l),
    pts: toNum(raw.pts),
    gf: toNum(raw.gf),
    ga: toNum(raw.ga),
    gd: toNum(raw.gd),
    group: groupName,
  };
}

export function normalizeGroup(raw: RawGroup, teamsMap: Map<number, Team>): Group {
  return {
    id: toNum(raw._id) || 0,
    name: raw.name,
    teams: (raw.teams ?? []).map((t) => normalizeGroupStanding(t, teamsMap, raw.name)),
  };
}

export function normalizeStadium(raw: RawStadium): Stadium {
  return {
    id: toNum(raw.id),
    name_en: raw.name_en,
    city_en: raw.city_en,
    country_en: raw.country_en,
    capacity: raw.capacity,
  };
}

/**
 * Extract player stats from match scorer data.
 * Parses home_scorers and away_scorers fields.
 */
export interface PlayerStat {
  name: string;
  teamId: number;
  goals: number;
}

export function extractPlayerStats(matches: Match[]): PlayerStat[] {
  const playerMap = new Map<string, { name: string; teamId: number; goals: number }>();

  for (const match of matches) {
    // Parse home scorers
    if (match.home_scorers) {
      const names = parseScorerNames(match.home_scorers, match.home_team_id);
      for (const name of names) {
        const key = `${name}::${match.home_team_id}`;
        const existing = playerMap.get(key);
        if (existing) {
          existing.goals++;
        } else {
          playerMap.set(key, { name, teamId: match.home_team_id, goals: 1 });
        }
      }
    }

    // Parse away scorers
    if (match.away_scorers) {
      const names = parseScorerNames(match.away_scorers, match.away_team_id);
      for (const name of names) {
        const key = `${name}::${match.away_team_id}`;
        const existing = playerMap.get(key);
        if (existing) {
          existing.goals++;
        } else {
          playerMap.set(key, { name, teamId: match.away_team_id, goals: 1 });
        }
      }
    }
  }

  return Array.from(playerMap.values()).sort((a, b) => b.goals - a.goals);
}

/**
 * Parse scorer names from a scorer string like:
 * "Nestory Irankunda 27', C. Metcalfe 75'"
 * "B. Khoukhi 90'+5' (p)"
 * Strips minute markers and penalty indicators.
 */
function parseScorerNames(scorers: string, _teamId: number): string[] {
  if (!scorers) return [];

  // Split by comma
  const parts = scorers.split(',').map((s) => s.trim()).filter(Boolean);
  return parts.map((part) => {
    // Remove trailing minute info: " 27'", " 90'+5'", " 17' (p)"
    let name = part
      .replace(/\s+\d+\+?\d*'\s*(\([^)]*\))?\s*$/, '')  // Remove minute like " 27'" or " 90'+5'" and optional (p)
      .replace(/\s*\([^)]*\)\s*$/, '')                    // Remove trailing (p), (og), etc.
      .trim();
    return name;
  }).filter((n) => n.length > 0);
}
