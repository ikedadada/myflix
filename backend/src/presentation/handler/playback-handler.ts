import type { Context } from "hono";
import type { PlaybackService } from "@/application_service/playback-service";
import { PlaybackPosition } from "@/domain/model/value_object/playback-position";
import { VideoId } from "@/domain/model/value_object/video-id";
import type { HonoEnv } from "@/env";

export class PlaybackHandler {
	constructor(private readonly playbackService: PlaybackService) {}

	get = async (c: Context<HonoEnv>) => {
		const authContext = c.var.authContext;
		if (!authContext) {
			return c.json({ message: "Unauthorized" }, 401);
		}
		const videoId = new VideoId(c.req.param("id"));
		const session = await this.playbackService.findProgress(
			authContext.userId,
			videoId,
		);
		if (!session) {
			return c.json({ position: null });
		}
		return c.json({ position: session.lastPosition().value() });
	};

	upsert = async (c: Context<HonoEnv>) => {
		const authContext = c.var.authContext;
		if (!authContext) {
			return c.json({ message: "Unauthorized" }, 401);
		}
		const body = await c.req.json<{ position: number }>();
		const videoId = new VideoId(c.req.param("id"));
		await this.playbackService.upsertProgress(
			authContext.userId,
			videoId,
			new PlaybackPosition(body.position),
		);
		return c.json({ ok: true });
	};
}
