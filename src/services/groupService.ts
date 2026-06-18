// ─── Group Service ───────────────────────────────────
import { apiClient } from './apiClient';
import { normalizeGroup, normalizeGroupStanding } from './normalize';
import { fetchTeamsMap } from './teamService';
import type { Group, GroupStanding, GroupsResponse, RawGroup, RawGroupTeam, Team } from '@/types/worldcup';

export async function fetchGroups(): Promise<Group[]> {
  // Try API first
  try {
    const [{ data }, teamsMap] = await Promise.all([
      apiClient.get<GroupsResponse>('/get/groups'),
      fetchTeamsMap(),
    ]);
    const rawGroups = data.groups ?? [];
    if (rawGroups.length > 0) {
      return rawGroups.map((g) => normalizeGroup(g, teamsMap));
    }
  } catch {
    // API failed — fall back to building groups from teams + matches
    console.warn('/get/groups failed, building groups from teams + matches');
  }

  return buildGroupsFromTeamsAndMatches();
}

export async function fetchGroupByName(name: string): Promise<Group | null> {
  const groups = await fetchGroups();
  return groups.find((g) => g.name === name) ?? null;
}

export async function fetchStandings(): Promise<GroupStanding[]> {
  const groups = await fetchGroups();
  return groups.flatMap((g) => g.teams);
}

export async function fetchGroupStandings(groupName: string): Promise<GroupStanding[]> {
  const group = await fetchGroupByName(groupName);
  return group?.teams ?? [];
}

// ─── Fallback: Build groups from teams + matches ─────
async function buildGroupsFromTeamsAndMatches(): Promise<Group[]> {
  const teamsResp = await apiClient.get<any>('/get/teams');
  const teamsData = teamsResp.data.teams ?? [];
  
  let gamesData: any[] = [];
  try {
    const gamesResp = await apiClient.get<any>('/get/games');
    gamesData = gamesResp.data.games ?? [];
  } catch {
    // games failed too, proceed without standings
    console.warn('/get/games also failed — groups will have zero standings');
  }

  const teamsList: Team[] = teamsData.map((t: any) => ({
    id: Number(t.id),
    name_en: t.name_en,
    flag: t.flag,
    fifa_code: t.fifa_code,
    iso2: t.iso2,
    groups: t.groups,
  }));

  // Group teams by group letter
  const groupMap = new Map<string, Team[]>();
  for (const team of teamsList) {
    const groupName = team.groups;
    if (!groupName) continue;
    if (!groupMap.has(groupName)) groupMap.set(groupName, []);
    groupMap.get(groupName)!.push(team);
  }

  // Build standings from match results
  const matches = gamesData.map((m: any) => ({
    id: Number(m.id),
    home_team_id: Number(m.home_team_id),
    away_team_id: Number(m.away_team_id),
    home_score: m.home_score === 'null' || m.home_score === null ? null : Number(m.home_score),
    away_score: m.away_score === 'null' || m.away_score === null ? null : Number(m.away_score),
    finished: String(m.finished).toUpperCase() === 'TRUE',
    group: m.group,
  }));

  const groups: Group[] = [];
  for (const [groupName, teams] of groupMap) {
    // Compute standings for this group
    const standings = computeGroupStandings(teams, matches, groupName);
    groups.push({ id: 0, name: groupName, teams: standings });
  }

  // Sort by group name
  groups.sort((a, b) => a.name.localeCompare(b.name));
  return groups;
}

function computeGroupStandings(teams: Team[], matches: any[], groupName: string): GroupStanding[] {
  const stats = new Map<number, {
    mp: number; w: number; d: number; l: number; gf: number; ga: number; pts: number;
  }>();

  for (const team of teams) {
    stats.set(team.id, { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
  }

  for (const match of matches) {
    if (match.group !== groupName) continue;
    if (!match.finished) continue;
    if (match.home_score === null || match.away_score === null) continue;

    const home = stats.get(match.home_team_id);
    const away = stats.get(match.away_team_id);
    if (!home || !away) continue;

    home.mp++;
    away.mp++;
    home.gf += match.home_score;
    home.ga += match.away_score;
    away.gf += match.away_score;
    away.ga += match.home_score;

    if (match.home_score > match.away_score) {
      home.w++;
      home.pts += 3;
      away.l++;
    } else if (match.home_score < match.away_score) {
      away.w++;
      away.pts += 3;
      home.l++;
    } else {
      home.d++;
      away.d++;
      home.pts++;
      away.pts++;
    }
  }

  const standings: GroupStanding[] = teams.map((team) => {
    const s = stats.get(team.id) ?? { mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 };
    return {
      id: team.id,
      name_en: team.name_en,
      flag: team.flag,
      fifa_code: team.fifa_code,
      mp: s.mp,
      w: s.w,
      d: s.d,
      l: s.l,
      pts: s.pts,
      gf: s.gf,
      ga: s.ga,
      gd: s.gf - s.ga,
      group: groupName,
    };
  });

  // Sort by points, then GD, then GF
  standings.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  return standings;
}
