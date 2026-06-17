import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Flag, MapPin, Trophy, X } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Team } from '@/types/worldcup';

const CONTINENT_MAP: Record<string, { name: string; color: string }> = {
  UEFA: { name: 'Europe', color: '#0033A0' },
  CONMEBOL: { name: 'South America', color: '#00A859' },
  CONCACAF: { name: 'North America', color: '#E4002B' },
  CAF: { name: 'Africa', color: '#F2A900' },
  AFC: { name: 'Asia', color: '#6366F1' },
  OFC: { name: 'Oceania', color: '#14B8A6' },
};

function getContinent(team: Team): string {
  const code = team.fifa_code?.toUpperCase() || '';
  const southAmericanCodes = ['ARG', 'BRA', 'URU', 'COL', 'CHI', 'PER', 'ECU', 'PAR', 'BOL', 'VEN'];
  const northAmericanCodes = ['USA', 'MEX', 'CAN', 'CRC', 'PAN', 'JAM', 'HON', 'SLV', 'TRI', 'GUA', 'HAI', 'CUB', 'SUR', 'GUY', 'NCA', 'BLZ', 'DMA', 'GRN', 'ATG', 'VIN', 'LCA', 'SKN', 'BRB', 'BAH', 'BER', 'CUR', 'ARU', 'CAY'];
  const africanCodes = ['MAR', 'SEN', 'TUN', 'NGA', 'ALG', 'EGY', 'CMR', 'CIV', 'GHA', 'MLI', 'BFA', 'RSA', 'COD', 'CPV', 'GUI', 'ZAM', 'GAB', 'BEN', 'EQG', 'UGA', 'ANG', 'TOG', 'MOZ', 'LBY', 'SUD', 'KEN', 'NAM', 'MAD', 'MWI', 'ZIM', 'GAM', 'CGO', 'TAN', 'SLE', 'NIG', 'BOT', 'LBR', 'MRI', 'SOM', 'CAF', 'BDI', 'LES', 'SWZ', 'SEY', 'DJI', 'CHA', 'RWA', 'ETH', 'ERI', 'STP', 'COM'];
  const asianCodes = ['JPN', 'KOR', 'IRN', 'AUS', 'KSA', 'QAT', 'UAE', 'IRQ', 'UZB', 'CHN', 'OMA', 'BHR', 'JOR', 'SYR', 'PLE', 'VIE', 'THA', 'PRK', 'KGZ', 'TJK', 'LBN', 'IND', 'TKM', 'KUW', 'PHI', 'HKG', 'SIN', 'AFG', 'MYA', 'MDV', 'YEM', 'NEP', 'CAM', 'BAN', 'TPE', 'MGL', 'LAO', 'BHU', 'BRU', 'TLS', 'PAK', 'SRI'];
  const europeanCodes = ['ENG', 'FRA', 'GER', 'ESP', 'ITA', 'NED', 'POR', 'BEL', 'CRO', 'SUI', 'DEN', 'SRB', 'POL', 'UKR', 'SWE', 'WAL', 'SCO', 'NOR', 'AUT', 'CZE', 'HUN', 'TUR', 'ROU', 'GRE', 'SVK', 'IRL', 'NIR', 'ISL', 'SVN', 'BIH', 'GEO', 'ALB', 'MKD', 'MNE', 'LUX', 'LTU', 'LVA', 'EST', 'BLR', 'MDA', 'ARM', 'AZE', 'KAZ', 'ISR', 'CYP', 'MLT', 'AND', 'LIE', 'SMR', 'GIB', 'FRO', 'KOS'];
  if (southAmericanCodes.includes(code)) return 'CONMEBOL';
  if (northAmericanCodes.includes(code)) return 'CONCACAF';
  if (africanCodes.includes(code)) return 'CAF';
  if (asianCodes.includes(code)) return 'AFC';
  if (europeanCodes.includes(code)) return 'UEFA';
  if (code === 'NZL' || ['FIJ', 'SOL', 'PNG', 'TAH', 'VAN', 'SAM', 'COK', 'TGA'].includes(code)) return 'OFC';
  return 'UEFA';
}

export function CountriesPage() {
  const { data: teams, isLoading, error } = useTeams();
  const [search, setSearch] = useState('');
  const [confedFilter, setConfedFilter] = useState<string>('all');
  const { language } = useAppStore();

  const grouped = useMemo(() => {
    if (!teams) return [];
    let result = [...teams];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.name_en?.toLowerCase().includes(q) || t.fifa_code?.toLowerCase().includes(q));
    }
    if (confedFilter !== 'all') {
      result = result.filter((t) => getContinent(t) === confedFilter);
    }
    return result;
  }, [teams, search, confedFilter]);

  const confederationCounts = useMemo(() => {
    if (!teams) return {};
    const counts: Record<string, number> = {};
    teams.forEach((t) => {
      const c = getContinent(t);
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [teams]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="glass-card p-4"><Skeleton className="h-20" /></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center">
        <X size={40} className="mx-auto mb-4 text-wc-red/50" />
        <h3 className="text-lg font-bold text-text mb-2">{t('countries.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('countries.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('countries.subtitleLine', language, teams?.length ?? 0, Object.keys(confederationCounts).length)}
        </p>
      </motion.div>

      {/* Confederation Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(confederationCounts).map(([conf, count]) => {
          const info = CONTINENT_MAP[conf] || { name: conf, color: '#64748B' };
          return (
            <motion.div
              key={conf}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="kpi-card text-center"
            >
              <Globe size={20} className="mx-auto mb-1" style={{ color: info.color }} />
              <span className="kpi-value text-lg" style={{ color: info.color }}>{count}</span>
              <span className="text-[10px] text-text-secondary">{info.name}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={t('countries.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-wc-blue focus:ring-2 focus:ring-wc-blue/10 transition-all"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setConfedFilter('all')}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              confedFilter === 'all' ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'
            }`}
          >
            {t('countries.all', language)}
          </button>
          {Object.keys(CONTINENT_MAP).map((c) => (
            <button
              key={c}
              onClick={() => setConfedFilter(c)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                confedFilter === c ? 'bg-wc-blue text-white' : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'
              }`}
            >
              {CONTINENT_MAP[c].name}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Flag size={40} className="mx-auto mb-4 text-text-secondary/30" />
          <p className="text-text-secondary font-medium">{t('countries.noCountriesFound', language)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {grouped.map((team, idx) => {
            const conf = getContinent(team);
            const info = CONTINENT_MAP[conf] || { name: conf, color: '#64748B' };
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="glass-card-hover p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{team.flag || '🏳'}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-text truncate">{team.name_en}</h3>
                    <p className="text-[10px] font-semibold text-wc-blue uppercase">{team.fifa_code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-secondary pt-3 border-t border-border">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {tf('common.groupLabel', language, team.groups || team.group || '—')}
                  </span>
                  <span
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ backgroundColor: `${info.color}15`, color: info.color }}
                  >
                    <Globe size={10} />
                    {info.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
