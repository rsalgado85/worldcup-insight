import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, Clock, MapPin, Activity, Trophy, X } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { getCrestPath, getFlagUrl } from '@/constants/crests';
import { useAppStore } from '@/store/useAppStore';
import type { Match, Team } from '@/types/worldcup';

function getTeamForMatch(teamId: number, teams: Team[]): Team | undefined {
  return teams.find((t: Team) => t.id === teamId);
}

function formatDateSpanish(dateStr: string, lang: 'en' | 'es'): string {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  } catch { return dateStr; }
}

function formatDateISO(dateStr: string): string {
  return dateStr; // Already ISO format from API
}

function formatTime(dateStr: string): string {
  // Matches show local_date, time from API; for now show the date
  return '';
}

type DateFilter = 'all' | 'today' | 'tomorrow' | string; // string = specific date

export function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches();
  const { data: teams } = useTeams();
  const { language } = useAppStore();

  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // Extract all unique match dates, sorted
  const availableDates = useMemo(() => {
    if (!matches) return [];
    const dates = [...new Set(matches.map(m => m.local_date))].filter(Boolean);
    return dates.sort();
  }, [matches]);

  // Filter matches by selected date
  const filtered = useMemo(() => {
    if (!matches) return [];

    let result = [...matches];

    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      result = result.filter(m => m.local_date === today);
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      result = result.filter(m => m.local_date === tomorrow);
    } else if (dateFilter !== 'all') {
      result = result.filter(m => m.local_date === dateFilter);
    }

    result.sort((a, b) => {
      if (a.time_elapsed && !b.time_elapsed) return -1;
      if (!a.time_elapsed && b.time_elapsed) return 1;
      return 0;
    });
    return result;
  }, [matches, dateFilter]);

  // Format the selected date label
  const dateLabel = useMemo(() => {
    if (dateFilter === 'today') {
      const d = new Date();
      return formatDateSpanish(d.toISOString().split('T')[0], language);
    }
    if (dateFilter === 'tomorrow') {
      const d = new Date(Date.now() + 86400000);
      return formatDateSpanish(d.toISOString().split('T')[0], language);
    }
    if (dateFilter === 'all') return t('matches.allDates', language);
    return formatDateSpanish(dateFilter, language);
  }, [dateFilter, language]);

  // Loading state
  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-72" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card p-4"><Skeleton className="h-24" /></div>
        ))}
      </div>
    </div>
  );

  // Error state
  if (error) return (
    <div className="card p-12 text-center">
      <X size={40} className="mx-auto mb-4 text-live/50" />
      <h3 className="text-lg font-bold text-text mb-2">{t('matches.failedLoad', language)}</h3>
      <p className="text-text-secondary text-sm">{t('matches.failedDetail', language)}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
          {t('matches.title', language)}
        </h1>
        <p className="text-sm text-text-secondary">
          {t('matches.browseSubtitle', language)}
        </p>
      </motion.div>

      {/* Date Selector — inspired by fifa.piodeportes.com */}
      <div className="card p-4 space-y-4">
        {/* Filter label + date dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t('matches.filterByDate', language)}
          </span>

          {/* Custom dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateDropdown(!showDateDropdown)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-bg border border-border text-sm font-semibold text-text hover:border-primary-light transition-all min-w-[200px]"
            >
              <Calendar size={16} className="text-primary-light" />
              <span>{dateLabel}</span>
              <ChevronDown size={14} className={`ml-auto text-text-secondary transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showDateDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full mt-1 left-0 z-50 w-64 bg-card border border-border rounded-xl shadow-elevated overflow-hidden"
                >
                  {/* Quick options */}
                  <div className="p-2 border-b border-divider">
                    <button
                      onClick={() => { setDateFilter('all'); setShowDateDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === 'all' ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:bg-primary-subtle'}`}
                    >
                      {t('matches.allDates', language)}
                    </button>
                  </div>

                  {/* Individual dates */}
                  <div className="max-h-64 overflow-y-auto p-2">
                    {availableDates.map(date => (
                      <button
                        key={date}
                        onClick={() => { setDateFilter(date); setShowDateDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === date ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-secondary hover:bg-primary-subtle'}`}
                      >
                        {formatDateSpanish(date, language)}
                        <span className="text-text-muted ml-2 text-xs">
                          ({matches?.filter(m => m.local_date === date).length ?? 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Match count */}
          <span className="text-sm text-text-secondary">
                        {(t('matches.matchCount', language) as string).replace('{count}', String(filtered.length)).replace('{date}', dateLabel)}
          </span>
        </div>

        {/* Quick filter pills */}
        <div className="flex gap-2">
          <button
            onClick={() => setDateFilter('today')}
            className={`filter-pill ${dateFilter === 'today' ? 'active' : ''}`}
          >
            {t('matches.today', language)}
          </button>
          <button
            onClick={() => setDateFilter('tomorrow')}
            className={`filter-pill ${dateFilter === 'tomorrow' ? 'active' : ''}`}
          >
            {t('matches.tomorrow', language)}
          </button>
          <button
            onClick={() => setDateFilter('all')}
            className={`filter-pill ${dateFilter === 'all' ? 'active' : ''}`}
          >
            {t('matches.allDates', language)}
          </button>
        </div>
      </div>

      {/* Match list */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary font-medium">
                        {(t('matches.noMatchesDate', language) as string).replace('{date}', dateLabel)}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match, i) => {
            const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
            const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card hover:shadow-card-hover transition-all"
              >
                <div className="p-4 sm:p-5">
                  {/* Top row: date, group, status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-text-muted" />
                      <span className="text-xs font-semibold text-text-secondary">
                        {formatDateSpanish(match.local_date, language)}
                      </span>
                      {match.group && (
                        <span className="badge bg-primary-subtle text-primary text-[10px]">
                          {tf('common.groupLabel', language, match.group)}
                        </span>
                      )}
                      {match.type && match.type !== 'group' && (
                        <span className="badge badge-premium text-[10px]">
                          {match.type.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>

                    {/* Status badge */}
                    {match.finished ? (
                      <span className="badge badge-finished text-[10px]">
                        {match.home_score} - {match.away_score} FT
                      </span>
                    ) : match.time_elapsed ? (
                      <span className="badge badge-live text-[10px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {match.time_elapsed === 'HT' ? 'HT' : `${match.time_elapsed}'`}
                      </span>
                    ) : (
                      <span className="badge bg-secondary-light text-secondary text-[10px]">
                        {t('matches.upcoming', language)}
                      </span>
                    )}
                  </div>

                  {/* Teams row */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    {/* Home team */}
                    <div className="flex-1 flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="text-sm sm:text-base font-bold text-text truncate max-w-[140px]">
                          {homeTeam?.name_en ?? `Team ${match.home_team_id}`}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {homeTeam?.fifa_code ? (
                          <img
                            src={getCrestPath(homeTeam.fifa_code)}
                            alt={homeTeam.name_en}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getFlagUrl(homeTeam.iso2);
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-subtle flex items-center justify-center text-lg">
                            {homeTeam?.flag ?? '🏳'}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score / VS */}
                    <div className="flex-shrink-0 flex flex-col items-center min-w-[60px]">
                      {match.home_score !== null && match.away_score !== null ? (
                        <>
                          <span className="text-2xl sm:text-3xl font-black text-text tabular-nums">
                            {match.home_score} - {match.away_score}
                          </span>
                          {match.finished && (
                            <span className="text-[9px] text-text-muted mt-0.5">
                              {t('matches.fullTime', language)}
                            </span>
                          )}
                          {match.time_elapsed && !match.finished && (
                            <span className="text-[9px] text-live font-semibold mt-0.5 animate-pulse">
                              LIVE
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-lg font-bold text-text-muted">VS</span>
                      )}
                    </div>

                    {/* Away team */}
                    <div className="flex-1 flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {awayTeam?.fifa_code ? (
                          <img
                            src={getCrestPath(awayTeam.fifa_code)}
                            alt={awayTeam.name_en}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getFlagUrl(awayTeam.iso2);
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-subtle flex items-center justify-center text-lg">
                            {awayTeam?.flag ?? '🏳'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm sm:text-base font-bold text-text truncate max-w-[140px]">
                          {awayTeam?.name_en ?? `Team ${match.away_team_id}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: stadium + match info */}
                  {match.stadium_id && (
                    <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-divider">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <MapPin size={12} />
                        <span>Estadio {match.stadium_id}</span>
                      </div>
                      {match.type && (
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Trophy size={12} />
                          <span className="capitalize">{match.type.replace(/_/g, ' ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
