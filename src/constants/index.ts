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

/* ─── Static stadium data (used when API is offline) ─── */
export const STATIC_STADIUMS = [
  { id: 1, name_en: 'Estadio Azteca', city_en: 'Mexico City', country_en: 'Mexico', capacity: 87523 },
  { id: 2, name_en: 'MetLife Stadium', city_en: 'East Rutherford', country_en: 'United States', capacity: 82500 },
  { id: 3, name_en: 'AT&T Stadium', city_en: 'Arlington', country_en: 'United States', capacity: 80000 },
  { id: 4, name_en: 'Arrowhead Stadium', city_en: 'Kansas City', country_en: 'United States', capacity: 76416 },
  { id: 5, name_en: 'NRG Stadium', city_en: 'Houston', country_en: 'United States', capacity: 72220 },
  { id: 6, name_en: 'Mercedes-Benz Stadium', city_en: 'Atlanta', country_en: 'United States', capacity: 71000 },
  { id: 7, name_en: 'SoFi Stadium', city_en: 'Inglewood', country_en: 'United States', capacity: 70240 },
  { id: 8, name_en: 'Lincoln Financial Field', city_en: 'Philadelphia', country_en: 'United States', capacity: 69796 },
  { id: 9, name_en: 'Lumen Field', city_en: 'Seattle', country_en: 'United States', capacity: 69000 },
  { id: 10, name_en: "Levi's Stadium", city_en: 'Santa Clara', country_en: 'United States', capacity: 68500 },
  { id: 11, name_en: 'Gillette Stadium', city_en: 'Foxborough', country_en: 'United States', capacity: 65878 },
  { id: 12, name_en: 'Hard Rock Stadium', city_en: 'Miami Gardens', country_en: 'United States', capacity: 64767 },
  { id: 13, name_en: 'BC Place', city_en: 'Vancouver', country_en: 'Canada', capacity: 54500 },
  { id: 14, name_en: 'Estadio BBVA', city_en: 'Monterrey', country_en: 'Mexico', capacity: 53500 },
  { id: 15, name_en: 'BMO Field', city_en: 'Toronto', country_en: 'Canada', capacity: 45736 },
  { id: 16, name_en: 'Estadio Akron', city_en: 'Guadalajara', country_en: 'Mexico', capacity: 48071 },
];

/* ─── FIFA Rankings (approximate, used for predictions when groups haven't played) ─── */
export const FIFA_RANKING: Record<string, number> = {
  Argentina: 1, France: 2, Spain: 3, England: 4, Brazil: 5,
  Portugal: 6, Netherlands: 7, Belgium: 8, Germany: 10,
  Uruguay: 11, Colombia: 12, Croatia: 13, Morocco: 14,
  Japan: 15, 'United States': 16, Senegal: 17, Iran: 18,
  Mexico: 19, Switzerland: 20, Austria: 22, 'South Korea': 23,
  Australia: 24, Sweden: 27, Egypt: 30, Norway: 31,
  Canada: 32, "Côte d'Ivoire": 33, Tunisia: 35, Scotland: 36,
  Turkey: 37, Panama: 38, Algeria: 39, Qatar: 40,
  'Saudi Arabia': 41, Ghana: 42, Paraguay: 43, Ecuador: 44,
  'South Africa': 45, 'New Zealand': 46, 'Cape Verde': 47,
  'Bosnia and Herzegovina': 48, 'Czech Republic': 49,
  'DR Congo': 50, Uzbekistan: 51, Iraq: 52, Jordan: 53,
  Haiti: 54, Curaçao: 55, 'Costa Rica': 56, Jamaica: 57,
  Honduras: 58,
};

/** Resolve FIFA rank for a team name, with fallback aliases */
export function getFifaRank(teamName: string): number {
  if (FIFA_RANKING[teamName]) return FIFA_RANKING[teamName];
  // Alias mappings
  const aliases: Record<string, string> = {
    'Korea Republic': 'South Korea',
    'Türkiye': 'Turkey',
    'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
    'RD Congo': 'DR Congo',
    'Cabo Verde': 'Cape Verde',
    'Arabia Saudita': 'Saudi Arabia',
    'República Checa': 'Czech Republic',
    'Costa de Marfil': "Côte d'Ivoire",
    'Nueva Zelanda': 'New Zealand',
  };
  const canonical = aliases[teamName];
  if (canonical && FIFA_RANKING[canonical]) return FIFA_RANKING[canonical];
  return 99; // unranked fallback
}

/* ─── Static groups for offline predictions ─── */
export const STATIC_GROUPS: Record<string, string[]> = {
  A: ['Mexico', 'South Korea', 'Czech Republic', 'Senegal'],
  B: ['Brazil', 'Sweden', 'Ecuador', 'Uzbekistan'],
  C: ['Germany', 'Paraguay', 'Cape Verde', 'Haiti'],
  D: ['France', 'Croatia', 'Scotland', 'Qatar'],
  E: ['Colombia', 'Morocco', 'Curaçao', 'Australia'],
  F: ['Uruguay', 'Japan', 'Panama', 'Costa Rica'],
  G: ['Spain', 'Norway', 'Turkey', 'Tunisia'],
  H: ['Portugal', 'DR Congo', 'Saudi Arabia', 'Egypt'],
  I: ['Argentina', 'Austria', 'Iraq', 'New Zealand'],
  J: ['England', 'Iran', 'Algeria', 'Ghana'],
  K: ['Netherlands', 'Switzerland', 'Jordan', 'Bosnia and Herzegovina'],
  L: ['Belgium', 'United States', 'Canada', 'South Africa'],
};

/** Map team name → 3-letter country code for local flag images */
const TEAM_TO_ISO3: Record<string, string> = {
  Argentina: 'ARG', France: 'FRA', Spain: 'ESP', England: 'ENG', Brazil: 'BRA',
  Portugal: 'POR', Netherlands: 'NED', Belgium: 'BEL', Germany: 'GER',
  Uruguay: 'URY', Colombia: 'COL', Croatia: 'CRO', Morocco: 'MAR',
  Japan: 'JPN', 'United States': 'USA', Senegal: 'SEN', Iran: 'IRN',
  Mexico: 'MEX', Switzerland: 'SUI', Austria: 'AUT', 'South Korea': 'KOR',
  Australia: 'AUS', Sweden: 'SWE', Egypt: 'EGY', Norway: 'NOR',
  Canada: 'CAN', "Côte d'Ivoire": 'CIV', Tunisia: 'TUN', Scotland: 'SCO',
  Turkey: 'TUR', Panama: 'PAN', Algeria: 'ALG', Qatar: 'QAT',
  'Saudi Arabia': 'KSA', Ghana: 'GHA', Paraguay: 'PAR', Ecuador: 'ECU',
  'South Africa': 'RSA', 'New Zealand': 'NZL', 'Cape Verde': 'CPV',
  'Bosnia and Herzegovina': 'BIH', 'Czech Republic': 'CZE',
  'DR Congo': 'COD', Uzbekistan: 'UZB', Iraq: 'IRQ', Jordan: 'JOR',
  Haiti: 'HAI', Curaçao: 'CUW', 'Costa Rica': 'CRC', Jamaica: 'JAM',
  Honduras: 'HON',
};

export function getFlagPath(teamName: string): string {
  const iso3 = TEAM_TO_ISO3[teamName];
  if (iso3) return `/images/flags/${iso3}.png`;
  // Fallback aliases
  const aliases: Record<string, string> = {
    'Korea Republic': 'KOR', 'Türkiye': 'TUR', 'Bosnia & Herzegovina': 'BIH',
    'RD Congo': 'COD', 'Cabo Verde': 'CPV', 'Arabia Saudita': 'KSA',
    'República Checa': 'CZE', 'Costa de Marfil': 'CIV', 'Nueva Zelanda': 'NZL',
    'Alemania': 'GER', 'Croacia': 'CRO', 'Suiza': 'SUI', 'Argelia': 'ALG',
    'Sudáfrica': 'RSA', 'Paraguay': 'PAR', 'Haití': 'HAI', 'Portugal': 'POR',
    'Países Bajos': 'NED', 'Costa Rica': 'CRC', 'Jamaica': 'JAM', 'Honduras': 'HON',
  };
  const alias = aliases[teamName];
  if (alias) return `/images/flags/${alias}.png`;
  return `/images/flags/${teamName.slice(0, 3).toUpperCase()}.png`;
}

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
  Qatar: '/images/players/qatar-10.jpg',
  'Bosnia and Herzegovina': '/images/players/bosnia-11.jpg',
  'Bosnia & Herzegovina': '/images/players/bosnia-11.jpg',
  Austria: '/images/players/austria-10.jpg',
  'Czech Republic': '/images/players/czech-10.jpg',
  'República Checa': '/images/players/czech-10.jpg',
  Tunisia: '/images/players/tunisia-10.jpg',
  Jordan: '/images/players/jordan-10.jpg',
  'New Zealand': '/images/players/newzealand-10.jpg',
  'Nueva Zelanda': '/images/players/newzealand-10.jpg',
  Uzbekistan: '/images/players/uzbekistan-10.jpg',
  'DR Congo': '/images/players/drcongo-10.jpg',
  'RD Congo': '/images/players/drcongo-10.jpg',
  'Cape Verde': '/images/players/capeverde-10.jpg',
  'Cabo Verde': '/images/players/capeverde-10.jpg',
  'Costa Rica': '/images/players/costarica-10.jpg',
  Jamaica: '/images/players/jamaica-10.jpg',
  Honduras: '/images/players/honduras-10.jpg',
  Haiti: '/images/players/haiti-10.jpg',
  Curaçao: '/images/players/curacao-10.jpg',
  Iraq: '/images/players/iraq-10.jpg',
  Algeria: '/images/players/algeria-10.jpg',
};

export function getPlayerAvatar(team: string): string | undefined {
  return AVATAR_BY_TEAM[team];
}
