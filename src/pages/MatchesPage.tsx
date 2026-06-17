import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronDown, MapPin, Trophy, X } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { FlagImage } from '@/components/common/FlagImage';
import { getCrestPath, getCrestFallback, getFlagUrl } from '@/constants/crests';
import { t } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Match, Team } from '@/types/worldcup';

type DateFilter = 'all' | 'today' | 'tomorrow' | string;

// ─── Helpers ───────────────────────────────────────────

const MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const WEEKDAYS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEKDAYS_ES = ['dom','lun','mar','mié','jue','vie','sáb'];

/** Get local date as ISO string YYYY-MM-DD (NOT UTC) */
function getLocalDate(daysOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Format date: "19 jun" or "Jun 19" */
function fmtDateShort(dateStr: string, lang: 'en' | 'es'): string {
  const clean = (dateStr || '').slice(0, 10);
  const parts = clean.split('-');
  if (parts.length < 3) return dateStr;
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  const months = lang === 'es' ? MONTHS_ES : MONTHS_EN;
  return lang === 'es' ? `${d} ${months[m]}` : `${months[m]} ${d}`;
}

/** Format date with weekday: "jue, 19 jun 2026" or "Thu, Jun 19, 2026" */
function fmtDateFull(dateStr: string, lang: 'en' | 'es'): string {
  const clean = (dateStr || '').slice(0, 10);
  const parts = clean.split('-');
  if (parts.length < 3) return dateStr;
  const [y, mo, d] = parts.map(Number);
  const date = new Date(y, mo - 1, d);
  const wd = (lang === 'es' ? WEEKDAYS_ES : WEEKDAYS_EN)[date.getDay()];
  const month = (lang === 'es' ? MONTHS_ES : MONTHS_EN)[mo - 1];
  return `${wd}, ${d} ${month} ${y}`;
}

function getTeamForMatch(teamId: number, teams: Team[]): Team | undefined {
  return teams.find((t: Team) => t.id === teamId);
}

// ─── Component ─────────────────────────────────────────

export function MatchesPage() {
  const { data: matches, isLoading, error } = useMatches();
  const { data: teams } = useTeams();
  const { language } = useAppStore();

  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  // All unique match dates from API (strip time if present), sorted
  const availableDates = useMemo(() => {
    if (!matches) return [];
    const dates = [...new Set(matches.map(m => (m.local_date || '').slice(0, 10)))].filter(Boolean);
    return dates.sort();
  }, [matches]);

  // Filter matches by selected date (compare date part only)
  const filtered = useMemo(() => {
    if (!matches) return [];

    const today = getLocalDate();
    const tomorrow = getLocalDate(1);

    let result = [...matches];

    if (dateFilter === 'today') {
      result = result.filter(m => {
        const ld = (m.local_date || '');
        return ld.slice(0, 10) === today || ld === today || ld.includes(today.slice(5));
      });
    } else if (dateFilter === 'tomorrow') {
      result = result.filter(m => (m.local_date || '').slice(0, 10) === tomorrow);
    } else if (dateFilter !== 'all') {
      result = result.filter(m => (m.local_date || '').slice(0, 10) === dateFilter);
    }

    // In-progress matches first
    result.sort((a, b) => {
      if (a.time_elapsed && !b.time_elapsed) return -1;
      if (!a.time_elapsed && b.time_elapsed) return 1;
      return 0;
    });
    return result;
  }, [matches, dateFilter]);

  // Label for the selected date in the dropdown
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

  // ─── Render ──────────────────────────────────────
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
                  <div className="p-2 border-b border-divider">
                    <button
                      onClick={() => { setDateFilter('all'); setShowDateDropdown(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === 'all' ? 'bg-primary-subtle text-primary' : 'text-text-secondary hover:bg-primary-subtle'}`}
                    >
                      {t('matches.allDates', language)}
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2">
                    {availableDates.map(date => (
                      <button
                        key={date}
                        onClick={() => { setDateFilter(date); setShowDateDropdown(false); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${dateFilter === date ? 'bg-primary-subtle text-primary font-semibold' : 'text-text-secondary hover:bg-primary-subtle'}`}
                      >
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

          {/* Match count */}
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
            {language === 'es'
              ? `No hay partidos para esta fecha.`
              : `No matches for this date.`}
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

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card hover:shadow-card-hover transition-all"
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
                          <img
                            src={getCrestPath(homeTeam.fifa_code)}
                            alt={homeTeam.name_en}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (!img.src.endsWith('.png')) {
                                img.src = getCrestFallback(homeTeam.fifa_code);
                              } else {
                                img.src = getFlagUrl(homeTeam.iso2);
                              }
                            }}
                          />
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
                          <img
                            src={getCrestPath(awayTeam.fifa_code)}
                            alt={awayTeam.name_en}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (!img.src.endsWith('.png')) {
                                img.src = getCrestFallback(awayTeam.fifa_code);
                              } else {
                                img.src = getFlagUrl(awayTeam.iso2);
                              }
                            }}
                          />
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
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
