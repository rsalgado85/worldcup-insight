import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Medal, Goal, Zap, Star, Swords, X,
} from 'lucide-react';
import { usePlayers } from '@/hooks/usePlayers';
import { Skeleton } from '@/components/common/Skeleton';
import { FEATURED_PLAYERS, TOP_SCORERS, TOP_ASSISTS, TOP_RATINGS, TOP_CLEAN_SHEETS } from '@/constants';
import { t } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { useAppStore } from '@/store/useAppStore';
import { usePlayerModalStore } from '@/store/playerModalStore';
import { getPlayerAvatar } from '@/constants';
import type { Player } from '@/types/worldcup';

function ScorerRow({ player, rank, highlight, language }: { player: Player & { cleanSheets?: number }; rank: number; highlight?: 'goals' | 'assists' | 'rating' | 'cleanSheets'; language: 'en' | 'es' }) {
  const medalColors = ['#F2A900', '#94A3B8', '#CD7F32'];
  const value = highlight === 'assists' ? player.assists
    : highlight === 'rating' ? player.rating
    : highlight === 'cleanSheets' ? player.cleanSheets
    : player.goals;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
      rank <= 3 ? 'bg-primary-subtle' : 'hover:bg-card-hover'
    }`}>
      <div className="w-8 text-center">
        {rank <= 3 ? (
          <Medal size={18} style={{ color: medalColors[rank - 1] }} />
        ) : (
          <span className="text-sm font-black text-text-muted">{rank}</span>
        )}
      </div>
      <span className="text-xl"><FlagImage flag={player.avatar || player.flag} size="md" /></span>
      <div className="flex-1 min-w-0">
        <button
          onClick={() => usePlayerModalStore.getState().open({
            name: player.name,
            team: player.team,
            flag: player.flag,
            avatar: getPlayerAvatar(player.team),
            goals: player.goals,
            assists: player.assists,
            rating: player.rating,
            cleanSheets: (player as any).cleanSheets,
          })}
          className="text-sm font-bold text-text truncate text-left hover:text-primary-light transition-colors cursor-pointer"
        >
          {player.name}
        </button>
        <p className="text-[10px] text-text-secondary">{player.team}</p>
      </div>
      <div className="flex items-center gap-4 text-right flex-shrink-0">
        {highlight !== 'cleanSheets' && (
          <>
            <div>
              <span className="text-sm font-black text-live">{player.goals}</span>
              <span className="text-[9px] text-text-muted ml-0.5">G</span>
            </div>
            <div>
              <span className="text-sm font-black text-primary-light">{player.assists}</span>
              <span className="text-[9px] text-text-muted ml-0.5">A</span>
            </div>
          </>
        )}
        <div>
          <span className="text-sm font-black text-warm">
            {highlight === 'cleanSheets' ? player.cleanSheets : (player.rating?.toFixed(1) ?? '-')}
          </span>
          <span className="text-[9px] text-text-muted ml-0.5">
            {highlight === 'cleanSheets' ? 'CS' : 'R'}
          </span>
        </div>
      </div>
    </div>
  );
}

export function TopScorersPage() {
  const { data: players, isLoading, error } = usePlayers();
  const { language } = useAppStore();

  const sortedPlayers = useMemo(() => {
    if (!players || players.length === 0) return null;
    const byGoals = [...players].sort((a, b) => (b.goals || 0) - (a.goals || 0) || (b.assists || 0) - (a.assists || 0));
    const byAssists = [...players].sort((a, b) => (b.assists || 0) - (a.assists || 0) || (b.goals || 0) - (a.goals || 0));
    const byRating = [...players].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return { byGoals, byAssists, byRating };
  }, [players]);

  const dataSource = sortedPlayers ?? {
    byGoals: TOP_SCORERS,
    byAssists: TOP_ASSISTS,
    byRating: TOP_RATINGS,
  };

  // ─── Loading ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
        {/* Podium skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3 text-center">
              <Skeleton className="h-12 w-12 rounded-full mx-auto" />
              <Skeleton className="h-5 w-32 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
              <div className="flex justify-center gap-5">
                <Skeleton className="h-10 w-14" />
                <Skeleton className="h-10 w-14" />
                <Skeleton className="h-10 w-14" />
              </div>
            </div>
          ))}
        </div>
        {/* Leaderboard skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-2">
              <Skeleton className="h-4 w-36" />
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-12" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────
  if (error) {
    return (
      <div className="card p-12 text-center">
        <X size={48} className="mx-auto mb-4 text-live" />
        <h3 className="text-lg font-bold text-text mb-2">{t('topScorers.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('topScorers.fallbackNote', language)}</p>
      </div>
    );
  }

  const podium = dataSource.byGoals.slice(0, 3);
  const podiumStyles = [
    {
      medal: Trophy,
      medalColor: '#F2A900',
      borderColor: 'rgba(242,169,0,0.3)',
      bgGlow: 'rgba(242,169,0,0.08)',
      ring: 'ring-warm/30',
    },
    {
      medal: Medal,
      medalColor: '#94A3B8',
      borderColor: 'rgba(148,163,184,0.2)',
      bgGlow: 'rgba(148,163,184,0.04)',
      ring: 'ring-border-strong/30',
    },
    {
      medal: Medal,
      medalColor: '#CD7F32',
      borderColor: 'rgba(205,127,50,0.2)',
      bgGlow: 'rgba(205,127,50,0.04)',
      ring: 'ring-border/30',
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('topScorers.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {t('topScorers.subtitleLine', language)}
        </p>
      </motion.div>

      {/* Podium — Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {podium.map((p, idx) => {
          const style = podiumStyles[idx];
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card p-5 text-center relative overflow-hidden"
              style={{
                borderColor: idx === 0 ? style.borderColor : undefined,
                backgroundColor: idx === 0 ? style.bgGlow : undefined,
              }}
            >
              {idx === 0 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Trophy size={28} className="text-warm drop-shadow-lg" />
                </div>
              )}
              <div className="w-16 h-16 mx-auto mt-2 rounded-2xl bg-primary-subtle flex items-center justify-center">
                <span className="text-3xl"><FlagImage flag={p.avatar || p.flag} size="xl" /></span>
              </div>
              <button
                onClick={() => usePlayerModalStore.getState().open({
                  name: p.name,
                  team: p.team,
                  flag: p.flag,
                  avatar: getPlayerAvatar(p.team),
                  goals: p.goals,
                  assists: p.assists,
                  rating: p.rating,
                })}
                className="text-lg font-black text-text mt-3 text-left hover:text-primary-light transition-colors cursor-pointer"
              >
                {p.name}
              </button>
              <p className="text-xs text-text-secondary mb-3">{p.team}</p>
              <div className="flex items-center justify-center gap-5">
                <div className="text-center">
                  <span className="text-2xl font-black text-live">{p.goals}</span>
                  <p className="text-[9px] uppercase tracking-wider text-text-muted">{t('topScorers.goals', language)}</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-primary-light">{p.assists}</span>
                  <p className="text-[9px] uppercase tracking-wider text-text-muted">{t('topScorers.assists', language)}</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-warm">{p.rating}</span>
                  <p className="text-[9px] uppercase tracking-wider text-text-muted">{t('topScorers.rating', language)}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <h3 className="text-xs font-black uppercase tracking-wider text-live mb-4 flex items-center gap-1.5">
            <Goal size={14} /> {t('topScorers.goldenBootGoals', language)}
          </h3>
          <div className="space-y-1">
            {dataSource.byGoals.slice(0, 10).map((p, i) => (
              <ScorerRow key={p.id} player={p} rank={i + 1} highlight="goals" language={language} />
            ))}
          </div>
        </motion.div>

        {/* Assists */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-4"
        >
          <h3 className="text-xs font-black uppercase tracking-wider text-primary-light mb-4 flex items-center gap-1.5">
            <Zap size={14} /> {t('topScorers.playmakers', language)}
          </h3>
          <div className="space-y-1">
            {dataSource.byAssists.slice(0, 10).map((p, i) => (
              <ScorerRow key={p.id} player={p} rank={i + 1} highlight="assists" language={language} />
            ))}
          </div>
        </motion.div>

        {/* Ratings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-4"
        >
          <h3 className="text-xs font-black uppercase tracking-wider text-warm mb-4 flex items-center gap-1.5">
            <Star size={14} /> {t('topScorers.playerRatings', language)}
          </h3>
          <div className="space-y-1">
            {dataSource.byRating.slice(0, 10).map((p, i) => (
              <ScorerRow key={p.id} player={p} rank={i + 1} highlight="rating" language={language} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Clean Sheets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="card p-4"
      >
        <h3 className="text-xs font-black uppercase tracking-wider text-success mb-4 flex items-center gap-1.5">
          <Swords size={14} /> {t('topScorers.goldenGlove', language)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TOP_CLEAN_SHEETS.slice(0, 5).map((p, i) => (
            <ScorerRow key={p.id} player={p as Player & { cleanSheets?: number }} rank={i + 1} highlight="cleanSheets" language={language} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
