import { useQuery } from '@tanstack/react-query';
import {
  fetchTeams,
  fetchMatches,
  fetchGroups,
  fetchStadiums,
  type Team,
  type Match,
  type Group,
  type Stadium,
} from '@/services/worldcupApi';

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 30 * 60 * 1000,
  });
}

export function useMatches() {
  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    staleTime: 10 * 60 * 1000,
  });
}

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ['groups'],
    queryFn: fetchGroups,
    staleTime: 30 * 60 * 1000,
  });
}

export function useStadiums() {
  return useQuery<Stadium[]>({
    queryKey: ['stadiums'],
    queryFn: fetchStadiums,
    staleTime: 60 * 60 * 1000,
  });
}
