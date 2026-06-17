// ─── Match Service ──────────────────────────────────
import { apiClient } from './apiClient';
import { normalizeMatch } from './normalize';
import type { Match, GamesResponse } from '@/types/worldcup';

export async function fetchMatches(): Promise<Match[]> {
  const { data } = await apiClient.get<GamesResponse>('/get/games');
  const rawGames = data.games ?? [];
  return rawGames.map(normalizeMatch);
}

export async function fetchMatchById(id: number): Promise<Match | null> {
  const matches = await fetchMatches();
  return matches.find((m) => m.id === id) ?? null;
}

export async function fetchLiveMatches(): Promise<Match[]> {
  const matches = await fetchMatches();
  return matches.filter((m) => !m.finished);
}

export async function fetchMatchesByGroup(group: string): Promise<Match[]> {
  const matches = await fetchMatches();
  return matches.filter((m) => m.group === group);
}

export async function fetchMatchesByTeam(teamId: number): Promise<Match[]> {
  const matches = await fetchMatches();
  return matches.filter((m) => m.home_team_id === teamId || m.away_team_id === teamId);
}

export async function fetchTodayMatches(): Promise<Match[]> {
  const matches = await fetchMatches();
  const today = new Date().toISOString().split('T')[0];
  return matches.filter((m) => m.local_date === today);
}

export async function fetchRecentMatches(limit: number = 10): Promise<Match[]> {
  const matches = await fetchMatches();
  return matches
    .filter((m) => m.finished)
    .sort((a, b) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime())
    .slice(0, limit);
}

export async function fetchUpcomingMatches(limit: number = 10): Promise<Match[]> {
  const matches = await fetchMatches();
  const today = new Date().toISOString().split('T')[0];
  return matches
    .filter((m) => !m.finished && m.local_date >= today)
    .sort((a, b) => new Date(a.local_date).getTime() - new Date(b.local_date).getTime())
    .slice(0, limit);
}
