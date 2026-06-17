// Map FIFA country codes to crest filenames in public/images/crests/
// Format: fifa_code → filename (without extension)
// getCrestPath auto-detects .svg vs .png based on what exists

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

// Only-PNG crests (no SVG available). All others have SVG.
const PNG_ONLY = new Set([
  "argentina", "brazil", "germany", "algeria", "canada", "usa",
  "uzbekistan", "haiti", "ivory-coast", "south-korea", "curacao",
  "cape-verde", "australia", "saudi-arabia",
]);

/**
 * Get the crest path for a team by its FIFA code.
 * Uses .svg when available, .png for PNG-only crests.
 * Falls back to placeholder.svg when crest name is unknown.
 */
export function getCrestPath(fifaCode: string): string {
  const name = CREST_MAP[fifaCode?.toUpperCase()];
  if (!name) return "/images/crests/placeholder.svg";
  const ext = PNG_ONLY.has(name) ? "png" : "svg";
  return `/images/crests/${name}.${ext}`;
}

/**
 * Get PNG fallback path (for onError handler when SVG fails).
 */
export function getCrestFallback(fifaCode: string): string {
  const name = CREST_MAP[fifaCode?.toUpperCase()];
  if (!name) return "/images/crests/placeholder.svg";
  return `/images/crests/${name}.png`;
}

/**
 * Get the local flag path for a team by its FIFA code.
 * Flags are pre-downloaded to /public/images/flags/{FIFA_CODE}.png
 * Falls back to flagcdn.com via getFlagUrl(iso2) if no local flag.
 */
export function getLocalFlag(fifaCode: string): string {
  if (!fifaCode) return "";
  return `/images/flags/${fifaCode.toUpperCase()}.png`;
}

/**
 * Get the flag CDN URL for a team by its ISO2 code.
 * Used as fallback when local flag is not available.
 */
export function getFlagUrl(iso2: string): string {
  if (!iso2) return "";
  return `https://flagcdn.com/w80/${iso2.toLowerCase()}.png`;
}
