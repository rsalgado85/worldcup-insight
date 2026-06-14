import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Sword,
  Shield,
  Crosshair,
  Flame,
  Zap,
  Anchor,
  Gavel,
  Droplets,
  Eye,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

// ─── Weapon data ─────────────────────────────────────────────────────────────

type WeaponCategory = 'Sword' | 'Bow' | 'Shield' | 'Armor' | 'Other';

interface WeaponData {
  id: string;
  name: string;
  nameEs: string;
  atk: number;
  def?: number;
  type: string;
  typeEs: string;
  description: string;
  descriptionEs: string;
  category: WeaponCategory;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  image: string;
}

const WEAPONS: WeaponData[] = [
  // ── Swords (6) ──────────────────────────────────────────────────────────
  {
    id: 'master-sword',
    name: 'Master Sword',
    nameEs: 'Espada Maestra',
    atk: 60,
    type: 'Sacred Light',
    typeEs: 'Luz Sagrada',
    description: "The Blade of Evil's Bane, forged by the Goddess Hylia",
    descriptionEs: 'La Espada del Destierro del Mal, forjada por la Diosa Hylia',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/master_sword.png',
  },
  {
    id: 'biggoron-sword',
    name: "Biggoron's Sword",
    nameEs: 'Espada de Biggoron',
    atk: 50,
    type: 'Heavy Blade',
    typeEs: 'Hoja Pesada',
    description: "Giant's Knife forged by Biggoron",
    descriptionEs: 'Cuchillo Gigante forjado por Biggoron',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/biggoron_sword.png',
  },
  {
    id: 'fierce-deity-sword',
    name: 'Fierce Deity Sword',
    nameEs: 'Espada de la Deidad Feroz',
    atk: 70,
    type: 'Dark Power',
    typeEs: 'Poder Oscuro',
    description: 'Double-helix blade of the Fierce Deity',
    descriptionEs: 'Hoja de doble hélice de la Deidad Feroz',
    category: 'Sword',
    icon: Flame,
    image: '/weapons/fierce_deity_sword.png',
  },
  {
    id: 'goddess-sword',
    name: 'Goddess Sword',
    nameEs: 'Espada de la Diosa',
    atk: 30,
    type: 'Divine Steel',
    typeEs: 'Acero Divino',
    description: 'The sword that became the Master Sword',
    descriptionEs: 'La espada que se convirtió en la Espada Maestra',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/goddess_sword.png',
  },
  {
    id: 'four-sword',
    name: 'Four Sword',
    nameEs: 'Cuatro Espadas',
    atk: 40,
    type: 'Wind Element',
    typeEs: 'Elemento Viento',
    description: 'Splits the wielder into four',
    descriptionEs: 'Divide al portador en cuatro',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/four_sword.png',
  },
  {
    id: 'royal-claymore',
    name: 'Royal Claymore',
    nameEs: 'Mandoble Real',
    atk: 52,
    type: 'Heavy Weapon',
    typeEs: 'Arma Pesada',
    description: 'Two-handed royal guard sword',
    descriptionEs: 'Espada de guardia real a dos manos',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/royal_claymore.png',
  },

  // ── Bows (4) ─────────────────────────────────────────────────────────────
  {
    id: 'heros-bow',
    name: "Hero's Bow",
    nameEs: 'Arco del Héroe',
    atk: 30,
    type: 'Precision',
    typeEs: 'Precisión',
    description: 'Standard bow of the Hero',
    descriptionEs: 'Arco estándar del Héroe',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/heros_bow.png',
  },
  {
    id: 'great-eagle-bow',
    name: 'Great Eagle Bow',
    nameEs: 'Gran Arco del Águila',
    atk: 45,
    type: 'Rapid Fire',
    typeEs: 'Fuego Rápido',
    description: "Revali's champion bow, fires 3 arrows",
    descriptionEs: 'Arco del campeón Revali, dispara 3 flechas',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/great_eagle_bow.png',
  },
  {
    id: 'twilight-bow',
    name: 'Twilight Bow',
    nameEs: 'Arco del Crepúsculo',
    atk: 30,
    type: 'Light Arrows',
    typeEs: 'Flechas de Luz',
    description: 'Fires arrows of pure light',
    descriptionEs: 'Dispara flechas de luz pura',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/twilight_bow.png',
  },
  {
    id: 'bow-of-light',
    name: 'Bow of Light',
    nameEs: 'Arco de Luz',
    atk: 100,
    type: 'Divine Light',
    typeEs: 'Luz Divina',
    description: "Zelda's gift in the final battle",
    descriptionEs: 'El regalo de Zelda en la batalla final',
    category: 'Bow',
    icon: Zap,
    image: '/weapons/bow_of_light.png',
  },

  // ── Other (4) ────────────────────────────────────────────────────────────
  {
    id: 'megaton-hammer',
    name: 'Megaton Hammer',
    nameEs: 'Martillo Megatón',
    atk: 50,
    type: 'Earth-shattering',
    typeEs: 'Rompe-tierras',
    description: 'Goron weapon, breaks boulders',
    descriptionEs: 'Arma Goron, rompe rocas',
    category: 'Other',
    icon: Gavel,
    image: '/weapons/megaton_hammer.png',
  },
  {
    id: 'ball-and-chain',
    name: 'Ball and Chain',
    nameEs: 'Bola y Cadena',
    atk: 45,
    type: 'Devastating',
    typeEs: 'Devastador',
    description: 'Twilight Princess heavy weapon',
    descriptionEs: 'Arma pesada de Twilight Princess',
    category: 'Other',
    icon: Shield,
    image: '/weapons/ball_and_chain.png',
  },
  {
    id: 'hookshot',
    name: 'Hookshot',
    nameEs: 'Gancho',
    atk: 10,
    type: 'Utility',
    typeEs: 'Utilidad',
    description: 'Grappling device, stuns enemies',
    descriptionEs: 'Dispositivo de agarre, aturde enemigos',
    category: 'Other',
    icon: Anchor,
    image: '/weapons/hookshot.png',
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    nameEs: 'Búmeran',
    atk: 10,
    type: 'Stun',
    typeEs: 'Aturdimiento',
    description: 'Returns to sender, stuns targets',
    descriptionEs: 'Siempre regresa, aturde objetivos',
    category: 'Other',
    icon: Zap,
    image: '/weapons/boomerang.png',
  },

  // ── Swords (9 new) ──────────────────────────────────────────────────────
  {
    id: 'white-sword',
    name: 'White Sword',
    nameEs: 'Espada Blanca',
    atk: 40,
    type: 'Sacred Steel',
    typeEs: 'Acero Sagrado',
    description: 'Ancient blade upgraded by the Old Man in the original Legend of Zelda',
    descriptionEs: 'Hoja ancestral mejorada por el Anciano en el Legend of Zelda original',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/white_sword.png',
  },
  {
    id: 'magic-sword',
    name: 'Magic Sword',
    nameEs: 'Espada Mágica',
    atk: 55,
    type: 'Enchanted Blade',
    typeEs: 'Hoja Encantada',
    description: 'The strongest sword in the original Legend of Zelda, infused with ancient magic',
    descriptionEs: 'La espada más fuerte del Legend of Zelda original, imbuida con magia ancestral',
    category: 'Sword',
    icon: Zap,
    image: '/weapons/magic_sword.png',
  },
  {
    id: 'kokiri-sword',
    name: 'Kokiri Sword',
    nameEs: 'Espada Kokiri',
    atk: 15,
    type: 'Training Sword',
    typeEs: 'Espada de Entrenamiento',
    description: 'The treasured blade of the Kokiri, given to Link before his great adventure',
    descriptionEs: 'La preciada hoja de los Kokiri, entregada a Link antes de su gran aventura',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/kokiri_sword.png',
  },
  {
    id: 'gilded-sword',
    name: 'Gilded Sword',
    nameEs: 'Espada Dorada',
    atk: 58,
    type: 'Forged Gold',
    typeEs: 'Oro Forjado',
    description: 'Razor Sword reforged with Gold Dust by the Goron smiths of Termina',
    descriptionEs: 'Espada Afilada reforjada con Polvo de Oro por los herreros Goron de Términa',
    category: 'Sword',
    icon: Flame,
    image: '/weapons/gilded_sword.png',
  },
  {
    id: 'phantom-sword',
    name: 'Phantom Sword',
    nameEs: 'Espada Espectral',
    atk: 65,
    type: 'Spirit Blade',
    typeEs: 'Hoja Espectral',
    description: 'Forged from the purified Phantom Hourglass, this blade can freeze time itself',
    descriptionEs: 'Forjada del Reloj de Arena Espectral purificado, puede congelar el tiempo mismo',
    category: 'Sword',
    icon: Zap,
    image: '/weapons/phantom_sword.png',
  },
  {
    id: 'golden-sword',
    name: 'Golden Sword',
    nameEs: 'Espada Dorada',
    atk: 75,
    type: 'Tempered Masterwork',
    typeEs: 'Obra Maestra Templada',
    description: 'The ultimate upgrade in A Link to the Past, tempered by the Dwarven Swordsmiths',
    descriptionEs: 'La mejora definitiva en A Link to the Past, templada por los Herreros Enanos',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/golden_sword.png',
  },
  {
    id: 'scimitar-of-the-seven',
    name: 'Scimitar of the Seven',
    nameEs: 'Cimitarra de los Siete',
    atk: 62,
    type: 'Gerudo Royal Blade',
    typeEs: 'Hoja Real Gerudo',
    description: 'Legendary blade wielded by the Gerudo Champion Urbosa, crackling with lightning',
    descriptionEs: 'Hoja legendaria empuñada por la Campeona Gerudo Urbosa, crepitante de relámpagos',
    category: 'Sword',
    icon: Zap,
    image: '/weapons/scimitar_seven.png',
  },
  {
    id: 'zora-sword',
    name: 'Zora Sword',
    nameEs: 'Espada Zora',
    atk: 35,
    type: 'Aquatic Blade',
    typeEs: 'Hoja Acuática',
    description: 'Elegant silver blade crafted by the finest Zora smiths of Lanayru',
    descriptionEs: 'Elegante hoja plateada forjada por los mejores herreros Zora de Lanayru',
    category: 'Sword',
    icon: Droplets,
    image: '/weapons/zora_sword.png',
  },
  {
    id: 'gerudo-scimitar',
    name: 'Gerudo Scimitar',
    nameEs: 'Cimitarra Gerudo',
    atk: 38,
    type: 'Desert Blade',
    typeEs: 'Hoja del Desierto',
    description: 'Curved blade favored by the warriors of the Gerudo Desert',
    descriptionEs: 'Hoja curva preferida por los guerreros del Desierto Gerudo',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/gerudo_scimitar.png',
  },

  // ── Shields (7) ─────────────────────────────────────────────────────────
  {
    id: 'hylian-shield',
    name: 'Hylian Shield',
    nameEs: 'Escudo Hyliano',
    atk: 0,
    def: 90,
    type: 'Legendary Shield',
    typeEs: 'Escudo Legendario',
    description: 'The indestructible shield of legend, emblazoned with the Triforce and Crimson Loftwing',
    descriptionEs: 'El escudo indestructible de la leyenda, blasonado con la Trifuerza y el Loftwing Carmesí',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/hylian_shield.png',
  },
  {
    id: 'mirror-shield',
    name: 'Mirror Shield',
    nameEs: 'Escudo Espejo',
    atk: 0,
    def: 75,
    type: 'Reflective Shield',
    typeEs: 'Escudo Reflectante',
    description: 'Polished surface that reflects light and magic — essential for solving puzzles and defeating darkness',
    descriptionEs: 'Superficie pulida que refleja luz y magia — esencial para resolver acertijos y derrotar la oscuridad',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/mirror_shield.png',
  },
  {
    id: 'heros-shield',
    name: "Hero's Shield",
    nameEs: 'Escudo del Héroe',
    atk: 0,
    def: 55,
    type: 'Classic Shield',
    typeEs: 'Escudo Clásico',
    description: 'The standard shield of the Hero, reliable protection throughout the ages',
    descriptionEs: 'El escudo estándar del Héroe, protección confiable a través de las eras',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/heros_shield.png',
  },
  {
    id: 'deku-shield',
    name: 'Deku Shield',
    nameEs: 'Escudo Deku',
    atk: 0,
    def: 25,
    type: 'Wooden Shield',
    typeEs: 'Escudo de Madera',
    description: 'Lightweight wooden shield sold at the Kokiri Shop. Flammable but affordable',
    descriptionEs: 'Escudo ligero de madera vendido en la Tienda Kokiri. Inflamable pero económico',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/deku_shield.png',
  },
  {
    id: 'guardian-shield',
    name: 'Guardian Shield',
    nameEs: 'Escudo Guardián',
    atk: 0,
    def: 65,
    type: 'Ancient Tech',
    typeEs: 'Tecnología Ancestral',
    description: 'Shield crafted from ancient Guardian parts. Automatically deflects Guardian lasers',
    descriptionEs: 'Escudo fabricado con partes ancestrales de Guardián. Desvía automáticamente los láseres',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/guardian_shield.png',
  },
  {
    id: 'royal-shield',
    name: 'Royal Shield',
    nameEs: 'Escudo Real',
    atk: 0,
    def: 70,
    type: 'Royal Guard Gear',
    typeEs: 'Equipo de la Guardia Real',
    description: 'Ornate shield issued to the Royal Guard of Hyrule Castle',
    descriptionEs: 'Escudo ornamentado otorgado a la Guardia Real del Castillo de Hyrule',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/royal_shield.png',
  },
  {
    id: 'daybreaker',
    name: "Daybreaker",
    nameEs: 'Rompealbas',
    atk: 0,
    def: 80,
    type: "Champion's Shield",
    typeEs: 'Escudo de Campeona',
    description: "The golden shield of the Gerudo Champion Urbosa, said to break the dawn itself",
    descriptionEs: 'El escudo dorado de la Campeona Gerudo Urbosa, se dice que rompe el amanecer mismo',
    category: 'Shield',
    icon: Shield,
    image: '/weapons/daybreaker.png',
  },

  // ── Bows (4 new) ────────────────────────────────────────────────────────
  {
    id: 'falcon-bow',
    name: 'Falcon Bow',
    nameEs: 'Arco de Halcón',
    atk: 52,
    type: 'Rito Warbow',
    typeEs: 'Arco de Guerra Rito',
    description: 'Revali\'s signature bow, crafted by the finest Rito fletchers for aerial combat',
    descriptionEs: 'El arco característico de Revali, fabricado por los mejores flecheros Rito para combate aéreo',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/falcon_bow.png',
  },
  {
    id: 'savage-lynel-bow',
    name: 'Savage Lynel Bow',
    nameEs: 'Arco Salvaje de Lynel',
    atk: 68,
    type: 'Multi-shot Bow',
    typeEs: 'Arco de Disparo Múltiple',
    description: 'Fearsome multi-shot bow wielded by the strongest Lynels. Fires a volley of arrows',
    descriptionEs: 'Temible arco de disparo múltiple empuñado por los Lynels más fuertes. Dispara una ráfaga de flechas',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/savage_lynel_bow.png',
  },
  {
    id: 'ancient-bow',
    name: 'Ancient Bow',
    nameEs: 'Arco Ancestral',
    atk: 60,
    type: 'Sheikah Tech',
    typeEs: 'Tecnología Sheikah',
    description: 'High-tech bow from the Akkala Ancient Tech Lab. Fires arrows in perfectly straight lines',
    descriptionEs: 'Arco de alta tecnología del Laboratorio Ancestral de Akkala. Dispara flechas en líneas perfectamente rectas',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/ancient_bow.png',
  },
  {
    id: 'royal-bow',
    name: 'Royal Bow',
    nameEs: 'Arco Real',
    atk: 45,
    type: 'Royal Armament',
    typeEs: 'Armamento Real',
    description: 'Elegant bow issued to Hyrule\'s Royal Guard, balancing power and precision',
    descriptionEs: 'Arco elegante otorgado a la Guardia Real de Hyrule, equilibrando potencia y precisión',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/royal_bow.png',
  },

  // ── Armor & Outfits (10) ─────────────────────────────────────────────────
  {
    id: 'champions-tunic',
    name: "Champion's Tunic",
    nameEs: 'Túnica del Campeón',
    atk: 10,
    def: 50,
    type: 'Hero\'s Garb',
    typeEs: 'Atuendo del Héroe',
    description: 'Traditional Hylian blue tunic worn by the Champion of Hyrule. Reveals enemy health',
    descriptionEs: 'Túnica azul tradicional Hyliana del Campeón de Hyrule. Revela la salud del enemigo',
    category: 'Armor',
    icon: Shield,
    image: '/weapons/champions_tunic.png',
  },
  {
    id: 'zora-armor',
    name: 'Zora Armor',
    nameEs: 'Armadura Zora',
    atk: 5,
    def: 40,
    type: 'Aquatic Gear',
    typeEs: 'Equipo Acuático',
    description: 'Handcrafted by the Zora, this armor lets Link swim up waterfalls and breathe underwater',
    descriptionEs: 'Hecha a mano por los Zora, permite a Link nadar por cascadas y respirar bajo el agua',
    category: 'Armor',
    icon: Droplets,
    image: '/weapons/zora_armor.png',
  },
  {
    id: 'goron-tunic',
    name: 'Goron Tunic',
    nameEs: 'Túnica Goron',
    atk: 5,
    def: 45,
    type: 'Heat-Resistant',
    typeEs: 'Resistente al Calor',
    description: 'Fireproof tunic woven by the Gorons. Essential for surviving Death Mountain',
    descriptionEs: 'Túnica ignífuga tejida por los Gorons. Esencial para sobrevivir en la Montaña de la Muerte',
    category: 'Armor',
    icon: Flame,
    image: '/weapons/goron_tunic.png',
  },
  {
    id: 'hero-of-time-set',
    name: 'Hero of Time Set',
    nameEs: 'Conjunto del Héroe del Tiempo',
    atk: 8,
    def: 42,
    type: 'Classic Garb',
    typeEs: 'Atuendo Clásico',
    description: 'The iconic green tunic and cap of the Hero of Time, legendary across all eras',
    descriptionEs: 'La icónica túnica verde y gorro del Héroe del Tiempo, legendaria en todas las eras',
    category: 'Armor',
    icon: Sword,
    image: '/weapons/hero_of_time.png',
  },
  {
    id: 'sheikah-set',
    name: 'Sheikah Set',
    nameEs: 'Conjunto Sheikah',
    atk: 8,
    def: 32,
    type: 'Stealth Gear',
    typeEs: 'Equipo de Sigilo',
    description: 'Traditional Sheikah stealth suit that muffles footsteps and increases night speed',
    descriptionEs: 'Traje de sigilo tradicional Sheikah que amortigua pisadas y aumenta velocidad nocturna',
    category: 'Armor',
    icon: Eye,
    image: '/weapons/sheikah_set.png',
  },
  {
    id: 'barbarian-set',
    name: 'Barbarian Set',
    nameEs: 'Conjunto Bárbaro',
    atk: 20,
    def: 30,
    type: 'War Paint',
    typeEs: 'Pintura de Guerra',
    description: 'Fierce war paint and furs of an ancient warlike tribe. Boosts attack power',
    descriptionEs: 'Feroz pintura de guerra y pieles de una antigua tribu guerrera. Aumenta el poder de ataque',
    category: 'Armor',
    icon: Flame,
    image: '/weapons/barbarian_set.png',
  },
  {
    id: 'dark-link',
    name: 'Dark Link Armor',
    nameEs: 'Armadura de Link Oscuro',
    atk: 12,
    def: 38,
    type: 'Shadow Garb',
    typeEs: 'Atuendo Sombrío',
    description: 'Shadowy armor that embodies the darkness within the Hero. Increases night speed',
    descriptionEs: 'Armadura sombría que encarna la oscuridad dentro del Héroe. Aumenta velocidad nocturna',
    category: 'Armor',
    icon: Eye,
    image: '/weapons/dark_link_armor.png',
  },
  {
    id: 'fierce-deity-armor',
    name: 'Fierce Deity Armor',
    nameEs: 'Armadura de la Deidad Feroz',
    atk: 25,
    def: 45,
    type: 'Godly Power',
    typeEs: 'Poder Divino',
    description: 'The legendary armor of the Fierce Deity, transforming Link into a god-like warrior',
    descriptionEs: 'La legendaria armadura de la Deidad Feroz, transformando a Link en un guerrero divino',
    category: 'Armor',
    icon: Zap,
    image: '/weapons/fierce_deity_armor.png',
  },
  {
    id: 'climbing-gear',
    name: 'Climbing Gear',
    nameEs: 'Equipo de Escalada',
    atk: 3,
    def: 20,
    type: 'Mobility',
    typeEs: 'Movilidad',
    description: 'Lightweight bandana and gear that dramatically increases climbing speed',
    descriptionEs: 'Bandana y equipo ligero que aumenta drásticamente la velocidad de escalada',
    category: 'Armor',
    icon: Sword,
    image: '/weapons/climbing_gear.png',
  },
  {
    id: 'royal-guard-uniform',
    name: 'Royal Guard Uniform',
    nameEs: 'Uniforme de Guardia Real',
    atk: 6,
    def: 48,
    type: 'Ceremonial Armor',
    typeEs: 'Armadura Ceremonial',
    description: 'Pristine uniform of Hyrule\'s elite Royal Guard. High defense but fragile durability',
    descriptionEs: 'Uniforme impecable de la élite de la Guardia Real de Hyrule. Alta defensa pero frágil',
    category: 'Armor',
    icon: Shield,
    image: '/weapons/royal_guard_set.png',
  },
];

// ─── Category metadata ──────────────────────────────────────────────────────

interface CategoryMeta {
  key: WeaponCategory;
  labelEn: string;
  labelEs: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  gradientStart: string;
  gradientEnd: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'Sword',
    labelEn: 'Swords',
    labelEs: 'Espadas',
    accentColor: '#C6A15B',
    badgeBg: 'rgba(198, 161, 91, 0.15)',
    badgeText: '#E8D8B0',
    iconBg: 'rgba(198, 161, 91, 0.1)',
    iconColor: '#C6A15B',
    borderColor: 'rgba(198, 161, 91, 0.25)',
    gradientStart: '#E8D8B0',
    gradientEnd: '#C6A15B',
  },
  {
    key: 'Bow',
    labelEn: 'Bows',
    labelEs: 'Arcos',
    accentColor: '#3E6B48',
    badgeBg: 'rgba(62, 107, 72, 0.15)',
    badgeText: '#6BAF7A',
    iconBg: 'rgba(62, 107, 72, 0.1)',
    iconColor: '#3E6B48',
    borderColor: 'rgba(62, 107, 72, 0.25)',
    gradientStart: '#6BAF7A',
    gradientEnd: '#3E6B48',
  },
  {
    key: 'Shield',
    labelEn: 'Shields',
    labelEs: 'Escudos',
    accentColor: '#3B82F6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    badgeText: '#7BA8F8',
    iconBg: 'rgba(59, 130, 246, 0.1)',
    iconColor: '#3B82F6',
    borderColor: 'rgba(59, 130, 246, 0.25)',
    gradientStart: '#7BA8F8',
    gradientEnd: '#3B82F6',
  },
  {
    key: 'Armor',
    labelEn: 'Armor & Outfits',
    labelEs: 'Armaduras y Trajes',
    accentColor: '#8B5CF6',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    badgeText: '#B794F6',
    iconBg: 'rgba(139, 92, 246, 0.1)',
    iconColor: '#8B5CF6',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    gradientStart: '#B794F6',
    gradientEnd: '#8B5CF6',
  },
  {
    key: 'Other',
    labelEn: 'Other',
    labelEs: 'Otros',
    accentColor: '#5B8A9E',
    badgeBg: 'rgba(91, 138, 158, 0.15)',
    badgeText: '#7DB8CB',
    iconBg: 'rgba(91, 138, 158, 0.1)',
    iconColor: '#5B8A9E',
    borderColor: 'rgba(91, 138, 158, 0.25)',
    gradientStart: '#7DB8CB',
    gradientEnd: '#5B8A9E',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function WeaponsPage() {
  const { language } = useAppStore();

  const grouped = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        weapons: WEAPONS.filter((w) => w.category === cat.key),
      })),
    [],
  );

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('weapons.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          {t('weapons.subtitle', language)}
        </p>
      </motion.div>

      {/* ── Decorative Triforce divider ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(198, 161, 91, 0.4), rgba(62, 107, 72, 0.3), rgba(198, 161, 91, 0.4), transparent)',
        }}
      />

      {/* ── Category sections ───────────────────────────────────────────── */}
      {grouped.map((category, catIndex) => (
        <motion.section
          key={category.key}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + catIndex * 0.12, duration: 0.5 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Category header */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-1 h-5 sm:h-6 rounded-full"
              style={{ backgroundColor: category.accentColor }}
            />
            <h2 className="text-base sm:text-lg font-semibold text-text-primary">
              {language === 'es' ? category.labelEs : category.labelEn}
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
              style={{
                backgroundColor: category.badgeBg,
                color: category.badgeText,
              }}
            >
              {category.weapons.length}
            </span>
          </div>

          {/* Weapons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {category.weapons.map((weapon, index) => {
              const Icon = weapon.icon;
              const atkPercent = Math.min((weapon.atk / 100) * 100, 100);

              return (
                <motion.div
                  key={weapon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + catIndex * 0.12 + index * 0.05,
                    duration: 0.4,
                  }}
                  className="glass-card-hover p-3 sm:p-4 group"
                  style={{ borderLeft: `2px solid ${category.borderColor}` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: category.iconBg,
                        color: category.iconColor,
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Name + type badge */}
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                          {language === 'es' ? weapon.nameEs : weapon.name}
                        </h3>
                        <span
                          className="shrink-0 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: category.badgeBg,
                            color: category.badgeText,
                          }}
                        >
                          {language === 'es' ? weapon.typeEs : weapon.type}
                        </span>
                      </div>

                      {/* Weapon Image */}
                      <div className="mt-2 mb-2 flex justify-center">
                        <div
                          className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${category.iconBg}, transparent)`,
                            border: `1px solid ${category.borderColor}`,
                          }}
                        >
                          <img
                            src={weapon.image}
                            alt={weapon.name}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 line-clamp-2">
                        {language === 'es'
                          ? weapon.descriptionEs
                          : weapon.description}
                      </p>

                      {/* ATK stat */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <span
                            className="font-semibold"
                            style={{ color: category.accentColor }}
                          >
                            {t('weapons.attack', language)}
                          </span>
                          <span className="font-bold text-text-primary">
                            {weapon.atk}
                          </span>
                        </div>

                        {/* Damage progress bar */}
                        <div
                          className="h-1.5 sm:h-2 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${atkPercent}%` }}
                            transition={{
                              delay:
                                0.4 + catIndex * 0.12 + index * 0.05,
                              duration: 0.8,
                              ease: 'easeOut',
                            }}
                            style={{
                              background: `linear-gradient(90deg, ${category.gradientStart}, ${category.gradientEnd})`,
                              boxShadow: `0 0 6px ${category.accentColor}40`,
                            }}
                          />
                        </div>
                      </div>

                      {/* DEF stat — only for shields and armor */}
                      {weapon.def != null && weapon.def > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px] sm:text-xs">
                            <span
                              className="font-semibold"
                              style={{ color: category.accentColor }}
                            >
                              {t('weapons.defense', language)}
                            </span>
                            <span className="font-bold text-text-primary">
                              {weapon.def}
                            </span>
                          </div>
                          <div
                            className="h-1.5 sm:h-2 rounded-full overflow-hidden"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            }}
                          >
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((weapon.def / 100) * 100, 100)}%` }}
                              transition={{
                                delay:
                                  0.5 + catIndex * 0.12 + index * 0.05,
                                duration: 0.8,
                                ease: 'easeOut',
                              }}
                              style={{
                                background: `linear-gradient(90deg, ${category.gradientStart}, ${category.gradientEnd})`,
                                boxShadow: `0 0 6px ${category.accentColor}40`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      ))}

      {/* ── Footer Triforce ornament ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex items-center justify-center gap-4 sm:gap-6 py-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-xl sm:text-2xl select-none"
            style={{ color: 'rgba(198, 161, 91, 0.3)' }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
          >
            ▲
          </motion.span>
        ))}
      </motion.div>

      {/* ── Stats summary ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="rounded-2xl p-4 sm:p-5 text-center"
        style={{
          background: 'rgba(198, 161, 91, 0.03)',
          border: '1px solid rgba(198, 161, 91, 0.06)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
        }}
      >
        <p className="text-xs sm:text-sm text-text-secondary">
          {language === 'es'
            ? `${WEAPONS.length} armas legendarias · 3 categorías · Forjadas en Hyrule`
            : `${WEAPONS.length} legendary weapons · 3 categories · Forged in Hyrule`}
        </p>
      </motion.div>
    </div>
  );
}
