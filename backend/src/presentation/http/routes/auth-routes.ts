import type { Hono } from 'hono';
import type { HonoEnv } from '../hono-env';
import type { AppContainer } from '../container';

export const registerAuthRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer
): void => {
  app.get('/auth/me', (c) => resolve(c.env).authHandler.me(c));
};
