import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, UserRound, Goal, Zap, Star, X } from 'lucide-react';
import { usePlayers } from '@/hooks/usePlayers';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Player } from '@/types/worldcup';

export function PlayersPage() {
  const { data: players, isLoading, error } = usePlayers();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'rating'>('goals');
  const { language } = useAppStore();

  const sortLabels: Record<string, string> = {
    goals: t('players.goals_short', language),
    assists: t('players.assists_short', language),
    rating: t('players.rating_short', language),
  };

  const processed = useMemo(() => {
    if (!players) return [];
    let result = [...players];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.team?.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
    return result;
  }, [players, search, sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass-card p-4">
              <Skeleton className="h-16" />
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
        <h3 className="text-lg font-bold text-text mb-2">{t('players.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.tryAgain', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('players.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('players.subtitleLine', language, players?.length ?? 0)}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={t('players.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-wc-blue focus:ring-2 focus:ring-wc-blue/10 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {(['goals', 'assists', 'rating'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all uppercase ${
                sortBy === s
                  ? 'bg-wc-blue text-white shadow-lg shadow-wc-blue/25'
                  : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'
              }`}
            >
              {s === 'goals' && <Goal size={12} className="inline mr-1" />}
              {s === 'assists' && <Zap size={12} className="inline mr-1" />}
              {s === 'rating' && <Star size={12} className="inline mr-1" />}
              {sortLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {processed.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <UserRound size={40} className="mx-auto mb-4 text-text-secondary/30" />
          {players && players.length === 0 ? (
            <p className="text-text-secondary font-medium">{t('players.noPlayersData', language)}</p>
          ) : (
            <p className="text-text-secondary font-medium">{t('players.noPlayersFound', language)}</p>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            {tf('players.showingOf', language, processed.length, players?.length ?? 0)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {processed.map((player, idx) => (
              <motion.div
                key={player.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{player.flag || '👤'}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-text truncate">{player.name}</h3>
                    <p className="text-[10px] text-text-secondary">{player.team}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="text-center flex-1">
                    <div className="text-lg font-black text-wc-red">{player.goals ?? 0}</div>
                    <div className="text-[9px] uppercase text-text-secondary">{t('players.goals', language)}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg font-black text-wc-blue">{player.assists ?? 0}</div>
                    <div className="text-[9px] uppercase text-text-secondary">{t('players.assists', language)}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg font-black text-wc-gold">
                      {player.rating ? player.rating.toFixed(1) : '—'}
                    </div>
                    <div className="text-[9px] uppercase text-text-secondary">{t('players.rating', language)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
