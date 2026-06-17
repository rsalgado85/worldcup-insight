import { useQuery } from '@tanstack/react-query';
import { fetchPlayers } from '@/services/playerService';
import type { Player } from '@/types/worldcup';

export function usePlayers() {
  return useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: fetchPlayers,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
