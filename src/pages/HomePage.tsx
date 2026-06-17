import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Clock, Goal, MapPin, Swords, Trophy, Users, Activity, TrendingUp, Star, Zap, Shield } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { FlagImage } from '@/components/common/FlagImage';
import { getLocalFlag } from '@/constants/crests';
import { TOP_SCORERS, TOP_ASSISTS, TOP_RATINGS, TOP_CLEAN_SHEETS, GROUPS, getPlayerAvatar } from '@/constants';
import { usePlayerModalStore } from '@/store/playerModalStore';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import { fmtTime } from '@/utils/dates';
import type { Match, Team } from '@/types/worldcup';

const flagOnError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const i = e.target as HTMLImageElement;
  i.style.display = 'none';
};

/* ─── Helpers ─────────────────────────────────────── */
const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmtDate(d: string) { const p = (d||'').slice(0,10).split('-'); return p[2] ? `${MONTHS_EN[+p[1]-1]} ${+p[2]}` : d; }
function getTeam(matches: Team[] | undefined, id: number) { return matches?.find(t => t.id === id); }
function getStatus(m: Match) {
  if (m.finished) return { l: 'FT', c: 'text-text-muted' };
  if (m.time_elapsed) return { l: m.time_elapsed, c: 'text-live' };
  return { l: '', c: 'text-text-muted' };
}
function formBlock(w: number, d: number, l: number, i: number) {
  if (i < w) return 'bg-success';
  if (i < w + d) return 'bg-warm';
  if (i < w + d + l) return 'bg-live';
  return 'bg-border';
}

interface PlayerData { id: number; name: string; team: string; flag: string; goals?: number; assists?: number; rating?: number; cleanSheets?: number; value?: number }

function TrendingPlayerRow({ player, rank, stat, statColor }: { player: PlayerData; rank: number; stat?: string | number; statColor?: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-subtle transition-colors">
      <span className="text-[10px] font-black text-text-muted w-4 text-right">{rank}</span>
      <FlagImage flag={player.flag} size="md" />
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
            cleanSheets: player.cleanSheets,
          })}
          className="text-xs font-bold text-text truncate text-left hover:text-primary-light transition-colors cursor-pointer"
        >
          {player.name}
        </button>
        <p className="text-[9px] text-text-muted">{player.team}</p>
      </div>
      {stat !== undefined && <span className="text-sm font-black text-right min-w-[2rem]" style={{color: statColor}}>{stat}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════ */
export function HomePage() {
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: groups } = useGroups();
  const [activeGroupTab, setActiveGroupTab] = useState('A');
  const [expandedMatch, setExpandedMatch] = useState<number | null>(null);
  const { language } = useAppStore();
  const isLoading = matchesLoading || teamsLoading;

  // Dates
  const todayApi = useMemo(() => { const d = new Date(); return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}/${d.getFullYear()}`; }, []);
  const displayDate = useMemo(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }, []);

  // Data
  const todayMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter(m => { const ld = m.local_date||''; return ld===todayApi||ld.includes(todayApi)||ld.includes(todayApi.replace(/\//g,'-')); });
  }, [matches, todayApi]);

  const recentMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter(m => m.finished).sort((a,b) => new Date(b.local_date).getTime()-new Date(a.local_date).getTime()).slice(0,6);
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter(m => !m.finished && (m.local_date||'').slice(0,10)>=displayDate).sort((a,b) => new Date(a.local_date).getTime()-new Date(b.local_date).getTime()).slice(0,6);
  }, [matches, displayDate]);

  const groupStandings = useMemo(() => {
    if (!groups) return [];
    const g = groups.find(g => g.name===activeGroupTab);
    return g?.teams?.sort((a,b) => b.pts-a.pts||b.gd-a.gd||b.gf-a.gf)??[];
  }, [groups, activeGroupTab]);

  const totalGoals = matches?.reduce((s,m) => s+(m.home_score??0)+(m.away_score??0), 0)??0;
  const finished = matches?.filter(m => m.finished).length??0;

  // KPI cards with palette colors
  const kpiCards = [
    { label: t('home.matchesPlayed', language), value: finished, icon: Swords, color: 'var(--color-primary)' },
    { label: t('home.goalsScored', language), value: totalGoals, icon: Goal, color: 'var(--color-live)' },
    { label: t('home.avgGoalsMatch', language), value: finished ? (totalGoals/finished).toFixed(1) : '—', icon: TrendingUp, color: 'var(--color-success)' },
    { label: t('home.countries', language), value: 48, icon: Users, color: 'var(--color-warm)' },
    { label: t('home.liveNow', language), value: matches?.filter(m => !m.finished&&m.time_elapsed).length??0, icon: Activity, color: 'var(--color-live)' },
    { label: t('home.totalAttendance', language), value: '3.5M+', icon: Users, color: 'var(--color-primary-light)' },
    { label: t('home.topScorer', language), value: `${TOP_SCORERS[0].name.split(' ').pop()} (${TOP_SCORERS[0].goals})`, icon: Star, color: 'var(--color-accent)' },
    { label: t('home.topAssists', language), value: 'De Bruyne (6)', icon: Zap, color: 'var(--color-success)' },
  ];

  // Loading
  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-64" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-48 rounded-xl" /><Skeleton className="h-48 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({length:8}).map((_,i)=><div key={i} className="kpi-card"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-24" /></div>)}
      </div>
    </div>
  );

  const featured = TOP_SCORERS[0];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('home.title', language)}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('home.dateSubtitle', language)}</p>
      </motion.div>

      {/* ═══ SECTION 1: Player of the Tournament ═══ */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{background:'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)'}}>
        {/* Background player illustration — right-aligned, merging into the card */}
        {featured.avatar && (
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 overflow-hidden">
            <img src={featured.avatar} alt=""
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[120%] w-auto max-w-none object-cover"
              style={{maskImage:'linear-gradient(to left, black 30%, transparent 100%)',WebkitMaskImage:'linear-gradient(to left, black 30%, transparent 100%)'}} />
          </div>
        )}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-4xl shadow-lg overflow-hidden p-1">
              <img src={featured.flag} alt="" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="badge text-[9px] px-2 py-0.5 bg-white/20 text-white backdrop-blur font-semibold">{t('home.playerOfTournament', language)}</span>
          </div>
          <div className="flex-1">
            <button
              onClick={() => usePlayerModalStore.getState().open({
                name: featured.name,
                team: featured.team,
                flag: featured.flag,
                avatar: getPlayerAvatar(featured.team),
                goals: featured.goals,
                assists: featured.assists,
                rating: featured.rating,
              })}
              className="text-2xl sm:text-3xl font-black text-white mb-1 text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              {featured.name}
            </button>
            <p className="text-sm text-white/70 mb-4">{featured.team}</p>
            <div className="flex flex-wrap gap-3">
              {[{l:t('home.goals',language),v:featured.goals},{l:t('home.assists',language),v:featured.assists},{l:t('home.rating',language),v:featured.rating}].map(s=>(
                <div key={s.l} className="bg-white/10 rounded-xl px-4 py-2 text-center backdrop-blur">
                  <p className="text-2xl font-black text-white">{s.v}</p>
                  <p className="text-[9px] text-white/60 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══ SECTION 2: Today's Matches ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-primary-light" />
          <h2 className="text-lg font-black text-text">{t('home.todaysMatches', language)}</h2>
          <span className="text-[10px] text-text-muted ml-2">({todayApi} · {todayMatches.length})</span>
        </div>
        {todayMatches.length===0 ? (
          <div className="card p-10 text-center">
            <Calendar size={40} className="mx-auto mb-3 text-text-muted" />
            <p className="text-text-secondary font-medium">{t('home.noMatchesToday', language)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayMatches.map(match => {
              const home = getTeam(teams,match.home_team_id), away = getTeam(teams,match.away_team_id), st = getStatus(match);
              return (
                <motion.div key={match.id} initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="card p-4 hover:shadow-card-hover transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{match.group ? tf('common.groupLabel',language,match.group): match.type}</span>
                    {fmtTime(match.local_date, language) && <span className="badge bg-primary-subtle text-primary text-[9px]">{fmtTime(match.local_date, language)}</span>}
                    <span className={`text-[10px] font-bold ${st.c}`}>{st.l||'VS'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {home?.fifa_code ? <img src={getLocalFlag(home.fifa_code)} alt="" className="w-8 h-8 object-contain rounded-sm" onError={(e) => flagOnError(e)}/> : <FlagImage flag={home?.flag} size="md"/>}
                      <span className="text-sm font-bold text-text truncate">{home?.name_en??`T${match.home_team_id}`}</span>
                    </div>
                    <div className="mx-3">
                      {match.home_score!==null&&match.away_score!==null&&(match.finished||match.time_elapsed) ? <span className="text-lg font-black text-text">{match.home_score}-{match.away_score}</span> : <span className="text-lg font-bold text-text-muted">vs</span>}
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span className="text-sm font-bold text-text truncate text-right">{away?.name_en??`T${match.away_team_id}`}</span>
                      {away?.fifa_code ? <img src={getLocalFlag(away.fifa_code)} alt="" className="w-8 h-8 object-contain rounded-sm" onError={(e) => flagOnError(e)}/> : <FlagImage flag={away?.flag} size="md"/>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═══ SECTION 3: KPI Metrics ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-live" />
          <h2 className="text-lg font-black text-text">{t('home.keyMetrics', language)}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpiCards.map((kpi,i) => (
            <motion.div key={kpi.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*.04}}
              className="card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor:`${kpi.color}15`}}>
                  <kpi.icon size={15} style={{color:kpi.color}} />
                </div>
              </div>
              <p className="text-2xl font-black text-text" style={{color:kpi.color}}>{kpi.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 4: Top Rankings ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-warm" />
          <h2 className="text-lg font-black text-text">{t('home.topRankings', language)}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {t:t('home.topScorers',language),d:TOP_SCORERS,ic:Goal,c:'var(--color-live)', s:TOP_SCORERS.reduce((a,p)=>a+(p.goals||0),0), u:t('home.goals',language), sf:(p:any)=>p.goals},
            {t:t('home.topAssistsSub',language),d:TOP_ASSISTS,ic:Zap,c:'var(--color-primary-light)', s:TOP_ASSISTS.reduce((a,p)=>a+(p.value||0),0), u:t('home.assists',language), sf:(p:any)=>p.value},
            {t:t('home.topRatings',language),d:TOP_RATINGS,ic:Star,c:'var(--color-warm)', s:(TOP_RATINGS.reduce((a,p)=>a+(p.value||0),0)/TOP_RATINGS.length).toFixed(1), u:'', sf:(p:any)=>p.value},
            {t:t('home.cleanSheets',language),d:TOP_CLEAN_SHEETS,ic:Shield,c:'var(--color-success)', s:TOP_CLEAN_SHEETS.reduce((a,p)=>a+(p.value||0),0), u:'', sf:(p:any)=>p.value},
          ].map(section => (
            <div key={section.t} className="card p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{color:section.c}}>
                <section.ic size={13} /> {section.t}
              </h3>
              {section.u && <p className="text-2xl font-black mb-3" style={{color:section.c}}>{section.s} <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">{section.u}</span></p>}
              {!section.u && <p className="text-2xl font-black mb-3" style={{color:section.c}}>{section.s}</p>}
              {section.d.slice(0,5).map((p,i) => <TrendingPlayerRow key={p.id} player={p as PlayerData} rank={i+1} stat={section.sf(p)} statColor={section.c} />)}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: Group Standings ═══ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-primary-light" />
          <h2 className="text-lg font-black text-text">{t('home.groupStandings', language)}</h2>
        </div>
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2">
          {GROUPS.map(g => (
            <button key={g} onClick={()=>setActiveGroupTab(g)}
              className={`group-tab flex-shrink-0 ${activeGroupTab===g?'active':''}`}>{g}</button>
          ))}
        </div>
        {groupStandings.length===0 ? (
          <div className="card p-10 text-center"><Trophy size={40} className="mx-auto mb-3 text-text-muted"/><p className="text-text-secondary font-medium">{t('home.noStandingsData',language)}</p></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider bg-primary-subtle">
                    <th className="text-left pl-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted w-8">#</th>
                    <th className="text-left py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">{t('standings.team',language)}</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">PTS</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">PJ</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">G</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">E</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">P</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">GF</th>
                    <th className="text-center py-2.5 px-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">GC</th>
                    <th className="text-center pr-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">DG</th>
                  </tr>
                </thead>
                <tbody>
                  {groupStandings.map((team,idx) => (
                    <tr key={team.id} className={`border-b border-divider hover:bg-card-hover transition-colors ${idx<2?'bg-primary-subtle/30':''}`}>
                      <td className="pl-4 py-3">
                        {idx===0 ? <div className="w-5 h-5 rounded-full bg-warm flex items-center justify-center"><Trophy size={10} className="text-[#8B6914]"/></div>
                         : idx===1 ? <span className="text-text-secondary font-bold text-xs">2</span>
                         : <span className="text-text-muted text-xs">{idx+1}</span>}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2.5">
                          <FlagImage flag={team.flag} size="sm"/>
                          <div>
                            <p className="text-xs font-bold text-text">{team.name_en}</p>
                            <p className="text-[9px] text-text-muted">{team.fifa_code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 font-black text-primary">{team.pts}</td>
                      <td className="text-center py-3 text-xs text-text-secondary">{team.mp}</td>
                      <td className="text-center py-3 text-xs font-semibold text-success">{team.w}</td>
                      <td className="text-center py-3 text-xs text-text-secondary">{team.d}</td>
                      <td className="text-center py-3 text-xs font-semibold text-live">{team.l}</td>
                      <td className="text-center py-3 text-xs text-text-secondary">{team.gf}</td>
                      <td className="text-center py-3 text-xs text-text-secondary">{team.ga}</td>
                      <td className={`text-center py-3 text-xs font-bold pr-4 ${team.gd>0?'text-success':team.gd<0?'text-live':'text-text-secondary'}`}>{team.gd>0?'+':''}{team.gd}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ═══ SECTION 6: Recent Results ═══ */}
      {recentMatches.length>0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-text-muted" />
            <h2 className="text-lg font-black text-text">{t('home.recentResults', language)}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentMatches.map(match => {
              const home = getTeam(teams,match.home_team_id), away = getTeam(teams,match.away_team_id);
              const isOpen = expandedMatch === match.id;
              const scorers = [match.home_scorers, match.away_scorers].filter(Boolean);
              const hasDetails = scorers.length > 0 || match.group || match.matchday || match.type;
              return (
                <motion.div key={match.id} layout className={`card transition-all ${isOpen ? 'ring-1 ring-primary/20' : 'cursor-pointer hover:shadow-card-hover'}`} onClick={() => setExpandedMatch(isOpen ? null : match.id)}>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {home?.fifa_code ? <img src={getLocalFlag(home.fifa_code)} alt="" className="w-5 h-5 object-contain rounded-sm" onError={(e) => flagOnError(e)}/> : <span className="text-xs">{home?.flag}</span>}
                      <span className="text-[11px] font-bold text-text truncate">{home?.name_en}</span>
                    </div>
                    <span className="text-sm font-black text-text mx-2">{match.home_score}-{match.away_score}</span>
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end">
                      <span className="text-[11px] font-bold text-text truncate">{away?.name_en}</span>
                      {away?.fifa_code ? <img src={getLocalFlag(away.fifa_code)} alt="" className="w-5 h-5 object-contain rounded-sm" onError={(e) => flagOnError(e)}/> : <span className="text-xs">{away?.flag}</span>}
                    </div>
                    {hasDetails && <ChevronDown size={14} className={`text-text-muted flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                  </div>
                  <AnimatePresence>
                    {isOpen && hasDetails && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}} className="overflow-hidden">
                        <div className="px-3 pb-3 space-y-2 border-t border-divider pt-2">
                          {match.group && <p className="text-[10px] text-text-muted"><span className="font-semibold text-text-secondary">{t('common.group', language) || 'Group'}:</span> {match.group}{match.matchday ? ` · Matchday ${match.matchday}` : ''}</p>}
                          {match.type && !match.group && <p className="text-[10px] text-text-muted"><span className="font-semibold text-text-secondary">Stage:</span> {match.type}{match.matchday ? ` · Matchday ${match.matchday}` : ''}</p>}
                          {scorers.length > 0 && (
                            <div className="space-y-1">
                              {match.home_scorers && <p className="text-[10px]"><Goal size={10} className="inline text-live mr-1" /><span className="font-semibold text-text-secondary">{home?.name_en || 'Home'}:</span> <span className="text-text-muted">{match.home_scorers}</span></p>}
                              {match.away_scorers && <p className="text-[10px]"><Goal size={10} className="inline text-primary-light mr-1" /><span className="font-semibold text-text-secondary">{away?.name_en || 'Away'}:</span> <span className="text-text-muted">{match.away_scorers}</span></p>}
                            </div>
                          )}
                          <p className="text-[9px] text-text-muted/60">{fmtDate(match.local_date)} · FT</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ═══ SECTION 7: Upcoming Matches ═══ */}
      {upcomingMatches.length>0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-primary-light" />
            <h2 className="text-lg font-black text-text">{t('home.upcomingMatches', language)}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingMatches.map(match => {
              const home = getTeam(teams,match.home_team_id), away = getTeam(teams,match.away_team_id);
              return (
                <div key={match.id} className="card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-semibold text-text-muted">{fmtDate(match.local_date)}</span>
                    {match.group && <span className="text-[9px] font-bold text-primary">{tf('common.groupLabel',language,match.group)}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {home?.fifa_code ? <img src={getLocalFlag(home.fifa_code)} alt="" className="w-5 h-5 object-contain rounded-sm" onError={(e) => flagOnError(e)}/> : <span className="text-xs">{home?.flag}</span>}
                      <span className="text-[11px] font-bold text-text truncate">{home?.name_en}</span>
                    </div>
                    <span className="text-xs font-bold text-text-muted mx-2">vs</span>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                      <span className="text-[11px] font-bold text-text truncate">{away?.name_en}</span>
                      {away?.fifa_code ? <img src={getLocalFlag(away.fifa_code)} alt="" className="w-5 h-5 object-contain rounded-sm" onError={(e) => flagOnError(e)}/> : <span className="text-xs">{away?.flag}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
