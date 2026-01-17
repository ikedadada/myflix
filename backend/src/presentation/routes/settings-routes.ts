import type { Hono } from 'hono';
import type { HonoEnv } from '../hono-env';
import type { AppContainer } from '../container';

export const registerSettingsRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer
): void => {
  app.get('/settings', (c) => resolve(c.env).settingsHandler.get(c));
  app.put('/settings', (c) => resolve(c.env).settingsHandler.update(c));
};
