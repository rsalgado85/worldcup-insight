// ─── Team Service ────────────────────────────────────
import { apiClient } from './apiClient';
import type { Team, ApiResponse } from '@/types/worldcup';

export async function fetchTeams(): Promise<Team[]> {
  const { data } = await apiClient.get<ApiResponse<Team>>('/get/teams');
  return data.data ?? [];
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
