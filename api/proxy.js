// ─── Vercel Serverless Proxy + Cache ──────────────────────────
// Receives /api/proxy?upstream=get/games → fetches https://worldcup26.ir/get/games
// Caches responses for 5 minutes. Serves stale on upstream failure.

const CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

export default async function handler(req, res) {
  const upstreamPath = req.query?.upstream;

  if (!upstreamPath) {
    return res.status(400).json({ error: 'Missing ?upstream= param' });
  }

  const cacheKey = upstreamPath;

  // ── Cache HIT ──
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('X-Cache', 'HIT');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(cached.data);
  }

  // ── Fetch from upstream ──
  try {
    const targetUrl = `https://worldcup26.ir/${upstreamPath}`;
    console.log(`→ Fetching ${targetUrl}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const upstream = await fetch(targetUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!upstream.ok) {
      throw new Error(`Upstream ${upstream.status}`);
    }

    const data = await upstream.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });

    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    console.error(`✗ ${upstreamPath}:`, err.message);

    if (cached) {
      console.log(`→ Stale cache for ${upstreamPath}`);
      res.setHeader('X-Cache', 'STALE');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(200).json(cached.data);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(502).json({ error: 'Upstream unreachable', path: upstreamPath });
  }
}
