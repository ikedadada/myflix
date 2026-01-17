import { Hono } from 'hono';
import { registerAuthRoutes } from '@/presentation/routes/auth-routes';
import { registerVideoRoutes } from '@/presentation/routes/video-routes';
import { registerUploadRoutes } from '@/presentation/routes/upload-routes';
import { registerPlaybackRoutes } from '@/presentation/routes/playback-routes';
import { registerSettingsRoutes } from '@/presentation/routes/settings-routes';
import { registerErrorHandler } from '@/presentation/middleware/error-handler';
import { createLoggingMiddleware } from '@/presentation/middleware/logging-middleware';
import { createAuthMiddleware } from '@/presentation/middleware/auth-middleware';
import { createCorsMiddleware } from '@/presentation/middleware/cors-middleware';
import { createContainer, type AppContainer } from '@/container';
import type { HonoEnv,ServiceBindings } from '@/env';
import { Logger } from '@/infrastructure/logging/logger';
import { AccessAuthProvider } from '@/infrastructure/external/auth-provider-impl';




const app = new Hono<HonoEnv>().basePath('/api');
const logger = new Logger('api');

let cachedContainer: AppContainer | null = null;
const resolveContainer = (bindings: ServiceBindings): AppContainer => {
  if (!cachedContainer) {
    cachedContainer = createContainer(bindings);
  }
  return cachedContainer;
};

app.use('*', createLoggingMiddleware(logger));
app.use('*', createCorsMiddleware());
app.use('*', createAuthMiddleware((env) => new AccessAuthProvider(env.ACCESS_JWKS_URL, env.ACCESS_JWT_AUD)));

registerAuthRoutes(app, resolveContainer);
registerVideoRoutes(app, resolveContainer);
registerUploadRoutes(app, resolveContainer);
registerPlaybackRoutes(app, resolveContainer);
registerSettingsRoutes(app, resolveContainer);
registerErrorHandler(app);

export default app;
