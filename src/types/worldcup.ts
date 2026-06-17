// ─── World Cup Insight v2 Types ────────────────────────

export interface Match {
  id: number;
  home_team_id: number;
  away_team_id: number;
  home_score: number | null;
  away_score: number | null;
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
  goals: number;
  assists: number;
  rating: number;
  image?: string;
}

export interface ApiResponse<T> {
  data: T[];
  status?: string;
  message?: string;
}
