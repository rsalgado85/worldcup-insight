// ─── Stadium Service ────────────────────────────────
import { apiClient } from './apiClient';
import { normalizeStadium } from './normalize';
import { STATIC_STADIUMS } from '@/constants';
import type { Stadium, StadiumsResponse } from '@/types/worldcup';

export async function fetchStadiums(): Promise<Stadium[]> {
  try {
    const { data } = await apiClient.get<StadiumsResponse>('/get/stadiums');
    const rawStadiums = data.stadiums ?? [];
    if (rawStadiums.length > 0) {
      return rawStadiums.map(normalizeStadium);
    }
  } catch {
    console.warn('/get/stadiums failed — using static stadium data');
  }
  // Fallback: static data
  return STATIC_STADIUMS as Stadium[];
}

export async function fetchStadiumById(id: number): Promise<Stadium | null> {
  const stadiums = await fetchStadiums();
  return stadiums.find((s) => s.id === id) ?? null;
}
