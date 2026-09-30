/**
 * Browser-facing endpoint paths. netlify.toml maps each one to
 * /.netlify/functions/<name>; keep the two in step.
 */
export const API = {
  events: '/api/get-events',
  contact: '/api/submit-contact',
} as const;
