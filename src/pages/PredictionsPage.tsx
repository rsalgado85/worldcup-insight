import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Shuffle, Trophy, ChevronRight, Swords, X,
} from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { GROUPS } from '@/constants';
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
  if (groupStandings.length < 32) return [];
  const seeds = [...groupStandings].sort(() => Math.random() - 0.5);
  const r32 = [];
  for (let i = 0; i < 16; i++) {
    const h = seeds[i * 2]; const a = seeds[i * 2 + 1];
    const result = simulateKnockoutMatch(h.name, a.name, h.flag, a.flag);
    r32.push({ home: h.name, away: a.name, homeFlag: h.flag, awayFlag: a.flag, winner: result.winner, winnerFlag: result.flag });
  }
  const r16winners = r32.map((m) => ({ name: m.winner!, flag: m.winnerFlag! }));
  const r16 = [];
  for (let i = 0; i < 8; i++) {
    const result = simulateKnockoutMatch(r16winners[i * 2].name, r16winners[i * 2 + 1].name, r16winners[i * 2].flag, r16winners[i * 2 + 1].flag);
    r16.push({ home: r16winners[i * 2].name, away: r16winners[i * 2 + 1].name, homeFlag: r16winners[i * 2].flag, awayFlag: r16winners[i * 2 + 1].flag, winner: result.winner, winnerFlag: result.flag });
  }
  const qfwinners = r16.map((m) => ({ name: m.winner!, flag: m.winnerFlag! }));
  const qf = [];
  for (let i = 0; i < 4; i++) {
    const result = simulateKnockoutMatch(qfwinners[i * 2].name, qfwinners[i * 2 + 1].name, qfwinners[i * 2].flag, qfwinners[i * 2 + 1].flag);
    qf.push({ home: qfwinners[i * 2].name, away: qfwinners[i * 2 + 1].name, homeFlag: qfwinners[i * 2].flag, awayFlag: qfwinners[i * 2 + 1].flag, winner: result.winner, winnerFlag: result.flag });
  }
  const sfwinners = qf.map((m) => ({ name: m.winner!, flag: m.winnerFlag! }));
  const sf = [];
  for (let i = 0; i < 2; i++) {
    const result = simulateKnockoutMatch(sfwinners[i * 2].name, sfwinners[i * 2 + 1].name, sfwinners[i * 2].flag, sfwinners[i * 2 + 1].flag);
    sf.push({ home: sfwinners[i * 2].name, away: sfwinners[i * 2 + 1].name, homeFlag: sfwinners[i * 2].flag, awayFlag: sfwinners[i * 2 + 1].flag, winner: result.winner, winnerFlag: result.flag });
  }
  const fwinners = sf.map((m) => ({ name: m.winner!, flag: m.winnerFlag! }));
  const finalResult = simulateKnockoutMatch(fwinners[0].name, fwinners[1].name, fwinners[0].flag, fwinners[1].flag);
  const finalMatch = { home: fwinners[0].name, away: fwinners[1].name, homeFlag: fwinners[0].flag, awayFlag: fwinners[1].flag, winner: finalResult.winner, winnerFlag: finalResult.flag };
  return [
    { round: t('predictions.round32', language), matches: r32 },
    { round: t('predictions.round16', language), matches: r16 },
    { round: t('predictions.quarterFinals', language), matches: qf },
    { round: t('predictions.semiFinals', language), matches: sf },
    { round: t('predictions.final', language), matches: [finalMatch] },
  ];
}

function KnockoutMatchCard({ match, isLast }: { match: { home: string; away: string; homeFlag: string; awayFlag: string; winner?: string; winnerFlag?: string }; isLast: boolean }) {
  const homeWon = match.winner === match.home;
  const awayWon = match.winner === match.away;
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${match.winner ? 'bg-wc-blue/[0.03]' : ''}`}>
      <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
        <span className={`text-xs font-semibold truncate ${homeWon ? 'text-text font-bold' : 'text-text-secondary'}`}>{match.home}</span>
        <span className="text-base flex-shrink-0">{match.homeFlag || '🏳'}</span>
      </div>
      <div className="flex-shrink-0 mx-2">
        {match.winner ? (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-wc-blue/10 text-wc-blue">W</span>
        ) : (
          <span className="text-[9px] text-text-secondary/40">vs</span>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <span className="text-base flex-shrink-0">{match.awayFlag || '🏳'}</span>
        <span className={`text-xs font-semibold truncate ${awayWon ? 'text-text font-bold' : 'text-text-secondary'}`}>{match.away}</span>
      </div>
    </div>
  );
}

export function PredictionsPage() {
  const { data: groups, isLoading: gLoading, error: gError } = useGroups();
  const { data: teams, isLoading: tLoading, error: tError } = useTeams();
  const { language } = useAppStore();

  const isLoading = gLoading || tLoading;
  const error = gError || tError;

  const groupStandingsList = useMemo(() => {
    if (!groups) return [];
    const result: { name: string; flag: string }[] = [];
    groups.forEach((g) => {
      const teams = [...(g.teams ?? [])].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
      teams.slice(0, 2).forEach((t) => { result.push({ name: t.name_en, flag: t.flag }); });
    });
    return result;
  }, [groups]);

  const [bracket, setBracket] = useState<ReturnType<typeof generateBracket>>([]);
  const [hasSimulated, setHasSimulated] = useState(false);

  const handleSimulate = useCallback(() => {
    if (groupStandingsList.length >= 32) {
      setBracket(generateBracket(groupStandingsList, language));
      setHasSimulated(true);
    }
  }, [groupStandingsList, language]);

  const groupPreviews = useMemo(() => {
    if (!groups) return [];
    return GROUPS.map((gName) => {
      const group = groups.find((g) => g.name === gName);
      return { name: gName, teams: group?.teams ? [...group.teams].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf) : [] };
    });
  }, [groups]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card p-4"><Skeleton className="h-6 w-20 mb-2" />{Array.from({ length: 4 }).map((_, j) => (<Skeleton key={j} className="h-8 mb-1" />))}</div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('predictions.title', language)}</h1>
        <p className="text-sm text-text-secondary">{t('predictions.bracketSimDesc', language)}</p>
      </motion.div>

      <div className="glass-card p-6 text-center">
        <Sparkles size={32} className="mx-auto mb-3 text-wc-gold" />
        <h2 className="text-lg font-bold text-text mb-2">{t('predictions.knockoutTitle', language)}</h2>
        <p className="text-sm text-text-secondary max-w-lg mx-auto mb-4">{t('predictions.knockoutDesc', language)}</p>
        <button
          onClick={handleSimulate}
          disabled={groupStandingsList.length < 32}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-wc-blue text-white text-sm font-bold hover:bg-wc-blue/90 transition-all shadow-lg shadow-wc-blue/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shuffle size={16} />
          {hasSimulated ? t('predictions.simulateAgain', language) : t('predictions.runSimulation', language)}
        </button>
        {groupStandingsList.length < 32 && (
          <p className="text-xs text-text-secondary mt-2">{tf('predictions.needTeams', language, groupStandingsList.length)}</p>
        )}
      </div>

      {bracket.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {bracket.map((round) => (
            <div key={round.round} className="glass-card p-4">
              <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2"><Swords size={16} className="text-wc-blue" />{round.round}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {round.matches.map((m, idx) => (<KnockoutMatchCard key={idx} match={m} isLast={idx === round.matches.length - 1} />))}
              </div>
              {round.round === t('predictions.final', language) && round.matches[0]?.winner && (
                <div className="mt-4 p-4 rounded-xl text-center wc-gradient text-white">
                  <Trophy size={32} className="mx-auto mb-2 text-wc-gold" />
                  <p className="text-2xl font-black"><span className="text-3xl mr-2">{round.matches[0].winnerFlag}</span>{round.matches[0].winner}</p>
                  <p className="text-xs text-white/60 mt-1">{t('predictions.championLabel', language)}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}

      <section>
        <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2"><Trophy size={20} className="text-wc-gold" />{t('predictions.groupStageProjections', language)}</h2>
        {groupPreviews.length === 0 ? (
          <div className="glass-card p-8 text-center"><p className="text-text-secondary">{t('predictions.noGroupData', language)}</p></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {groupPreviews.map((gp) => (
              <div key={gp.name} className="glass-card p-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-wc-blue mb-2">{tf('common.groupLabel', language, gp.name)}</h3>
                {gp.teams.length === 0 ? (
                  <p className="text-xs text-text-secondary py-2">{t('predictions.noData', language)}</p>
                ) : (
                  <div className="space-y-1">
                    {gp.teams.map((team, idx) => (
                      <div key={team.id || idx} className={`flex items-center gap-2 p-1.5 rounded text-xs ${idx < 2 ? 'bg-wc-blue/[0.04]' : ''}`}>
                        <span className="w-4 text-center font-bold text-text-secondary">{idx + 1}</span>
                        <span className="text-base">{<FlagImage flag={team.flag} size="md" />}</span>
                        <span className="truncate flex-1 font-medium text-text">{team.name_en}</span>
                        <span className="font-bold text-wc-blue">{team.pts}</span>
                      </div>
                    ))}
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
