import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';
import { TrendingUp, BarChart3, PieChartIcon, Activity, X } from 'lucide-react';
import { useMatches } from '@/hooks/useMatches';
import { useTeams } from '@/hooks/useTeams';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { GROUP_COLORS, GROUPS } from '@/constants';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Match } from '@/types/worldcup';

const RADIAN = Math.PI / 180;

export function StatisticsPage() {
  const { data: matches, isLoading: mLoading, error: mError } = useMatches();
  const { data: teams, isLoading: tLoading, error: tError } = useTeams();
  const { data: groups, isLoading: gLoading, error: gError } = useGroups();
  const { language } = useAppStore();

  const isLoading = mLoading || tLoading || gLoading;
  const error = mError || tError || gError;

  const stats = useMemo(() => {
    if (!matches) return null;

    const finished = matches.filter((m: Match) => m.finished);

    const totalGoals = finished.reduce((s: number, m: Match) => s + (m.home_score ?? 0) + (m.away_score ?? 0), 0);
    const avgGoals = finished.length ? (totalGoals / finished.length).toFixed(1) : '0';

    // Goals by group
    const groupGoals: Record<string, number> = {};
    GROUPS.forEach((g) => { groupGoals[g] = 0; });
    finished.forEach((m: Match) => {
      if (m.group && groupGoals[m.group] !== undefined) {
        groupGoals[m.group] += (m.home_score ?? 0) + (m.away_score ?? 0);
      }
    });
    const goalsByGroup = GROUPS.map((g) => ({ name: `G${g}`, goals: groupGoals[g], color: GROUP_COLORS[g] }));

    // Goals by matchday
    const matchdayMap: Record<number, number> = {};
    finished.forEach((m: Match) => {
      if (m.matchday != null) {
        matchdayMap[m.matchday] = (matchdayMap[m.matchday] || 0) + (m.home_score ?? 0) + (m.away_score ?? 0);
      }
    });
    const goalsByMatchday = Object.entries(matchdayMap)
      .map(([md, goals]) => ({ name: `MD ${md}`, goals }))
      .sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

    // Result distribution
    let homeWins = 0, awayWins = 0, draws = 0;
    finished.forEach((m: Match) => {
      const hs = m.home_score ?? 0;
      const as = m.away_score ?? 0;
      if (hs > as) homeWins++;
      else if (as > hs) awayWins++;
      else draws++;
    });
    const resultDist = [
      { name: t('stats.homeWins', language), value: homeWins, color: '#0033A0' },
      { name: t('stats.draws', language), value: draws, color: '#F2A900' },
      { name: t('stats.awayWins', language), value: awayWins, color: '#E4002B' },
    ];

    // Group stage progress
    const groupProgress = groups
      ? groups.map((g) => ({
          name: `G${g.name}`,
          played: g.teams?.reduce((s, t) => s + (t.mp || 0), 0) ?? 0,
          total: (g.teams?.length ?? 0) * 3,
        }))
      : [];

    return {
      totalMatches: matches.length,
      finishedMatches: finished.length,
      totalGoals,
      avgGoals,
      goalsByGroup,
      goalsByMatchday: goalsByMatchday.slice(0, 14),
      resultDist,
      groupProgress,
    };
  }, [matches, groups, language]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="kpi-card"><Skeleton className="h-4 w-20" /><Skeleton className="h-8 w-24" /></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center">
        <X size={40} className="mx-auto mb-4 text-wc-red/50" />
        <h3 className="text-lg font-bold text-text mb-2">{t('stats.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('stats.title', language)}</h1>
        <p className="text-sm text-text-secondary">{t('stats.comprehensive', language)}</p>
      </motion.div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t('stats.totalMatches', language), value: stats.totalMatches, icon: BarChart3, color: '#0033A0' },
            { label: t('stats.finished', language), value: stats.finishedMatches, icon: Activity, color: '#00A859' },
            { label: t('stats.totalGoals', language), value: stats.totalGoals, icon: TrendingUp, color: '#E4002B' },
            { label: t('stats.avgGoalsMatch', language), value: stats.avgGoals, icon: PieChartIcon, color: '#F2A900' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="kpi-card"
            >
              <div className="flex items-center justify-between">
                <span className="kpi-label">{kpi.label}</span>
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${kpi.color}10`, color: kpi.color }}>
                  <kpi.icon size={16} />
                </div>
              </div>
              <span className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</span>
            </motion.div>
          ))}
        </div>
      )}

      {!stats || stats.totalMatches === 0 ? (
        <div className="glass-card p-12 text-center">
          <BarChart3 size={40} className="mx-auto mb-4 text-text-secondary/30" />
          <p className="text-text-secondary font-medium">{t('stats.noDataYet', language)}</p>
        </div>
      ) : (
        <>
          {/* Goals by Group */}
          <section>
            <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-wc-blue" />
              {t('stats.goalsByGroup', language)}
            </h2>
            <div className="glass-card p-4">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.goalsByGroup}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Bar dataKey="goals" radius={[6, 6, 0, 0]}>
                    {stats.goalsByGroup.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Result Distribution */}
            <section>
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <PieChartIcon size={20} className="text-wc-red" />
                {t('stats.resultDistribution', language)}
              </h2>
              <div className="glass-card p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.resultDist}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const r = (outerRadius ?? 90) + 25;
                        const angle = midAngle ?? 0;
                        const x = (cx ?? 0) + r * Math.cos(-angle * RADIAN);
                        const y = (cy ?? 0) + r * Math.sin(-angle * RADIAN);
                        const pct = percent ?? 0;
                        return (
                          <text x={x} y={y} textAnchor={x > (cx ?? 0) ? 'start' : 'end'} dominantBaseline="central" fill="var(--color-text)" fontSize={11}>
                            {`${(pct * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {stats.resultDist.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Goals by Matchday */}
            <section>
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-wc-green" />
                {t('stats.goalsByMatchday', language)}
              </h2>
              <div className="glass-card p-4">
                {stats.goalsByMatchday.length === 0 ? (
                  <div className="flex items-center justify-center h-[280px] text-text-secondary text-sm">
                    {t('stats.noMatchdayData', language)}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={stats.goalsByMatchday}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-secondary)' }} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '0.75rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="goals"
                        stroke="#0033A0"
                        strokeWidth={2}
                        dot={{ fill: '#0033A0', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>

          {/* Group Stage Progress */}
          {stats.groupProgress && stats.groupProgress.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <Activity size={20} className="text-wc-blue" />
                {t('stats.groupStageProgress', language)}
              </h2>
              <div className="glass-card p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.groupProgress} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" domain={[0, 'dataMax']} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} width={40} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem',
                      }}
                      formatter={(value) => [tf('stats.matchesPlayed', language, value as number), t('stats.played', language)]}
                    />
                    <Bar dataKey="played" fill="#0033A0" radius={[0, 6, 6, 0]} />
                    <Bar dataKey="total" fill="var(--color-border)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
