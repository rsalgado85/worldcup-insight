// ─── useMatches Hook ────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { fetchMatches } from '@/services/matchService';
import type { Match } from '@/types/worldcup';

export function useMatches() {
  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
