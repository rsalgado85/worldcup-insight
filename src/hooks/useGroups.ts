// ─── useGroups Hook ─────────────────────────────────
import { useQuery } from '@tanstack/react-query';
import { fetchGroups } from '@/services/groupService';
import type { Group } from '@/types/worldcup';

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 30 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
}
