/**
 * Browser-facing endpoint paths. netlify.toml maps each one to /.netlify/functions/<name>,
 * except submit-contact (a v2 function with its own config.path); keep them in step.
 */
export const API = {
  events: '/api/get-events',
  contact: '/api/submit-contact',
} as const;
