import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Trophy, Activity, Target, Goal, Calendar } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { useMatches } from '@/hooks/useMatches';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { getCrestPath, getCrestFallback } from '@/constants/crests';
import { useAppStore } from '@/store/useAppStore';
import { GROUP_COLORS } from '@/constants';
import type { Team, Match } from '@/types/worldcup';

/* ─── Team Stats Builder ────────────────────────── */
interface TeamStats {
  played: number; won: number; drawn: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDiff: number;
  points: number; matches: Match[];
}

function buildTeamStats(teamId: number, matches: Match[]): TeamStats {
  const teamMatches = matches.filter(m => m.home_team_id === teamId || m.away_team_id === teamId);
  let won = 0, drawn = 0, lost = 0, gf = 0, ga = 0;
  teamMatches.filter(m => m.finished).forEach(m => {
    const isHome = m.home_team_id === teamId;
    const hs = m.home_score ?? 0, as = m.away_score ?? 0;
    gf += isHome ? hs : as;
    ga += isHome ? as : hs;
    if (hs === as) drawn++;
    else if ((isHome && hs > as) || (!isHome && as > hs)) won++;
    else lost++;
  });
  return { played: won+drawn+lost, won, drawn, lost, goalsFor: gf, goalsAgainst: ga, goalDiff: gf-ga, points: won*3+drawn, matches: teamMatches };
}

/* ─── Helpers ────────────────────────────────────── */
function formatMatchDate(d: string) { const p = (d||'').slice(0,10).split(/[\/-]/); if(p.length<3) return d; const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${m[+p[0]-1]||m[+p[1]-1]} ${+p[1]||+p[2]}`; }

function getGroupForTeam(team: Team): string { return team.groups || team.group || '—'; }

/* ═══════════════════════════════════════════════════ */
export function TeamsPage() {
  const { data: teams, isLoading, error } = useTeams();
  const { data: groups } = useGroups();
  const { data: matches } = useMatches();
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { language } = useAppStore();

  const teamsWithGroup = useMemo(() => {
    if (!teams) return [];
    if (!groups) return teams;
    return teams.map(team => {
      let groupName = team.groups || team.group;
      if (!groupName) {
        for (const g of groups) {
          if ((g.teams as any[])?.some((t: any) => t.team_id === team.id)) { groupName = g.name; break; }
        }
      }
      return { ...team, group: groupName || '—' };
    });
  }, [teams, groups]);

  const filtered = useMemo(() => {
    if (!teamsWithGroup) return [];
    if (!search) return teamsWithGroup;
    const q = search.toLowerCase();
    return teamsWithGroup.filter(t => t.name_en.toLowerCase().includes(q) || t.fifa_code?.toLowerCase().includes(q) || t.group?.toLowerCase().includes(q));
  }, [teamsWithGroup, search]);

  const confederations = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach(t => { if (t.iso2) set.add(t.iso2); });
    return set.size;
  }, [filtered]);

  // Build stats for selected team
  const teamStats = useMemo(() => {
    if (!selectedTeam || !matches) return null;
    return buildTeamStats(selectedTeam.id, matches);
  }, [selectedTeam, matches]);

  // Loading
  if (isLoading) return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-56" /><Skeleton className="h-5 w-80" /><Skeleton className="h-12 w-full rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({length:16}).map((_,i)=><div key={i} className="card p-5"><Skeleton className="h-12 w-12 rounded-xl" /><Skeleton className="h-4 w-24 mt-2" /></div>)}
      </div>
    </div>
  );

  if (error) return (
    <div className="card p-12 text-center">
      <X size={48} className="mx-auto mb-4 text-live" />
      <h3 className="text-lg font-bold text-text mb-2">{t('teams.failedLoad', language)}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('teams.title', language)}</h1>
        <p className="text-sm text-text-secondary">{tf('teams.subtitleLine', language, teams?.length??0, confederations)}</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" placeholder={t('teams.searchPlaceholder', language)} value={search} onChange={e=>setSearch(e.target.value)}
          className="input-field pl-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((team, idx) => {
          const groupName = (team as any).group || '—';
          const groupColor = GROUP_COLORS[groupName] || 'var(--color-primary)';
          return (
            <motion.button key={team.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:idx*0.03}}
              onClick={() => setSelectedTeam(team)}
              className="card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all text-left cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <FlagImage flag={team.flag} size="xl" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-black text-text truncate">{team.name_en}</h3>
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{team.fifa_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-text-secondary pt-3 border-t border-divider">
                <span className="badge flex items-center gap-1" style={{backgroundColor:`${groupColor}15`, color:groupColor}}>
                  <MapPin size={10} /> {tf('common.groupLabel', language, team.group)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ═══ Team Detail Modal ═══ */}
      <AnimatePresence>
        {selectedTeam && teamStats && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTeam(null)}>
            <motion.div initial={{opacity:0,scale:.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95,y:20}}
              className="card w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="sticky top-0 z-10 card border-b border-divider rounded-b-none px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FlagImage flag={selectedTeam.flag} size="lg" />
                  <div>
                    <h2 className="text-lg font-black text-text">{selectedTeam.name_en}</h2>
                    <p className="text-[10px] text-text-muted uppercase">{selectedTeam.fifa_code} · {tf('common.groupLabel', language, getGroupForTeam(selectedTeam))}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="p-1.5 rounded-lg hover:bg-primary-subtle text-text-muted transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    {l:'PJ',v:teamStats.played,ic:Calendar,c:'var(--color-text-secondary)'},
                    {l:'G',v:teamStats.won,ic:Trophy,c:'var(--color-success)'},
                    {l:'E',v:teamStats.drawn,ic:Activity,c:'var(--color-warm)'},
                    {l:'P',v:teamStats.lost,ic:Target,c:'var(--color-live)'},
                    {l:'GF',v:teamStats.goalsFor,ic:Goal,c:'var(--color-success)'},
                    {l:'GC',v:teamStats.goalsAgainst,ic:Goal,c:'var(--color-live)'},
                    {l:'DG',v:teamStats.goalDiff,ic:Activity,c:teamStats.goalDiff>0?'var(--color-success)':teamStats.goalDiff<0?'var(--color-live)':'var(--color-text-secondary)'},
                    {l:'PTS',v:teamStats.points,ic:Trophy,c:'var(--color-primary)'},
                  ].map(s => (
                    <div key={s.l} className="bg-primary-subtle rounded-xl p-3 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted mb-1">{s.l}</p>
                      <p className="text-xl font-black" style={{color:s.c}}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Matches */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-1.5">
                    <Calendar size={12} /> {language==='es'?'Partidos':'Matches'}
                  </h3>
                  <div className="space-y-1.5">
                    {teamStats.matches.sort((a,b)=>new Date(b.local_date).getTime()-new Date(a.local_date).getTime()).slice(0,8).map(m => {
                      const isHome = m.home_team_id === selectedTeam.id;
                      const opponent = isHome ? (m.away_team_name_en || `Team ${m.away_team_id}`) : (m.home_team_name_en || `Team ${m.home_team_id}`);
                      const hs = m.home_score??'-', as = m.away_score??'-';
                      const result = !m.finished ? 'bg-primary-subtle text-text-secondary' :
                        (isHome && hs>as)||(!isHome && as>hs) ? 'bg-success-subtle text-success' :
                        hs===as ? 'bg-warm-subtle text-[#8B6914]' : 'bg-live/10 text-live';
                      return (
                        <div key={m.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary-subtle/50">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-text-muted">{formatMatchDate(m.local_date)}</span>
                            <span className="text-text font-semibold">{isHome?'vs':''}{opponent}</span>
                            {!isHome && <span className="text-[9px] text-text-muted">(V)</span>}
                          </div>
                          <span className={`text-xs font-black px-2 py-0.5 rounded-md ${result}`}>
                            {m.finished ? `${hs}-${as}` : formatMatchDate(m.local_date)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
