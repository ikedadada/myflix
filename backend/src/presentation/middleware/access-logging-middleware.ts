import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "@/env";
import type { Logger } from "@/utils/logger";

export const createAccessLoggingMiddleware =
	(logger: Logger): MiddlewareHandler<HonoEnv> =>
	async (c, next) => {
		const start = Date.now();
		await next();
		const duration = Date.now() - start;
		logger.info(
			`${c.req.method} ${c.req.path} -> ${c.res.status} (${duration}ms)`,
		);
	};
