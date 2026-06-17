/**
 * Date/time formatting utilities.
 * API returns dates as "MM/DD/YYYY" or "MM/DD/YYYY HH:MM" (e.g. "06/17/2026 14:00").
 * All display functions use the browser's local timezone via Intl / Date.
 */

/** Parse API date string "MM/DD/YYYY" or "MM/DD/YYYY HH:MM" into a Date (local TZ) */
export function parseApiDate(dateStr: string): Date {
  if (!dateStr) return new Date(NaN);
  const parts = dateStr.trim().split(/[\/\-\sT]/);
  const m = Number(parts[0]), d = Number(parts[1]), y = Number(parts[2]);
  if (isNaN(m) || isNaN(d) || isNaN(y)) return new Date(dateStr);
  const hh = Number(parts[3]) || 0, mm = Number(parts[4]) || 0;
  return new Date(y, m - 1, d, hh, mm);
}

/** Short date: "Jun 17" or "17 jun" */
export function fmtDateShort(dateStr: string, lang: 'en' | 'es'): string {
  const d = parseApiDate(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  if (lang === 'es') {
    return d.toLocaleDateString('es', { day: 'numeric', month: 'short' });
  }
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

/** Full date: "Wed, Jun 17, 2026" or "mié, 17 jun 2026" */
export function fmtDateFull(dateStr: string, lang: 'en' | 'es'): string {
  const d = parseApiDate(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString(lang, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

/** Time only: "14:00" or "2:00 PM" (local TZ) */
export function fmtTime(dateStr: string, lang: 'en' | 'es'): string {
  const d = parseApiDate(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit' });
}

/** Date + time: "Jun 17, 14:00" or "17 jun, 14:00" */
export function fmtDateTime(dateStr: string, lang: 'en' | 'es'): string {
  const d = parseApiDate(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const date = fmtDateShort(dateStr, lang);
  const time = fmtTime(dateStr, lang);
  return `${date}, ${time}`;
}

/** Compact: "17/06" */
export function fmtDateCompact(dateStr: string): string {
  const d = parseApiDate(dateStr);
  if (isNaN(d.getTime())) return dateStr.slice(0, 10);
  return d.toLocaleDateString('es', { day: '2-digit', month: '2-digit' });
}

/** Today/tomorrow date as MM/DD/YYYY for API querying */
export function getApiDate(daysOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
}

/** Today as YYYY-MM-DD for display comparisons */
export function getLocalDate(daysOffset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
