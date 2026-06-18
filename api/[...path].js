// ─── Vercel Serverless Proxy + Cache ──────────────────────────
// Catches all /api/* requests, proxies to worldcup26.ir with 30s timeout.
// Caches responses for 5 min (300s). Serves stale cache if API fails.
// worldcup26.ir is very slow (12-15s per request) — cache is critical.

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

function cleanKey(key) {
  return key.replace(/\/$/, '') || '/';
}

export async function GET(request) {
  const url = new URL(request.url);
  // Extract the path after /api, e.g. /api/get/games → /get/games
  const apiPath = cleanKey(url.pathname.replace(/^\/api\/?/, '/'));
  const cacheKey = apiPath;

  // ── Serve from cache if fresh ──
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return new Response(JSON.stringify(cached.data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // ── Fetch from upstream ──
  try {
    const targetUrl = `https://worldcup26.ir${apiPath}`;
    console.log(`→ Proxy fetch: ${targetUrl}`);
    const upstream = await fetch(targetUrl, {
      signal: AbortSignal.timeout(30000),
    });

    if (!upstream.ok) {
      throw new Error(`Upstream returned ${upstream.status}`);
    }

    const data = await upstream.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(`✗ Proxy error for ${apiPath}:`, err.message);

    // ── Serve stale cache as fallback ──
    if (cached) {
      console.log(`→ Serving stale cache for ${apiPath}`);
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Cache': 'STALE',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Upstream API unreachable', path: apiPath }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle OPTIONS preflight (belt-and-suspenders for CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}
