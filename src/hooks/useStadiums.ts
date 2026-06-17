// ─── useStadiums Hook ───────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { fetchStadiums } from '@/services/stadiumService';
import type { Stadium } from '@/types/worldcup';

export function useStadiums() {
  return useQuery<Stadium[]>({
    queryKey: ['stadiums'],
    queryFn: fetchStadiums,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
