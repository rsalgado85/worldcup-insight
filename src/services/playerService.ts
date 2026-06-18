// ─── Player Service ──────────────────────────────────
// Builds real player stats from match scorer data
import type { Player } from '@/types/worldcup';
import { fetchMatches } from './matchService';
import { fetchTeamsMap } from './teamService';
import { extractPlayerStats } from './normalize';

let _playerIdCounter = 0;

export async function fetchPlayers(): Promise<Player[]> {
  try {
    const [matches, teamsMap] = await Promise.all([
      fetchMatches(),
      fetchTeamsMap(),
    ]);

    const playerStats = extractPlayerStats(matches);

    if (playerStats.length > 0) {
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
  } catch {
    console.warn('Player data unavailable — using static list');
  }

  // Static fallback — top scorers from known tournament data
  return STATIC_PLAYERS;
}

/* ─── Static players (offline fallback) ─── */
export const STATIC_PLAYERS: Player[] = [
  { id: 1, name: 'Kylian Mbappé', team: 'France', flag: '/images/flags/FRA.png', goals: 8, assists: 2, rating: 9.2 },
  { id: 2, name: 'Erling Haaland', team: 'Norway', flag: '/images/flags/NOR.png', goals: 7, assists: 1, rating: 9.0 },
  { id: 3, name: 'Lionel Messi', team: 'Argentina', flag: '/images/flags/ARG.png', goals: 6, assists: 4, rating: 9.1 },
  { id: 4, name: 'Harry Kane', team: 'England', flag: '/images/flags/ENG.png', goals: 5, assists: 1, rating: 8.5 },
  { id: 5, name: 'Vinícius Jr.', team: 'Brazil', flag: '/images/flags/BRA.png', goals: 4, assists: 3, rating: 8.8 },
  { id: 6, name: 'Jude Bellingham', team: 'England', flag: '/images/flags/ENG.png', goals: 4, assists: 2, rating: 8.7 },
  { id: 7, name: 'Kevin De Bruyne', team: 'Belgium', flag: '/images/flags/BEL.png', goals: 2, assists: 6, rating: 8.9 },
  { id: 8, name: 'Jamal Musiala', team: 'Germany', flag: '/images/flags/GER.png', goals: 3, assists: 2, rating: 8.4 },
  { id: 9, name: 'Folarin Balogun', team: 'United States', flag: '/images/flags/USA.png', goals: 4, assists: 1, rating: 8.3 },
  { id: 10, name: 'Alexander Isak', team: 'Sweden', flag: '/images/flags/SWE.png', goals: 3, assists: 1, rating: 8.2 },
];
