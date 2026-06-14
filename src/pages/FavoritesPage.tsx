import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, X, Users, Skull, Bug, ExternalLink, MapPin, Package } from 'lucide-react';
import { useAppStore, type FavoriteEntry, type FavoriteType } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { RACE_COLORS } from '@/constants';
import { CHARACTERS, type CharacterData } from '@/pages/CharactersPage';
import { bosses, type Boss } from '@/pages/BossesPage';

/* ─── Creature types & stats helper ────────────────── */

interface CreatureSummary {
  id: number;
  name: string;
  category: 'creatures' | 'monsters';
  description: string;
  image: string;
  common_locations: string[] | null;
  drops: string[] | null;
}

const API_BASE = 'https://api.hyrule-compendium.com/v3/compendium';

/** Same hash-based stats as CreaturesPage */
function getCreatureStats(name: string, category: 'creatures' | 'monsters') {
  const low = name.toLowerCase();
  const isMonster = category === 'monsters';

  let hpMin = isMonster ? 20 : 8;
  let hpMax = isMonster ? 95 : 50;
  let atkMin = isMonster ? 18 : 3;
  let atkMax = isMonster ? 90 : 30;
  let defMin = isMonster ? 12 : 5;
  let defMax = isMonster ? 80 : 40;
  let spdMin = isMonster ? 8 : 20;
  let spdMax = isMonster ? 60 : 92;

  if (/silver|gold|white-?maned|black|blue-?maned|cursed|master/i.test(low)) { hpMin += 10; hpMax += 5; atkMin += 10; atkMax += 5; defMin += 8; }
  if (/ganon|blight|kohga|molduking|talus_titan|stalnox|hinox|lynel|guardian_stalker/i.test(low)) { hpMin += 25; atkMin += 20; defMin += 15; }
  if (/electric|fire|ice|wizzrobe|thunder|blizz|meteo/i.test(low)) { atkMin += 12; spdMin += 5; }
  if (/butterfly|firefly|cricket|fairy|lizard|sparrow|beetle/i.test(low)) { hpMax = Math.min(hpMax, 25); atkMax = Math.min(atkMax, 15); spdMin += 20; }
  if (/horse|fox|coyote|wolf|hawk|heron|buck|doe|ostrich/i.test(low)) { spdMin += 20; atkMin -= 5; }
  if (/guardian|talus|pebblit|lynel|hinox|molduga/i.test(low)) { defMin += 15; hpMin += 10; }
  if (/dinraal|farosh|naydra/i.test(low)) { hpMin = 90; hpMax = 95; atkMin = 85; atkMax = 92; defMin = 75; defMax = 88; spdMin = 50; spdMax = 70; }

  const hash = (s: string, min: number, max: number) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.round(min + ((Math.abs(h) % 10000) / 10000) * (max - min));
  };

  const hp = hash(name + '_hp', hpMin, hpMax);
  const atk = hash(name + '_atk', atkMin, atkMax);
  const def = hash(name + '_def', defMin, defMax);
  const spd = hash(name + '_spd', spdMin, spdMax);
  return { hp, atk, def, spd, total: hp + atk + def + spd };
}

function formatCreatureName(name: string) {
  return name.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ─── Unified Favorite Item ─────────────────────────── */

type UnifiedFav =
  | { type: 'character'; data: CharacterData }
  | { type: 'boss'; data: Boss }
  | { type: 'creature'; data: CreatureSummary };

/* ─── Stat Bar (non-animated) ───────────────────────── */

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.max(0, value);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs w-5">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ backgroundColor: color, width: `${pct}%` }} />
      </div>
      <span className="text-[9px] font-mono text-text-secondary/50 w-6 text-right">{value}</span>
    </div>
  );
}

/* ─── Detail Modal ──────────────────────────────────── */

function FavoriteDetail({
  item,
  language,
  onClose,
  onRemove,
  onNavigate,
}: {
  item: UnifiedFav;
  language: 'en' | 'es';
  onClose: () => void;
  onRemove: () => void;
  onNavigate: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  let image: string;
  let name: string;
  let subtitle: string;
  let description: string;
  let accentColor: string;
  let typeLabel: string;
  let stats: { hp: number; atk: number; def: number; spd: number; total: number };
  let locations: string[] = [];
  let drops: string[] = [];

  if (item.type === 'character') {
    const c = item.data;
    image = c.image;
    name = c.name;
    subtitle = language === 'es' ? c.gameEs : c.game;
    description = language === 'es' ? c.descriptionEs : c.description;
    accentColor = RACE_COLORS[c.race] || '#C6A15B';
    typeLabel = language === 'es' ? 'Personaje' : 'Character';
    stats = { hp: c.hp, atk: c.atk, def: c.def, spd: c.spd, total: c.hp + c.atk + c.def + c.spd };
    locations = [language === 'es' ? c.roleEs : c.role, language === 'es' ? c.weaponEs : c.weapon];
  } else if (item.type === 'boss') {
    const b = item.data;
    image = b.image;
    name = b.name;
    subtitle = b.game;
    description = b.description;
    accentColor = b.accentColor;
    typeLabel = language === 'es' ? 'Jefe' : 'Boss';
    stats = { hp: b.hp, atk: b.atk, def: b.def, spd: b.spd, total: b.hp + b.atk + b.def + b.spd };
    locations = [b.dungeon, b.typeKey];
    drops = [`${language === 'es' ? 'Dificultad' : 'Difficulty'}: ${b.difficulty}/5`];
  } else {
    const cr = item.data;
    image = `/creatures/${cr.name.replace(/\s+/g, '_')}.png`;
    name = formatCreatureName(cr.name);
    subtitle = cr.category === 'monsters' ? (language === 'es' ? 'Monstruo' : 'Monster') : (language === 'es' ? 'Criatura' : 'Creature');
    description = cr.description;
    accentColor = cr.category === 'monsters' ? '#8B3A3A' : '#3E6B48';
    typeLabel = language === 'es' ? 'Criatura' : 'Creature';
    stats = getCreatureStats(cr.name, cr.category);
    locations = cr.common_locations || [];
    drops = cr.drops || [];
  }

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
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          backgroundColor: isDark ? '#141A1F' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(198,161,91,0.2)' : 'rgba(180,140,60,0.25)'}`,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}>
          <X size={18} />
        </button>

        {/* Image */}
        <div className="relative w-full h-52 sm:h-60 overflow-hidden rounded-t-2xl"
          style={{ background: `linear-gradient(135deg, ${isDark ? 'rgba(198,161,91,0.08)' : 'rgba(200,170,100,0.1)'}, transparent)` }}>
          <img src={image} alt={name} className="w-full h-full object-contain p-4"
            onError={(e) => { if (item.type === 'creature') (e.target as HTMLImageElement).src = item.data.image; }} />
          <div className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: `linear-gradient(to top, ${isDark ? '#141A1F' : '#ffffff'}, transparent)` }} />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>{name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}>
              {typeLabel}
            </span>
          </div>

          {/* Subtitle */}
          <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>{subtitle}</p>

          {/* Total Power */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: isDark ? 'rgba(198,161,91,0.1)' : 'rgba(180,140,60,0.08)', color: '#C6A15B', border: `1px solid ${isDark ? 'rgba(198,161,91,0.2)' : 'rgba(180,140,60,0.15)'}` }}>
              ⚡ {stats.total} Total
            </span>
          </div>

          {/* Stats */}
          <div className="space-y-2 p-3 rounded-xl"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}` }}>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
              {language === 'es' ? 'Estadísticas' : 'Stats'}
            </h4>
            <StatBar label="❤️" value={stats.hp} color="#3E6B48" />
            <StatBar label="⚔️" value={stats.atk} color="#8B3A3A" />
            <StatBar label="🛡️" value={stats.def} color="#5B8A9E" />
            <StatBar label="⚡" value={stats.spd} color="#C6A15B" />
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}>{description}</p>

          {/* Locations / meta */}
          {locations.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                <MapPin size={12} />
                {item.type === 'character' ? (language === 'es' ? 'Rol / Arma' : 'Role / Weapon') : language === 'es' ? 'Info' : 'Info'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {locations.map((loc) => (
                  <span key={loc} className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{ backgroundColor: isDark ? 'rgba(198,161,91,0.08)' : 'rgba(180,140,60,0.06)', color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)', border: `1px solid ${isDark ? 'rgba(198,161,91,0.15)' : 'rgba(180,140,60,0.15)'}` }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Drops */}
          {drops.length > 0 && (
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                <Package size={12} />
                {item.type === 'boss' ? (language === 'es' ? 'Dificultad' : 'Difficulty') : language === 'es' ? 'Botín' : 'Drops'}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {drops.map((d) => (
                  <span key={d} className="px-2 py-0.5 rounded-full text-[10px]"
                    style={{ backgroundColor: isDark ? 'rgba(91,138,158,0.1)' : 'rgba(91,138,158,0.06)', color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)', border: `1px solid ${isDark ? 'rgba(91,138,158,0.2)' : 'rgba(91,138,158,0.15)'}` }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <button onClick={onRemove}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              style={{ backgroundColor: 'rgba(231,76,60,0.12)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.2)' }}>
              <Heart size={14} fill="currentColor" />
              {language === 'es' ? 'Quitar de favoritos' : 'Remove from favorites'}
            </button>
            <button onClick={onNavigate}
              className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              style={{ backgroundColor: isDark ? 'rgba(198,161,91,0.12)' : 'rgba(180,140,60,0.08)', color: '#C6A15B', border: `1px solid ${isDark ? 'rgba(198,161,91,0.2)' : 'rgba(180,140,60,0.15)'}` }}>
              <ExternalLink size={14} />
              {language === 'es' ? 'Ir a la página' : 'Go to page'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Favorite Card ─────────────────────────────────── */

function FavoriteCard({
  item, language, onRemove, onClick,
}: { item: UnifiedFav; language: 'en' | 'es'; onRemove: () => void; onClick: () => void }) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  let image: string, name: string, subtitle: string, accentColor: string, typeLabel: string;

  if (item.type === 'character') {
    const c = item.data;
    image = c.image; name = c.name;
    subtitle = language === 'es' ? c.roleEs : c.role;
    accentColor = RACE_COLORS[c.race] || '#C6A15B';
    typeLabel = language === 'es' ? 'Personaje' : 'Character';
  } else if (item.type === 'boss') {
    const b = item.data;
    image = b.image; name = b.name;
    subtitle = b.game; accentColor = b.accentColor;
    typeLabel = language === 'es' ? 'Jefe' : 'Boss';
  } else {
    const cr = item.data;
    image = `/creatures/${cr.name.replace(/\s+/g, '_')}.png`;
    name = formatCreatureName(cr.name);
    subtitle = cr.category === 'monsters' ? (language === 'es' ? 'Monstruo' : 'Monster') : (language === 'es' ? 'Criatura' : 'Creature');
    accentColor = cr.category === 'monsters' ? '#8B3A3A' : '#3E6B48';
    typeLabel = language === 'es' ? 'Criatura' : 'Creature';
  }

  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group relative"
      style={{ background: isDark ? `linear-gradient(145deg, ${accentColor}10 0%, rgba(12,16,20,0.9) 100%)` : `linear-gradient(145deg, ${accentColor}08 0%, rgba(255,255,255,0.9) 100%)`, border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)' }}>
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 z-10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: 'rgba(231,76,60,0.2)', color: '#e74c3c' }}
        aria-label={language === 'es' ? 'Quitar de favoritos' : 'Remove'}>
        <X size={12} />
      </button>
      <div className="absolute top-2 left-2 z-10">
        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white"
          style={{ backgroundColor: item.type === 'boss' ? 'rgba(198,161,91,0.7)' : item.type === 'character' ? 'rgba(98,130,180,0.7)' : 'rgba(62,107,72,0.7)' }}>
          {typeLabel}
        </span>
      </div>
      <div className="relative h-32 sm:h-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor}10, transparent)` }}>
        <img src={image} alt={name} className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-bold truncate" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>{name}</h3>
        <p className="text-[10px] truncate" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>{subtitle}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */

export function FavoritesPage() {
  const navigate = useNavigate();
  const { language, favorites, removeFavorite } = useAppStore();
  const isDark = useAppStore((s) => s.theme === 'dark');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | FavoriteType>('all');
  const [creatures, setCreatures] = useState<CreatureSummary[]>([]);
  const [creaturesLoading, setCreaturesLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<UnifiedFav | null>(null);

  // Fetch full creature data
  useEffect(() => {
    let cancelled = false;
    async function fetchCreatures() {
      try {
        const [cRes, mRes] = await Promise.all([fetch(`${API_BASE}/category/creatures`), fetch(`${API_BASE}/category/monsters`)]);
        const [cData, mData] = await Promise.all([cRes.json(), mRes.json()]);
        if (!cancelled) {
          const all: CreatureSummary[] = [...cData.data, ...mData.data].map((e: any) => ({
            id: e.id, name: e.name, category: e.category,
            description: e.description, image: e.image,
            common_locations: e.common_locations, drops: e.drops,
          }));
          setCreatures(all);
          setCreaturesLoading(false);
        }
      } catch { if (!cancelled) setCreaturesLoading(false); }
    }
    if (favorites.some((f) => f.type === 'creature')) fetchCreatures();
    else setCreaturesLoading(false);
    return () => { cancelled = true; };
  }, [favorites]);

  const unifiedFavorites = useMemo((): UnifiedFav[] =>
    favorites.map((fav): UnifiedFav | null => {
      if (fav.type === 'character') { const c = CHARACTERS.find((ch) => ch.id === fav.id); return c ? { type: 'character', data: c } : null; }
      if (fav.type === 'boss') { const b = bosses.find((bo) => bo.id === fav.id); return b ? { type: 'boss', data: b } : null; }
      if (fav.type === 'creature') { const cr = creatures.find((ce) => ce.id === fav.id); return cr ? { type: 'creature', data: cr } : null; }
      return null;
    }).filter((item): item is UnifiedFav => item !== null),
  [favorites, creatures]);

  const filtered = useMemo(() =>
    unifiedFavorites.filter((item) => {
      const matchesSearch = !search.trim() || (() => {
        const n = item.type === 'character' ? item.data.name : item.type === 'boss' ? item.data.name : item.data.name.replace(/[_-]/g, ' ');
        return n.toLowerCase().includes(search.toLowerCase());
      })();
      return matchesSearch && (filter === 'all' || item.type === filter);
    }),
  [unifiedFavorites, search, filter]);

  const handleNavigate = (item: UnifiedFav) => {
    setSelectedItem(null);
    if (item.type === 'character') navigate('/characters');
    else if (item.type === 'boss') navigate('/bosses');
    else navigate('/creatures');
  };

  const handleRemove = (item: UnifiedFav) => {
    const id = item.type === 'character' ? item.data.id : item.type === 'boss' ? item.data.id : item.data.id;
    removeFavorite(item.type, id);
    setSelectedItem(null);
  };

  const filterTabs = [
    { key: 'all', labelEn: 'All', labelEs: 'Todos', icon: Heart },
    { key: 'character', labelEn: 'Characters', labelEs: 'Personajes', icon: Users },
    { key: 'boss', labelEn: 'Bosses', labelEs: 'Jefes', icon: Skull },
    { key: 'creature', labelEn: 'Creatures', labelEs: 'Criaturas', icon: Bug },
  ] as const;

  return (
    <div className="space-y-5 sm:space-y-7">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Heart size={28} className="text-[#e74c3c] drop-shadow-[0_0_8px_rgba(231,76,60,0.3)]" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('favorites.title', language)}</h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold" style={{ backgroundColor: 'rgba(198,161,91,0.15)', color: '#C6A15B' }}>{favorites.length}</span>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{t('favorites.subtitle', language)}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'es' ? 'Buscar en favoritos...' : 'Search favorites...'}
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all focus:outline-none"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, color: isDark ? '#F0ECE4' : '#1A1510' }} />
        </div>
        <div className="flex gap-1.5 flex-wrap items-center">
          {filterTabs.map(({ key, labelEn, labelEs, icon: Icon }) => (
            <button key={key} onClick={() => setFilter(key)}
              className="px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
              style={{ backgroundColor: filter === key ? 'rgba(198,161,91,0.15)' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', color: filter === key ? '#C6A15B' : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)', border: `1px solid ${filter === key ? 'rgba(198,161,91,0.3)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <Icon size={14} /><span>{language === 'es' ? labelEs : labelEn}</span>
            </button>
          ))}
          <span className="text-[10px] px-2" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>{filtered.length}/{unifiedFavorites.length}</span>
        </div>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <Heart size={48} className="mx-auto mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <h2 className="text-base font-semibold mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{t('favorites.empty', language)}</h2>
          <p className="text-xs mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{t('favorites.emptyDesc', language)}</p>
          <button onClick={() => navigate('/characters')} className="px-4 py-2 rounded-xl text-white text-xs font-semibold" style={{ backgroundColor: '#C6A15B' }}>{t('favorites.explore', language)}</button>
        </motion.div>
      ) : creaturesLoading ? (
        <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <Heart size={40} className="mx-auto mb-3" style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{language === 'es' ? 'Sin resultados' : 'No results'}</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((item) => (
            <FavoriteCard key={`${item.type}-${(item.data as any).id}`} item={item} language={language}
              onRemove={() => handleRemove(item)} onClick={() => setSelectedItem(item)} />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selectedItem && (
          <FavoriteDetail item={selectedItem} language={language}
            onClose={() => setSelectedItem(null)}
            onRemove={() => handleRemove(selectedItem)}
            onNavigate={() => handleNavigate(selectedItem)} />
        )}
      </AnimatePresence>
    </div>
  );
}
