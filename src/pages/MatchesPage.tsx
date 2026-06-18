import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, MapPin, Trophy, X, ChevronUp, Clock, Users, Target, Zap } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { FlagImage } from '@/components/common/FlagImage';
import { getLocalFlag } from '@/constants/crests';
import { t } from '@/constants/translations';
import { getApiDate, getLocalDate, fmtDateShort, fmtDateFull, fmtTime } from '@/utils/dates';
import { useAppStore } from '@/store/useAppStore';
import type { Match, Team } from '@/types/worldcup';

type DateFilter = 'all' | 'today' | 'tomorrow' | string;

const getTeamForMatch = (id: number, teams: Team[]) => teams.find(t => t.id === id);

// Parse scorer string like "K. Mbappé 66', B. Barcola 82'" into [{name, minute}]
function parseScorers(scorers: string | null): { name: string; minute: string }[] {
  if (!scorers) return [];
  return scorers.split(', ').map(entry => {
    const match = entry.match(/^(.+?)\s+(\d+\+?\d*'.*)$/);
    if (match) {
      return { name: match[1].trim(), minute: match[2].replace(/\(p\)|\(og\)/g, '').trim() };
    }
    return { name: entry.trim(), minute: '' };
  });
}

export function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches();
  const { data: teams } = useTeams();
  const { language } = useAppStore();

  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // All unique match dates from API
  const availableDates = useMemo(() => {
    if (!matches) return [];
    const dates = [...new Set(matches.map(m => (m.local_date || '').slice(0, 10)))].filter(Boolean);
    return dates.sort();
  }, [matches]);

  // Filter matches by selected date
  const filtered = useMemo(() => {
    if (!matches) return [];
    const today = getApiDate();
    const tomorrow = getApiDate(1);
    let result = [...matches];

    if (dateFilter === 'today') {
      result = result.filter(m => {
        const ld = m.local_date || '';
        return ld === today || ld.includes(today) || ld.includes(today.replace(/\//g, '-'));
      });
    } else if (dateFilter === 'tomorrow') {
      result = result.filter(m => {
        const ld = m.local_date || '';
        return ld === tomorrow || ld.includes(tomorrow) || ld.includes(tomorrow.replace(/\//g, '-'));
      });
    } else if (dateFilter !== 'all') {
      result = result.filter(m => {
        const ld = m.local_date || '';
        return ld === dateFilter || ld.slice(0, 10) === dateFilter;
      });
    }

    result.sort((a, b) => {
      if (a.time_elapsed && !b.time_elapsed) return -1;
      if (!a.time_elapsed && b.time_elapsed) return 1;
      return 0;
    });
    return result;
  }, [matches, dateFilter]);

  const dateLabel = useMemo(() => {
    if (dateFilter === 'today') return fmtDateFull(getLocalDate(), language);
    if (dateFilter === 'tomorrow') return fmtDateFull(getLocalDate(1), language);
    if (dateFilter === 'all') return t('matches.allDates', language);
    return fmtDateFull(dateFilter, language);
  }, [dateFilter, language]);

  // ─── Loading ─────────────────────────────────────
  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-72" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card p-4"><Skeleton className="h-24" /></div>
      ))}
    </div>
  );

  // ─── Error ───────────────────────────────────────
  if (error) return (
    <div className="card p-12 text-center">
      <X size={48} className="mx-auto mb-4 text-live/40" />
      <h3 className="text-lg font-bold text-text mb-2">{t('matches.failedLoad', language)}</h3>
      <p className="text-text-secondary text-sm">{t('matches.failedDetail', language)}</p>
    </div>
  );

  const isTodayActive = dateFilter === 'today';

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
          {t('matches.title', language)}
        </h1>
        <p className="text-sm text-text-secondary">{t('matches.browseSubtitle', language)}</p>
      </motion.div>

      {/* ═══ Date Selector ═══ */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
            {t('matches.filterByDate', language)}
          </span>

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
                  <div className="p-2 border-b border-divider">
                    <button onClick={() => { setDateFilter('all'); setShowDateDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === 'all' ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:bg-primary-subtle'}`}>
                      {t('matches.allDates', language)}
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {availableDates.map(date => (
                      <button key={date}
                        onClick={() => { setDateFilter(date); setShowDateDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === date ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-secondary hover:bg-primary-subtle'}`}>
                        {fmtDateFull(date, language)}
                        <span className="text-text-muted ml-2 text-xs">
                          ({matches?.filter(m => (m.local_date || '').slice(0, 10) === date).length ?? 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-sm text-text-secondary">
            {filtered.length} {language === 'es' ? 'partidos' : 'matches'} — {dateLabel}
          </span>
        </div>

        {/* Quick filter pills */}
        <div className="flex gap-2">
          <button onClick={() => setDateFilter('today')}
            className={`filter-pill ${isTodayActive ? 'active' : ''}`}>
            {t('matches.today', language)}
          </button>
          <button onClick={() => setDateFilter('tomorrow')}
            className={`filter-pill ${dateFilter === 'tomorrow' ? 'active' : ''}`}>
            {t('matches.tomorrow', language)}
          </button>
          <button onClick={() => setDateFilter('all')}
            className={`filter-pill ${dateFilter === 'all' ? 'active' : ''}`}>
            {t('matches.allDates', language)}
          </button>
        </div>
      </div>

      {/* ═══ Match List ═══ */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar size={48} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary font-medium">
            {language === 'es' ? 'No hay partidos para esta fecha.' : 'No matches for this date.'}
          </p>
          <button onClick={() => setDateFilter('all')} className="btn-primary mt-4">
            {t('matches.allDates', language)}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match, i) => {
            const homeTeam = teams ? getTeamForMatch(match.home_team_id, teams) : undefined;
            const awayTeam = teams ? getTeamForMatch(match.away_team_id, teams) : undefined;
            const isExpanded = expandedId === match.id;

            // Parse scorers for expanded view
            const homeScorers = parseScorers(match.home_scorers);
            const awayScorers = parseScorers(match.away_scorers);
            const hasScorers = homeScorers.length > 0 || awayScorers.length > 0;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {/* Main card — clickable */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : match.id)}
                  className="card hover:shadow-card-hover transition-all cursor-pointer group"
                >
                  <div className="p-4 sm:p-5">
                    {/* Top: date + group + status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-text-muted" />
                        <span className="text-xs font-semibold text-text-secondary">
                          {fmtDateFull(match.local_date, language)}
                        </span>
                        {match.group && (
                          <span className="badge bg-primary-subtle text-primary text-[10px]">
                            {language === 'es' ? 'Grupo' : 'Group'} {match.group}
                          </span>
                        )}
                        {match.type && match.type !== 'group' && (
                          <span className="badge badge-premium text-[10px] capitalize">
                            {match.type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Status */}
                      {match.finished ? (
                        <span className="badge text-[10px]" style={{ background: 'var(--color-text-muted)', color: '#fff' }}>
                          FT {match.home_score}-{match.away_score}
                        </span>
                      ) : match.time_elapsed ? (
                        <span className="badge badge-live text-[10px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {match.time_elapsed === 'HT' ? 'HT' : `${match.time_elapsed}'`}
                        </span>
                      ) : (
                        <span className="badge text-[10px]" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
                          {fmtDateShort(match.local_date, language)}
                        </span>
                      )}

                      {/* Expand indicator */}
                      <ChevronUp size={16} className={`text-text-muted transition-transform duration-200 ${isExpanded ? '' : 'rotate-180'}`} />
                    </div>

                    {/* Teams row */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      {/* Home */}
                      <div className="flex-1 flex items-center gap-3 justify-end">
                        <div className="text-right">
                          <p className="text-sm sm:text-base font-bold text-text truncate max-w-[140px]">
                            {homeTeam?.name_en ?? `Team ${match.home_team_id}`}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {homeTeam?.fifa_code ? (
                            <img src={getLocalFlag(homeTeam.fifa_code)} alt={homeTeam.name_en}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <FlagImage flag={homeTeam?.flag} size="lg" />
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="flex-shrink-0 flex flex-col items-center min-w-[60px]">
                        {match.home_score !== null && match.away_score !== null ? (
                          <span className="text-2xl sm:text-3xl font-black text-text tabular-nums">
                            {match.home_score} - {match.away_score}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-text-muted">VS</span>
                        )}
                        {match.finished && <span className="text-[9px] text-text-muted mt-0.5">{t('matches.fullTime', language)}</span>}
                        {match.time_elapsed && !match.finished && <span className="text-[9px] text-live font-semibold mt-0.5 animate-pulse">LIVE</span>}
                      </div>

                      {/* Away */}
                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {awayTeam?.fifa_code ? (
                            <img src={getLocalFlag(awayTeam.fifa_code)} alt={awayTeam.name_en}
                              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ) : (
                            <FlagImage flag={awayTeam?.flag} size="lg" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-text truncate max-w-[140px]">
                            {awayTeam?.name_en ?? `Team ${match.away_team_id}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer: stadium + type */}
                    {match.stadium_id && (
                      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-divider">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <MapPin size={12} />
                          <span>{language === 'es' ? 'Estadio' : 'Stadium'} {match.stadium_id}</span>
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
                </div>

                {/* ═══ Expanded Detail Panel ═══ */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="card mx-1 -mt-1 rounded-t-none border-t-0" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                        <div className="p-4 sm:p-5 space-y-5">

                          {/* Match Info Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <Clock size={14} className="text-primary-light flex-shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-text-muted">{language === 'es' ? 'Fecha' : 'Date'}</p>
                                <p className="font-semibold">{fmtDateFull(match.local_date, language)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <MapPin size={14} className="text-primary-light flex-shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-text-muted">{language === 'es' ? 'Estadio' : 'Stadium'}</p>
                                <p className="font-semibold">#{match.stadium_id}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <Users size={14} className="text-primary-light flex-shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-text-muted">{language === 'es' ? 'Grupo' : 'Group'}</p>
                                <p className="font-semibold">{match.group || '—'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                              <Trophy size={14} className="text-primary-light flex-shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-text-muted">{language === 'es' ? 'Ronda' : 'Round'}</p>
                                <p className="font-semibold capitalize">{match.type?.replace(/_/g, ' ') || '—'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Scorers Section */}
                          {hasScorers && match.finished && (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-3 flex items-center gap-2">
                                <Target size={14} className="text-live" />
                                {language === 'es' ? 'Goleadores' : 'Goal Scorers'}
                              </h4>

                              <div className="grid grid-cols-2 gap-4">
                                {/* Home Scorers */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    {homeTeam?.fifa_code ? (
                                      <img src={getLocalFlag(homeTeam.fifa_code)} alt=""
                                        className="w-5 h-5 object-contain" />
                                    ) : (
                                      <FlagImage flag={homeTeam?.flag} size="sm" />
                                    )}
                                    <span className="text-sm font-bold text-text truncate">
                                      {homeTeam?.name_en ?? `Team ${match.home_team_id}`}
                                    </span>
                                  </div>
                                  {homeScorers.length > 0 ? (
                                    <ul className="space-y-1.5">
                                      {homeScorers.map((s, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm">
                                          <Zap size={12} className="text-amber-400 flex-shrink-0" />
                                          <span className="text-text font-medium">{s.name}</span>
                                          <span className="text-text-muted text-xs tabular-nums ml-auto">{s.minute}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-text-muted italic">—</p>
                                  )}
                                </div>

                                {/* Away Scorers */}
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 mb-2">
                                    {awayTeam?.fifa_code ? (
                                      <img src={getLocalFlag(awayTeam.fifa_code)} alt=""
                                        className="w-5 h-5 object-contain" />
                                    ) : (
                                      <FlagImage flag={awayTeam?.flag} size="sm" />
                                    )}
                                    <span className="text-sm font-bold text-text truncate">
                                      {awayTeam?.name_en ?? `Team ${match.away_team_id}`}
                                    </span>
                                  </div>
                                  {awayScorers.length > 0 ? (
                                    <ul className="space-y-1.5">
                                      {awayScorers.map((s, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm">
                                          <Zap size={12} className="text-amber-400 flex-shrink-0" />
                                          <span className="text-text font-medium">{s.name}</span>
                                          <span className="text-text-muted text-xs tabular-nums ml-auto">{s.minute}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-text-muted italic">—</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Match not started — countdown info */}
                          {!match.finished && !match.time_elapsed && (
                            <div className="flex items-center justify-center gap-3 py-2">
                              <Clock size={16} className="text-secondary" />
                              <p className="text-sm text-text-secondary font-medium">
                                {language === 'es' ? 'Partido aún no iniciado' : 'Match not started yet'}
                              </p>
                            </div>
                          )}

                          {/* Live match — in progress */}
                          {match.time_elapsed && !match.finished && (
                            <div className="flex items-center justify-center gap-3 py-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-live animate-pulse" />
                              <p className="text-sm text-live font-bold">
                                {t('matches.live', language)} — {match.time_elapsed === 'HT' ? 'Half Time' : `${match.time_elapsed}'`}
                              </p>
                            </div>
                          )}

                          {/* Close button */}
                          <div className="flex justify-center pt-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-text hover:bg-primary-subtle transition-colors"
                            >
                              <ChevronUp size={14} />
                              {language === 'es' ? 'Cerrar' : 'Collapse'}
                            </button>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
