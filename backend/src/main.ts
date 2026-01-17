import { Hono } from "hono";
import { type AppContainer, createContainer } from "@/container";
import type { HonoEnv, ServiceBindings } from "@/env";
import { AccessAuthProvider } from "@/infrastructure/external/auth-provider-impl";
import { createAccessLoggingMiddleware } from "@/presentation/middleware/access-logging-middleware";
import { createAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { registerErrorHandler } from "@/presentation/middleware/error-handler";
import { registerAuthRoutes } from "@/presentation/routes/auth-routes";
import { registerPlaybackRoutes } from "@/presentation/routes/playback-routes";
import { registerSettingsRoutes } from "@/presentation/routes/settings-routes";
import { registerUploadRoutes } from "@/presentation/routes/upload-routes";
import { registerVideoRoutes } from "@/presentation/routes/video-routes";
import { LoggerImpl } from "@/utils/logger";

const app = new Hono<HonoEnv>().basePath("/api");
const logger = new LoggerImpl("api");

let cachedContainer: AppContainer | null = null;
const resolveContainer = (bindings: ServiceBindings): AppContainer => {
	if (!cachedContainer) {
		cachedContainer = createContainer(bindings);
	}
	return cachedContainer;
};

app.use("*", createAccessLoggingMiddleware(logger));
app.use(
	"*",
	createAuthMiddleware(
		(env) => new AccessAuthProvider(env.ACCESS_JWKS_URL, env.ACCESS_JWT_AUD),
    logger,
	),
);

registerAuthRoutes(app, resolveContainer);
registerVideoRoutes(app, resolveContainer);
registerUploadRoutes(app, resolveContainer);
registerPlaybackRoutes(app, resolveContainer);
registerSettingsRoutes(app, resolveContainer);

registerErrorHandler(app, logger);

export default app;
