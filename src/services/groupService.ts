// ─── Group Service ───────────────────────────────────
import { apiClient } from './apiClient';
import type { Group, GroupStanding, ApiResponse } from '@/types/worldcup';

export async function fetchGroups(): Promise<Group[]> {
  const { data } = await apiClient.get<ApiResponse<Group>>('/get/groups');
  return data.data ?? [];
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
