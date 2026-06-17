import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Calendar, Activity, Clock } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { GROUPS } from '@/constants';
import type { Match, Team } from '@/types/worldcup';

function getStatus(match: Match): { label: string; className: string } {
  if (match.finished) return { label: 'FT', className: 'status-finished' };
  if (match.time_elapsed) {
    if (match.time_elapsed === 'HT') return { label: 'HT', className: 'status-ht' };
    return { label: `${match.time_elapsed}'`, className: 'status-live' };
  }
  return { label: 'UP', className: 'status-upcoming' };
}
function getTeamForMatch(teamId: number, teams: Team[]): Team | undefined { return teams.find((t: Team) => t.id === teamId); }
function formatFullDate(dateStr: string): string { try { return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); } catch { return dateStr; } }

type MatchFilter = 'all' | 'live' | 'finished' | 'upcoming';

export function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches();
  const { data: teams } = useTeams();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<MatchFilter>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    if (!matches) return [];
    let result = [...matches];
    if (statusFilter === 'live') result = result.filter((m: Match) => !m.finished && m.time_elapsed);
    else if (statusFilter === 'finished') result = result.filter((m: Match) => m.finished);
    else if (statusFilter === 'upcoming') result = result.filter((m: Match) => !m.finished && !m.time_elapsed);
    if (groupFilter !== 'all') result = result.filter((m: Match) => m.group === groupFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m: Match) => {
        const home = teams ? getTeamForMatch(m.home_team_id, teams) : undefined;
        const away = teams ? getTeamForMatch(m.away_team_id, teams) : undefined;
        return home?.name_en?.toLowerCase().includes(q) || away?.name_en?.toLowerCase().includes(q) || m.group?.toLowerCase().includes(q);
      });
    }
    result.sort((a: Match, b: Match) => new Date(a.local_date).getTime() - new Date(b.local_date).getTime());
    return result;
  }, [matches, statusFilter, groupFilter, search, teams]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="glass-card p-4"><Skeleton className="h-20" /></div>)}</div></div>;
  if (error) return <div className="glass-card p-12 text-center"><X size={40} className="mx-auto mb-4 text-wc-red/50" /><h3 className="text-lg font-bold text-text mb-2">Failed to load matches</h3><p className="text-text-secondary text-sm">Please check your connection and try again.</p></div>;

  const filtersActive = statusFilter !== 'all' || groupFilter !== 'all' || search;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Matches</h1>
        <p className="text-sm text-text-secondary">Browse all 104 World Cup matches — filter by team, group, or status</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input type="text" placeholder="Search teams or groups..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-wc-blue focus:ring-2 focus:ring-wc-blue/10 transition-all" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filtersActive ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary'}`}>
          <Filter size={16} /> Filters {filtersActive && <span className="w-2 h-2 rounded-full bg-white" />}
        </button>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-2">Status</label>
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'live', 'upcoming', 'finished'] as const).map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === s ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'}`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block mb-2">Group</label>
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => setGroupFilter('all')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${groupFilter === 'all' ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'}`}>All</button>
                {GROUPS.map((g) => (
                  <button key={g} onClick={() => setGroupFilter(g)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${groupFilter === g ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'}`}>Group {g}</button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-sm text-text-secondary">Showing <span className="font-bold text-text">{filtered.length}</span> of {matches?.length ?? 0} matches</p>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center"><Calendar size={40} className="mx-auto mb-4 text-text-secondary/30" /><p className="text-text-secondary font-medium">No matches found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((match: Match) => {
            const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
            const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
            const status = getStatus(match);
            return (
              <div key={match.id} className="glass-card-hover p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/60">{formatFullDate(match.local_date)}</span>
                    {match.group && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-wc-blue/5 text-wc-blue">G{match.group}</span>}
                  </div>
                  <span className={`status-badge ${status.className}`}>{status.label !== 'FT' && status.label !== 'UP' && <Activity size={10} className="animate-pulse" />}{status.label}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0"><span className="text-2xl">{homeTeam?.flag ?? '🏳'}</span><span className="text-xs font-semibold text-text text-center truncate w-full">{homeTeam?.name_en ?? `T${match.home_team_id}`}</span></div>
                  <div className="flex flex-col items-center mx-3">
                    {match.home_score !== null && match.away_score !== null ? <span className="text-2xl font-black text-text">{match.home_score} - {match.away_score}</span> : <span className="text-xl font-bold text-text-secondary/40">vs</span>}
                    {match.finished && <span className="text-[9px] text-text-secondary/40 mt-0.5">Full Time</span>}
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1 min-w-0"><span className="text-2xl">{awayTeam?.flag ?? '🏳'}</span><span className="text-xs font-semibold text-text text-center truncate w-full">{awayTeam?.name_en ?? `T${match.away_team_id}`}</span></div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border">
                  <span className="text-[10px] text-text-secondary/50">Match {match.id}</span>
                  <span className="text-[10px] text-text-secondary/50">{match.type?.replace('_', ' ') ?? 'Group Stage'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
