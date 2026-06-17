// ─── Stadium Service ────────────────────────────────
import { apiClient } from './apiClient';
import { normalizeStadium } from './normalize';
import type { Stadium, StadiumsResponse } from '@/types/worldcup';

export async function fetchStadiums(): Promise<Stadium[]> {
  const { data } = await apiClient.get<StadiumsResponse>('/get/stadiums');
  const rawStadiums = data.stadiums ?? [];
  return rawStadiums.map(normalizeStadium);
}

export async function fetchStadiumById(id: number): Promise<Stadium | null> {
  const stadiums = await fetchStadiums();
  return stadiums.find((s) => s.id === id) ?? null;
}
