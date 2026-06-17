import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Activity, Users, Clock, Calendar,
  Goal, Shield, Star, Zap, TrendingUp, Swords, ChevronRight,
} from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { FEATURED_PLAYERS, TOP_SCORERS, TOP_ASSISTS, TOP_RATINGS, TOP_CLEAN_SHEETS, GROUPS } from '@/constants';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Match, Team } from '@/types/worldcup';

function getStatus(match: Match): { label: string; className: string } {
  if (match.finished) return { label: 'FT', className: 'status-finished' };
  if (match.time_elapsed) {
    if (match.time_elapsed === 'HT') return { label: 'HT', className: 'status-ht' };
    return { label: `${match.time_elapsed}'`, className: 'status-live' };
  }
  return { label: 'UP', className: 'status-upcoming' };
}

function getTeamForMatch(teamId: number, teams: Team[]): Team | undefined {
  return teams.find((t) => t.id === teamId);
}

function formatDate(dateStr: string): string {
  try { return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
  catch { return dateStr; }
}

interface PlayerData { id: number; name: string; team: string; flag: string; goals?: number; assists?: number; rating?: number; cleanSheets?: number; value?: number }

function TrendingPlayerRow({ player, rank }: { player: PlayerData; rank: number }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-wc-blue/[0.03] transition-colors">
      <span className="text-xs font-bold text-text-secondary w-5">{rank}</span>
      <span className="text-xl">{player.flag}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">{player.name}</p>
        <p className="text-[10px] text-text-secondary">{player.team}</p>
      </div>
      <div className="text-right">
        <span className="text-sm font-bold text-wc-blue">{player.goals || player.assists || player.cleanSheets || player.rating}</span>
      </div>
    </div>
  );
}

export function HomePage() {
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const { data: teams, isLoading: teamsLoading } = useTeams();
  const { data: groups } = useGroups();
  const [activeGroupTab, setActiveGroupTab] = useState<string>('A');
  const { language } = useAppStore();

  const isLoading = matchesLoading || teamsLoading;

  const todayStr = useMemo(() => { try { return new Date().toISOString().split('T')[0]; } catch { return ''; } }, []);

  const todayMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter((m: Match) => m.local_date === todayStr);
  }, [matches, todayStr]);

  const recentMatches = useMemo(() => {
    if (!matches) return [];
    return matches.filter((m: Match) => m.finished).sort((a: Match, b: Match) => new Date(b.local_date).getTime() - new Date(a.local_date).getTime()).slice(0, 10);
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    if (!matches) return [];
    const today = new Date().toISOString().split('T')[0];
    return matches.filter((m: Match) => !m.finished && m.local_date >= today).sort((a: Match, b: Match) => new Date(a.local_date).getTime() - new Date(b.local_date).getTime()).slice(0, 10);
  }, [matches]);

  const groupStandings = useMemo(() => {
    if (!groups) return [];
    const group = groups.find((g: { name: string }) => g.name === activeGroupTab);
    return group?.teams?.sort((a: { pts: number; gd: number; gf: number }, b: { pts: number; gd: number; gf: number }) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf) ?? [];
  }, [groups, activeGroupTab]);

  const kpiCards = useMemo(() => [
    { label: t('home.matchesPlayed', language), value: matches?.filter((m: Match) => m.finished).length ?? '—', icon: Swords, color: '#0033A0' },
    { label: t('home.goalsScored', language), value: matches?.reduce((s: number, m: Match) => s + (m.home_score ?? 0) + (m.away_score ?? 0), 0) ?? '—', icon: Goal, color: '#E4002B' },
    { label: t('home.avgGoalsMatch', language), value: (() => { const f = matches?.filter((m: Match) => m.finished) ?? []; return f.length ? (f.reduce((s: number, m: Match) => s + (m.home_score ?? 0) + (m.away_score ?? 0), 0) / f.length).toFixed(1) : '—'; })(), icon: TrendingUp, color: '#00A859' },
    { label: t('home.countries', language), value: 48, icon: Users, color: '#F2A900' },
    { label: t('home.liveNow', language), value: matches?.filter((m: Match) => !m.finished && m.time_elapsed).length ?? 0, icon: Activity, color: '#E4002B' },
    { label: t('home.totalAttendance', language), value: '3.5M+', icon: Users, color: '#0033A0' },
    { label: t('home.topScorer', language), value: 'Mbappé (8)', icon: Star, color: '#F2A900' },
    { label: t('home.topAssists', language), value: 'De Bruyne (6)', icon: Zap, color: '#00A859' },
  ], [matches, language]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="kpi-card"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-24" /></div>
          ))}
        </div>
      </div>
    );
  }

  const featuredPlayer = FEATURED_PLAYERS[0];

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-text"><span className="gradient-text">{t('home.title', language)}</span> {t('home.dashboardLabel', language)}</h1>
        <p className="text-sm text-text-secondary mt-1">{t('home.dateSubtitle', language)}</p>
      </motion.div>

      {/* Section 1: Player of the Tournament */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{ background: 'linear-gradient(135deg, #001B44 0%, #002266 30%, #0033A0 70%, #1E5FD9 100%)', border: '1px solid rgba(0,51,160,0.15)' }}>
        <div className="absolute -right-12 -top-12 w-48 h-48 opacity-10 pointer-events-none">
          <div className="w-full h-full rounded-full border-[20px] border-white/20" />
        </div>
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/15 text-white/80 inline-flex items-center gap-1.5 mb-3">
            <Trophy size={12} /> {t('home.playerOfTournament', language)}
          </span>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{featuredPlayer.flag}</span>
            <div>
              <h2 className="font-black text-white text-2xl sm:text-3xl">{featuredPlayer.name}</h2>
              <p className="text-sm text-white/60">{featuredPlayer.team}</p>
            </div>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="text-center"><div className="font-black text-2xl text-white">{featuredPlayer.goals}</div><div className="text-[10px] uppercase tracking-wider text-white/50">{t('home.goals', language)}</div></div>
            <div className="text-center"><div className="font-black text-2xl text-white">{featuredPlayer.assists}</div><div className="text-[10px] uppercase tracking-wider text-white/50">{t('home.assists', language)}</div></div>
            <div className="text-center"><div className="font-black text-2xl text-wc-gold">{featuredPlayer.rating}</div><div className="text-[10px] uppercase tracking-wider text-white/50">{t('home.rating', language)}</div></div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Today's Matches */}
      <section>
        <div className="flex items-center gap-2 mb-4"><Calendar size={20} className="text-wc-blue" /><h2 className="text-lg font-bold text-text">{t('home.todaysMatches', language)}</h2></div>
        {todayMatches.length === 0 ? (
          <div className="glass-card p-8 text-center"><Calendar size={32} className="mx-auto mb-3 text-text-secondary/40" /><p className="text-text-secondary font-medium">{t('home.noMatchesToday', language)}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayMatches.map((match: Match) => {
              const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
              const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
              const status = getStatus(match);
              return (
                <motion.div key={match.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">{match.group ? tf('common.groupLabel', language, match.group) : match.type}</span>
                    <span className={`status-badge ${status.className}`}>{status.label === 'UP' ? <Clock size={10} /> : status.label === 'FT' ? null : <Activity size={10} className="animate-pulse" />}{status.label}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0"><span className="text-xl">{homeTeam?.flag ?? '🏳'}</span><span className="text-sm font-semibold text-text truncate">{homeTeam?.name_en ?? `T${match.home_team_id}`}</span></div>
                    <div className="flex items-center gap-2 mx-3">{match.home_score !== null && match.away_score !== null ? <span className="text-lg font-black text-text">{match.home_score} - {match.away_score}</span> : <span className="text-lg font-black text-text-secondary">vs</span>}</div>
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end"><span className="text-sm font-semibold text-text truncate text-right">{awayTeam?.name_en ?? `T${match.away_team_id}`}</span><span className="text-xl">{awayTeam?.flag ?? '🏳'}</span></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 3: KPI Metrics */}
      <section>
        <div className="flex items-center gap-2 mb-4"><Activity size={20} className="text-wc-red" /><h2 className="text-lg font-bold text-text">{t('home.keyMetrics', language)}</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpiCards.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="kpi-card">
              <div className="flex items-center justify-between"><span className="kpi-label">{kpi.label}</span><div className="p-1.5 rounded-lg" style={{ backgroundColor: `${kpi.color}10`, color: kpi.color }}><kpi.icon size={16} /></div></div>
              <span className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 4: Top Rankings */}
      <section>
        <div className="flex items-center gap-2 mb-4"><Trophy size={20} className="text-wc-gold" /><h2 className="text-lg font-bold text-text">{t('home.topRankings', language)}</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4"><h3 className="text-xs font-bold uppercase tracking-wider text-wc-red mb-3 flex items-center gap-1.5"><Goal size={14} /> {t('home.topScorers', language)}</h3>{TOP_SCORERS.slice(0, 5).map((p, i) => <TrendingPlayerRow key={p.id} player={p} rank={i + 1} />)}</div>
          <div className="glass-card p-4"><h3 className="text-xs font-bold uppercase tracking-wider text-wc-blue mb-3 flex items-center gap-1.5"><Zap size={14} /> {t('home.topAssistsSub', language)}</h3>{TOP_ASSISTS.slice(0, 5).map((p, i) => <TrendingPlayerRow key={p.id} player={p as PlayerData} rank={i + 1} />)}</div>
          <div className="glass-card p-4"><h3 className="text-xs font-bold uppercase tracking-wider text-wc-gold mb-3 flex items-center gap-1.5"><Star size={14} /> {t('home.topRatings', language)}</h3>{TOP_RATINGS.slice(0, 5).map((p, i) => <TrendingPlayerRow key={p.id} player={p} rank={i + 1} />)}</div>
          <div className="glass-card p-4"><h3 className="text-xs font-bold uppercase tracking-wider text-wc-green mb-3 flex items-center gap-1.5"><Shield size={14} /> {t('home.cleanSheets', language)}</h3>{TOP_CLEAN_SHEETS.slice(0, 5).map((p, i) => <TrendingPlayerRow key={p.id} player={p as PlayerData} rank={i + 1} />)}</div>
        </div>
      </section>

      {/* Section 5: Group Standings */}
      <section>
        <div className="flex items-center gap-2 mb-4"><Trophy size={20} className="text-wc-blue" /><h2 className="text-lg font-bold text-text">{t('home.groupStandings', language)}</h2></div>
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-2">
          {GROUPS.map((g) => (
            <button key={g} onClick={() => setActiveGroupTab(g)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${activeGroupTab === g ? 'bg-wc-blue text-white shadow-lg shadow-wc-blue/25' : 'bg-card text-text-secondary hover:bg-wc-blue/5 hover:text-wc-blue border border-border'}`}>
              {tf('common.groupLabel', language, g)}
            </button>
          ))}
        </div>
        {groupStandings.length === 0 ? (
          <div className="glass-card p-8 text-center"><Trophy size={32} className="mx-auto mb-3 text-text-secondary/40" /><p className="text-text-secondary font-medium">{t('home.noStandingsData', language)}</p></div>
        ) : (
          <div className="glass-card overflow-x-auto">
            <table className="wc-table">
              <thead><tr><th>#</th><th>{t('standings.team', language)}</th><th className="text-center">{t('standings.pts', language)}</th><th className="text-center">{t('standings.mp', language)}</th><th className="text-center">{t('standings.w', language)}</th><th className="text-center">{t('standings.d', language)}</th><th className="text-center">{t('standings.l', language)}</th><th className="text-center">{t('standings.gf', language)}</th><th className="text-center">{t('standings.ga', language)}</th><th className="text-center">{t('standings.gd', language)}</th></tr></thead>
              <tbody>
                {groupStandings.map((team: { id: number; flag: string; name_en: string; pts: number; mp: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }, idx: number) => (
                  <tr key={team.id} className={idx < 2 ? 'bg-wc-blue/[0.02]' : ''}>
                    <td className="font-bold text-text-secondary">{idx + 1}</td>
                    <td><div className="flex items-center gap-2"><span className="text-lg">{team.flag}</span><span className="text-sm font-semibold text-text">{team.name_en}</span></div></td>
                    <td className="text-center font-bold text-wc-blue">{team.pts}</td>
                    <td className="text-center">{team.mp}</td><td className="text-center">{team.w}</td><td className="text-center">{team.d}</td><td className="text-center">{team.l}</td>
                    <td className="text-center">{team.gf}</td><td className="text-center">{team.ga}</td>
                    <td className={`text-center font-bold ${team.gd > 0 ? 'text-wc-green' : team.gd < 0 ? 'text-wc-red' : ''}`}>{team.gd > 0 ? '+' : ''}{team.gd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 text-right"><Link to="/standings" className="inline-flex items-center gap-1 text-sm font-semibold text-wc-blue hover:text-wc-blue/80 transition-colors">{t('home.viewAllStandings', language)} <ChevronRight size={16} /></Link></div>
      </section>

      {/* Section 6: Recent Results */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Clock size={20} className="text-wc-green" /><h2 className="text-lg font-bold text-text">{t('home.recentResultsLabel', language)}</h2></div>
          <Link to="/matches" className="text-sm font-semibold text-wc-blue hover:text-wc-blue/80 transition-colors flex items-center gap-1">{t('home.allMatches', language)} <ChevronRight size={16} /></Link>
        </div>
        {recentMatches.length === 0 ? (
          <div className="glass-card p-8 text-center"><Clock size={32} className="mx-auto mb-3 text-text-secondary/40" /><p className="text-text-secondary font-medium">{t('home.noRecentResults', language)}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {recentMatches.map((match: Match) => {
              const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
              const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
              return (
                <div key={match.id} className="glass-card-hover p-3 cursor-pointer">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-text-secondary/60 mb-2">{match.group ? tf('common.groupLabel', language, match.group) : ''} • {formatDate(match.local_date)}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1"><span className="text-base">{homeTeam?.flag ?? '🏳'}</span><span className="text-[11px] font-semibold text-text truncate">{homeTeam?.name_en ?? '—'}</span></div>
                    <span className="text-sm font-black text-text mx-1">{match.home_score ?? 0} - {match.away_score ?? 0}</span>
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-end"><span className="text-[11px] font-semibold text-text truncate">{awayTeam?.name_en ?? '—'}</span><span className="text-base">{awayTeam?.flag ?? '🏳'}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Section 7: Upcoming Matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Calendar size={20} className="text-wc-blue" /><h2 className="text-lg font-bold text-text">{t('home.upcomingMatches', language)}</h2></div>
          <Link to="/matches" className="text-sm font-semibold text-wc-blue hover:text-wc-blue/80 transition-colors flex items-center gap-1">{t('home.fullCalendar', language)} <ChevronRight size={16} /></Link>
        </div>
        {upcomingMatches.length === 0 ? (
          <div className="glass-card p-8 text-center"><Calendar size={32} className="mx-auto mb-3 text-text-secondary/40" /><p className="text-text-secondary font-medium">{t('home.noUpcomingMatches', language)}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingMatches.map((match: Match) => {
              const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
              const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
              return (
                <div key={match.id} className="glass-card-hover p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="status-badge status-upcoming"><Clock size={10} />{formatDate(match.local_date)}</span>
                    {match.group && <span className="text-[10px] font-semibold text-text-secondary/60">{tf('common.groupLabel', language, match.group)}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0"><span className="text-xl">{homeTeam?.flag ?? '🏳'}</span><span className="text-sm font-semibold text-text truncate">{homeTeam?.name_en ?? `T${match.home_team_id}`}</span></div>
                    <span className="text-xs font-bold text-text-secondary">vs</span>
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end"><span className="text-sm font-semibold text-text truncate text-right">{awayTeam?.name_en ?? `T${match.away_team_id}`}</span><span className="text-xl">{awayTeam?.flag ?? '🏳'}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
