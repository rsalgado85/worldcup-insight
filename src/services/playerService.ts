import { apiClient } from './apiClient';
import type { Player, ApiResponse } from '@/types/worldcup';

export async function fetchPlayers(): Promise<Player[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<Player>>('/get/players');
    return data.data ?? [];
  } catch {
    return [];
  }
}
