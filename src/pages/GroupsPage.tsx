import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { useAppStore } from '@/store/useAppStore';
import type { Group } from '@/types/worldcup';

function GroupCard({ group, language }: { group: Group; language: 'en' | 'es' }) {
  const teams = useMemo(() => [...(group.teams ?? [])].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf), [group.teams]);
  return (
    <div className="glass-card-hover p-0 overflow-hidden">
      <div className="wc-gradient p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><Trophy size={18} className="text-wc-gold" /><h3 className="text-lg font-black">{tf('groups.groupLabel', language, group.name)}</h3></div>
          <span className="text-xs font-semibold text-white/70">{tf('groups.teamsCount', language, teams.length)}</span>
        </div>
      </div>
      <div className="p-3">
        {teams.length === 0 ? <p className="text-sm text-text-secondary text-center py-4">{t('groups.noTeams', language)}</p> : (
          <div className="space-y-1">
            {teams.map((team, idx) => (
              <div key={team.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors hover:bg-wc-blue/[0.03] ${idx === 0 ? 'bg-wc-gold/5' : idx === 1 ? 'bg-wc-blue/[0.02]' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-wc-gold/15 text-wc-gold' : idx === 1 ? 'bg-wc-blue/10 text-wc-blue' : 'bg-border text-text-secondary'}`}>{idx + 1}</div>
                <div className="flex items-center gap-2 flex-1 min-w-0"><span className="text-xl">{<FlagImage flag={team.flag} size="md" />}</span><div className="min-w-0"><p className="text-sm font-semibold text-text truncate">{team.name_en}</p><p className="text-[10px] text-text-secondary">{team.fifa_code}</p></div></div>
                <div className="flex items-center gap-3 text-right flex-shrink-0">
                  <div><span className="text-sm font-black text-wc-blue">{team.pts}</span><span className="text-[9px] text-text-secondary ml-0.5">PTS</span></div>
                  <div className="hidden sm:block"><span className="text-xs text-text">{team.w}-{team.d}-{team.l}</span><span className="text-[9px] text-text-secondary ml-0.5">WDL</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="px-4 py-2.5 bg-bg/50 border-t border-border flex items-center justify-between text-[10px] text-text-secondary">
        <span>{t('groups.totalGoals', language)}: {teams.reduce((s, t) => s + t.gf, 0)}</span>
        <span>{t('groups.avgPts', language)}: {teams.length ? (teams.reduce((s, t) => s + t.pts, 0) / teams.length).toFixed(1) : '—'}</span>
      </div>
    </div>
  );
}

export function GroupsPage() {
  const { data: groups, isLoading, error } = useGroups();
  const { language } = useAppStore();

  if (isLoading) return (
    <div className="space-y-6"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="glass-card p-0 overflow-hidden"><Skeleton className="h-12 rounded-none" /><div className="p-3 space-y-2">{Array.from({ length: 4 }).map((_, j) => <Skeleton key={j} className="h-10" />)}</div></div>)}</div></div>
  );
  if (error) return <div className="glass-card p-12 text-center"><Users size={40} className="mx-auto mb-4 text-text-secondary/30" /><h3 className="text-lg font-bold text-text mb-2">{t('groups.failedLoad', language)}</h3><p className="text-text-secondary text-sm">{t('groups.errorDetail', language)}</p></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('groups.title', language)}</h1>
        <p className="text-sm text-text-secondary">{t('groups.allGroupsSubtitle', language)}</p>
      </motion.div>

      {!groups || groups.length === 0 ? (
        <div className="glass-card p-12 text-center"><Users size={40} className="mx-auto mb-4 text-text-secondary/30" /><p className="text-text-secondary font-medium">{t('groups.noDataAvailable', language)}</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {groups.map((group: Group) => <GroupCard key={group.name} group={group} language={language} />)}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="wc-gradient rounded-2xl p-6 text-white text-center">
        <Trophy size={32} className="mx-auto mb-3 text-wc-gold" />
        <h3 className="text-lg font-black mb-2">{t('groups.roadToFinal', language)}</h3>
        <p className="text-sm text-white/70 max-w-2xl mx-auto">{t('groups.roadToFinalDesc', language)}</p>
      </motion.div>
    </div>
  );
}
