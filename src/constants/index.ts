export const API_BASE_URL = 'https://worldcup26.ir/api';
export const CACHE_PREFIX = 'wcinsight_';
export const CACHE_TTL = 24 * 60 * 60 * 1000;
export const STALE_TIME = 5 * 60 * 1000;
// Legacy exports for backward compatibility
export const POKEMON_LIMIT = 200;
export const ATTRIBUTE_NAMES: Record<string, string> = {};
export const RACE_COLORS: Record<string, string> = {};

export const WC_COLORS = {
  blue: '#0033A0',
  red: '#E4002B',
  green: '#00A859',
  gold: '#F2A900',
  navy: '#001B44',
  bg: '#F8FAFC',
} as const;

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export const GROUP_COLORS: Record<string, string> = {
  A: '#0033A0',
  B: '#E4002B',
  C: '#00A859',
  D: '#F2A900',
  E: '#6366F1',
  F: '#EC4899',
  G: '#14B8A6',
  H: '#F97316',
  I: '#8B5CF6',
  J: '#06B6D4',
  K: '#EF4444',
  L: '#84CC16',
};

export const ROUTES = {
  HOME: '/',
  MATCHES: '/matches',
  LIVE_SCORES: '/live-scores',
  STANDINGS: '/standings',
  GROUPS: '/groups',
  TEAMS: '/teams',
  PLAYERS: '/players',
  STATISTICS: '/statistics',
  TOP_SCORERS: '/top-scorers',
  STADIUMS: '/stadiums',
  COUNTRIES: '/countries',
  PREDICTIONS: '/predictions',
  ABOUT: '/about',
  DONATE: '/donate',
} as const;

export const NAV_ITEMS = [
  { label: 'Home', path: ROUTES.HOME, icon: 'LayoutDashboard' },
  { label: 'Matches', path: ROUTES.MATCHES, icon: 'Trophy' },
  { label: 'LiveScores', path: ROUTES.LIVE_SCORES, icon: 'Activity' },
  { label: 'Standings', path: ROUTES.STANDINGS, icon: 'BarChart3' },
  { label: 'Groups', path: ROUTES.GROUPS, icon: 'Grid3x3' },
  { label: 'Teams', path: ROUTES.TEAMS, icon: 'Users' },
  { label: 'Players', path: ROUTES.PLAYERS, icon: 'UserRound' },
  { label: 'Statistics', path: ROUTES.STATISTICS, icon: 'TrendingUp' },
  { label: 'TopScorers', path: ROUTES.TOP_SCORERS, icon: 'Star' },
  { label: 'Stadiums', path: ROUTES.STADIUMS, icon: 'Building2' },
  { label: 'Countries', path: ROUTES.COUNTRIES, icon: 'Globe' },
  { label: 'Predictions', path: ROUTES.PREDICTIONS, icon: 'Sparkles' },
  { label: 'About', path: ROUTES.ABOUT, icon: 'User' },
  { label: 'Donate', path: ROUTES.DONATE, icon: 'Heart' },
] as const;

export const FEATURED_PLAYERS = [
  { id: 1, name: 'Kylian Mbappé', team: 'France', flag: '🇫🇷', goals: 8, assists: 2, rating: 9.2 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: '🇦🇷', goals: 7, assists: 3, rating: 9.1 },
  { id: 3, name: 'Erling Haaland', team: 'Norway', flag: '🇳🇴', goals: 9, assists: 1, rating: 8.9 },
  { id: 4, name: 'Vinícius Jr.', team: 'Brazil', flag: '🇧🇷', goals: 5, assists: 4, rating: 8.8 },
  { id: 5, name: 'Jude Bellingham', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 4, assists: 3, rating: 8.7 },
];

export const TOP_SCORERS = [
  ...FEATURED_PLAYERS,
  { id: 6, name: 'Harry Kane', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 6, assists: 1, rating: 8.5 },
  { id: 7, name: 'Lautaro Martínez', team: 'Argentina', flag: '🇦🇷', goals: 5, assists: 2, rating: 8.3 },
  { id: 8, name: 'Bukayo Saka', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 4, assists: 3, rating: 8.4 },
];

export const TOP_ASSISTS = [
  { id: 1, name: 'Kevin De Bruyne', team: 'Belgium', flag: '🇧🇪', goals: 2, assists: 6, rating: 8.9 },
  { id: 2, name: 'Vinícius Jr.', team: 'Brazil', flag: '🇧🇷', goals: 5, assists: 4, rating: 8.8 },
  { id: 3, name: 'Bruno Fernandes', team: 'Portugal', flag: '🇵🇹', goals: 3, assists: 4, rating: 8.5 },
  { id: 4, name: 'Bukayo Saka', team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', goals: 4, assists: 3, rating: 8.4 },
  { id: 5, name: 'Lionel Messi', team: 'Argentina', flag: '🇦🇷', goals: 7, assists: 3, rating: 9.1 },
];

export const TOP_RATINGS = [
  ...FEATURED_PLAYERS,
  { id: 6, name: 'Rodri', team: 'Spain', flag: '🇪🇸', goals: 1, assists: 2, rating: 8.6 },
  { id: 7, name: 'Jamal Musiala', team: 'Germany', flag: '🇩🇪', goals: 3, assists: 2, rating: 8.5 },
];

export const TOP_CLEAN_SHEETS = [
  { id: 1, name: 'Emiliano Martínez', team: 'Argentina', flag: '🇦🇷', goals: 0, assists: 0, rating: 8.8, cleanSheets: 5 },
  { id: 2, name: 'Alisson Becker', team: 'Brazil', flag: '🇧🇷', goals: 0, assists: 0, rating: 8.5, cleanSheets: 4 },
  { id: 3, name: 'Thibaut Courtois', team: 'Belgium', flag: '🇧🇪', goals: 0, assists: 0, rating: 8.6, cleanSheets: 4 },
  { id: 4, name: 'Mike Maignan', team: 'France', flag: '🇫🇷', goals: 0, assists: 0, rating: 8.3, cleanSheets: 3 },
  { id: 5, name: 'Manuel Neuer', team: 'Germany', flag: '🇩🇪', goals: 0, assists: 0, rating: 8.2, cleanSheets: 3 },
];
