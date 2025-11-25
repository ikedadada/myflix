export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8787',
  accessDomain: import.meta.env.VITE_ACCESS_DOMAIN ?? '',
  accessAud: import.meta.env.VITE_ACCESS_JWT_AUD ?? ''
};

export const buildApiUrl = (path: string): string => new URL(path, env.apiBaseUrl).toString();

export const buildAccessLoginUrl = (redirectUrl: string): string | null => {
  if (!env.accessDomain || !env.accessAud) return null;
  const encoded = encodeURIComponent(redirectUrl);
  return `https://${env.accessDomain}/cdn-cgi/access/login/${env.accessAud}?redirect_url=${encoded}`;
};
