interface FlagImageProps {
  flag?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

/** 2-letter (ISO 3166-1 alpha-2) → local ISO3 filename code */
const ISO2_TO_ISO3: Record<string, string> = {
  us: 'USA', gb: 'GBR', fr: 'FRA', de: 'GER', es: 'ESP', it: 'ITA',
  br: 'BRA', ar: 'ARG', nl: 'NED', pt: 'POR', be: 'BEL', hr: 'CRO',
  uy: 'URY', co: 'COL', ma: 'MAR', jp: 'JPN', ir: 'IRN', mx: 'MEX',
  kr: 'KOR', au: 'AUS', se: 'SWE', eg: 'EGY', no: 'NOR', ca: 'CAN',
  ci: 'CIV', tn: 'TUN', tr: 'TUR', pa: 'PAN', dz: 'ALG', qa: 'QAT',
  sa: 'KSA', gh: 'GHA', py: 'PAR', ec: 'ECU', za: 'RSA', nz: 'NZL',
  cv: 'CPV', ba: 'BIH', cz: 'CZE', cd: 'COD', uz: 'UZB', iq: 'IRQ',
  jo: 'JOR', ht: 'HAI', cw: 'CUW', cr: 'CRC', jm: 'JAM', hn: 'HON',
  ch: 'SUI', at: 'AUT', sn: 'SEN', sc: 'SCO', rs: 'SRB', dk: 'DNK',
  kz: 'KAZ', cm: 'CMR', ng: 'NGA', ve: 'VEN', pe: 'PER', cl: 'CHL',
  ua: 'UKR', pl: 'POL', ro: 'ROU', gr: 'GRC',
};

/** Resolve flag URL to local path */
function resolveFlagSrc(flag: string): string {
  // Already a local path
  if (flag.startsWith('/')) return flag;
  if (flag.startsWith('./') || flag.startsWith('../')) return flag;
  
  // Extract 2-letter code from flagcdn URL: https://flagcdn.com/w80/XX.png
  const cdnMatch = flag.match(/flagcdn\.com\/.*?\/([a-z]{2})\.(?:png|svg)/i);
  if (cdnMatch) {
    const iso2 = cdnMatch[1].toLowerCase();
    const iso3 = ISO2_TO_ISO3[iso2];
    if (iso3) return `/images/flags/${iso3}.png`;
  }
  
  // Extract 3-letter code from any URL: /.../XXX.png or .../XXX.png
  const codeMatch = flag.match(/\/([A-Za-z]{3})\.(?:png|svg)/i);
  if (codeMatch) {
    const code = codeMatch[1].toUpperCase();
    // Check if it looks like an ISO3 code (3 uppercase letters)
    if (/^[A-Z]{3}$/.test(code)) return `/images/flags/${code}.png`;
  }
  
  // Try to extract from other common flag URL patterns
  const flagMatch = flag.match(/\/flags?\/([A-Za-z]{2,3})\.(?:png|svg)/i);
  if (flagMatch) {
    const code = flagMatch[1].toUpperCase();
    if (code.length === 3) return `/images/flags/${code}.png`;
    const iso3 = ISO2_TO_ISO3[code.toLowerCase()];
    if (iso3) return `/images/flags/${iso3}.png`;
  }
  
  // Fallback: return the original URL (might still work)
  return flag;
}

export function FlagImage({ flag, alt = '', className = '', size = 'md' }: FlagImageProps) {
  if (!flag) return <span className={className || sizeMap[size]}>🏳</span>;
  
  const src = resolveFlagSrc(flag);
  
  return (
    <img
      src={src}
      alt={alt || 'flag'}
      className={`${sizeMap[size]} object-cover rounded-sm ${className}`}
      loading="lazy"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        // Only hide if it's not already our local path (prevent infinite errors)
        if (img.src.includes('/images/flags/')) {
          img.style.display = 'none';
          const parent = img.parentElement;
          if (parent && !parent.querySelector('.flag-fallback')) {
            const span = document.createElement('span');
            span.className = 'flag-fallback';
            span.textContent = '🏳';
            parent.appendChild(span);
          }
        } else {
          // Try local path as fallback
          const localMatch = flag.match(/\/([A-Za-z]{2,3})\.(?:png|svg)/i);
          if (localMatch) {
            const code = localMatch[1].toUpperCase();
            if (code.length === 2) {
              const iso3 = ISO2_TO_ISO3[code.toLowerCase()];
              if (iso3) img.src = `/images/flags/${iso3}.png`;
            } else {
              img.src = `/images/flags/${code}.png`;
            }
          }
        }
      }}
    />
  );
}
