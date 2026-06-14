import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Skull,
  Sword,
  Shield,
  Crown,
  Flame,
  Search,
  MapPin,
  Gamepad2,
  Triangle,
  Droplets,
  Ghost,
  Zap,
  Eye,
  Wind,
  Bone,
  Cog,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

// ─── Boss Data ───────────────────────────────────────────────────────────────

export interface Boss {
  id: number;
  name: string;
  titleKey: string;
  typeKey: string;
  dungeon: string;
  game: string;
  difficulty: number; // 1-5
  hp: number;
  atk: number;
  def: number;
  spd: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string; // tailwind color class
  description: string;
  image: string;
}

export const bosses: Boss[] = [
  {
    id: 1,
    name: 'Ganon',
    titleKey: "Ganondorf's Beast Form",
    typeKey: 'Final Boss',
    dungeon: "Ganon's Castle",
    game: 'Ocarina of Time',
    difficulty: 5,
    hp: 95,
    atk: 98,
    def: 90,
    spd: 70,
    icon: Crown,
    accentColor: '#C6A15B',
    description:
      'The Demon King in his most terrifying form — a towering beast wielding twin blades forged in darkness, the final obstacle between Link and the salvation of Hyrule.',
    image: '/bosses/ganon.png',
  },
  {
    id: 2,
    name: 'Volvagia',
    titleKey: 'Subterranean Lava Dragon',
    typeKey: 'Fire Temple Boss',
    dungeon: 'Fire Temple',
    game: 'Ocarina of Time',
    difficulty: 4,
    hp: 80,
    atk: 85,
    def: 70,
    spd: 75,
    icon: Flame,
    accentColor: '#E85D3A',
    description:
      'An ancient dragon revived by Ganondorf to terrorize the Gorons. It emerges from lava pits and attacks with fiery breath and whipping strikes.',
    image: '/bosses/volvagia.png',
  },
  {
    id: 3,
    name: 'Morpha',
    titleKey: 'Giant Aquatic Amoeba',
    typeKey: 'Water Temple Boss',
    dungeon: 'Water Temple',
    game: 'Ocarina of Time',
    difficulty: 3,
    hp: 65,
    atk: 60,
    def: 50,
    spd: 40,
    icon: Droplets,
    accentColor: '#3B82F6',
    description:
      'A massive amoebic entity controlling the waters of the Water Temple. It manipulates water tentacles from a central nucleus with lethal precision.',
    image: '/bosses/morpha.png',
  },
  {
    id: 4,
    name: 'Bongo Bongo',
    titleKey: 'Phantom Shadow Beast',
    typeKey: 'Shadow Temple Boss',
    dungeon: 'Shadow Temple',
    game: 'Ocarina of Time',
    difficulty: 4,
    hp: 75,
    atk: 80,
    def: 45,
    spd: 85,
    icon: Ghost,
    accentColor: '#8B5CF6',
    description:
      'A disembodied spirit with two massive hands that pound the drum-like arena. An invisible horror that lurks in the darkness of the Shadow Temple.',
    image: '/bosses/bongo_bongo.png',
  },
  {
    id: 5,
    name: 'Twinrova',
    titleKey: 'Sorceress Sisters',
    typeKey: 'Spirit Temple Boss',
    dungeon: 'Spirit Temple',
    game: 'Ocarina of Time',
    difficulty: 4,
    hp: 70,
    atk: 88,
    def: 60,
    spd: 78,
    icon: Zap,
    accentColor: '#F59E0B',
    description:
      'Kotake and Koume — the twin Gerudo sorceresses who merge into Twinrova. Masters of fire and ice magic who raised Ganondorf himself.',
    image: '/bosses/twinrova.png',
  },
  {
    id: 6,
    name: 'King Dodongo',
    titleKey: 'Infernal Dinosaur',
    typeKey: 'Dodongo Cavern Boss',
    dungeon: "Dodongo's Cavern",
    game: 'Ocarina of Time',
    difficulty: 2,
    hp: 70,
    atk: 72,
    def: 75,
    spd: 30,
    icon: Flame,
    accentColor: '#DC2626',
    description:
      'The colossal ruler of the Dodongos, capable of inhaling everything in its path and unleashing devastating fire breath across the cavern.',
    image: '/bosses/king_dodongo.png',
  },
  {
    id: 7,
    name: 'Barinade',
    titleKey: 'Bio-electric Anemone',
    typeKey: 'Jabu-Jabu Boss',
    dungeon: "Inside Jabu-Jabu's Belly",
    game: 'Ocarina of Time',
    difficulty: 3,
    hp: 60,
    atk: 65,
    def: 45,
    spd: 55,
    icon: Zap,
    accentColor: '#EC4899',
    description:
      'A parasitic bio-electric creature that attached itself to Lord Jabu-Jabu. It spins and releases electric tendrils to shock its prey.',
    image: '/bosses/barinade.png',
  },
  {
    id: 8,
    name: 'Phantom Ganon',
    titleKey: 'Evil Spirit',
    typeKey: 'Forest Temple Boss',
    dungeon: 'Forest Temple',
    game: 'Ocarina of Time',
    difficulty: 3,
    hp: 72,
    atk: 82,
    def: 55,
    spd: 80,
    icon: Ghost,
    accentColor: '#6B7280',
    description:
      'A phantom specter of Ganondorf that haunts the Forest Temple. It rides through paintings and strikes with dark lightning from its spectral steed.',
    image: '/bosses/phantom_ganon.png',
  },
  {
    id: 9,
    name: 'Dark Link',
    titleKey: 'Shadow Reflection',
    typeKey: 'Mini-Boss',
    dungeon: 'Water Temple',
    game: 'Ocarina of Time',
    difficulty: 5,
    hp: 78,
    atk: 92,
    def: 75,
    spd: 95,
    icon: Eye,
    accentColor: '#374151',
    description:
      "Link's own shadow given form — a perfect mirror that copies every move. The most personal and psychologically terrifying battle in the series.",
    image: '/bosses/dark_link.png',
  },
  {
    id: 10,
    name: 'Molgera',
    titleKey: 'Giant Sand Worm',
    typeKey: 'Wind Temple Boss',
    dungeon: 'Wind Temple',
    game: 'Wind Waker',
    difficulty: 4,
    hp: 82,
    atk: 78,
    def: 60,
    spd: 70,
    icon: Wind,
    accentColor: '#D97706',
    description:
      'A colossal sand-dwelling worm that burrows beneath the Wind Temple arena. It spawns larvae and erupts from the sand with devastating lunges.',
    image: '/bosses/molgera.png',
  },
  {
    id: 11,
    name: 'Stallord',
    titleKey: 'Fossilized Dragon',
    typeKey: "Arbiter's Grounds Boss",
    dungeon: "Arbiter's Grounds",
    game: 'Twilight Princess',
    difficulty: 4,
    hp: 85,
    atk: 80,
    def: 65,
    spd: 60,
    icon: Bone,
    accentColor: '#92400E',
    description:
      'A reanimated skeletal dragon unearthed in the ancient prison. Its massive skull crashes down as it summons undead minions from the sand.',
    image: '/bosses/stallord.png',
  },
  {
    id: 12,
    name: 'Koloktos',
    titleKey: 'Ancient Automaton',
    typeKey: 'Ancient Cistern Boss',
    dungeon: 'Ancient Cistern',
    game: 'Skyward Sword',
    difficulty: 4,
    hp: 88,
    atk: 90,
    def: 80,
    spd: 50,
    icon: Cog,
    accentColor: '#A16207',
    description:
      'A massive golden automaton with six arms wielding colossal blades. One of the most visually spectacular and mechanically complex boss fights.',
    image: '/bosses/koloktos.png',
  },
];

// ─── Triforce Difficulty Renderer ─────────────────────────────────────────────

function DifficultyTriforce({
  level,
  max = 5,
}: {
  level: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty ${level} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <Triangle
          key={i}
          size={14}
          className={`transition-all duration-300 ${
            i < level
              ? 'text-[#C6A15B] drop-shadow-[0_0_4px_rgba(198,161,91,0.5)]'
              : 'text-dark-border opacity-40'
          }`}
          fill={i < level ? 'currentColor' : 'none'}
          strokeWidth={i < level ? 1.5 : 1}
        />
      ))}
    </div>
  );
}

// ─── Animations ───────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
};

// ─── Main Component ──────────────────────────────────────────────────────────

export function BossesPage() {
  const { language } = useAppStore();
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredBosses = useMemo(() => {
    if (!search.trim()) return bosses;
    const query = search.toLowerCase();
    return bosses.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.dungeon.toLowerCase().includes(query) ||
        b.game.toLowerCase().includes(query) ||
        b.typeKey.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Skull
            size={28}
            className="text-[#8B3A3A] drop-shadow-[0_0_8px_rgba(139,58,58,0.3)]"
          />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('bosses.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          {t('bosses.subtitle', language)}
        </p>
      </motion.div>

      {/* ── Search Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md"
      >
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          size={16}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('bosses.search', language)}
          className="w-full bg-dark-hover border border-dark-border rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-[#C6A15B]/50 focus:shadow-[0_0_12px_rgba(198,161,91,0.08)] transition-all duration-300"
          aria-label={t('bosses.search', language)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <span className="text-[10px] text-text-secondary/50">
            {filteredBosses.length}/{bosses.length}
          </span>
        </div>
      </motion.div>

      {/* ── Grid ── */}
      {filteredBosses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 sm:p-14 text-center"
        >
          <Skull size={48} className="mx-auto mb-4 text-text-secondary/20" />
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            {t('bosses.noResults', language)}
          </h2>
          <p className="text-sm text-text-secondary">
            {language === 'es'
              ? 'Intenta con otro término de búsqueda'
              : 'Try a different search term'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredBosses.map((boss) => {
              const BossIcon = boss.icon;
              const isHovered = hoveredId === boss.id;

              return (
                <motion.div
                  key={boss.id}
                  variants={cardVariants}
                  layout
                  onMouseEnter={() => setHoveredId(boss.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative"
                >
                  {/* ── Card Glow ── */}
                  <div
                    className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${boss.accentColor}22 0%, transparent 50%, ${boss.accentColor}11 100%)`,
                      filter: 'blur(8px)',
                    }}
                  />

                  {/* ── Card ── */}
                  <div className="glass-card-hover relative z-10 p-5 sm:p-6 flex flex-col gap-4 overflow-hidden">
                    {/* Accent Line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent 0%, ${boss.accentColor} 30%, ${boss.accentColor} 70%, transparent 100%)`,
                        opacity: isHovered ? 1 : 0.3,
                      }}
                    />

                    {/* ── Header: Icon + Name ── */}
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500"
                        style={{
                          backgroundColor: `${boss.accentColor}15`,
                          border: `1px solid ${boss.accentColor}30`,
                          boxShadow: isHovered
                            ? `0 0 16px ${boss.accentColor}20`
                            : 'none',
                        }}
                      >
                        <BossIcon
                          size={22}
                          className="flex-shrink-0"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-text-primary truncate">
                          {boss.name}
                        </h3>
                        <p className="text-xs text-text-secondary/70 mt-0.5">
                          {boss.titleKey}
                        </p>
                      </div>
                    </div>

                    {/* ── Boss Image ── */}
                    <div className="flex justify-center">
                      <motion.div
                        className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${boss.accentColor}12 0%, ${boss.accentColor}06 100%)`,
                          border: `1px solid ${boss.accentColor}20`,
                        }}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={boss.image}
                          alt={boss.name}
                          className="w-full h-full object-contain p-2"
                          loading="lazy"
                        />
                        <div
                          className="absolute inset-x-0 bottom-0 h-8"
                          style={{
                            background: `linear-gradient(to top, ${boss.accentColor}10, transparent)`,
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* ── Meta: Dungeon + Game ── */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <MapPin size={12} className="flex-shrink-0 text-text-secondary/40" />
                        <span className="truncate">{boss.dungeon}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Gamepad2 size={12} className="flex-shrink-0 text-text-secondary/40" />
                        <span className="truncate">{boss.game}</span>
                      </div>
                    </div>

                    {/* ── Stat Bars ── */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                      {[
                        { label: '❤️', value: boss.hp, color: '#3E6B48' },
                        { label: '⚔️', value: boss.atk, color: '#8B3A3A' },
                        { label: '🛡️', value: boss.def, color: '#5B8A9E' },
                        { label: '⚡', value: boss.spd, color: '#C6A15B' },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-center gap-1.5">
                          <span className="text-xs w-5">{stat.label}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${stat.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              style={{ backgroundColor: stat.color }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-text-secondary/50 w-6 text-right">{stat.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* ── Difficulty ── */}
                    <div className="flex items-center justify-between pt-1 border-t border-dark-border">
                      <span className="text-[10px] uppercase tracking-wider text-text-secondary/50">
                        {t('bosses.difficulty', language)}
                      </span>
                      <DifficultyTriforce level={boss.difficulty} />
                    </div>

                    {/* ── Expandable Description (on hover) ── */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isHovered ? 'auto' : 0,
                        opacity: isHovered ? 1 : 0,
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-text-secondary/60 leading-relaxed pt-1">
                        {boss.description}
                      </p>
                    </motion.div>

                    {/* ── Type Badge ── */}
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${boss.accentColor}18`,
                          color: boss.accentColor,
                          border: `1px solid ${boss.accentColor}30`,
                        }}
                      >
                        {boss.typeKey}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
