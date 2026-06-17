import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, MapPin, Globe, X } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="glass-card p-4">
              <Skeleton className="h-20" />
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
        <h3 className="text-lg font-bold text-text mb-2">{t('teams.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('teams.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('teams.subtitleLine', language, teams?.length ?? 0, confederations)}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={t('teams.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-wc-blue focus:ring-2 focus:ring-wc-blue/10 transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users size={40} className="mx-auto mb-4 text-text-secondary/30" />
          <p className="text-text-secondary font-medium">{t('teams.noTeamsFound', language)}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-text-secondary">
            {tf('teams.showingOf', language, filtered.length, teams?.length ?? 0)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((team, idx) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="glass-card-hover p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{team.flag || '🏳'}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-text truncate">{team.name_en}</h3>
                    <p className="text-[10px] font-semibold text-wc-blue uppercase">{team.fifa_code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-text-secondary pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {tf('common.groupLabel', language, getGroupForTeam(team))}
                  </span>
                  {team.iso2 && (
                    <span className="flex items-center gap-1">
                      <Globe size={12} />
                      {team.iso2.toUpperCase()}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
