import type { Hono } from "hono";
import type { AppContainer } from "@/container";
import type { HonoEnv } from "@/env";

export const registerSettingsRoutes = (
	app: Hono<HonoEnv>,
	resolve: (env: HonoEnv["Bindings"]) => AppContainer,
): void => {
	app.get("/settings", (c) => resolve(c.env).settingsHandler.get(c));
	app.put("/settings", (c) => resolve(c.env).settingsHandler.update(c));
};
