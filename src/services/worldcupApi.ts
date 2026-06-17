import axios from 'axios';

const API_BASE = 'https://worldcup26.ir/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export interface Team {
  id: number;
  name: string;
  name_en: string;
  fifa_code: string;
  flag: string;
  group: string;
  federation: string;
  ranking: number;
}

export interface Stadium {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity: number;
  image?: string;
}

export interface Group {
  id: number;
  name: string;
  teams: Team[];
}

export interface Match {
  id: number;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  date: string;
  stadium: string;
  group: string;
  stage: string;
  status: string;
  scorers: string | null;
  home_team_flag?: string;
  away_team_flag?: string;
}

export interface GroupStanding {
  team: string;
  team_flag?: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export interface ScorerData {
  player: string;
  team: string;
  team_flag?: string;
  goals: number;
  matches: number;
  minutes_per_goal?: string;
}

export async function fetchTeams(): Promise<Team[]> {
  const { data } = await api.get('/teams');
  return data.data || data;
}

export async function fetchMatches(): Promise<Match[]> {
  const { data } = await api.get('/matches');
  return data.data || data;
}

export async function fetchGroups(): Promise<Group[]> {
  const { data } = await api.get('/groups');
  return data.data || data;
}

export async function fetchStadiums(): Promise<Stadium[]> {
  const { data } = await api.get('/stadiums');
  return data.data || data;
}
