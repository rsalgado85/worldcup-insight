import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, MapPin, Users, Globe, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStadiums } from '@/hooks/useStadiums';
import { Skeleton } from '@/components/common/Skeleton';
import { t, tf } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import type { Stadium } from '@/types/worldcup';

const HOST_COUNTRIES = ['United States', 'Canada', 'Mexico'];

/* ─── Map API stadium name → image filename ─────────── */
const STADIUM_IMAGE_MAP: Record<string, string> = {
  'estadio azteca': 'estadio-azteca',
  'metlife': 'metlife',
  'at&t': 'att',
  'sofi': 'sofi',
  'arrowhead': 'arrowhead',
  'levi': 'levis',
  'nrg': 'nrg',
  'lincoln financial': 'lincoln-financial',
  'mercedes-benz': 'mercedes-benz',
  'mercedes benz': 'mercedes-benz',
  'lumen': 'lumen',
  'hard rock': 'hard-rock',
  'gillette': 'gillette',
  'bc place': 'bc-place',
  'bbva': 'bbva',
  'akron': 'akron',
  'bmo': 'bmo',
};

function getStadiumImage(name: string): string {
  const lower = name.toLowerCase();
  for (const [key, filename] of Object.entries(STADIUM_IMAGE_MAP)) {
    if (lower.includes(key)) return `/images/stadiums/${filename}.jpg`;
  }
  return '';
}

/* ─── Helpers ───────────────────────────────────────── */
function formatCapacity(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

/* ═══════════════════════════════════════════════════════ */
export function StadiumsPage() {
  const { data: stadiums, isLoading, error } = useStadiums();
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState<string>('all');
  const { language } = useAppStore();

  /* ─── Carousel state ──────────────────────────────── */
  const [carouselIdx, setCarouselIdx] = useState(0);

  const carouselImages = useMemo(() => {
    if (!stadiums) return [];
    return stadiums
      .map((s) => ({ src: getStadiumImage(s.name_en), name: s.name_en, city: s.city_en, country: s.country_en }))
      .filter((img) => img.src);
  }, [stadiums]);

  const goNext = useCallback(() => {
    setCarouselIdx((prev) => (prev + 1) % carouselImages.length);
  }, [carouselImages.length]);

  const goPrev = useCallback(() => {
    setCarouselIdx((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, [carouselImages.length]);

  // Auto-rotate every 5s
  useEffect(() => {
    if (carouselImages.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length, goNext]);

  /* ─── Filtered stadiums ────────────────────────────── */
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

  /* ─── Loading state ────────────────────────────────── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="kpi-card">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-5 w-32 mt-3" />
              <Skeleton className="h-3 w-24 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Error state ──────────────────────────────────── */
  if (error) {
    return (
      <div className="card p-12 text-center">
        <X size={40} className="mx-auto mb-4 text-live/50" />
        <h3 className="text-lg font-bold text-text mb-2">{t('stadiums.failedLoad', language)}</h3>
        <p className="text-text-secondary text-sm">{t('common.errorCheck', language)}</p>
      </div>
    );
  }

  /* ─── KPI data ─────────────────────────────────────── */
  const kpiCards = [
    { label: t('stadiums.totalVenues', language), value: stadiums?.length ?? 0, icon: Building2, color: 'var(--color-primary)' },
    { label: t('stadiums.totalCapacity', language), value: formatCapacity(totalCapacity), icon: Users, color: 'var(--color-primary-light)' },
    { label: t('stadiums.hostCountries', language), value: 3, icon: Globe, color: 'var(--color-warm)' },
    { label: t('stadiums.cities', language), value: new Set(stadiums?.map((s) => s.city_en) ?? []).size, icon: MapPin, color: 'var(--color-live)' },
  ];

  return (
    <div className="space-y-8">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gradient">{t('stadiums.title', language)}</h1>
        <p className="text-sm text-text-secondary">
          {tf('stadiums.subtitleLine', language, stadiums?.length ?? 0, HOST_COUNTRIES.join(', '), formatCapacity(totalCapacity))}
        </p>
      </motion.div>

      {/* ═══ KPI Summary Row ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpiCards.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {kpi.label}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${kpi.color}15` }}
              >
                <kpi.icon size={15} style={{ color: kpi.color }} />
              </div>
            </div>
            <p className="text-2xl font-black text-text" style={{ color: kpi.color }}>
              {kpi.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ═══ Image Carousel ═══ */}
      {carouselImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl bg-card border border-border shadow-elevated"
        >
          {/* Carousel track */}
          <div className="relative aspect-[21/9] sm:aspect-[21/8] bg-black/10">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIdx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img
                  src={carouselImages[carouselIdx].src}
                  alt={carouselImages[carouselIdx].name}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-1">
                    {carouselImages[carouselIdx].name}
                  </h3>
                  <p className="text-sm text-white/70 flex items-center gap-1.5">
                    <MapPin size={13} />
                    {carouselImages[carouselIdx].city}, {carouselImages[carouselIdx].country}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 flex items-center justify-center text-white transition-all z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 flex items-center justify-center text-white transition-all z-10"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === carouselIdx ? 'bg-white w-5' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══ Filters ═══ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder={t('stadiums.searchPlaceholder', language)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-text placeholder:text-text-secondary/50 focus:outline-none focus:border-primary-light focus:ring-2 focus:ring-primary-subtle transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setCountryFilter('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              countryFilter === 'all'
                ? 'bg-primary text-text-on-primary'
                : 'bg-card border border-border text-text-secondary hover:bg-primary-subtle'
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
                  ? 'bg-primary text-text-on-primary'
                  : 'bg-card border border-border text-text-secondary hover:bg-primary-subtle'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Empty state ═══ */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Building2 size={40} className="mx-auto mb-4 text-text-secondary/30" />
          <p className="text-text-secondary font-medium">{t('stadiums.noStadiumsFound', language)}</p>
        </div>
      ) : (
        /* ═══ Stadium Cards Grid ═══ */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stadium, idx) => {
            const imgSrc = getStadiumImage(stadium.name_en);
            return (
              <motion.div
                key={stadium.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card overflow-hidden group"
              >
                {/* Stadium Image */}
                {imgSrc ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imgSrc}
                      alt={stadium.name_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="badge px-2.5 py-1 bg-black/50 backdrop-blur text-white text-[10px] font-bold">
                        🏟️ Host City
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-primary-subtle flex items-center justify-center">
                    <Building2 size={48} className="text-text-muted/30" />
                  </div>
                )}

                {/* Card body */}
                <div className="p-4">
                  <h3 className="text-sm font-black text-text mb-1.5 truncate">
                    {stadium.name_en}
                  </h3>
                  <p className="text-xs text-text-secondary flex items-center gap-1 mb-3">
                    <MapPin size={11} />
                    {stadium.city_en}, {stadium.country_en}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-divider">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-primary-light" />
                      <span className="text-sm font-bold text-text">
                        {formatCapacity(stadium.capacity)}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        {t('stadiums.capacity', language)}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-subtle text-primary">
                      {stadium.country_en}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
