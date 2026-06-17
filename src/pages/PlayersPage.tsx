import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserRound, Goal, Zap, Star, X, Calendar, Activity, Target } from 'lucide-react';
import { usePlayers } from '@/hooks/usePlayers';
import { useMatches } from '@/hooks/useMatches';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { useAppStore } from '@/store/useAppStore';
import { fmtDateCompact } from '@/utils/dates';
import type { Player, Match } from '@/types/worldcup';

/* ─── Player Match Stats ────────────────────────── */
interface PlayerMatchInfo { match: Match; goals: number; assists: number; opponent: string; date: string }

function getPlayerMatches(playerId: number, playerName: string, matches: Match[]): PlayerMatchInfo[] {
  return matches
    .filter(m => {
      const hs = (m.home_scorers || '').toLowerCase();
      const as = (m.away_scorers || '').toLowerCase();
      const nm = playerName.toLowerCase();
      return hs.includes(nm) || as.includes(nm);
    })
    .map(m => {
      const hs = (m.home_scorers || '').toLowerCase();
      const as = (m.away_scorers || '').toLowerCase();
      const nm = playerName.toLowerCase();
      const goals = [...hs.matchAll(new RegExp(`\\(?${nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'))].length +
                    [...as.matchAll(new RegExp(`\\(?${nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi'))].length;
      const opponent = m.home_team_name_en?.toLowerCase().includes(nm) ? m.away_team_name_en || '' : m.home_team_name_en || '';
      return { match: m, goals, assists: 0, opponent, date: m.local_date };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);
}

/* ═══════════════════════════════════════════════════ */
export function PlayersPage() {
  const { data: players, isLoading, error } = usePlayers();
  const { data: matches } = useMatches();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'rating'>('goals');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
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
      result = result.filter(p => p.name?.toLowerCase().includes(q) || p.team?.toLowerCase().includes(q));
    }
    result.sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
    return result;
  }, [players, search, sortBy]);

  const playerMatches = useMemo(() => {
    if (!selectedPlayer || !matches) return [];
    return getPlayerMatches(selectedPlayer.id, selectedPlayer.name, matches);
  }, [selectedPlayer, matches]);

  // Loading
  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-48" /><Skeleton className="h-5 w-72" />
      <div className="flex gap-3"><Skeleton className="h-10 flex-1 rounded-xl" /><Skeleton className="h-10 w-24 rounded-xl" /><Skeleton className="h-10 w-24 rounded-xl" /><Skeleton className="h-10 w-24 rounded-xl" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({length:9}).map((_,i)=><div key={i} className="card p-4"><Skeleton className="h-10 w-10 rounded-lg" /><Skeleton className="h-4 w-28 mt-2" /></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="card p-12 text-center">
      <X size={48} className="mx-auto mb-4 text-live" />
      <h3 className="text-lg font-bold text-text mb-2">{t('players.failedLoad', language)}</h3>
    </div>
  );

  const sortConfigs = [
    { key: 'goals' as const, icon: Goal, color: 'var(--color-live)' },
    { key: 'assists' as const, icon: Zap, color: 'var(--color-primary-light)' },
    { key: 'rating' as const, icon: Star, color: 'var(--color-warm)' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('players.title', language)}</h1>
        <p className="text-sm text-text-secondary">{tf('players.subtitleLine', language, players?.length ?? 0)}</p>
      </motion.div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input type="text" placeholder={t('players.searchPlaceholder', language)} value={search} onChange={e=>setSearch(e.target.value)} className="input-field pl-10" />
        </div>
        <div className="flex gap-1.5">
          {sortConfigs.map(({key, icon: Icon, color}) => (
            <button key={key} onClick={()=>setSortBy(key)} className={`filter-pill flex items-center gap-1.5 ${sortBy===key?'active':''}`} style={sortBy===key?{background:color,borderColor:color}:undefined}>
              <Icon size={12} />{sortLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {processed.length===0 ? (
        <div className="card p-12 text-center"><UserRound size={40} className="mx-auto mb-4 text-text-muted"/><p className="text-text-secondary font-medium">{players&&players.length===0?t('players.noPlayersData',language):t('players.noPlayersFound',language)}</p></div>
      ) : (
        <>
          <p className="text-sm text-text-secondary">{tf('players.showingOf',language,processed.length,players?.length??0)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {processed.map((player,idx) => (
              <motion.button key={player.id||idx} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:idx*.02}}
                onClick={() => setSelectedPlayer(player)}
                className="card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-left cursor-pointer w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center flex-shrink-0">
                    <FlagImage flag={player.flag} size="md" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-text truncate">{player.name}</h3>
                    <p className="text-[10px] text-text-secondary">{player.team}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-divider">
                  {[{v:player.goals??0,l:t('players.goals',language),c:'text-live'},{v:player.assists??0,l:t('players.assists',language),c:'text-primary-light'},{v:player.rating?player.rating.toFixed(1):'—',l:t('players.rating',language),c:'text-warm'}].map(s=>(
                    <div key={s.l} className="text-center flex-1">
                      <span className={`text-lg font-black ${s.c}`}>{s.v}</span>
                      <p className="text-[9px] uppercase tracking-wider text-text-muted">{s.l}</p>
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}

      {/* ═══ Player Detail Modal ═══ */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPlayer(null)}>
            <motion.div initial={{opacity:0,scale:.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95,y:20}}
              className="card w-full max-w-md max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="sticky top-0 z-10 card border-b border-divider rounded-b-none px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-subtle flex items-center justify-center">
                    <FlagImage flag={selectedPlayer.flag} size="lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-text">{selectedPlayer.name}</h2>
                    <p className="text-[10px] text-text-muted uppercase">{selectedPlayer.team}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPlayer(null)} className="p-1.5 rounded-lg hover:bg-primary-subtle text-text-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {l:'GL',v:selectedPlayer.goals??0,ic:Goal,c:'var(--color-live)'},
                    {l:'AS',v:selectedPlayer.assists??0,ic:Zap,c:'var(--color-primary-light)'},
                    {l:'RT',v:selectedPlayer.rating?.toFixed(1)??'—',ic:Star,c:'var(--color-warm)'},
                    {l:'PJ',v:playerMatches.length,ic:Calendar,c:'var(--color-text-secondary)'},
                  ].map(s => (
                    <div key={s.l} className="bg-primary-subtle rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.l}</p>
                      <p className="text-xl font-black" style={{color:s.c}}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {/* Tournament Matches */}
                {playerMatches.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                      <Calendar size={12} /> {language==='es'?'Partidos en el torneo':'Tournament Matches'}
                    </h3>
                    <div className="space-y-1.5">
                      {playerMatches.map(pm => (
                        <div key={pm.match.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary-subtle/50">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-text-muted">{fmtDateCompact(pm.date)}</span>
                            <span className="text-text font-semibold">{pm.opponent || `Match ${pm.match.id}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {pm.goals > 0 && <span className="badge bg-live/15 text-live text-[9px] flex items-center gap-0.5"><Goal size={8}/> {pm.goals}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {playerMatches.length === 0 && (
                  <div className="text-center py-6">
                    <Activity size={32} className="mx-auto mb-2 text-text-muted" />
                    <p className="text-xs text-text-muted">{language==='es'?'Sin datos de partidos aún':'No match data yet'}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
