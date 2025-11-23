import type { Hono } from 'hono';
import type { HonoEnv } from '../hono-env';
import type { AppContainer } from '../container';

export const registerVideoRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer
): void => {
  app.get('/videos', (c) => resolve(c.env).videoHandler.list(c));
  app.get('/videos/:id/metadata', (c) => resolve(c.env).videoHandler.metadata(c));
};
