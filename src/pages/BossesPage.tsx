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
  Bug,
  Heart,
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
  {
    id: 13,
    name: 'Calamity Ganon',
    titleKey: 'The Scourge of Hyrule',
    typeKey: 'Final Boss',
    dungeon: 'Hyrule Castle',
    game: 'Breath of the Wild',
    difficulty: 5,
    hp: 95,
    atk: 96,
    def: 85,
    spd: 60,
    icon: Crown,
    accentColor: '#8B0000',
    description:
      'The primordial evil that has plagued Hyrule for 10,000 years. A swirling mass of Malice and Guardian technology fused into a nightmarish hybrid of beast and machine.',
    image: '/bosses/calamity-ganon.png',
  },
  {
    id: 14,
    name: 'Waterblight Ganon',
    titleKey: 'Scourge of Divine Beast Vah Ruta',
    typeKey: 'Blight Ganon',
    dungeon: 'Divine Beast Vah Ruta',
    game: 'Breath of the Wild',
    difficulty: 3,
    hp: 65,
    atk: 60,
    def: 45,
    spd: 50,
    icon: Droplets,
    accentColor: '#3B82F6',
    description:
      'A grotesque creature of Malice and water, wielding a massive spear. Created by Calamity Ganon to eliminate the Zora Champion Mipha and corrupt her Divine Beast.',
    image: '/bosses/waterblight-ganon.png',
  },
  {
    id: 15,
    name: 'Fireblight Ganon',
    titleKey: 'Scourge of Divine Beast Vah Rudania',
    typeKey: 'Blight Ganon',
    dungeon: 'Divine Beast Vah Rudania',
    game: 'Breath of the Wild',
    difficulty: 3,
    hp: 70,
    atk: 75,
    def: 50,
    spd: 40,
    icon: Flame,
    accentColor: '#E85D3A',
    description:
      'A hulking mass of Malice and flame, swinging a colossal axe. Created to defeat the Goron Champion Daruk inside the volcanic Divine Beast Vah Rudania.',
    image: '/bosses/fireblight-ganon.png',
  },
  {
    id: 16,
    name: 'Windblight Ganon',
    titleKey: 'Scourge of Divine Beast Vah Medoh',
    typeKey: 'Blight Ganon',
    dungeon: 'Divine Beast Vah Medoh',
    game: 'Breath of the Wild',
    difficulty: 3,
    hp: 60,
    atk: 55,
    def: 40,
    spd: 85,
    icon: Wind,
    accentColor: '#A855F7',
    description:
      'A swift aerial monstrosity armed with a laser cannon. Created to assassinate the Rito Champion Revali and seize control of the airborne Divine Beast Vah Medoh.',
    image: '/bosses/windblight-ganon.png',
  },
  {
    id: 17,
    name: 'Thunderblight Ganon',
    titleKey: 'Scourge of Divine Beast Vah Naboris',
    typeKey: 'Blight Ganon',
    dungeon: 'Divine Beast Vah Naboris',
    game: 'Breath of the Wild',
    difficulty: 5,
    hp: 75,
    atk: 88,
    def: 55,
    spd: 95,
    icon: Zap,
    accentColor: '#EAB308',
    description:
      'The deadliest of the Blight Ganons, moving at lightning speed with electrical strikes. Widely considered the hardest boss in Breath of the Wild, it defeated the Gerudo Champion Urbosa.',
    image: '/bosses/thunderblight-ganon.png',
  },
  {
    id: 18,
    name: 'Demon King Ganondorf',
    titleKey: 'The Demon King Reborn',
    typeKey: 'Final Boss',
    dungeon: 'Gloom\'s Origin',
    game: 'Tears of the Kingdom',
    difficulty: 5,
    hp: 98,
    atk: 99,
    def: 92,
    spd: 78,
    icon: Skull,
    accentColor: '#8B0000',
    description:
      'The resurrected Demon King at the height of his power, wielding Gloom and the Secret Stone. His health bar extends far beyond the screen — the most epic final battle in Zelda history.',
    image: '/bosses/demon-king-ganondorf.png',
  },
  {
    id: 19,
    name: 'Colgera',
    titleKey: 'Scourge of the Wind Temple',
    typeKey: 'Temple Boss',
    dungeon: 'Wind Temple',
    game: 'Tears of the Kingdom',
    difficulty: 3,
    hp: 65,
    atk: 70,
    def: 40,
    spd: 90,
    icon: Wind,
    accentColor: '#3B82F6',
    description:
      'A massive flying beast covered in ice armor, guarding the Stormwind Ark. Link must skydive through its segmented body, shattering its icy weak points with Tulin\'s gusts.',
    image: '/bosses/colgera.png',
  },
  {
    id: 20,
    name: 'Queen Gibdo',
    titleKey: 'Scourge of the Lightning Temple',
    typeKey: 'Temple Boss',
    dungeon: 'Lightning Temple',
    game: 'Tears of the Kingdom',
    difficulty: 4,
    hp: 78,
    atk: 82,
    def: 60,
    spd: 55,
    icon: Bug,
    accentColor: '#A16207',
    description:
      'The queen of the Gibdo swarm, a towering insectoid horror that commands an army of undead. Light and lightning are the only way to strip its armor and expose its vulnerable core.',
    image: '/bosses/queen-gibdo.png',
  },
  {
    id: 21,
    name: 'Majora',
    titleKey: 'The Masked Demon',
    typeKey: 'Final Boss',
    dungeon: 'Inside the Moon',
    game: 'Majora\'s Mask',
    difficulty: 5,
    hp: 90,
    atk: 92,
    def: 75,
    spd: 88,
    icon: Eye,
    accentColor: '#A855F7',
    description:
      'An ancient and chaotic entity sealed within a mask, driving Skull Kid to madness. Its three phases — Mask, Incarnation, and Wrath — culminate in one of the most disturbing final battles ever created.',
    image: '/bosses/majora.png',
  },
  {
    id: 22,
    name: 'Demise',
    titleKey: 'The Original Demon King',
    typeKey: 'Final Boss',
    dungeon: 'Sealed Grounds',
    game: 'Skyward Sword',
    difficulty: 5,
    hp: 96,
    atk: 97,
    def: 88,
    spd: 75,
    icon: Sword,
    accentColor: '#DC2626',
    description:
      'The primordial source of all evil in the Zelda timeline. After his defeat, Demise curses Link and Zelda\'s descendants — creating the eternal cycle of reincarnation that spawns every incarnation of Ganon.',
    image: '/bosses/demise.png',
  },
  {
    id: 23,
    name: 'Zant',
    titleKey: 'The Usurper King',
    typeKey: 'Final Boss',
    dungeon: 'Palace of Twilight',
    game: 'Twilight Princess',
    difficulty: 4,
    hp: 85,
    atk: 82,
    def: 72,
    spd: 80,
    icon: Crown,
    accentColor: '#704070',
    description:
      'The seemingly composed Usurper King of Twilight descends into madness during his battle, cycling through previous boss arenas in a chaotic and unforgettable final confrontation.',
    image: '/bosses/zant.png',
  },
  {
    id: 24,
    name: 'Helmaroc King',
    titleKey: 'The Masked Bird',
    typeKey: 'Forsaken Fortress Boss',
    dungeon: 'Forsaken Fortress',
    game: 'The Wind Waker',
    difficulty: 3,
    hp: 60,
    atk: 65,
    def: 45,
    spd: 70,
    icon: Crown,
    accentColor: '#E8A040',
    description:
      'A colossal masked bird that terrorizes the Great Sea, snatching young girls for Ganondorf\'s search for Princess Zelda. Link confronts it atop the Forsaken Fortress using his newly acquired Skull Hammer.',
    image: '/bosses/helmaroc-king.png',
  },
  {
    id: 25,
    name: 'Agahnim',
    titleKey: 'The Dark Wizard',
    typeKey: 'Final Boss',
    dungeon: 'Hyrule Castle Tower',
    game: 'A Link to the Past',
    difficulty: 4,
    hp: 75,
    atk: 80,
    def: 55,
    spd: 65,
    icon: Eye,
    accentColor: '#3E6B48',
    description:
      'A mysterious wizard who usurps the throne of Hyrule and sacrifices the Seven Maidens to break Ganon\'s seal. His magic attacks — including the deadly Dead Man\'s Volley — test every skill Link has learned.',
    image: '/bosses/agahnim.png',
  },
  {
    id: 26,
    name: 'Ghirahim',
    titleKey: 'The Demon Lord',
    typeKey: 'Recurring Boss',
    dungeon: 'Sealed Grounds',
    game: 'Skyward Sword',
    difficulty: 4,
    hp: 78,
    atk: 85,
    def: 65,
    spd: 88,
    icon: Sword,
    accentColor: '#C0262D',
    description:
      'A flamboyant and sadistic Demon Lord who serves as Demise\'s right hand. Fought multiple times throughout Skyward Sword, each encounter escalating in difficulty and dramatic tension.',
    image: '/bosses/ghirahim.png',
  },
  {
    id: 27,
    name: 'Molduga',
    titleKey: 'The Desert Leviathan',
    typeKey: 'Field Boss',
    dungeon: 'Gerudo Desert',
    game: 'Breath of the Wild',
    difficulty: 4,
    hp: 82,
    atk: 78,
    def: 60,
    spd: 55,
    icon: Skull,
    accentColor: '#8B6914',
    description:
      'A gargantuan sand-dwelling beast that detects vibrations across the Gerudo Desert. Players must use bombs to lure it to the surface, then strike when it\'s stunned — a thrilling David-vs-Goliath encounter.',
    image: '/bosses/molduga.png',
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
              const bossIsFav = useAppStore((s) => s.isFavorite('boss', boss.id));
              const toggleBossFav = useAppStore((s) => s.toggleFavorite);

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
                      <div className="flex items-center gap-2">
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
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBossFav('boss', boss.id); }}
                          className="p-1 rounded-lg transition-all"
                          style={{ color: bossIsFav ? '#e74c3c' : 'rgba(255,255,255,0.2)' }}
                          aria-label="Toggle favorite"
                        >
                          <Heart size={13} fill={bossIsFav ? 'currentColor' : 'none'} />
                        </button>
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
