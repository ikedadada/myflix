import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../hono-env';

const parseOrigins = (raw: string | undefined): string[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const matchesOrigin = (origin: string, allowed: string): boolean => {
  if (allowed === '*') return true;
  if (allowed.startsWith('*.')) {
    try {
      const url = new URL(origin);
      return url.hostname === allowed.slice(2) || url.hostname.endsWith(allowed.slice(1));
    } catch {
      return false;
    }
  }
  return origin === allowed;
};

export const createCorsMiddleware = (): MiddlewareHandler<HonoEnv> => {
  return async (c, next) => {
    const origins = parseOrigins(c.env.CORS_ALLOWED_ORIGINS);
    const requestOrigin = c.req.header('origin');
    const allowOrigin =
      requestOrigin && origins.some((o) => matchesOrigin(requestOrigin, o))
        ? requestOrigin
        : origins.includes('*')
          ? '*'
          : null;

    const setHeaders = () => {
      if (allowOrigin) {
        c.header('Access-Control-Allow-Origin', allowOrigin);
        c.header('Vary', 'Origin');
      }
      c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      c.header('Access-Control-Allow-Headers', 'Content-Type, Cf-Access-Jwt-Assertion');
      c.header('Access-Control-Max-Age', '86400');
    };

    if (c.req.method === 'OPTIONS') {
      setHeaders();
      return c.text('', 204);
    }

    await next();
    setHeaders();
  };
};
