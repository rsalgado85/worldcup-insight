import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';
import { Skeleton } from '@/components/common/Skeleton';
import { GROUPS } from '@/constants';

export function StandingsPage() {
  const { data: groups, isLoading, error } = useGroups();
  const [activeGroup, setActiveGroup] = useState<string>('A');

  const standings = useMemo(() => {
    if (!groups) return [];
    const group = groups.find((g: { name: string }) => g.name === activeGroup);
    return group?.teams?.sort((a: { pts: number; gd: number; gf: number }, b: { pts: number; gd: number; gf: number }) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf) ?? [];
  }, [groups, activeGroup]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 rounded-2xl" /></div>;
  if (error) return <div className="glass-card p-12 text-center"><p className="text-wc-red font-semibold">Failed to load standings</p></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Standings</h1>
        <p className="text-sm text-text-secondary">Group stage standings for all 12 groups</p>
      </motion.div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {GROUPS.map((g) => (
          <button key={g} onClick={() => setActiveGroup(g)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 ${activeGroup === g ? 'bg-wc-blue text-white shadow-lg shadow-wc-blue/25' : 'bg-card text-text-secondary hover:bg-wc-blue/5 border border-border'}`}>
            Group {g}
          </button>
        ))}
      </div>

      {standings.length === 0 ? (
        <div className="glass-card p-12 text-center"><Trophy size={40} className="mx-auto mb-4 text-text-secondary/30" /><p className="text-text-secondary font-medium">No standings data for Group {activeGroup}</p></div>
      ) : (
        <motion.div key={activeGroup} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-x-auto">
          <table className="wc-table">
            <thead><tr><th className="w-10">#</th><th>Team</th><th className="text-center">PTS</th><th className="text-center">MP</th><th className="text-center">W</th><th className="text-center">D</th><th className="text-center">L</th><th className="text-center">GF</th><th className="text-center">GA</th><th className="text-center">GD</th><th className="text-center">Form</th></tr></thead>
            <tbody>
              {standings.map((team: { id: number; flag: string; name_en: string; fifa_code: string; pts: number; mp: number; w: number; d: number; l: number; gf: number; ga: number; gd: number }, idx: number) => (
                <tr key={team.id} className={`${idx === 0 ? 'bg-wc-gold/5' : idx === 1 ? 'bg-wc-blue/[0.02]' : ''} transition-colors`}>
                  <td className="text-center">{idx === 0 ? <Trophy size={16} className="text-wc-gold inline" /> : idx === 1 ? <span className="font-bold text-text-secondary">2</span> : <span className="text-text-secondary">{idx + 1}</span>}</td>
                  <td><div className="flex items-center gap-2.5"><span className="text-xl">{team.flag}</span><div><p className="text-sm font-bold text-text">{team.name_en}</p><p className="text-[10px] text-text-secondary/60">{team.fifa_code}</p></div></div></td>
                  <td className="text-center"><span className="font-black text-wc-blue text-base">{team.pts}</span></td>
                  <td className="text-center text-sm">{team.mp}</td><td className="text-center text-sm text-wc-green font-semibold">{team.w}</td><td className="text-center text-sm">{team.d}</td><td className="text-center text-sm text-wc-red font-semibold">{team.l}</td>
                  <td className="text-center text-sm">{team.gf}</td><td className="text-center text-sm">{team.ga}</td>
                  <td className="text-center"><span className={`text-sm font-bold ${team.gd > 0 ? 'text-wc-green' : team.gd < 0 ? 'text-wc-red' : 'text-text-secondary'}`}>{team.gd > 0 ? '+' : ''}{team.gd}</span></td>
                  <td className="text-center"><div className="flex items-center justify-center gap-0.5">{Array.from({ length: Math.min(team.mp, 5) }).map((_, i) => <div key={i} className={`w-2.5 h-2.5 rounded-sm ${i < team.w ? 'bg-wc-green' : 'bg-border'}`} />)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      <div className="flex items-center gap-6 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-wc-gold/20 border border-wc-gold/30" /><span>Group Winner</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-wc-blue/10 border border-wc-blue/20" /><span>Runner-up</span></div>
        <div><span className="font-bold">PTS</span> Points • <span className="font-bold">MP</span> Played • <span className="font-bold">GD</span> Goal Diff</div>
      </div>
    </div>
  );
}
