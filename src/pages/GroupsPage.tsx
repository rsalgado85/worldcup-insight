import { motion } from 'framer-motion';
import { Trophy, Users, Target, Activity } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { FlagImage } from '@/components/common/FlagImage';
import { getLocalFlag } from '@/constants/crests';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import { GROUP_COLORS } from '@/constants';

export function GroupsPage() {
  const { data: groups, isLoading, error } = useGroups();
  const { language } = useAppStore();

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-48" />
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
    </div>
  );

  if (error) return (
    <div className="card p-12 text-center">
      <Trophy size={48} className="mx-auto mb-4 text-text-muted" />
      <h3 className="text-lg font-bold text-text mb-2">{t('groups.failedLoad', language)}</h3>
      <p className="text-text-secondary text-sm">{t('groups.failedDetail', language)}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('groups.title', language)}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('groups.subtitle', language)}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups?.map((group, gi) => {
          const color = GROUP_COLORS[group.name] || '#4583CA';
          const sorted = [...group.teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
          const totalGoals = sorted.reduce((s, t) => s + t.gf, 0);

          return (
            <motion.div key={group.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05 }}
              className="card overflow-hidden group hover:shadow-card-hover transition-all"
            >
              {/* Group header */}
              <div className="px-5 py-4 border-b border-divider flex items-center justify-between"
                style={{ background: `linear-gradient(135deg, ${color}10, ${color}05)` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ backgroundColor: `${color}18`, color }}>
                    {group.name}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-text">{tf('common.groupLabel', language, group.name)}</h2>
                    <p className="text-[10px] text-text-muted">{sorted.length} {t('groups.teams', language)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-text-muted">
                  <div className="flex items-center gap-1 text-[10px]">
                    <Target size={11} />
                    <span>{totalGoals} {t('groups.goals', language)}</span>
                  </div>
                </div>
              </div>

              {/* Teams list */}
              <div className="divide-y divide-divider">
                {sorted.map((team, idx) => (
                  <div key={team.id}
                    className={`flex items-center gap-3 px-5 py-3 transition-colors hover:bg-card-hover ${
                      idx < 2 ? 'bg-primary-subtle/30' : ''
                    }`}>
                    {/* Rank badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
                      idx === 0 ? 'bg-warm text-[#8B6914]' :
                      idx === 1 ? 'bg-border-strong text-text-secondary' :
                      'text-text-muted'
                    }`}>
                      {idx + 1}
                    </div>

                    {/* Crest/flag */}
                    {team.fifa_code ? (
                      <img src={getLocalFlag(team.fifa_code)} alt={team.name_en}
                        className="w-7 h-7 object-contain flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <FlagImage flag={team.flag} size="sm" />
                    )}

                    {/* Team name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text truncate">{team.name_en}</p>
                      <p className="text-[10px] text-text-muted">{team.fifa_code}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-black text-primary w-6 text-center">{team.pts}</span>
                      <span className="text-text-muted w-8 text-center">PJ{team.mp}</span>
                      <span className="text-success font-semibold w-4 text-center">{team.w}</span>
                      <span className="text-text-muted w-4 text-center">{team.d}</span>
                      <span className="text-live font-semibold w-4 text-center">{team.l}</span>
                      <span className={`font-bold w-8 text-center ${team.gd > 0 ? 'text-success' : team.gd < 0 ? 'text-live' : 'text-text-muted'}`}>
                        {team.gd > 0 ? '+' : ''}{team.gd}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
