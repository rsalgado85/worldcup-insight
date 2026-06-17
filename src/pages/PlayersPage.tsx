import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, UserRound, Goal, Zap, Star, X } from 'lucide-react';
import { usePlayers } from '@/hooks/usePlayers';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
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

  // ─── Loading ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72" />
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 flex-1" />
              </div>
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
        <h3 className="text-lg font-bold text-text mb-2">{t('players.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.tryAgain', language)}</p>
      </div>
    );
  }

  const sortConfigs = [
    { key: 'goals' as const, icon: Goal, color: 'var(--color-live)' },
    { key: 'assists' as const, icon: Zap, color: 'var(--color-primary-light)' },
    { key: 'rating' as const, icon: Star, color: 'var(--color-warm)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('players.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('players.subtitleLine', language, players?.length ?? 0)}
        </p>
      </motion.div>

      {/* Search + Sort */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={t('players.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-1.5">
          {sortConfigs.map(({ key, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`filter-pill flex items-center gap-1.5 ${sortBy === key ? 'active' : ''}`}
              style={sortBy === key ? { background: color, borderColor: color } : undefined}
            >
              <Icon size={12} />
              {sortLabels[key]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Empty state */}
      {processed.length === 0 ? (
        <div className="card p-12 text-center">
          <UserRound size={40} className="mx-auto mb-4 text-text-muted" />
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
                className="card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{player.flag && <FlagImage flag={player.flag} size="md" />}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-text truncate">{player.name}</h3>
                    <p className="text-[10px] text-text-secondary">{player.team}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-divider">
                  <div className="text-center flex-1">
                    <span className="text-lg font-black text-live">{player.goals ?? 0}</span>
                    <p className="text-[9px] uppercase tracking-wider text-text-muted">{t('players.goals', language)}</p>
                  </div>
                  <div className="text-center flex-1">
                    <span className="text-lg font-black text-primary-light">{player.assists ?? 0}</span>
                    <p className="text-[9px] uppercase tracking-wider text-text-muted">{t('players.assists', language)}</p>
                  </div>
                  <div className="text-center flex-1">
                    <span className="text-lg font-black text-warm">
                      {player.rating ? player.rating.toFixed(1) : '—'}
                    </span>
                    <p className="text-[9px] uppercase tracking-wider text-text-muted">{t('players.rating', language)}</p>
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
