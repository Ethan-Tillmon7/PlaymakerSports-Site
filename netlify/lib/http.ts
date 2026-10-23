import type { HandlerEvent, HandlerResponse } from '@netlify/functions';
import type { z } from 'zod';

/** A JSON response. Content-Type is always set; extra headers are merged in. */
export function json(statusCode: number, body: unknown, headers: Record<string, string> = {}): HandlerResponse {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  };
}

export type BodyResult<T> = { ok: true; data: T } | { ok: false; response: HandlerResponse };

/**
 * Read a POSTed JSON body and validate it. Failures come back as ready-made
 * responses: 405 (not POST), 413 (too large), 400 (bad JSON / schema).
 */
export function readJsonBody<S extends z.ZodType>(
  event: HandlerEvent,
  schema: S,
  { maxBytes }: { maxBytes: number },
): BodyResult<z.output<S>> {
  if (event.httpMethod !== 'POST') {
    return { ok: false, response: { statusCode: 405, body: 'Method Not Allowed' } };
  }
  if ((event.body?.length ?? 0) > maxBytes) {
    return { ok: false, response: json(413, { error: 'Submission too large' }) };
  }
  let body: unknown;
  try {
    body = JSON.parse(event.body ?? '{}');
  } catch {
    return { ok: false, response: json(400, { error: 'Invalid JSON' }) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, response: json(400, { error: 'Validation failed', issues: parsed.error.issues }) };
  }
  return { ok: true, data: parsed.data };
}

// ── v2 (Request/Response) functions ──
// Same contract as above for functions written as `export default async (req: Request)`.

/** A JSON `Response`. Content-Type is always set; extra headers are merged in. */
export function jsonResponse(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export type RequestBodyResult<T> = { ok: true; data: T } | { ok: false; response: Response };

/**
 * Read a POSTed JSON body from a v2 `Request` and validate it. Failures come
 * back as ready-made responses: 405 (not POST), 413 (too large), 400 (bad JSON /
 * schema). The body is read in full before the size check, so `maxBytes` caps
 * what gets parsed, not what gets received.
 */
export async function readJsonRequest<S extends z.ZodType>(
  req: Request,
  schema: S,
  { maxBytes }: { maxBytes: number },
): Promise<RequestBodyResult<z.output<S>>> {
  if (req.method !== 'POST') {
    return { ok: false, response: new Response('Method Not Allowed', { status: 405 }) };
  }
  const text = await req.text();
  if (text.length > maxBytes) {
    return { ok: false, response: jsonResponse(413, { error: 'Submission too large' }) };
  }
  let body: unknown;
  try {
    body = JSON.parse(text || '{}');
  } catch {
    return { ok: false, response: jsonResponse(400, { error: 'Invalid JSON' }) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, response: jsonResponse(400, { error: 'Validation failed', issues: parsed.error.issues }) };
  }
  return { ok: true, data: parsed.data };
}
