// Map FIFA country codes to crest filenames in public/images/crests/
// Format: fifa_code → filename (without extension, .svg preferred, falls back to .png)

export const CREST_MAP: Record<string, string> = {
  // Host nations
  USA: "usa",
  CAN: "canada",
  MEX: "mexico",

  // CONMEBOL
  ARG: "argentina",
  BRA: "brazil",
  URU: "uruguay",
  COL: "colombia",
  ECU: "ecuador",
  PAR: "paraguay",

  // UEFA
  GER: "germany",
  FRA: "france",
  ESP: "spain",
  ENG: "england",
  ITA: "italy",
  NED: "netherlands",
  BEL: "belgium",
  POR: "portugal",
  CRO: "croatia",
  AUT: "austria",
  SCO: "scotland",
  SWE: "sweden",
  SUI: "switzerland",
  TUR: "turkey",
  CZE: "czechia",
  BIH: "bosnia",
  NOR: "norway",

  // CAF
  ALG: "algeria",
  EGY: "egypt",
  GHA: "ghana",
  MAR: "morocco",
  SEN: "senegal",
  TUN: "tunisia",
  CIV: "ivory-coast",
  COD: "dr-congo",
  RSA: "south-africa",
  CPV: "cape-verde",

  // AFC
  JPN: "japan",
  KOR: "south-korea",
  IRN: "iran",
  IRQ: "iraq",
  JOR: "jordan",
  QAT: "qatar",
  KSA: "saudi-arabia",
  AUS: "australia",
  UZB: "uzbekistan",

  // CONCACAF
  PAN: "panama",
  HAI: "haiti",
  CUW: "curacao",

  // OFC
  NZL: "new-zealand",
};

/**
 * Get the crest path for a team by its FIFA code.
 * Returns the path — browser will try SVG first, PNG on error.
 */
export function getCrestPath(fifaCode: string): string {
  const name = CREST_MAP[fifaCode?.toUpperCase()];
  if (!name) return "/images/crests/placeholder.svg";
  return `/images/crests/${name}.svg`;
}

/**
 * Get PNG fallback path (for onError handler).
 */
export function getCrestFallback(fifaCode: string): string {
  const name = CREST_MAP[fifaCode?.toUpperCase()];
  if (!name) return "/images/crests/placeholder.svg";
  return `/images/crests/${name}.png`;
}

/**
 * Get the flag CDN URL for a team by its ISO2 code.
 * Falls back to flagcdn.com
 */
export function getFlagUrl(iso2: string): string {
  if (!iso2) return "";
  return `https://flagcdn.com/w80/${iso2.toLowerCase()}.png`;
}
