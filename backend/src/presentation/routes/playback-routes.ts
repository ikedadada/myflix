import type { Hono } from 'hono';
import type { AppContainer } from "@/container";
import type { HonoEnv } from "@/env";

export const registerPlaybackRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer
): void => {
  app.get('/videos/:id/progress', (c) => resolve(c.env).playbackHandler.get(c));
  app.post('/videos/:id/progress', (c) => resolve(c.env).playbackHandler.upsert(c));
};
