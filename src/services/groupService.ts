// ─── Group Service ───────────────────────────────────
import { apiClient } from './apiClient';
import { normalizeGroup } from './normalize';
import { fetchTeamsMap } from './teamService';
import type { Group, GroupStanding, GroupsResponse } from '@/types/worldcup';

export async function fetchGroups(): Promise<Group[]> {
  const [{ data }, teamsMap] = await Promise.all([
    apiClient.get<GroupsResponse>('/get/groups'),
    fetchTeamsMap(),
  ]);
  const rawGroups = data.groups ?? [];
  return rawGroups.map((g) => normalizeGroup(g, teamsMap));
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
