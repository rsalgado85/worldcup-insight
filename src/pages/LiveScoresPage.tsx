import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, AlertCircle, RefreshCw, Radio } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import type { Match, Team } from '@/types/worldcup';

function getTeamForMatch(teamId: number, teams: Team[]): Team | undefined { return teams.find((t: Team) => t.id === teamId); }

export function LiveScoresPage() {
  const { data: matches, isLoading, error, refetch } = useMatches();
  const { data: teams } = useTeams();
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => { if (!autoRefresh) return; const interval = setInterval(() => refetch(), 30000); return () => clearInterval(interval); }, [autoRefresh, refetch]);

  const liveMatches = useMemo(() => { if (!matches) return []; return matches.filter((m: Match) => !m.finished); }, [matches]);
  const inPlay = useMemo(() => liveMatches.filter((m: Match) => m.time_elapsed), [liveMatches]);
  const upcoming = useMemo(() => liveMatches.filter((m: Match) => !m.time_elapsed), [liveMatches]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="glass-card p-4"><Skeleton className="h-24" /></div>)}</div></div>;
  if (error) return <div className="glass-card p-12 text-center"><AlertCircle size={40} className="mx-auto mb-4 text-wc-red/50" /><h3 className="text-lg font-bold text-text mb-2">Failed to load live scores</h3><p className="text-text-secondary text-sm mb-4">Please check your connection.</p><button onClick={() => refetch()} className="px-4 py-2 rounded-xl bg-wc-blue text-white text-sm font-semibold"><RefreshCw size={14} className="inline mr-1.5" />Retry</button></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Live Scores</h1>
            <p className="text-sm text-text-secondary mt-1">{inPlay.length > 0 ? `${inPlay.length} match${inPlay.length > 1 ? 'es' : ''} in play` : 'No matches currently live'}</p>
          </div>
          <div className="flex items-center gap-3">
            {inPlay.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-wc-red/10 border border-wc-red/20">
                <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wc-red opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-wc-red" /></span>
                <span className="text-xs font-bold text-wc-red uppercase tracking-wider">LIVE</span>
              </div>
            )}
            <button onClick={() => setAutoRefresh(!autoRefresh)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${autoRefresh ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary'}`}>
              <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} /> Auto {autoRefresh ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </motion.div>

      {inPlay.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4"><Activity size={18} className="text-wc-red animate-pulse" /><h2 className="text-lg font-bold text-text">In Play</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inPlay.map((match: Match) => {
              const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
              const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
              return (
                <div key={match.id} className="glass-card p-4 relative overflow-hidden" style={{ boxShadow: 'inset 0 0 0 2px rgba(228,0,43,0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/60">{match.group ? `Group ${match.group}` : match.type?.replace('_', ' ')}</span>
                    <span className="status-badge status-live"><Activity size={10} className="animate-pulse" />{match.time_elapsed === 'HT' ? 'Half Time' : `${match.time_elapsed || '0'}'`}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col items-center gap-1 flex-1"><span className="text-3xl">{homeTeam?.flag ?? '🏳'}</span><span className="text-sm font-bold text-text text-center">{homeTeam?.name_en ?? '—'}</span></div>
                    <div className="flex flex-col items-center"><span className="text-3xl font-black text-text">{match.home_score ?? 0} - {match.away_score ?? 0}</span><span className="text-[10px] font-semibold text-wc-red mt-1 animate-pulse">LIVE</span></div>
                    <div className="flex flex-col items-center gap-1 flex-1"><span className="text-3xl">{awayTeam?.flag ?? '🏳'}</span><span className="text-sm font-bold text-text text-center">{awayTeam?.name_en ?? '—'}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4"><Clock size={18} className="text-wc-blue" /><h2 className="text-lg font-bold text-text">Upcoming</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.slice(0, 12).map((match: Match) => {
              const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
              const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
              return (
                <div key={match.id} className="glass-card-hover p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary/60">{match.local_date}</span>
                    {match.group && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-wc-blue/5 text-wc-blue">G{match.group}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0"><span className="text-xl">{homeTeam?.flag ?? '🏳'}</span><span className="text-xs font-semibold text-text truncate">{homeTeam?.name_en ?? '—'}</span></div>
                    <span className="text-sm font-bold text-text-secondary/40">vs</span>
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end"><span className="text-xs font-semibold text-text truncate">{awayTeam?.name_en ?? '—'}</span><span className="text-xl">{awayTeam?.flag ?? '🏳'}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {liveMatches.length === 0 && (
        <div className="glass-card p-16 text-center"><Radio size={48} className="mx-auto mb-4 text-text-secondary/20" /><h3 className="text-lg font-bold text-text mb-2">No Live Matches</h3><p className="text-text-secondary text-sm max-w-md mx-auto">No matches currently in progress. Check back when the tournament is underway.</p></div>
      )}
    </div>
  );
}
