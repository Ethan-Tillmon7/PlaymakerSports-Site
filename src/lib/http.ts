/**
 * fetch() with a hard timeout. Phones at the field sit on one bar of signal,
 * and a bare fetch can hang for minutes before the browser gives up, leaving a
 * skeleton or a "Sending…" button on screen with no way out.
 *
 * An external `signal` (e.g. an effect's cleanup) aborts the request too.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 12000, signal, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException('Timed out', 'TimeoutError')), timeoutMs);
  const onAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    return await fetch(input, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

export type RequestFailure = 'offline' | 'timeout' | 'server';

/** Classify a thrown fetch error so the UI can say what actually happened. */
export function classifyFailure(err: unknown): RequestFailure {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'offline';
  if (err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError')) return 'timeout';
  return 'server';
}
