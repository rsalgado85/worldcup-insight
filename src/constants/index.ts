export const API_BASE_URL = 'https://worldcup26.ir/api';


export const WC_COLORS = {
  primary: '#1A3D7F',       // French Blue
  primaryLight: '#4583CA',  // Steel Blue
  secondary: '#42679A',     // Baltic Blue
  accent: '#412C49',        // Vintage Grape
  warm: '#CCBA8C',          // Sand
  success: '#419050',       // Sea Green
  live: '#9D302D',          // Brown Red
  hunter: '#346344',        // Hunter Green
  bg: '#FEFEFE',            // White
  card: '#FEFEFE',
  text: '#0F1A30',
  textSecondary: '#42679A',
  border: 'rgba(26, 61, 127, 0.08)',
} as const;

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;

export const GROUP_COLORS: Record<string, string> = {
  A: '#1A3D7F',  // French Blue
  B: '#9D302D',  // Brown Red
  C: '#419050',  // Sea Green
  D: '#CCBA8C',  // Sand
  E: '#4583CA',  // Steel Blue
  F: '#412C49',  // Vintage Grape
  G: '#346344',  // Hunter Green
  H: '#42679A',  // Baltic Blue
  I: '#1A3D7F',  // French Blue
  J: '#9D302D',  // Brown Red
  K: '#419050',  // Sea Green
  L: '#4583CA',  // Steel Blue
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
  { label: 'Matches', path: ROUTES.MATCHES, icon: 'Swords' },
  { label: 'LiveScores', path: ROUTES.LIVE_SCORES, icon: 'Radio' },
  { label: 'Standings', path: ROUTES.STANDINGS, icon: 'BarChart3' },
  { label: 'Groups', path: ROUTES.GROUPS, icon: 'Grid3x3' },
  { label: 'Teams', path: ROUTES.TEAMS, icon: 'Users' },
  { label: 'Players', path: ROUTES.PLAYERS, icon: 'UserRound' },
  { label: 'Statistics', path: ROUTES.STATISTICS, icon: 'TrendingUp' },
  { label: 'TopScorers', path: ROUTES.TOP_SCORERS, icon: 'Target' },
  { label: 'Stadiums', path: ROUTES.STADIUMS, icon: 'Building2' },
  { label: 'Countries', path: ROUTES.COUNTRIES, icon: 'Globe' },
  { label: 'Predictions', path: ROUTES.PREDICTIONS, icon: 'Sparkles' },
  { label: 'About', path: ROUTES.ABOUT, icon: 'Info' },
  { label: 'Donate', path: ROUTES.DONATE, icon: 'Heart' },
] as const;

export const FEATURED_PLAYERS = [
  { id: 1, name: 'Kylian Mbappé', team: 'France', flag: 'https://flagcdn.com/w160/fr.png', goals: 8, assists: 2, rating: 9.2 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: 'https://flagcdn.com/w160/ar.png', goals: 7, assists: 3, rating: 9.1 },
  { id: 3, name: 'Erling Haaland', team: 'Norway', flag: 'https://flagcdn.com/w160/no.png', goals: 9, assists: 1, rating: 8.9 },
  { id: 4, name: 'Vinícius Jr.', team: 'Brazil', flag: 'https://flagcdn.com/w160/br.png', goals: 5, assists: 4, rating: 8.8 },
  { id: 5, name: 'Jude Bellingham', team: 'England', flag: 'https://flagcdn.com/w160/gb-eng.png', goals: 4, assists: 3, rating: 8.7 },
];

export const TOP_SCORERS = [
  ...FEATURED_PLAYERS,
  { id: 6, name: 'Harry Kane', team: 'England', flag: 'https://flagcdn.com/w160/gb-eng.png', goals: 6, assists: 1, rating: 8.5 },
];

export const TOP_ASSISTS = [
  { id: 1, name: 'Kevin De Bruyne', team: 'Belgium', flag: 'https://flagcdn.com/w160/be.png', value: 5 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: 'https://flagcdn.com/w160/ar.png', value: 4 },
  { id: 3, name: 'Vinícius Jr.', team: 'Brazil', flag: 'https://flagcdn.com/w160/br.png', value: 4 },
  { id: 4, name: 'Jude Bellingham', team: 'England', flag: 'https://flagcdn.com/w160/gb-eng.png', value: 3 },
  { id: 5, name: 'Kylian Mbappé', team: 'France', flag: 'https://flagcdn.com/w160/fr.png', value: 3 },
];

export const TOP_RATINGS = [
  { id: 1, name: 'Kylian Mbappé', team: 'France', flag: 'https://flagcdn.com/w160/fr.png', value: 9.2 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: 'https://flagcdn.com/w160/ar.png', value: 9.1 },
  { id: 3, name: 'Erling Haaland', team: 'Norway', flag: 'https://flagcdn.com/w160/no.png', value: 8.9 },
  { id: 4, name: 'Vinícius Jr.', team: 'Brazil', flag: 'https://flagcdn.com/w160/br.png', value: 8.8 },
  { id: 5, name: 'Jude Bellingham', team: 'England', flag: 'https://flagcdn.com/w160/gb-eng.png', value: 8.7 },
];

export const TOP_CLEAN_SHEETS = [
  { id: 1, name: 'Alisson Becker', team: 'Brazil', flag: 'https://flagcdn.com/w160/br.png', value: 4 },
  { id: 2, name: 'Thibaut Courtois', team: 'Belgium', flag: 'https://flagcdn.com/w160/be.png', value: 3 },
  { id: 3, name: 'Emiliano Martínez', team: 'Argentina', flag: 'https://flagcdn.com/w160/ar.png', value: 3 },
  { id: 4, name: 'Manuel Neuer', team: 'Germany', flag: 'https://flagcdn.com/w160/de.png', value: 2 },
  { id: 5, name: 'Mike Maignan', team: 'France', flag: 'https://flagcdn.com/w160/fr.png', value: 2 },
];
