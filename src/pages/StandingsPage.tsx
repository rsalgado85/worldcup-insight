import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Swords, ChevronDown } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { FlagImage } from '@/components/common/FlagImage';
import { getCrestPath, getCrestFallback, getFlagUrl } from '@/constants/crests';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import { GROUPS } from '@/constants';

/* ─── Helpers ─────────────────────────────────────── */
function formBlock(w: number, d: number, l: number, i: number) {
  const total = w + d + l;
  if (i >= total) return 'bg-border';
  if (i < w) return 'bg-success';
  if (i < w + d) return 'bg-warm';
  return 'bg-live';
}

export function StandingsPage() {
  const { data: groups, isLoading, error } = useGroups();
  const { language } = useAppStore();
  const [activeGroup, setActiveGroup] = useState('A');
  const [showMobilePicker, setShowMobilePicker] = useState(false);

  const standings = (groups?.find(g => g.name === activeGroup)?.teams ?? [])
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  // ─── Loading ───────────────────────────────────
  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-5 w-80" />
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
    </div>
  );

  if (error) return (
    <div className="card p-12 text-center">
      <Trophy size={48} className="mx-auto mb-4 text-text-muted" />
      <h3 className="text-lg font-bold text-text mb-2">{t('standings.failedLoad', language)}</h3>
      <p className="text-text-secondary text-sm">{t('standings.failedDetail', language)}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('standings.title', language)}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('standings.subtitle', language)}</p>
      </motion.div>

      {/* Group Tab Bar */}
      <div className="card p-3">
        {/* Desktop tabs */}
        <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
          {GROUPS.map(g => (
            <button key={g} onClick={() => setActiveGroup(g)}
              className={`group-tab ${activeGroup === g ? 'active' : ''}`}>
              {g}
            </button>
          ))}
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden relative">
          <button onClick={() => setShowMobilePicker(!showMobilePicker)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-bg border border-border text-sm font-bold text-text">
            <span>{tf('common.groupLabel', language, activeGroup)}</span>
            <ChevronDown size={16} className={`text-text-muted transition-transform ${showMobilePicker ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showMobilePicker && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute top-full mt-1 left-0 right-0 z-50 card p-2 grid grid-cols-6 gap-1 shadow-elevated">
                {GROUPS.map(g => (
                  <button key={g} onClick={() => { setActiveGroup(g); setShowMobilePicker(false); }}
                    className={`py-2 rounded-lg text-sm font-bold transition-colors ${activeGroup === g ? 'bg-primary text-text-on-primary' : 'text-text-secondary hover:bg-primary-subtle'}`}>
                    {g}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Standings Table */}
      {standings.length === 0 ? (
        <div className="card p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary font-medium">{tf('standings.noDataFor', language, activeGroup)}</p>
        </div>
      ) : (
        <motion.div key={activeGroup} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider bg-primary-subtle">
                  <th className="text-left pl-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted w-10">#</th>
                  <th className="text-left py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">{t('standings.team', language)}</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">PTS</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">PJ</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">G</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">E</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">P</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">GF</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">GC</th>
                  <th className="text-center py-3 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">DG</th>
                  <th className="text-center pr-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">{t('standings.form', language)}</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, idx) => (
                  <tr key={team.id}
                    className={`border-b border-divider transition-colors hover:bg-card-hover ${
                      idx === 0 ? 'bg-success-subtle/30' : idx === 1 ? 'bg-primary-subtle/50' : ''
                    }`}>
                    {/* Rank */}
                    <td className="pl-4 py-3.5">
                      {idx === 0 ? (
                        <div className="w-6 h-6 rounded-full bg-warm flex items-center justify-center">
                          <Trophy size={12} className="text-[#8B6914]" />
                        </div>
                      ) : idx === 1 ? (
                        <div className="w-6 h-6 rounded-full bg-border-strong flex items-center justify-center">
                          <Medal size={12} className="text-text-secondary" />
                        </div>
                      ) : (
                        <span className="text-text-muted font-medium text-xs pl-1">{idx + 1}</span>
                      )}
                    </td>

                    {/* Team */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        {team.fifa_code ? (
                          <img src={getCrestPath(team.fifa_code)} alt={team.name_en}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              const i = e.target as HTMLImageElement;
                              i.src = i.src.endsWith('.png') ? getFlagUrl('') : getCrestFallback(team.fifa_code);
                            }} />
                        ) : (
                          <FlagImage flag={team.flag} size="sm" />
                        )}
                        <div>
                          <p className="text-sm font-bold text-text leading-tight">{team.name_en}</p>
                          <p className="text-[10px] text-text-muted">{team.fifa_code}</p>
                        </div>
                      </div>
                    </td>

                    {/* PTS */}
                    <td className="text-center py-3.5 px-2">
                      <span className="text-lg font-black text-primary">{team.pts}</span>
                    </td>

                    {/* PJ / G / E / P */}
                    <td className="text-center py-3.5 px-2 text-sm text-text-secondary">{team.mp}</td>
                    <td className="text-center py-3.5 px-2 text-sm font-semibold text-success">{team.w}</td>
                    <td className="text-center py-3.5 px-2 text-sm text-text-secondary">{team.d}</td>
                    <td className="text-center py-3.5 px-2 text-sm font-semibold text-live">{team.l}</td>
                    <td className="text-center py-3.5 px-2 text-sm text-text-secondary">{team.gf}</td>
                    <td className="text-center py-3.5 px-2 text-sm text-text-secondary">{team.ga}</td>

                    {/* GD */}
                    <td className="text-center py-3.5 px-2">
                      <span className={`text-sm font-bold ${team.gd > 0 ? 'text-success' : team.gd < 0 ? 'text-live' : 'text-text-secondary'}`}>
                        {team.gd > 0 ? '+' : ''}{team.gd}
                      </span>
                    </td>

                    {/* Form */}
                    <td className="text-center pr-4 py-3.5">
                      <div className="flex items-center justify-center gap-0.5">
                        {Array.from({ length: Math.min(team.mp, 5) }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-sm ${formBlock(team.w, team.d, team.l, i)}`} />
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 px-4 py-3 border-t border-divider text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-warm/30 border border-warm/40" />
              <span>{t('standings.groupWinner', language)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-primary-subtle border border-primary/20" />
              <span>{t('standings.runnerUp', language)}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
