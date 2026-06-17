// ─── Team Service ────────────────────────────────────
import { apiClient } from './apiClient';
import { normalizeTeam } from './normalize';
import type { Team, TeamsResponse } from '@/types/worldcup';

export async function fetchTeams(): Promise<Team[]> {
  const { data } = await apiClient.get<TeamsResponse>('/get/teams');
  const rawTeams = data.teams ?? [];
  return rawTeams.map(normalizeTeam);
}

export async function fetchTeamById(id: number): Promise<Team | null> {
  const teams = await fetchTeams();
  return teams.find((t) => t.id === id) ?? null;
}

export async function fetchTeamByCode(fifaCode: string): Promise<Team | null> {
  const teams = await fetchTeams();
  return teams.find((t) => t.fifa_code === fifaCode) ?? null;
}

export async function fetchTeamsByGroup(group: string): Promise<Team[]> {
  const teams = await fetchTeams();
  return teams.filter((t) => t.groups === group);
}

/** Build a lookup map from team ID to Team */
export async function fetchTeamsMap(): Promise<Map<number, Team>> {
  const teams = await fetchTeams();
  const map = new Map<number, Team>();
  for (const t of teams) {
    map.set(t.id, t);
  }
  return map;
}
