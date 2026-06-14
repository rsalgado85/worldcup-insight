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

  const displayName = formatName(creature.name);
  const categoryLabel =
    creature.category === 'monsters'
      ? language === 'es'
        ? 'Monstruo'
        : 'Monster'
      : language === 'es'
        ? 'Criatura'
        : 'Creature';

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
        <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${isDark ? 'rgba(198,161,91,0.08)' : 'rgba(200,170,100,0.1)'}, transparent)`,
          }}
        >
          <img
            src={creature.image}
            alt={displayName}
            className="w-full h-full object-contain p-4"
          />
          <div className="absolute inset-x-0 bottom-0 h-20"
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

          {/* ID */}
          <p className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
            #{creature.id} · Hyrule Compendium
          </p>

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
          src={creature.image}
          alt={displayName}
          className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
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
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-bold truncate"
          style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}
        >
          {displayName}
        </h3>
        <p className="text-[10px] leading-relaxed line-clamp-2"
          style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
        >
          {creature.description.length > 90
            ? creature.description.slice(0, 90) + '...'
            : creature.description}
        </p>
        <div className="flex items-center gap-1 text-[10px] pt-1"
          style={{ color: isDark ? 'rgba(198,161,91,0.5)' : 'rgba(160,120,50,0.6)' }}
        >
          <span>{language === 'es' ? 'Ver detalle' : 'View details'}</span>
          <ChevronRight size={10} />
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

  // Filter + search
  const filtered = useMemo(() => {
    return allCreatures.filter((c) => {
      const matchesSearch = !search.trim() ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'all' || c.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allCreatures, search, filterCategory]);

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
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all duration-300"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? '#F0ECE4' : '#1A1510',
            }}
          />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-1.5">
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
              {cat === 'all' ? (language === 'es' ? 'Todos' : 'All') : cat === 'creatures' ? (language === 'es' ? 'Criaturas' : 'Creatures') : (language === 'es' ? 'Monstruos' : 'Monsters')}
            </button>
          ))}
          <span className="flex items-center text-[10px] px-2"
            style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}
          >
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
