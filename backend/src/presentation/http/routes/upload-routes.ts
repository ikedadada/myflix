import type { Hono } from 'hono';
import type { HonoEnv } from '../hono-env';
import type { AppContainer } from '../container';

export const registerUploadRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer
): void => {
  app.get('/uploads', (c) => resolve(c.env).uploadHandler.list(c));
  app.post('/uploads', (c) => resolve(c.env).uploadHandler.create(c));
};
