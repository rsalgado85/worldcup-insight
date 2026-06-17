import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Flag, MapPin, Trophy, X } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { FlagImage } from '@/components/common/FlagImage';
import { getLocalFlag, getCrestPath, getCrestFallback } from '@/constants/crests';
import { useAppStore } from '@/store/useAppStore';
import { GROUP_COLORS } from '@/constants';
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

  // ─── Loading ───────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-5 w-80" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="kpi-card text-center space-y-1">
              <Skeleton className="h-5 w-5 mx-auto rounded-full" />
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-16 mx-auto" />
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────
  if (error) {
    return (
      <div className="card p-12 text-center">
        <X size={48} className="mx-auto mb-4 text-live" />
        <h3 className="text-lg font-bold text-text mb-2">{t('countries.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('countries.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('countries.subtitleLine', language, teams?.length ?? 0, Object.keys(confederationCounts).length)}
        </p>
      </motion.div>

      {/* Confederation Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
      >
        {Object.entries(confederationCounts).map(([conf, count]) => {
          const info = CONTINENT_MAP[conf] || { name: conf, color: '#64748B' };
          return (
            <motion.div
              key={conf}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="kpi-card text-center"
            >
              <Globe size={20} className="mx-auto mb-1" style={{ color: info.color }} />
              <span className="block text-xl font-black" style={{ color: info.color }}>{count}</span>
              <span className="text-[10px] text-text-secondary font-medium">{info.name}</span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder={t('countries.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setConfedFilter('all')}
            className={`filter-pill ${confedFilter === 'all' ? 'active' : ''}`}
          >
            {t('countries.all', language)}
          </button>
          {Object.keys(CONTINENT_MAP).map((c) => (
            <button
              key={c}
              onClick={() => setConfedFilter(c)}
              className={`filter-pill ${confedFilter === c ? 'active' : ''}`}
              style={confedFilter === c ? { background: CONTINENT_MAP[c].color, borderColor: CONTINENT_MAP[c].color } : undefined}
            >
              {CONTINENT_MAP[c].name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Empty state */}
      {grouped.length === 0 ? (
        <div className="card p-12 text-center">
          <Flag size={40} className="mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary font-medium">{t('countries.noCountriesFound', language)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {grouped.map((team, idx) => {
            const conf = getContinent(team);
            const info = CONTINENT_MAP[conf] || { name: conf, color: '#64748B' };
            const group = team.groups || team.group || '—';
            const groupColor = GROUP_COLORS[group] || info.color;
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Crest with fallback */}
                  {team.fifa_code ? (
                    <img
                      src={getCrestPath(team.fifa_code)}
                      alt={team.name_en}
                      className="w-10 h-10 object-contain rounded-lg bg-primary-subtle p-0.5"
                      onError={(e) => {
                        const fallback = getCrestFallback(team.fifa_code!);
                        const img = e.target as HTMLImageElement;
                        if (img.src !== fallback) {
                          img.src = fallback;
                        } else {
                          img.style.display = 'none';
                        }
                      }}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary-subtle flex items-center justify-center">
                      <FlagImage flag={team.flag} size="md" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-black text-text truncate">{team.name_en}</h3>
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{team.fifa_code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-secondary pt-3 border-t border-divider">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {tf('common.groupLabel', language, group)}
                  </span>
                  <span
                    className="badge flex items-center gap-1"
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
