/**
 * Minimal PostgREST client for the dashboard's Supabase project. The site only
 * calls SECURITY DEFINER functions that `anon` may execute, with the
 * publishable (anon) key, so a leak exposes nothing the function doesn't
 * already return. No supabase-js: one fetch is enough, and it keeps the
 * functions bundle small.
 *
 * Both values are server-side env vars (never `VITE_`-prefixed), and the
 * site's CSP keeps the browser from calling Supabase directly anyway.
 */
export function supabaseConfig(): { url: string; anonKey: string } {
  const url = (process.env.SUPABASE_URL ?? '').trim().replace(/\/+$/, '');
  const anonKey = (process.env.SUPABASE_ANON_KEY ?? '').trim();
  if (!url || !anonKey) throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY is not set');
  return { url, anonKey };
}

/**
 * POST /rest/v1/rpc/<fn> and return the parsed JSON body. Throws on a non-2xx
 * status, a timeout, or a non-JSON body; callers treat any throw as "feed
 * unavailable". The timeout stays under Netlify's 10 s function limit.
 */
export async function rpc(fn: string, args: Record<string, unknown> = {}, { timeoutMs = 8000 } = {}): Promise<unknown> {
  const { url, anonKey } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    throw new Error(`supabase rpc/${fn} responded ${res.status}: ${detail}`);
  }
  return res.json();
}
