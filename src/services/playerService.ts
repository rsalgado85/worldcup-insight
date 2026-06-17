// ─── Player Service ──────────────────────────────────
// Builds real player stats from match scorer data
import type { Player } from '@/types/worldcup';
import { fetchMatches } from './matchService';
import { fetchTeamsMap } from './teamService';
import { extractPlayerStats } from './normalize';

let _playerIdCounter = 0;

export async function fetchPlayers(): Promise<Player[]> {
  const [matches, teamsMap] = await Promise.all([
    fetchMatches(),
    fetchTeamsMap(),
  ]);

  const playerStats = extractPlayerStats(matches);

  return playerStats.map((ps) => {
    const team = teamsMap.get(ps.teamId);
    return {
      id: ++_playerIdCounter,
      name: ps.name,
      team: team?.name_en ?? `Team ${ps.teamId}`,
      flag: team?.flag ?? '',
      goals: ps.goals,
      assists: 0,
      rating: 0,
    };
  });
}
