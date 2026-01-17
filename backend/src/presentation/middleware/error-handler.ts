import type { Hono } from "hono";
import type { HonoEnv } from "@/env";
import type { Logger } from "@/utils/logger";

export const registerErrorHandler = (
	app: Hono<HonoEnv>,
	logger: Logger,
): void => {
	app.onError((err, c) => {
		logger.error("Unhandled error", { error: err });
		return c.json({ message: "Internal Server Error" }, 500);
	});
};
