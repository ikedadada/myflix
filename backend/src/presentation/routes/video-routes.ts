import type { Hono } from "hono";
import type { AppContainer } from "@/container";
import type { HonoEnv } from "@/env";

export const registerVideoRoutes = (
	app: Hono<HonoEnv>,
	resolve: (env: HonoEnv["Bindings"]) => AppContainer,
): void => {
	app.get("/videos", (c) => resolve(c.env).videoHandler.list(c));
	app.post("/videos", (c) => resolve(c.env).videoHandler.create(c));
	app.get("/videos/:id/metadata", (c) =>
		resolve(c.env).videoHandler.metadata(c),
	);
	app.get("/videos/:id/stream", (c) => resolve(c.env).videoHandler.stream(c));
	app.post("/videos/analyze", (c) => resolve(c.env).videoHandler.analyze(c));
	app.get("/videos/:id/thumbnail", (c) =>
		resolve(c.env).videoHandler.thumbnail(c),
	);
	app.post("/videos/:id/thumbnail/from-video", (c) =>
		resolve(c.env).videoHandler.thumbnailFromVideo(c),
	);
};
