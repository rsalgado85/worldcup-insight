'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Crown,
  Skull,
  Eye,
  Mountain,
  Droplets,
  Wind,
  Zap,
  Sparkles,
  Moon,
  Star,
  ShoppingBag,
  Search,
  Filter,
  X,
  Heart,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { RACE_COLORS } from '@/constants';
import type { FavoriteType } from '@/store/useAppStore';

/* ─── Character Data ─────────────────────────────────── */

export interface CharacterData {
  id: number;
  name: string;
  race: string;
  description: string;
  descriptionEs: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  image: string;
  game: string;
  gameEs: string;
  role: string;
  roleEs: string;
  weapon: string;
  weaponEs: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
}

export const CHARACTERS: CharacterData[] = [
  {
    id: 1,
    name: 'Link',
    race: 'hylian',
    description: 'The Hero of Hyrule, wielder of the Master Sword. Embodiment of Courage.',
    descriptionEs: 'El Héroe de Hyrule, portador de la Espada Maestra. Encarnación del Valor.',
    icon: Swords,
    image: '/characters/link.png',
    game: 'The Legend of Zelda',
    gameEs: 'The Legend of Zelda',
    role: 'Hero of Hyrule',
    roleEs: 'Héroe de Hyrule',
    weapon: 'Master Sword',
    weaponEs: 'Espada Maestra',
    hp: 85,
    atk: 90,
    def: 80,
    spd: 88,
  },
  {
    id: 2,
    name: 'Princess Zelda',
    race: 'hylian',
    description: 'Princess of Hyrule, bearer of the Triforce of Wisdom. Leader and scholar.',
    descriptionEs: 'Princesa de Hyrule, portadora de la Trifuerza de la Sabiduría. Líder y erudita.',
    icon: Crown,
    image: '/characters/zelda.png',
    game: 'The Legend of Zelda',
    gameEs: 'The Legend of Zelda',
    role: 'Princess of Hyrule',
    roleEs: 'Princesa de Hyrule',
    weapon: 'Bow of Light',
    weaponEs: 'Arco de Luz',
    hp: 70,
    atk: 45,
    def: 60,
    spd: 75,
  },
  {
    id: 3,
    name: 'Ganondorf',
    race: 'gerudo',
    description: 'The King of Evil, bearer of the Triforce of Power. Gerudo warlord.',
    descriptionEs: 'El Rey del Mal, portador de la Trifuerza del Poder. Señor de la guerra Gerudo.',
    icon: Skull,
    image: '/characters/ganondorf.png',
    game: 'Ocarina of Time',
    gameEs: 'Ocarina of Time',
    role: 'Demon King',
    roleEs: 'Rey Demonio',
    weapon: 'Sword of the Sages',
    weaponEs: 'Espada de los Sabios',
    hp: 95,
    atk: 95,
    def: 85,
    spd: 60,
  },
  {
    id: 4,
    name: 'Impa',
    race: 'sheikah',
    description: 'Loyal guardian of Princess Zelda and leader of the Sheikah clan.',
    descriptionEs: 'Guardiana leal de la Princesa Zelda y líder del clan Sheikah.',
    icon: Eye,
    image: '/characters/impa.png',
    game: 'Ocarina of Time',
    gameEs: 'Ocarina of Time',
    role: 'Sheikah Leader',
    roleEs: 'Líder Sheikah',
    weapon: 'Kodachi Blades',
    weaponEs: 'Espadas Kodachi',
    hp: 65,
    atk: 75,
    def: 55,
    spd: 90,
  },
  {
    id: 5,
    name: 'Daruk',
    race: 'goron',
    description: 'Champion of the Gorons and pilot of the Divine Beast Vah Rudania.',
    descriptionEs: 'Campeón de los Goron y piloto de la Bestia Divina Vah Rudania.',
    icon: Mountain,
    image: '/characters/daruk.png',
    game: "Breath of the Wild",
    gameEs: "Breath of the Wild",
    role: 'Goron Champion',
    roleEs: 'Campeón Goron',
    weapon: 'Boulder Breaker',
    weaponEs: 'Romperrocas',
    hp: 90,
    atk: 80,
    def: 95,
    spd: 35,
  },
  {
    id: 6,
    name: 'Mipha',
    race: 'zora',
    description: 'Champion of the Zoras and pilot of the Divine Beast Vah Ruta. Gifted healer.',
    descriptionEs: 'Campeona de los Zora y piloto de la Bestia Divina Vah Ruta. Sanadora talentosa.',
    icon: Droplets,
    image: '/characters/mipha.png',
    game: "Breath of the Wild",
    gameEs: "Breath of the Wild",
    role: 'Zora Champion',
    roleEs: 'Campeona Zora',
    weapon: 'Lightscale Trident',
    weaponEs: 'Tridente Escama de Luz',
    hp: 60,
    atk: 55,
    def: 50,
    spd: 80,
  },
  {
    id: 7,
    name: 'Revali',
    race: 'rito',
    description: 'Champion of the Rito and pilot of the Divine Beast Vah Medoh. Master archer.',
    descriptionEs: 'Campeón de los Rito y piloto de la Bestia Divina Vah Medoh. Arquero maestro.',
    icon: Wind,
    image: '/characters/revali.png',
    game: "Breath of the Wild",
    gameEs: "Breath of the Wild",
    role: 'Rito Champion',
    roleEs: 'Campeón Rito',
    weapon: 'Great Eagle Bow',
    weaponEs: 'Gran Arco del Águila',
    hp: 55,
    atk: 70,
    def: 40,
    spd: 95,
  },
  {
    id: 8,
    name: 'Urbosa',
    race: 'gerudo',
    description: 'Champion of the Gerudo and pilot of the Divine Beast Vah Naboris.',
    descriptionEs: 'Campeona de los Gerudo y piloto de la Bestia Divina Vah Naboris.',
    icon: Zap,
    image: '/characters/urbosa.png',
    game: "Breath of the Wild",
    gameEs: "Breath of the Wild",
    role: 'Gerudo Champion',
    roleEs: 'Campeona Gerudo',
    weapon: 'Scimitar of the Seven',
    weaponEs: 'Cimitarra de las Siete',
    hp: 75,
    atk: 85,
    def: 65,
    spd: 70,
  },
  {
    id: 9,
    name: 'Fi',
    race: 'spirit',
    description: 'The spirit of the Master Sword, created by the goddess Hylia.',
    descriptionEs: 'El espíritu de la Espada Maestra, creado por la diosa Hylia.',
    icon: Sparkles,
    image: '/characters/fi.png',
    game: 'Skyward Sword',
    gameEs: 'Skyward Sword',
    role: 'Sword Spirit',
    roleEs: 'Espíritu de la Espada',
    weapon: 'Master Sword (inhabits)',
    weaponEs: 'Espada Maestra (habita)',
    hp: 50,
    atk: 40,
    def: 35,
    spd: 85,
  },
  {
    id: 10,
    name: 'Midna',
    race: 'twili',
    description: 'The Twilight Princess, ruler of the Twilight Realm.',
    descriptionEs: 'La Princesa del Crepúsculo, gobernante del Reino del Crepúsculo.',
    icon: Moon,
    image: '/characters/midna.png',
    game: 'Twilight Princess',
    gameEs: 'Twilight Princess',
    role: 'Twilight Princess',
    roleEs: 'Princesa del Crepúsculo',
    weapon: 'Fused Shadows',
    weaponEs: 'Sombras Fusionadas',
    hp: 70,
    atk: 65,
    def: 55,
    spd: 80,
  },
  {
    id: 11,
    name: 'Tingle',
    race: 'hylian',
    description: 'The fairy-obsessed map maker. Dreams of becoming a fairy.',
    descriptionEs: 'El cartógrafo obsesionado con las hadas. Sueña con convertirse en hada.',
    icon: Star,
    image: '/characters/tingle.png',
    game: "Majora's Mask",
    gameEs: "Majora's Mask",
    role: 'Map Maker',
    roleEs: 'Cartógrafo',
    weapon: 'Tingle Tuner',
    weaponEs: 'Sintonizador Tingle',
    hp: 30,
    atk: 15,
    def: 20,
    spd: 40,
  },
  {
    id: 12,
    name: 'Beedle',
    race: 'hylian',
    description: 'The traveling merchant who roams Hyrule selling goods.',
    descriptionEs: 'El comerciante viajero que recorre Hyrule vendiendo mercancías.',
    icon: ShoppingBag,
    image: '/characters/beedle.png',
    game: 'The Wind Waker',
    gameEs: 'The Wind Waker',
    role: 'Traveling Merchant',
    roleEs: 'Comerciante Viajero',
    weapon: 'Beetle Ship',
    weaponEs: 'Barco Escarabajo',
    hp: 25,
    atk: 10,
    def: 15,
    spd: 50,
  },
  {
    id: 13,
    name: 'Sidon',
    race: 'zora',
    description: 'Prince of the Zora and the Sage of Water. Wields a lightscale trident and fights alongside Link against the Upheaval.',
    descriptionEs: 'Príncipe de los Zora y Sabio del Agua. Empuña un tridente de escamas de luz y lucha junto a Link contra el Cataclismo.',
    icon: Droplets,
    image: '/characters/sidon.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Sage of Water',
    roleEs: 'Sabio del Agua',
    weapon: 'Lightscale Trident',
    weaponEs: 'Tridente Escama de Luz',
    hp: 85,
    atk: 82,
    def: 78,
    spd: 88,
  },
  {
    id: 14,
    name: 'Tulin',
    race: 'rito',
    description: 'Young Rito warrior and the Sage of Wind. Son of Teba, he masters the Great Eagle Bow and creates powerful gusts.',
    descriptionEs: 'Joven guerrero Rito y Sabio del Viento. Hijo de Teba, domina el Gran Arco del Águila y crea poderosas ráfagas.',
    icon: Wind,
    image: '/characters/tulin.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Sage of Wind',
    roleEs: 'Sabio del Viento',
    weapon: 'Great Eagle Bow',
    weaponEs: 'Gran Arco del Águila',
    hp: 72,
    atk: 78,
    def: 65,
    spd: 95,
  },
  {
    id: 15,
    name: 'Yunobo',
    race: 'goron',
    description: 'President of YunoboCo and the Sage of Fire. Uses his powerful rolling attack and Daruk\'s Protection to shield allies.',
    descriptionEs: 'Presidente de YunoboCo y Sabio del Fuego. Usa su poderoso ataque rodante y la Protección de Daruk para escudar aliados.',
    icon: Mountain,
    image: '/characters/yunobo.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Sage of Fire',
    roleEs: 'Sabio del Fuego',
    weapon: 'Boulder Breaker',
    weaponEs: 'Romperrocas',
    hp: 95,
    atk: 90,
    def: 92,
    spd: 40,
  },
  {
    id: 16,
    name: 'Riju',
    race: 'gerudo',
    description: 'Chief of the Gerudo and the Sage of Lightning. Channels lightning through her Scimitars of the Seven to strike enemies.',
    descriptionEs: 'Jefa de las Gerudo y Sabia del Rayo. Canaliza relámpagos a través de sus Cimitarras de los Siete para fulminar enemigos.',
    icon: Zap,
    image: '/characters/riju.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Sage of Lightning',
    roleEs: 'Sabia del Rayo',
    weapon: 'Scimitars of the Seven',
    weaponEs: 'Cimitarras de los Siete',
    hp: 70,
    atk: 85,
    def: 60,
    spd: 92,
  },
  {
    id: 17,
    name: 'Rauru',
    race: 'zonai',
    description: 'The first King of Hyrule and a member of the ancient Zonai tribe. Sacrificed himself to seal Ganondorf beneath Hyrule Castle.',
    descriptionEs: 'El primer Rey de Hyrule y miembro de la antigua tribu Zonai. Se sacrificó para sellar a Ganondorf bajo el Castillo de Hyrule.',
    icon: Crown,
    image: '/characters/rauru.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'First King of Hyrule',
    roleEs: 'Primer Rey de Hyrule',
    weapon: 'Secret Stone (Light)',
    weaponEs: 'Piedra Secreta (Luz)',
    hp: 90,
    atk: 75,
    def: 80,
    spd: 70,
  },
  {
    id: 18,
    name: 'Sonia',
    race: 'hylian',
    description: 'Queen of ancient Hyrule and wife of Rauru. Possesses the power to manipulate time, which she used alongside Rauru\'s light.',
    descriptionEs: 'Reina del antiguo Hyrule y esposa de Rauru. Posee el poder de manipular el tiempo, que usaba junto a la luz de Rauru.',
    icon: Moon,
    image: '/characters/sonia.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Queen of Hyrule',
    roleEs: 'Reina de Hyrule',
    weapon: 'Secret Stone (Time)',
    weaponEs: 'Piedra Secreta (Tiempo)',
    hp: 65,
    atk: 45,
    def: 55,
    spd: 75,
  },
  {
    id: 19,
    name: 'Purah',
    race: 'sheikah',
    description: 'Director of Lookout Landing and lead researcher of ancient Sheikah and Zonai technology. Inventor of the Purah Pad.',
    descriptionEs: 'Directora de Vigía y jefa de investigación de la antigua tecnología Sheikah y Zonai. Inventora del Purah Pad.',
    icon: Eye,
    image: '/characters/purah.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Lead Researcher',
    roleEs: 'Investigadora Jefe',
    weapon: 'Purah Pad',
    weaponEs: 'Purah Pad',
    hp: 40,
    atk: 30,
    def: 35,
    spd: 55,
  },
  {
    id: 20,
    name: 'Master Kohga',
    race: 'sheikah',
    description: 'The bumbling yet dangerous leader of the Yiga Clan. Obsessed with bananas and Mighty Bananas, he constantly harasses Link in the Depths.',
    descriptionEs: 'El torpe pero peligroso líder del Clan Yiga. Obsesionado con los plátanos y Plátanos Vigorosos, acosa constantemente a Link en las Profundidades.',
    icon: Eye,
    image: '/characters/master-kohga.png',
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    role: 'Yiga Clan Leader',
    roleEs: 'Líder del Clan Yiga',
    weapon: 'Demon Carver',
    weaponEs: 'Cuchilla Demoníaca',
    hp: 75,
    atk: 70,
    def: 50,
    spd: 65,
  },
  {
    id: 21,
    name: 'King Rhoam',
    race: 'hylian',
    description: 'The last King of Hyrule before the Great Calamity. Guided Link as the Old Man on the Great Plateau after his spirit lingered.',
    descriptionEs: 'El último Rey de Hyrule antes del Gran Cataclismo. Guió a Link como el Anciano en la Gran Meseta después de que su espíritu permaneciera.',
    icon: Crown,
    image: '/characters/king-rhoam.png',
    game: 'Breath of the Wild',
    gameEs: 'Breath of the Wild',
    role: 'King of Hyrule',
    roleEs: 'Rey de Hyrule',
    weapon: 'Royal Claymore',
    weaponEs: 'Mandoble Real',
    hp: 80,
    atk: 75,
    def: 70,
    spd: 45,
  },
];

/* ─── Race labels ─────────────────────────────────────── */

const RACE_LABELS: Record<string, { en: string; es: string }> = {
  hylian: { en: 'Hylian', es: 'Hyliano' },
  gerudo: { en: 'Gerudo', es: 'Gerudo' },
  sheikah: { en: 'Sheikah', es: 'Sheikah' },
  goron: { en: 'Goron', es: 'Goron' },
  zora: { en: 'Zora', es: 'Zora' },
  rito: { en: 'Rito', es: 'Rito' },
  spirit: { en: 'Spirit', es: 'Espíritu' },
  twili: { en: 'Twili', es: 'Twili' },
  zonai: { en: 'Zonai', es: 'Zonai' },
};

/* ─── Sub-components ──────────────────────────────────── */

function CharacterCard({
  character,
  index,
  language,
  isExpanded,
  onToggle,
  onRaceClick,
}: {
  character: CharacterData;
  index: number;
  language: 'en' | 'es';
  isExpanded: boolean;
  onToggle: () => void;
  onRaceClick: (race: string) => void;
}) {
  const { theme, isFavorite, toggleFavorite } = useAppStore();
  const isDark = theme === 'dark';
  const fav = isFavorite('character', character.id);

  const raceColor = RACE_COLORS[character.race] || '#C6A15B';
  const raceLabel = RACE_LABELS[character.race]
    ? RACE_LABELS[character.race][language]
    : character.race;
  const Icon = character.icon;
  const description =
    language === 'es' ? character.descriptionEs : character.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: (index % 6) * 0.08,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onToggle}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: isDark
          ? `linear-gradient(145deg, ${raceColor}0D 0%, rgba(12, 16, 20, 0.95) 50%, ${raceColor}08 100%)`
          : `linear-gradient(145deg, ${raceColor}10 0%, rgba(255, 255, 255, 0.95) 50%, ${raceColor}05 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${raceColor}22`,
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 60px ${raceColor}15, 0 0 40px ${raceColor}10`,
        }}
      />

      {/* Decorative corner accent */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, ${raceColor}, transparent)`,
        }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header row: icon + race badge + fav */}
        <div className="flex items-center justify-between mb-4">
          {/* Icon circle */}
          <div className="flex items-center gap-2">
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${raceColor}18`,
              border: `1px solid ${raceColor}30`,
            }}
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon size={22} className="flex-shrink-0" />
          </motion.div>

          {/* Favorite button */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite('character', character.id); }}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: fav ? '#e74c3c' : isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)' }}
            aria-label="Toggle favorite"
          >
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
          </div>

          {/* Race badge — clickable to filter */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onRaceClick(character.race); }}
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
            style={{
              backgroundColor: `${raceColor}20`,
              color: raceColor,
              border: `1px solid ${raceColor}35`,
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            title={language === 'es' ? `Filtrar por ${raceLabel}` : `Filter by ${raceLabel}`}
          >
            {raceLabel}
          </motion.button>
        </div>

        {/* Name */}
        <h3
          className="text-lg font-black tracking-tight mb-2"
          style={{
            color: isDark ? '#F0ECE4' : '#1A1510',
          }}
        >
          {character.name}
        </h3>

        {/* Character Image */}
        <div className="mb-3 flex justify-center">
          <motion.div
            className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${raceColor}15 0%, ${raceColor}08 100%)`,
              border: `1px solid ${raceColor}25`,
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={character.image}
              alt={character.name}
              className="w-full h-full object-contain p-2"
              loading="lazy"
            />
            {/* Subtle bottom gradient overlay */}
            <div
              className="absolute inset-x-0 bottom-0 h-8"
              style={{
                background: `linear-gradient(to top, ${raceColor}10, transparent)`,
              }}
            />
          </motion.div>
        </div>

        {/* Meta: Game + Role + Weapon */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary/60">
            <span className="text-text-secondary/40">🎮</span>
            <span>{language === 'es' ? character.gameEs : character.game}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary/60">
            <span className="text-text-secondary/40">⭐</span>
            <span>{language === 'es' ? character.roleEs : character.role}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-secondary/60">
            <span className="text-text-secondary/40">⚔️</span>
            <span>{language === 'es' ? character.weaponEs : character.weapon}</span>
          </div>
        </div>

        {/* Stat Bars */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
          {[
            { label: '❤️', value: character.hp, color: '#3E6B48' },
            { label: '⚔️', value: character.atk, color: '#8B3A3A' },
            { label: '🛡️', value: character.def, color: '#5B8A9E' },
            { label: '⚡', value: character.spd, color: '#C6A15B' },
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

        {/* Description — expandable on click */}
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : '3.6rem',
            opacity: 1,
          }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p
            className="text-xs leading-relaxed"
            style={{
              color: isDark ? 'rgba(240, 236, 228, 0.55)' : 'rgba(26, 21, 16, 0.55)',
            }}
          >
            {description}
          </p>
        </motion.div>

        {/* Bottom bar with id */}
        <div
          className="mt-4 pt-3 flex items-center justify-between border-t"
          style={{ borderColor: `${raceColor}15` }}
        >
          <span
            className="text-[10px] font-mono tracking-wider"
            style={{ color: `${raceColor}99` }}
          >
            #{String(character.id).padStart(2, '0')}
          </span>

          {/* Toggle indicator */}
          <motion.span
            className="text-[10px] font-medium transition-opacity duration-300"
            style={{ color: raceColor }}
          >
            {isExpanded
              ? language === 'es' ? 'Ver menos ↑' : 'Show less ↑'
              : language === 'es' ? 'Ver más ↓' : 'Show more ↓'}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */

export function CharactersPage() {
  const { language, theme } = useAppStore();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredCharacters = useMemo(() => {
    let chars = CHARACTERS;
    
    // Filter by selected race
    if (selectedRace) {
      chars = chars.filter((c) => c.race === selectedRace);
    }
    
    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase();
      chars = chars.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.race.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.descriptionEs.toLowerCase().includes(query)
      );
    }
    
    return chars;
  }, [search, selectedRace]);

  // Race count summary
  const raceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CHARACTERS.forEach((c) => {
      counts[c.race] = (counts[c.race] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Triforce decorative element */}
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <motion.polygon
              points="14,0 0,24 28,24"
              fill="none"
              stroke="#C6A15B"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: 'easeInOut' }}
            />
            <motion.polygon
              points="14,5 6,20 22,20"
              fill="none"
              stroke="#C6A15B"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeInOut' }}
            />
          </svg>

          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #C6A15B, #E8D8B0, #C6A15B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('characters.title', language)}
            </h1>
            <p
              className="text-xs sm:text-sm mt-0.5"
              style={{
                color: isDark ? 'rgba(240, 236, 228, 0.5)' : 'rgba(26, 21, 16, 0.5)',
              }}
            >
              {t('characters.subtitle', language)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Search & Race Pills ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            size={15}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Buscar personajes...'
                : 'Search characters...'
            }
            className="w-full rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? '#F0ECE4' : '#1A1510',
            }}
            aria-label={language === 'es' ? 'Buscar personajes' : 'Search characters'}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/5 transition-colors"
              aria-label={t('common.clear', language)}
            >
              <X size={14} className="text-text-secondary" />
            </button>
          )}
        </div>

        {/* Race filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1 mr-1">
            <Filter size={11} />
            {language === 'es' ? 'Razas' : 'Races'}
          </span>
          {/* Clear filter button */}
          {selectedRace && (
            <button
              onClick={() => setSelectedRace(null)}
              className="px-2 py-1 rounded-full text-[10px] font-semibold transition-all"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              ✕ {language === 'es' ? 'Todas' : 'All'}
            </button>
          )}
          {Object.entries(raceCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([race, count]) => {
              const color = RACE_COLORS[race] || '#C6A15B';
              const label = RACE_LABELS[race]?.[language] || race;
              const isActive = selectedRace === race;
              return (
                <motion.button
                  key={race}
                  onClick={() => setSelectedRace(isActive ? null : race)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-pointer transition-all"
                  style={{
                    backgroundColor: isActive ? color : `${color}18`,
                    color: isActive ? '#ffffff' : color,
                    border: `1px solid ${isActive ? color : `${color}30`}`,
                    boxShadow: isActive ? `0 0 12px ${color}44` : 'none',
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label} · {count}
                </motion.button>
              );
            })}
        </div>
      </motion.div>

      {/* ── Character Grid ── */}
      <AnimatePresence mode="wait">
        {filteredCharacters.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 sm:p-14 text-center rounded-2xl"
          >
            <Search
              size={36}
              className="mx-auto mb-4"
              style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: isDark ? 'rgba(240,236,228,0.5)' : 'rgba(26,21,16,0.5)' }}
            >
              {t('common.noResults', language)}
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: '#C6A15B18',
                color: '#C6A15B',
                border: '1px solid #C6A15B30',
              }}
            >
              {t('common.clear', language)}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filteredCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                language={language}
                isExpanded={expandedId === character.id}
                onToggle={() => setExpandedId(expandedId === character.id ? null : character.id)}
                onRaceClick={(race) => setSelectedRace(race)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Triforce footer accent ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-2 pb-4"
      >
        <div className="flex items-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#C6A15B' }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
