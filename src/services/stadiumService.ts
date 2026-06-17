// ─── Stadium Service ────────────────────────────────
import { apiClient } from './apiClient';
import type { Stadium, ApiResponse } from '@/types/worldcup';

export async function fetchStadiums(): Promise<Stadium[]> {
  const { data } = await apiClient.get<ApiResponse<Stadium>>('/get/stadiums');
  return data.data ?? [];
}

export async function fetchStadiumById(id: number): Promise<Stadium | null> {
  const stadiums = await fetchStadiums();
  return stadiums.find((s) => s.id === id) ?? null;
}
