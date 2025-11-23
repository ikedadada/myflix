import { Hono } from 'hono';
import { registerAuthRoutes } from './routes/auth-routes';
import { registerVideoRoutes } from './routes/video-routes';
import { registerUploadRoutes } from './routes/upload-routes';
import { registerPlaybackRoutes } from './routes/playback-routes';
import { registerSettingsRoutes } from './routes/settings-routes';
import { registerErrorHandler } from './middleware/error-handler';
import { createLoggingMiddleware } from './middleware/logging-middleware';
import { createAuthMiddleware } from './middleware/auth-middleware';
import type { HonoEnv } from './hono-env';
import { createContainer, type AppContainer } from './container';
import type { ServiceBindings } from '@/infrastructure/config/env';
import { Logger } from '@/infrastructure/logging/logger';
import { AccessAuthProvider } from '@/infrastructure/external/auth-provider-impl';

const app = new Hono<HonoEnv>();
const logger = new Logger('api');

let cachedContainer: AppContainer | null = null;
const resolveContainer = (bindings: ServiceBindings): AppContainer => {
  if (!cachedContainer) {
    cachedContainer = createContainer(bindings);
  }
  return cachedContainer;
};

app.use('*', createLoggingMiddleware(logger));
app.use('*', createAuthMiddleware((env) => new AccessAuthProvider(env.ACCESS_JWKS_URL, env.ACCESS_JWT_AUD)));

registerAuthRoutes(app, resolveContainer);
registerVideoRoutes(app, resolveContainer);
registerUploadRoutes(app, resolveContainer);
registerPlaybackRoutes(app, resolveContainer);
registerSettingsRoutes(app, resolveContainer);
registerErrorHandler(app);

export default app;
