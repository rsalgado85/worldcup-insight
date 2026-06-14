export const API_BASE_URL = 'https://zelda.fanapis.com/api';
export const POKEMON_LIMIT = 200;
export const CACHE_PREFIX = 'hyruledex_';
export const CACHE_TTL = 24 * 60 * 60 * 1000;
export const STALE_TIME = 30 * 60 * 1000;

export const ATTRIBUTE_NAMES: Record<string, string> = {
  hp: 'Hearts',
  attack: 'Strength',
  defense: 'Defense',
  'special-attack': 'Wisdom',
  'special-defense': 'Spirit',
  speed: 'Speed',
};

export const ATTRIBUTE_COLORS: Record<string, string> = {
  hp: '#3E6B48',
  attack: '#8B3A3A',
  defense: '#5B8A9E',
  'special-attack': '#C6A15B',
  'special-defense': '#E8D8B0',
  speed: '#8B7E6A',
};

export const RACE_COLORS: Record<string, string> = {
  // Pokémon types (legacy)
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
  // Zelda races
  hylian: '#C6A15B',
  gerudo: '#8B3A3A',
  zora: '#3B7DD8',
  goron: '#D4783B',
  rito: '#E8A040',
  sheikah: '#5B3A8B',
  korok: '#6BA84A',
  monster: '#8B4513',
  boss: '#4A0E0E',
  character: '#C6A15B',
  fairy_zelda: '#E8A0D8',
  twili: '#704070',
  ancient: '#5B8A9E',
  demon: '#8B0000',
  spirit: '#A0C8E8',
  dragon_zelda: '#4A6AB8',
  deku: '#5B8A3B',
  yeti: '#A0C8D8',
  mogma: '#D4783B',
  parella: '#78B8D8',
  kikwi: '#6BA84A',
  robot: '#8A8A8A',
  fairy_race: '#E8A0D8',
  minish: '#6BA84A',
  oocca: '#A890F0',
  subrosian: '#8B4513',
  tokay: '#78C850',
  zuna: '#D4783B',
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CHARACTERS: '/characters',
  BOSSES: '/bosses',
  ITEMS: '/items',
  DUNGEONS: '/dungeons',
  LORE: '/lore',
  WEAPONS: '/weapons',
  GAMES: '/games',
  FAVORITES: '/favorites',
  ABOUT: '/about',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Characters', path: ROUTES.CHARACTERS, icon: 'Users' },
  { label: 'Bosses', path: ROUTES.BOSSES, icon: 'Skull' },
  { label: 'Items', path: ROUTES.ITEMS, icon: 'Package' },
  { label: 'Dungeons', path: ROUTES.DUNGEONS, icon: 'Clock' },
  { label: 'Lore', path: ROUTES.LORE, icon: 'BookOpen' },
  { label: 'Weapons', path: ROUTES.WEAPONS, icon: 'Swords' },
  { label: 'Games', path: ROUTES.GAMES, icon: 'Gamepad2' },
  { label: 'Favorites', path: ROUTES.FAVORITES, icon: 'Heart' },
  { label: 'About', path: ROUTES.ABOUT, icon: 'User' },
] as const;
