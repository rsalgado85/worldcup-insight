import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, MapPin, Globe, X, Shield } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { getLocalFlag, getCrestPath, getCrestFallback } from '@/constants/crests';
import { useAppStore } from '@/store/useAppStore';
import { GROUP_COLORS } from '@/constants';
import type { Team } from '@/types/worldcup';

function getGroupForTeam(team: Team): string {
  return team.groups || team.group || '—';
}

export function TeamsPage() {
  const { data: teams, isLoading, error } = useTeams();
  const { data: groups } = useGroups();
  const [search, setSearch] = useState('');
  const { language } = useAppStore();

  const teamsWithGroup = useMemo(() => {
    if (!teams) return [];
    if (!groups) return teams;
    return teams.map((team) => {
      let groupName = team.groups || team.group;
      if (!groupName) {
        for (const g of groups) {
          if (g.teams?.some((t) => t.id === team.id || t.name_en === team.name_en)) {
            groupName = g.name;
            break;
          }
        }
      }
      return { ...team, group: groupName || '—' };
    });
  }, [teams, groups]);

  const filtered = useMemo(() => {
    if (!search) return teamsWithGroup;
    const q = search.toLowerCase();
    return teamsWithGroup.filter(
      (t) =>
        t.name_en?.toLowerCase().includes(q) ||
        t.fifa_code?.toLowerCase().includes(q) ||
        t.group?.toLowerCase().includes(q)
    );
  }, [teamsWithGroup, search]);

  const confederations = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach((t) => {
      if (t.iso2) set.add(t.iso2);
    });
    return set.size;
  }, [filtered]);

  // ─── Loading ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
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
        <h3 className="text-lg font-bold text-text mb-2">{t('teams.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('teams.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('teams.subtitleLine', language, teams?.length ?? 0, confederations)}
        </p>
      </motion.div>

      {/* Search */}
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
            placeholder={t('teams.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users size={40} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary font-medium">{t('teams.noTeamsFound', language)}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            {tf('teams.showingOf', language, filtered.length, teams?.length ?? 0)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((team, idx) => {
              const group = getGroupForTeam(team);
              const groupColor = GROUP_COLORS[group] || 'var(--color-primary)';
              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* Crest with fallback */}
                    {team.fifa_code ? (
                      <img
                        src={getCrestPath(team.fifa_code)}
                        alt={team.name_en}
                        className="w-12 h-12 object-contain rounded-xl bg-primary-subtle p-1"
                        onError={(e) => {
                          const fallback = getCrestFallback(team.fifa_code!);
                          const img = e.target as HTMLImageElement;
                          if (img.src !== fallback) {
                            img.src = fallback;
                          } else {
                            img.style.display = 'none';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-primary-subtle flex items-center justify-center">
                        <FlagImage flag={team.flag} size="lg" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-text truncate">{team.name_en}</h3>
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{team.fifa_code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-text-secondary pt-3 border-t border-divider">
                    <span
                      className="badge flex items-center gap-1"
                      style={{ backgroundColor: `${groupColor}15`, color: groupColor }}
                    >
                      <MapPin size={10} />
                      {tf('common.groupLabel', language, group)}
                    </span>
                    {team.iso2 && (
                      <span className="flex items-center gap-1 text-text-muted">
                        <Globe size={10} />
                        {team.iso2.toUpperCase()}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
