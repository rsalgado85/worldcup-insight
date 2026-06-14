import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug,
  Search,
  X,
  MapPin,
  Package,
  Skull,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

/* ─── API Types ────────────────────────────────────── */

interface CreatureEntry {
  id: number;
  name: string;
  category: 'creatures' | 'monsters';
  description: string;
  image: string;
  common_locations: string[] | null;
  drops: string[] | null;
  cooking_effect?: string;
  healable?: boolean;
}

interface ApiResponse {
  data: CreatureEntry[];
}

interface CreatureStats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
  total: number;
}

/* ─── API Constants ─────────────────────────────────── */

const API_BASE = 'https://api.hyrule-compendium.com/v3/compendium';
const CATEGORIES = ['creatures', 'monsters'] as const;

/* ─── Helpers ────────────────────────────────────────── */

function formatName(name: string): string {
  return name
    .split(/[_-]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function getLocalImage(name: string): string {
  const filename = name.toLowerCase().replace(/\s+/g, '_');
  return `/creatures/${filename}.png`;
}

/** Simple string hash → 0…1 pseudo-random */
function hashToRange(str: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const normalized = (Math.abs(hash) % 10000) / 10000;
  return Math.round(min + normalized * (max - min));
}

/** Derive stats from creature name + category */
function getCreatureStats(name: string, category: 'creatures' | 'monsters'): CreatureStats {
  const isMonster = category === 'monsters';
  const low = name.toLowerCase();

  // Base ranges per category
  let hpMin = isMonster ? 20 : 8;
  let hpMax = isMonster ? 95 : 50;
  let atkMin = isMonster ? 18 : 3;
  let atkMax = isMonster ? 90 : 30;
  let defMin = isMonster ? 12 : 5;
  let defMax = isMonster ? 80 : 40;
  let spdMin = isMonster ? 8 : 20;
  let spdMax = isMonster ? 60 : 92;

  // Tier modifiers based on name keywords
  const elite = /silver|gold|white-?maned|black|blue-?maned|cursed|master/i.test(low);
  const boss = /ganon|blight|kohga|molduking|talus_titan|stalnox|hinox|lynel|guardian_stalker|guardian_skywatcher/i.test(low);
  const magical = /electric|fire|ice|wizzrobe|thunder|blizz|meteo/i.test(low);
  const tiny = /butterfly|firefly|cricket|fairy|lizard|sparrow|beetle/i.test(low);
  const fast = /horse|fox|coyote|wolf|hawk|heron|buck|doe|ostrich/i.test(low);
  const tough = /guardian|talus|pebblit|lynel|hinox|molduga/i.test(low);
  const dragon = /dinraal|farosh|naydra/i.test(low);

  if (boss) { hpMin += 25; hpMax += 10; atkMin += 20; atkMax += 10; defMin += 15; defMax += 10; spdMin += 5; }
  if (elite) { hpMin += 10; hpMax += 5; atkMin += 10; atkMax += 5; defMin += 8; }
  if (magical) { atkMin += 12; atkMax += 5; spdMin += 5; }
  if (tiny) { hpMax = Math.min(hpMax, 25); atkMax = Math.min(atkMax, 15); spdMin += 20; spdMax = Math.min(spdMax, 95); }
  if (fast) { spdMin += 20; spdMax += 5; atkMin -= 5; }
  if (tough) { defMin += 15; defMax += 5; hpMin += 10; }
  if (dragon) { hpMin = 90; hpMax = 95; atkMin = 85; atkMax = 92; defMin = 75; defMax = 88; spdMin = 50; spdMax = 70; }

  const hp = hashToRange(name + '_hp', hpMin, hpMax);
  const atk = hashToRange(name + '_atk', atkMin, atkMax);
  const def = hashToRange(name + '_def', defMin, defMax);
  const spd = hashToRange(name + '_spd', spdMin, spdMax);

  return { hp, atk, def, spd, total: hp + atk + def + spd };
}

/* ─── Stat Bar Component ────────────────────────────── */

function StatBar({
  label,
  value,
  max,
  color,
  animate = true,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
  animate?: boolean;
}) {
  const pct = max ? (value / max) * 100 : value;

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs w-5">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={animate ? { width: 0 } : undefined}
          whileInView={animate ? { width: `${pct}%` } : undefined}
          viewport={animate ? { once: true } : undefined}
          transition={animate ? { duration: 0.6, delay: 0.2 } : undefined}
          style={{ backgroundColor: color, width: animate ? undefined : `${pct}%` }}
        />
      </div>
      <span className="text-[9px] font-mono text-text-secondary/50 w-6 text-right">{value}</span>
    </div>
  );
}

/* ─── Detail Modal ──────────────────────────────────── */

function CreatureDetail({
  creature,
  language,
  onClose,
}: {
  creature: CreatureEntry;
  language: 'en' | 'es';
  onClose: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const stats = getCreatureStats(creature.name, creature.category);

  const displayName = formatName(creature.name);
  const categoryLabel =
    creature.category === 'monsters'
      ? language === 'es' ? 'Monstruo' : 'Monster'
      : language === 'es' ? 'Criatura' : 'Creature';

  const maxStat = Math.max(stats.hp, stats.atk, stats.def, stats.spd) + 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          backgroundColor: isDark ? '#141A1F' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(198,161,91,0.2)' : 'rgba(180,140,60,0.25)'}`,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="relative w-full h-56 sm:h-64 overflow-hidden rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${isDark ? 'rgba(198,161,91,0.08)' : 'rgba(200,170,100,0.1)'}, transparent)`,
          }}
        >
          <img
            src={getLocalImage(creature.name)}
            alt={displayName}
            className="w-full h-full object-contain p-4"
            onError={(e) => { (e.target as HTMLImageElement).src = creature.image; }}
          />
          <div className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: `linear-gradient(to top, ${isDark ? '#141A1F' : '#ffffff'}, transparent)` }}
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>
              {displayName}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: creature.category === 'monsters' ? 'rgba(139,58,58,0.15)' : 'rgba(62,107,72,0.12)',
                color: creature.category === 'monsters' ? '#D4726A' : '#6BAF7A',
                border: `1px solid ${creature.category === 'monsters' ? 'rgba(139,58,58,0.3)' : 'rgba(62,107,72,0.25)'}`,
              }}
            >
              {categoryLabel}
            </span>
          </div>

          {/* ID + Total Power */}
          <div className="flex items-center justify-between">
            <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
              #{creature.id} · Hyrule Compendium
            </p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isDark ? 'rgba(198,161,91,0.1)' : 'rgba(180,140,60,0.08)',
                color: '#C6A15B',
                border: `1px solid ${isDark ? 'rgba(198,161,91,0.2)' : 'rgba(180,140,60,0.15)'}`,
              }}
            >
              ⚡ {stats.total} Total
            </span>
          </div>

          {/* Stat Bars */}
          <div className="space-y-2 p-3 rounded-xl"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
            }}
          >
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
              {language === 'es' ? 'Estadísticas' : 'Stats'}
            </h4>
            <StatBar label="❤️" value={stats.hp} max={maxStat} color="#3E6B48" animate={false} />
            <StatBar label="⚔️" value={stats.atk} max={maxStat} color="#8B3A3A" animate={false} />
            <StatBar label="🛡️" value={stats.def} max={maxStat} color="#5B8A9E" animate={false} />
            <StatBar label="⚡" value={stats.spd} max={maxStat} color="#C6A15B" animate={false} />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}>
            {creature.description}
          </p>

          {/* Locations */}
          {creature.common_locations && creature.common_locations.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
              >
                <MapPin size={12} />
                {language === 'es' ? 'Ubicaciones' : 'Common Locations'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {creature.common_locations.map((loc) => (
                  <span key={loc} className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: isDark ? 'rgba(198,161,91,0.08)' : 'rgba(180,140,60,0.06)',
                      color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
                      border: `1px solid ${isDark ? 'rgba(198,161,91,0.15)' : 'rgba(180,140,60,0.15)'}`,
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Drops */}
          {creature.drops && creature.drops.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
              >
                <Package size={12} />
                {language === 'es' ? 'Botín' : 'Drops'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {creature.drops.map((drop) => (
                  <span key={drop} className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{
                      backgroundColor: isDark ? 'rgba(91,138,158,0.1)' : 'rgba(91,138,158,0.06)',
                      color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)',
                      border: `1px solid ${isDark ? 'rgba(91,138,158,0.2)' : 'rgba(91,138,158,0.15)'}`,
                    }}
                  >
                    {formatName(drop)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Creature Card ─────────────────────────────────── */

function CreatureCard({
  creature,
  language,
  onClick,
}: {
  creature: CreatureEntry;
  language: 'en' | 'es';
  onClick: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const stats = getCreatureStats(creature.name, creature.category);

  const displayName = formatName(creature.name);
  const isMonster = creature.category === 'monsters';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: isDark
          ? `linear-gradient(145deg, ${isMonster ? 'rgba(139,58,58,0.06)' : 'rgba(62,107,72,0.05)'} 0%, rgba(12,16,20,0.9) 100%)`
          : `linear-gradient(145deg, ${isMonster ? 'rgba(200,100,100,0.04)' : 'rgba(100,180,120,0.04)'} 0%, rgba(255,255,255,0.9) 100%)`,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Image */}
      <div className="relative h-36 sm:h-40 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${isMonster ? 'rgba(139,58,58,0.08)' : 'rgba(62,107,72,0.06)'}, transparent)`,
        }}
      >
        <img
          src={getLocalImage(creature.name)}
          alt={displayName}
          className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = creature.image; }}
        />
        {/* Category badge */}
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: isMonster ? 'rgba(139,58,58,0.8)' : 'rgba(62,107,72,0.7)',
              color: '#fff',
            }}
          >
            {isMonster ? '⚔' : '🦎'}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <h3 className="text-sm font-bold truncate"
          style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}
        >
          {displayName}
        </h3>

        {/* Compact stat bars */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {[
            { label: '❤️', value: stats.hp, color: '#3E6B48' },
            { label: '⚔️', value: stats.atk, color: '#8B3A3A' },
            { label: '🛡️', value: stats.def, color: '#5B8A9E' },
            { label: '⚡', value: stats.spd, color: '#C6A15B' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <span className="text-[10px] w-4">{s.label}</span>
              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  style={{ backgroundColor: s.color }}
                />
              </div>
              <span className="text-[8px] font-mono text-text-secondary/40 w-5 text-right">{s.value}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] leading-relaxed line-clamp-2"
          style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
        >
          {creature.description.length > 70
            ? creature.description.slice(0, 70) + '...'
            : creature.description}
        </p>

        <div className="flex items-center justify-between text-[10px]">
          <span style={{ color: isDark ? 'rgba(198,161,91,0.5)' : 'rgba(160,120,50,0.6)' }}>
            {language === 'es' ? 'Ver detalle' : 'Details'}
          </span>
          <span className="font-bold" style={{ color: isDark ? 'rgba(198,161,91,0.4)' : 'rgba(160,120,50,0.5)' }}>
            {stats.total}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */

export function CreaturesPage() {
  const { language, theme } = useAppStore();
  const isDark = theme === 'dark';

  const [allCreatures, setAllCreatures] = useState<CreatureEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCreature, setSelectedCreature] = useState<CreatureEntry | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'creatures' | 'monsters'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'total' | 'atk' | 'spd'>('default');

  // Fetch from API
  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          CATEGORIES.map(async (cat) => {
            const res = await fetch(`${API_BASE}/category/${cat}`);
            if (!res.ok) throw new Error(`Failed to fetch ${cat}: ${res.status}`);
            const json: ApiResponse = await res.json();
            return json.data;
          })
        );

        if (!cancelled) {
          const all = results.flat().sort((a, b) => a.name.localeCompare(b.name));
          setAllCreatures(all);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // Filter + search + sort
  const filtered = useMemo(() => {
    let result = allCreatures.filter((c) => {
      const matchesSearch = !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy !== 'default') {
      result = [...result].sort((a, b) => {
        const statsA = getCreatureStats(a.name, a.category);
        const statsB = getCreatureStats(b.name, b.category);
        if (sortBy === 'total') return statsB.total - statsA.total;
        if (sortBy === 'atk') return statsB.atk - statsA.atk;
        if (sortBy === 'spd') return statsB.spd - statsA.spd;
        return 0;
      });
    }

    return result;
  }, [allCreatures, search, filterCategory, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Bug size={28} className="text-[#C6A15B] drop-shadow-[0_0_8px_rgba(198,161,91,0.3)]" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('creatures.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          {t('creatures.subtitle', language)}
        </p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16}
            style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'es' ? 'Buscar criatura...' : 'Search creatures...'}
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all duration-300 focus:outline-none focus:border-[#C6A15B]/50"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? '#F0ECE4' : '#1A1510',
            }}
          />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {(['all', 'creatures', 'monsters'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                backgroundColor: filterCategory === cat
                  ? 'rgba(198,161,91,0.15)'
                  : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                color: filterCategory === cat
                  ? '#C6A15B'
                  : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                border: `1px solid ${filterCategory === cat
                  ? 'rgba(198,161,91,0.3)'
                  : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              }}
            >
              {cat === 'all'
                ? (language === 'es' ? 'Todos' : 'All')
                : cat === 'creatures'
                  ? (language === 'es' ? 'Criaturas' : 'Creatures')
                  : (language === 'es' ? 'Monstruos' : 'Monsters')}
            </button>
          ))}

          {/* Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-2 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <option value="default">{language === 'es' ? 'Ordenar' : 'Sort'}</option>
            <option value="total">{language === 'es' ? 'Más fuerte' : 'Strongest'}</option>
            <option value="atk">{language === 'es' ? 'Más ataque' : 'Top ATK'}</option>
            <option value="spd">{language === 'es' ? 'Más veloz' : 'Fastest'}</option>
          </select>

          <span className="text-[10px] px-1" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
            {filtered.length}/{allCreatures.length}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={36} className="text-[#C6A15B] animate-spin" />
          <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
            {language === 'es' ? 'Cargando criaturas del Compendio de Hyrule...' : 'Loading creatures from the Hyrule Compendium...'}
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <AlertTriangle size={36} style={{ color: '#D4726A' }} />
          <p className="text-sm font-semibold" style={{ color: '#D4726A' }}>
            {language === 'es' ? 'Error al cargar datos' : 'Error loading data'}
          </p>
          <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
            {error}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Bug size={48} className="mx-auto mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
            {language === 'es' ? 'Sin resultados' : 'No results found'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {filtered.map((creature) => (
            <motion.div key={creature.id} variants={itemVariants}>
              <CreatureCard
                creature={creature}
                language={language}
                onClick={() => setSelectedCreature(creature)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCreature && (
          <CreatureDetail
            creature={selectedCreature}
            language={language}
            onClose={() => setSelectedCreature(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
