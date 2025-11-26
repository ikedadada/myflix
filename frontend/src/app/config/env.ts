export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787'
};

const normalizeBase = (base: string): string => {
  // Ensure trailing slash for proper URL resolution.
  return base.endsWith('/') ? base : `${base}/`;
};

export const buildApiUrl = (path: string): string => {
  const cleanPath = path.replace(/^\/+/, '');
  return new URL(cleanPath, normalizeBase(env.apiBaseUrl)).toString();
};
