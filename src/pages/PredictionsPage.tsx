import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Shuffle, Trophy, ChevronRight, Swords, X, WifiOff,
  ChevronDown, Crown,
} from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { GROUPS, STATIC_GROUPS, getFifaRank, getFlagPath } from '@/constants';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { useAppStore } from '@/store/useAppStore';
import type { GroupStanding } from '@/types/worldcup';

function simulateKnockoutMatch(team1: string, team2: string, flag1: string, flag2: string): { winner: string; flag: string } {
  const r = Math.random();
  return r > 0.5 ? { winner: team1, flag: flag1 } : { winner: team2, flag: flag2 };
}

function generateBracket(
  groupStandings: { name: string; flag: string }[],
  language: 'en' | 'es'
): { round: string; matches: { home: string; away: string; homeFlag: string; awayFlag: string; winner?: string; winnerFlag?: string }[] }[] {
  if (groupStandings.length < 4) return [];

  // Use exactly 32 teams (pad if needed)
  let teams = [...groupStandings];
  while (teams.length < 32) {
    teams.push({ name: 'TBD', flag: '' });
  }
  teams = teams.slice(0, 32);

  // Random shuffle for variety
  const seeds = [...teams].sort(() => Math.random() - 0.5);

  function playRound(participants: { name: string; flag: string }[]) {
    const matches = [];
    for (let i = 0; i < participants.length; i += 2) {
      if (i + 1 >= participants.length) break;
      const h = participants[i];
      const a = participants[i + 1];
      // Skip TBD vs TBD match simulation
      if (h.name === 'TBD' && a.name === 'TBD') {
        matches.push({ home: 'TBD', away: 'TBD', homeFlag: '', awayFlag: '' });
      } else if (h.name === 'TBD') {
        matches.push({ home: 'TBD', away: a.name, homeFlag: '', awayFlag: a.flag, winner: a.name, winnerFlag: a.flag });
      } else if (a.name === 'TBD') {
        matches.push({ home: h.name, away: 'TBD', homeFlag: h.flag, awayFlag: '', winner: h.name, winnerFlag: h.flag });
      } else {
        const result = simulateKnockoutMatch(h.name, a.name, h.flag, a.flag);
        matches.push({ home: h.name, away: a.name, homeFlag: h.flag, awayFlag: a.flag, winner: result.winner, winnerFlag: result.flag });
      }
    }
    return matches;
  }

  const roundNames = [
    { key: 'predictions.round32', label: t('predictions.round32', language) },
    { key: 'predictions.round16', label: t('predictions.round16', language) },
    { key: 'predictions.quarterFinals', label: t('predictions.quarterFinals', language) },
    { key: 'predictions.semiFinals', label: t('predictions.semiFinals', language) },
    { key: 'predictions.final', label: t('predictions.final', language) },
  ];

  const rounds: typeof roundNames extends (infer T)[] ? { round: string; matches: any[] }[] : never = [];
  let currentParticipants = seeds;
  let roundIdx = 0;

  while (currentParticipants.length >= 2 && roundIdx < roundNames.length) {
    const matches = playRound(currentParticipants);
    const winners = matches
      .filter(m => m.winner)
      .map(m => ({ name: m.winner!, flag: m.winnerFlag! }));

    rounds.push({ round: roundNames[roundIdx].label, matches });
    currentParticipants = winners;
    roundIdx++;
  }

  return rounds;
}

function KnockoutMatchCard({ match }: { match: { home: string; away: string; homeFlag: string; awayFlag: string; winner?: string; winnerFlag?: string }; isLast?: boolean }) {
  const homeWon = match.winner === match.home;
  const awayWon = match.winner === match.away;
  const isTBD = match.home === 'TBD' && match.away === 'TBD';

  if (isTBD) {
    return (
      <div className="flex items-center justify-between p-2 rounded-lg opacity-30">
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <span className="text-xs text-text-secondary/40">—</span>
        </div>
        <div className="flex-shrink-0 mx-2">
          <span className="text-[9px] text-text-secondary/30">vs</span>
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-xs text-text-secondary/40">—</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${match.winner ? 'bg-wc-blue/[0.03]' : ''}`}>
      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        {homeWon && <Crown size={12} className="text-wc-gold flex-shrink-0" />}
        <span className={`text-xs font-semibold truncate ${homeWon ? 'text-text font-bold' : 'text-text-secondary'}`}>{match.home}</span>
        <FlagImage flag={match.homeFlag} size="sm" className="flex-shrink-0" />
      </div>
      <div className="flex-shrink-0 mx-2">
        {match.winner ? (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-wc-blue/10 text-wc-blue">W</span>
        ) : (
          <span className="text-[9px] text-text-secondary/40">vs</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <FlagImage flag={match.awayFlag} size="sm" className="flex-shrink-0" />
        <span className={`text-xs font-semibold truncate ${awayWon ? 'text-text font-bold' : 'text-text-secondary'}`}>{match.away}</span>
        {awayWon && <Crown size={12} className="text-wc-gold flex-shrink-0" />}
      </div>
    </div>
  );
}

export function PredictionsPage() {
  const { data: groups, isLoading: gLoading, error: gError } = useGroups();
  const { data: teams, isLoading: tLoading, error: tError } = useTeams();
  const { language } = useAppStore();
  const [isOffline, setIsOffline] = useState(false);
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({
    'predictions.round32': true,
    'predictions.round16': true,
  });

  const isLoading = gLoading || tLoading;
  const error = gError || tError;

  // Offline timeout (API dead — fallback in 6s)
  useEffect(() => {
    if (!isLoading || isOffline) return;
    const timer = setTimeout(() => setIsOffline(true), 6000);
    return () => clearTimeout(timer);
  }, [isLoading, isOffline]);

  useEffect(() => {
    if (error) setIsOffline(true);
  }, [error]);

  /* ─── Build team list for bracket (32 teams: 24 group qualifiers + 8 best 3rd place) ─── */
  const groupStandingsList = useMemo(() => {
    const allTeams: { name: string; flag: string; groupName: string; rank: number; pts: number; gd: number }[] = [];

    // 1. Try real API data first
    if (groups && groups.length > 0 && groups.some(g => g.teams?.length > 0)) {
      const thirdPlaceTeams: typeof allTeams = [];

      groups.forEach((g) => {
        const teamList = [...(g.teams ?? [])];
        const hasStandings = teamList.some(t => t.pts > 0);
        if (hasStandings) {
          teamList.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        } else {
          teamList.sort((a, b) => getFifaRank(a.name_en) - getFifaRank(b.name_en));
        }
        // Top 2 qualify directly
        teamList.slice(0, 2).forEach((t) => {
          allTeams.push({ name: t.name_en, flag: t.flag, groupName: g.name, rank: getFifaRank(t.name_en), pts: t.pts, gd: t.gd });
        });
        // 3rd place teams collected for wildcard
        if (teamList.length >= 3) {
          const third = teamList[2];
          thirdPlaceTeams.push({ name: third.name_en, flag: third.flag, groupName: g.name, rank: getFifaRank(third.name_en), pts: third.pts, gd: third.gd });
        }
      });

      // Sort 3rd place teams and take best 8
      thirdPlaceTeams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || a.rank - b.rank);
      allTeams.push(...thirdPlaceTeams.slice(0, 8));

      if (allTeams.length >= 4) return allTeams;
    }

    // 2. Fallback: static groups + ranking
    const fallback: typeof allTeams = [];
    const thirdPlaceStatic: typeof allTeams = [];

    for (const gName of GROUPS) {
      const staticTeams = STATIC_GROUPS[gName] || [];
      const sorted = [...staticTeams].sort((a, b) => getFifaRank(a) - getFifaRank(b));
      sorted.slice(0, 2).forEach((teamName) => {
        fallback.push({ name: teamName, flag: getFlagPath(teamName), groupName: gName, rank: getFifaRank(teamName), pts: 0, gd: 0 });
      });
      if (sorted.length >= 3) {
        thirdPlaceStatic.push({ name: sorted[2], flag: getFlagPath(sorted[2]), groupName: gName, rank: getFifaRank(sorted[2]), pts: 0, gd: 0 });
      }
    }
    thirdPlaceStatic.sort((a, b) => a.rank - b.rank);
    fallback.push(...thirdPlaceStatic.slice(0, 8));
    return fallback;
  }, [groups]);

  const [bracket, setBracket] = useState<ReturnType<typeof generateBracket>>([]);
  const [hasSimulated, setHasSimulated] = useState(false);

  const handleSimulate = useCallback(() => {
    if (groupStandingsList.length >= 4) {
      setBracket(generateBracket(groupStandingsList, language));
      setHasSimulated(true);
    }
  }, [groupStandingsList, language]);

  /* ─── Collapse toggle ────────────────────────── */
  const togglePhase = (phaseKey: string) => {
    setCollapsedPhases(prev => ({ ...prev, [phaseKey]: !prev[phaseKey] }));
  };

  /* ─── Group previews ───────────────────────────── */
  const groupPreviews = useMemo(() => {
    if (groups && groups.length > 0) {
      return GROUPS.map((gName) => {
        const group = groups.find((g) => g.name === gName);
        const teamList = group?.teams ? [...group.teams] : [];
        const hasStandings = teamList.some(t => t.pts > 0);
        if (hasStandings) {
          teamList.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        } else {
          teamList.sort((a, b) => getFifaRank(a.name_en) - getFifaRank(b.name_en));
        }
        return { name: gName, teams: teamList };
      });
    }
    return GROUPS.map((gName) => {
      const staticTeams = STATIC_GROUPS[gName] || [];
      const sorted = [...staticTeams].sort((a, b) => getFifaRank(a) - getFifaRank(b));
      return {
        name: gName,
        teams: sorted.map((teamName, idx) => ({
          id: idx + 1,
          name_en: teamName,
          flag: getFlagPath(teamName),
          pts: 0, gd: 0, gf: 0,
        })) as any,
      };
    });
  }, [groups]);

  const canSimulate = groupStandingsList.length >= 4;

  // Round keys for collapse tracking
  const roundKeys = ['predictions.round32', 'predictions.round16', 'predictions.quarterFinals', 'predictions.semiFinals', 'predictions.final'];

  /* ─── Loading ─────────────────────────────────── */
  if (isLoading && !isOffline) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card p-4">
              <Skeleton className="h-6 w-20 mb-2" />
              {Array.from({ length: 4 }).map((_, j) => (
                <Skeleton key={j} className="h-8 mb-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Hard error ─────────────────────────────── */
  if (isOffline && groupStandingsList.length === 0 && groupPreviews.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <X size={40} className="mx-auto mb-4 text-wc-red/50" />
        <h3 className="text-lg font-bold text-text mb-2">{t('predictions.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('predictions.title', language)}</h1>
        <p className="text-sm text-text-secondary">{t('predictions.bracketSimDesc', language)}</p>
      </motion.div>

      {/* Offline banner */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warm/10 border border-warm/20 text-sm text-warm font-medium"
        >
          <WifiOff size={16} />
          <span>{t('common.offlineBanner', language)}</span>
        </motion.div>
      )}

      {/* Simulation panel */}
      <div className="glass-card p-6 text-center">
        <Sparkles size={32} className="mx-auto mb-3 text-wc-gold" />
        <h2 className="text-lg font-bold text-text mb-2">{t('predictions.knockoutTitle', language)}</h2>
        <p className="text-sm text-text-secondary max-w-lg mx-auto mb-4">
          {canSimulate
            ? tf('predictions.teamsReady', language, groupStandingsList.length)
            : t('predictions.knockoutDesc', language)}
        </p>
        <button
          onClick={handleSimulate}
          disabled={!canSimulate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wc-blue text-white text-sm font-bold hover:bg-wc-blue/90 transition-all shadow-lg shadow-wc-blue/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <Shuffle size={16} />
          {hasSimulated ? t('predictions.simulateAgain', language) : t('predictions.runSimulation', language)}
        </button>
        {isOffline && (
          <p className="text-xs text-text-secondary mt-2">
            {language === 'es'
              ? 'Usando rankings mundiales para equipos sin partidos jugados'
              : 'Using world rankings for unplayed groups'}
          </p>
        )}
        {!canSimulate && (
          <p className="text-xs text-text-secondary mt-2">
            {tf('predictions.needTeams', language, groupStandingsList.length)}
          </p>
        )}
      </div>

      {/* Bracket display */}
      {bracket.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {bracket.map((round, roundIdx) => {
            const phaseKey = roundKeys[roundIdx] ?? `round_${roundIdx}`;
            const isCollapsed = collapsedPhases[phaseKey] ?? false;

            return (
              <div key={round.round} className="glass-card overflow-hidden">
                <button
                  onClick={() => togglePhase(phaseKey)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className="text-sm font-bold text-text flex items-center gap-2">
                    <Swords size={16} className="text-wc-blue" />
                    {round.round}
                    <span className="text-[10px] text-text-muted font-normal">
                      ({round.matches.length} {language === 'es' ? 'partidos' : 'matches'})
                    </span>
                  </h3>
                  <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-text-muted" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                        {round.matches.map((m, idx) => (
                          <KnockoutMatchCard key={idx} match={m} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Champion banner for final */}
                {round.round === t('predictions.final', language) && round.matches[0]?.winner && (
                  <div className="mx-4 mb-4 p-4 rounded-xl text-center wc-gradient text-white">
                    <Trophy size={32} className="mx-auto mb-2 text-wc-gold" />
                    <p className="text-2xl font-black">
                      <FlagImage flag={round.matches[0].winnerFlag} size="xl" className="inline-block mr-2" />
                      {round.matches[0].winner}
                    </p>
                    <p className="text-xs text-white/60 mt-1">{t('predictions.championLabel', language)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Group stage projections */}
      <section>
        <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-wc-gold" />
          {t('predictions.groupStageProjections', language)}
        </h2>
        <p className="text-xs text-text-secondary mb-3">
          {language === 'es'
            ? 'Top 2 de cada grupo + 8 mejores terceros avanzan a Dieciseisavos'
            : 'Top 2 from each group + 8 best 3rd place advance to Round of 32'}
        </p>
        {groupPreviews.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-text-secondary">{t('predictions.noGroupData', language)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupPreviews.map((gp) => (
              <div key={gp.name} className="glass-card p-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-wc-blue mb-2">
                  {tf('common.groupLabel', language, gp.name)}
                </h3>
                {gp.teams.length === 0 ? (
                  <p className="text-xs text-text-secondary py-2">{t('predictions.noData', language)}</p>
                ) : (
                  <div className="space-y-1">
                    {gp.teams.map((team: any, idx: number) => {
                      const isQualified = idx < 2;
                      const isThirdPlace = idx === 2;
                      const hasStandings = team.pts > 0;
                      return (
                        <div
                          key={team.id || idx}
                          className={`flex items-center gap-2 p-1.5 rounded text-xs ${
                            isQualified ? 'bg-wc-blue/[0.06]' : isThirdPlace ? 'bg-wc-gold/[0.06]' : ''
                          }`}
                        >
                          <span className="w-4 text-center font-bold text-text-secondary">{idx + 1}</span>
                          <span className="text-base"><FlagImage flag={team.flag} size="md" /></span>
                          <span className="truncate flex-1 font-medium text-text">{team.name_en}</span>
                          {hasStandings ? (
                            <span className="font-bold text-wc-blue">{team.pts}</span>
                          ) : (
                            <span className="text-[9px] text-text-muted" title="World ranking">
                              #{getFifaRank(team.name_en)}
                            </span>
                          )}
                          {isQualified && <span className="text-[8px] text-wc-blue/60">✓</span>}
                          {isThirdPlace && <span className="text-[8px] text-wc-gold/60">*</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
