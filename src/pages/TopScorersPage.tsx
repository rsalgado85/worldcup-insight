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
import type { Player } from '@/types/worldcup';

function ScorerRow({ player, rank, highlight, language }: { player: Player & { cleanSheets?: number }; rank: number; highlight?: 'goals' | 'assists' | 'rating' | 'cleanSheets'; language: 'en' | 'es' }) {
  const medalColors = ['#F2A900', '#94A3B8', '#CD7F32'];
  const value = highlight === 'assists' ? player.assists
    : highlight === 'rating' ? player.rating
    : highlight === 'cleanSheets' ? player.cleanSheets
    : player.goals;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-wc-blue/[0.03] ${rank <= 3 ? 'bg-wc-blue/[0.02]' : ''}`}>
      <div className="w-8 text-center">
        {rank <= 3 ? (
          <Medal size={18} style={{ color: medalColors[rank - 1] }} />
        ) : (
          <span className="text-sm font-bold text-text-secondary">{rank}</span>
        )}
      </div>
      <span className="text-xl">{<FlagImage flag={player.flag} size="md" />}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-text truncate">{player.name}</p>
        <p className="text-[10px] text-text-secondary">{player.team}</p>
      </div>
      <div className="flex items-center gap-4 text-right flex-shrink-0">
        {highlight !== 'cleanSheets' && (
          <>
            <div>
              <span className="text-sm font-black text-wc-red">{player.goals}</span>
              <span className="text-[9px] text-text-secondary ml-0.5">G</span>
            </div>
            <div>
              <span className="text-sm font-black text-wc-blue">{player.assists}</span>
              <span className="text-[9px] text-text-secondary ml-0.5">A</span>
            </div>
          </>
        )}
        <div>
          <span className="text-sm font-black text-wc-gold">
            {highlight === 'cleanSheets' ? player.cleanSheets : (player.rating?.toFixed(1) ?? '-')}
          </span>
          <span className="text-[9px] text-text-secondary ml-0.5">
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-12" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center">
        <X size={40} className="mx-auto mb-4 text-wc-red/50" />
        <h3 className="text-lg font-bold text-text mb-2">{t('topScorers.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('topScorers.fallbackNote', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('topScorers.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {t('topScorers.subtitleLine', language)}
        </p>
      </motion.div>

      {/* Golden Boot Leader (Top 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dataSource.byGoals.slice(0, 3).map((p, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-5 text-center relative overflow-hidden ${
              idx === 0 ? 'border-wc-gold/30 shadow-lg shadow-wc-gold/10' : ''
            }`}
          >
            {idx === 0 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Trophy size={28} className="text-wc-gold" />
              </div>
            )}
            <span className="text-4xl mt-2 block">{<FlagImage flag={p.flag} size="md" />}</span>
            <h3 className="text-lg font-black text-text mt-2">{p.name}</h3>
            <p className="text-xs text-text-secondary mb-3">{p.team}</p>
            <div className="flex items-center justify-center gap-5">
              <div className="text-center">
                <span className="text-2xl font-black text-wc-red">{p.goals}</span>
                <p className="text-[9px] uppercase text-text-secondary">{t('topScorers.goals', language)}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-black text-wc-blue">{p.assists}</span>
                <p className="text-[9px] uppercase text-text-secondary">{t('topScorers.assists', language)}</p>
              </div>
              <div className="text-center">
                <span className="text-2xl font-black text-wc-gold">{p.rating}</span>
                <p className="text-[9px] uppercase text-text-secondary">{t('topScorers.rating', language)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-wc-red mb-4 flex items-center gap-1.5">
            <Goal size={14} /> {t('topScorers.goldenBootGoals', language)}
          </h3>
          <div className="space-y-1">
            {dataSource.byGoals.slice(0, 10).map((p, i) => (
              <ScorerRow key={p.id} player={p} rank={i + 1} highlight="goals" language={language} />
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-wc-blue mb-4 flex items-center gap-1.5">
            <Zap size={14} /> {t('topScorers.playmakers', language)}
          </h3>
          <div className="space-y-1">
            {dataSource.byAssists.slice(0, 10).map((p, i) => (
              <ScorerRow key={p.id} player={p} rank={i + 1} highlight="assists" language={language} />
            ))}
          </div>
        </div>
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-wc-gold mb-4 flex items-center gap-1.5">
            <Star size={14} /> {t('topScorers.playerRatings', language)}
          </h3>
          <div className="space-y-1">
            {dataSource.byRating.slice(0, 10).map((p, i) => (
              <ScorerRow key={p.id} player={p} rank={i + 1} highlight="rating" language={language} />
            ))}
          </div>
        </div>
      </div>

      {/* Clean Sheets */}
      <div className="glass-card p-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-wc-green mb-4 flex items-center gap-1.5">
          <Swords size={14} /> {t('topScorers.goldenGlove', language)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TOP_CLEAN_SHEETS.slice(0, 5).map((p, i) => (
            <ScorerRow key={p.id} player={p as Player & { cleanSheets?: number }} rank={i + 1} highlight="cleanSheets" language={language} />
          ))}
        </div>
      </div>
    </div>
  );
}
