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
  { label: 'Predictions', path: ROUTES.PREDICTIONS, icon: 'Sparkles' },
  { label: 'About', path: ROUTES.ABOUT, icon: 'Info' },
  { label: 'Donate', path: ROUTES.DONATE, icon: 'Heart' },
] as const;

export const FEATURED_PLAYERS = [
  { id: 1, name: 'Kylian Mbappé', team: 'France', flag: '/images/flags/FRA.png', avatar: '/images/players/france-mbappe.jpg', goals: 8, assists: 2, rating: 9.2 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: '/images/flags/ARG.png', avatar: '/images/players/argentina-messi.jpg', goals: 7, assists: 3, rating: 9.1 },
  { id: 3, name: 'Erling Haaland', team: 'Norway', flag: '/images/flags/NOR.png', avatar: '/images/players/norway-9.jpg', goals: 9, assists: 1, rating: 8.9 },
  { id: 4, name: 'Vinícius Jr.', team: 'Brazil', flag: '/images/flags/BRA.png', goals: 5, assists: 4, rating: 8.8 },
  { id: 5, name: 'Jude Bellingham', team: 'England', flag: '/images/flags/ENG.png', goals: 4, assists: 3, rating: 8.7 },
];

export const TOP_SCORERS = [
  ...FEATURED_PLAYERS,
  { id: 6, name: 'Harry Kane', team: 'England', flag: '/images/flags/ENG.png', goals: 6, assists: 1, rating: 8.5 },
];

export const TOP_ASSISTS = [
  { id: 1, name: 'Kevin De Bruyne', team: 'Belgium', flag: '/images/flags/BEL.png', avatar: '/images/players/belgium-7.jpg', value: 5 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: '/images/flags/ARG.png', avatar: '/images/players/argentina-messi.jpg', value: 4 },
  { id: 3, name: 'Vinícius Jr.', team: 'Brazil', flag: '/images/flags/BRA.png', value: 4 },
  { id: 4, name: 'Jude Bellingham', team: 'England', flag: '/images/flags/ENG.png', value: 3 },
  { id: 5, name: 'Kylian Mbappé', team: 'France', flag: '/images/flags/FRA.png', avatar: '/images/players/france-mbappe.jpg', value: 3 },
];

export const TOP_RATINGS = [
  { id: 1, name: 'Kylian Mbappé', team: 'France', flag: '/images/flags/FRA.png', avatar: '/images/players/france-mbappe.jpg', value: 9.2 },
  { id: 2, name: 'Lionel Messi', team: 'Argentina', flag: '/images/flags/ARG.png', avatar: '/images/players/argentina-messi.jpg', value: 9.1 },
  { id: 3, name: 'Erling Haaland', team: 'Norway', flag: '/images/flags/NOR.png', avatar: '/images/players/norway-9.jpg', value: 8.9 },
  { id: 4, name: 'Vinícius Jr.', team: 'Brazil', flag: '/images/flags/BRA.png', value: 8.8 },
  { id: 5, name: 'Jude Bellingham', team: 'England', flag: '/images/flags/ENG.png', value: 8.7 },
];

export const TOP_CLEAN_SHEETS = [
  { id: 1, name: 'Alisson Becker', team: 'Brazil', flag: '/images/flags/BRA.png', value: 4 },
  { id: 2, name: 'Thibaut Courtois', team: 'Belgium', flag: '/images/flags/BEL.png', avatar: '/images/players/belgium-7.jpg', value: 3 },
  { id: 3, name: 'Emiliano Martínez', team: 'Argentina', flag: '/images/flags/ARG.png', avatar: '/images/players/argentina-messi.jpg', value: 3 },
  { id: 4, name: 'Manuel Neuer', team: 'Germany', flag: '/images/flags/GER.png', avatar: '/images/players/germany-8.jpg', value: 2 },
  { id: 5, name: 'Mike Maignan', team: 'France', flag: '/images/flags/FRA.png', avatar: '/images/players/france-mbappe.jpg', value: 2 },
];

export const AVATAR_BY_TEAM: Record<string, string> = {
  France: '/images/players/france-mbappe.jpg',
  Argentina: '/images/players/argentina-messi.jpg',
  Ecuador: '/images/players/ecuador-10.jpg',
  Colombia: '/images/players/colombia-10.jpg',
  Portugal: '/images/players/portugal-7.jpg',
  Brazil: '/images/players/brazil-10.jpg',
  Sweden: '/images/players/sweden-10.jpg',
  England: '/images/players/england-10.jpg',
  Norway: '/images/players/norway-9.jpg',
  Mexico: '/images/players/mexico-10.jpg',
  Germany: '/images/players/germany-8.jpg',
  Croatia: '/images/players/croatia-10.jpg',
  Panama: '/images/players/panama-10.jpg',
  Ghana: '/images/players/ghana-10.jpg',
  'United States': '/images/players/usa-10.jpg',
  Uruguay: '/images/players/uruguay-15.jpg',
  Spain: '/images/players/spain-19.jpg',
  Netherlands: '/images/players/netherlands-4.jpg',
  Japan: '/images/players/japan-7.jpg',
  Belgium: '/images/players/belgium-7.jpg',
  Morocco: '/images/players/morocco-2.jpg',
  Senegal: '/images/players/senegal-10.jpg',
  Canada: '/images/players/canada-19.jpg',
  'South Korea': '/images/players/korea-7.jpg',
  'Korea Republic': '/images/players/korea-7.jpg',
  Paraguay: '/images/players/paraguay-10.jpg',
  Switzerland: '/images/players/switzerland-5.jpg',
  Turkey: '/images/players/turkey-8.jpg',
  Türkiye: '/images/players/turkey-8.jpg',
  Australia: '/images/players/australia-15.jpg',
  'South Africa': '/images/players/southafrica-10.jpg',
  Scotland: '/images/players/scotland-7.jpg',
  "Côte d'Ivoire": '/images/players/ivorycoast-11.jpg',
  'Costa de Marfil': '/images/players/ivorycoast-11.jpg',
  Egypt: '/images/players/egypt-10.jpg',
  Iran: '/images/players/iran-20.jpg',
  'Saudi Arabia': '/images/players/saudiarabia-10.jpg',
  'Arabia Saudita': '/images/players/saudiarabia-10.jpg',
};

export function getPlayerAvatar(team: string): string | undefined {
  return AVATAR_BY_TEAM[team];
}
