// ─── World Cup Insight v2 Types ────────────────────────

export interface Match {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
  home_scorers: string | null;
  away_scorers: string | null;
  finished: boolean;
  time_elapsed: string | null;
  group: string | null;
  local_date: string;
  utc_date: string;
  stadium_id: number;
  type: string;
  matchday: number | null;
  home_team?: Team;
  away_team?: Team;
  stadium?: Stadium;
  home_team_name_en?: string;
  away_team_name_en?: string;
}

export interface Team {
  id: number;
  name_en: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
  group?: string;
}

export interface GroupStanding {
  id: number;
  name_en: string;
  flag: string;
  fifa_code: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  pts: number;
  gf: number;
  ga: number;
  gd: number;
  group: string;
}

export interface Group {
  id: number;
  name: string;
  teams: GroupStanding[];
}

export interface Stadium {
  id: number;
  name_en: string;
  city_en: string;
  country_en: string;
  capacity: number;
}

export interface Player {
  id: number;
  name: string;
  team: string;
  flag: string;
  goals?: number;
  assists?: number;
  rating?: number;
  value?: number;
  image?: string;
}

// ─── Raw API response shapes ───────────────────────────

export interface RawMatch {
  _id: string;
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: string | null;
  away_score: string | null;
  home_scorers: string | null;
  away_scorers: string | null;
  group: string | null;
  matchday: string | null;
  local_date: string;
  persian_date?: string;
  stadium_id: string;
  finished: string;
  time_elapsed: string | null;
  type: string;
  home_team_name_en?: string;
  home_team_name_fa?: string;
  away_team_name_en?: string;
  away_team_name_fa?: string;
}

export interface RawTeam {
  _id: string;
  id: string;
  name_en: string;
  name_fa?: string;
  flag: string;
  fifa_code: string;
  iso2: string;
  groups: string;
}

export interface RawGroup {
  _id: string;
  name: string;
  teams: RawGroupTeam[];
  createdAt?: string;
  __v?: number;
}

export interface RawGroupTeam {
  team_id: string;
  mp: string;
  w: string;
  l: string;
  d: string;
  pts: string;
  gf: string;
  ga: string;
  gd: string;
  _id: string;
}

export interface RawStadium {
  _id: string;
  id: string;
  name_en: string;
  name_fa?: string;
  fifa_name?: string;
  city_en: string;
  city_fa?: string;
  country_en: string;
  country_fa?: string;
  capacity: number;
  region?: string;
}

// ─── API Response wrappers ─────────────────────────────

export interface GamesResponse {
  games: RawMatch[];
}

export interface TeamsResponse {
  teams: RawTeam[];
}

export interface GroupsResponse {
  groups: RawGroup[];
}

export interface StadiumsResponse {
  stadiums: RawStadium[];
}
