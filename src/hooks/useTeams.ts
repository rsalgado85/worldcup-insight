// ─── useTeams Hook ──────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { fetchTeams } from '@/services/teamService';
import type { Team } from '@/types/worldcup';

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
