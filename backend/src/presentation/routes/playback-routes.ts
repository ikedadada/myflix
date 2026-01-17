import type { Hono } from 'hono';
import type { HonoEnv } from '../hono-env';
import type { AppContainer } from '../container';

export const registerPlaybackRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer
): void => {
  app.get('/videos/:id/progress', (c) => resolve(c.env).playbackHandler.getProgress(c));
  app.post('/videos/:id/progress', (c) => resolve(c.env).playbackHandler.updateProgress(c));
};
