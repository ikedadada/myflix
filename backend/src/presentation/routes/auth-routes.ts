import type { Hono } from 'hono'
import type { AppContainer } from '@/container'
import type { HonoEnv } from '@/env'

export const registerAuthRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer,
): void => {
  app.get('/auth/me', (c) => resolve(c.env).authHandler.me(c))
  app.get('/auth/callback', (c) => resolve(c.env).authHandler.callback(c))
}
