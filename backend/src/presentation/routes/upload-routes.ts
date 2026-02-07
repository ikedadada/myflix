import type { Hono } from 'hono'
import type { AppContainer } from '@/container'
import type { HonoEnv } from '@/env'

export const registerUploadRoutes = (
  app: Hono<HonoEnv>,
  resolve: (env: HonoEnv['Bindings']) => AppContainer,
): void => {
  app.get('/uploads', (c) => resolve(c.env).fileUploadHandler.list(c))
  app.post('/uploads', (c) => resolve(c.env).fileUploadHandler.create(c))
}
