import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin, Users, Globe, X } from 'lucide-react';
import { useStadiums } from '@/hooks/useStadiums';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Stadium } from '@/types/worldcup';

const HOST_COUNTRIES = ['United States', 'Canada', 'Mexico'];

function formatCapacity(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

export function StadiumsPage() {
  const { data: stadiums, isLoading, error } = useStadiums();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const { language } = useAppStore();

  const filtered = useMemo(() => {
    if (!stadiums) return [];
    let result = [...stadiums];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name_en?.toLowerCase().includes(q) ||
          s.city_en?.toLowerCase().includes(q) ||
          s.country_en?.toLowerCase().includes(q)
      );
    }
    if (countryFilter !== 'all') {
      result = result.filter((s) => s.country_en === countryFilter);
    }
    return result;
  }, [stadiums, search, countryFilter]);

  const totalCapacity = useMemo(
    () => stadiums?.reduce((s, st) => s + (st.capacity ?? 0), 0) ?? 0,
    [stadiums]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-4">
              <Skeleton className="h-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center">
        <X size={40} className="mx-auto mb-4 text-wc-red/50" />
        <h3 className="text-lg font-bold text-text mb-2">{t('stadiums.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('stadiums.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('stadiums.subtitleLine', language, stadiums?.length ?? 0, HOST_COUNTRIES.join(', '), formatCapacity(totalCapacity))}
        </p>
      </motion.div>

      {/* Summary KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: t('stadiums.totalVenues', language), value: stadiums?.length ?? 0, icon: Building2, color: '#0033A0' },
          { label: t('stadiums.totalCapacity', language), value: formatCapacity(totalCapacity), icon: Users, color: '#00A859' },
          { label: t('stadiums.hostCountries', language), value: 3, icon: Globe, color: '#F2A900' },
          { label: t('stadiums.cities', language), value: new Set(stadiums?.map((s) => s.city_en) ?? []).size, icon: MapPin, color: '#E4002B' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={t('stadiums.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-wc-blue focus:ring-2 focus:ring-wc-blue/10 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setCountryFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              countryFilter === 'all'
                ? 'bg-wc-blue text-white'
                : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'
            }`}
          >
            {t('stadiums.all', language)}
          </button>
          {HOST_COUNTRIES.map((c) => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                countryFilter === c
                  ? 'bg-wc-blue text-white'
                  : 'bg-card border border-border text-text-secondary hover:bg-wc-blue/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Building2 size={40} className="mx-auto mb-4 text-text-secondary/30" />
          <p className="text-text-secondary font-medium">{t('stadiums.noStadiumsFound', language)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stadium, idx) => (
            <motion.div
              key={stadium.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card-hover p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-text">{stadium.name_en}</h3>
                  <p className="text-[10px] text-text-secondary flex items-center gap-1 mt-0.5">
                    <MapPin size={10} />
                    {stadium.city_en}, {stadium.country_en}
                  </p>
                </div>
                <span className="text-lg">🏟️</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-wc-blue" />
                  <span className="text-sm font-bold text-text">{formatCapacity(stadium.capacity)}</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-wc-blue/5 text-wc-blue">
                  {stadium.country_en}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
