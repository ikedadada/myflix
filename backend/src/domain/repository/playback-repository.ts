import type { PlaybackSession } from "../model/entity/playback-session";
import type { UserId } from "../model/value_object/user-id";
import type { VideoId } from "../model/value_object/video-id";

export interface PlaybackRepository {
	findByUserAndVideo(
		userId: UserId,
		videoId: VideoId,
	): Promise<PlaybackSession | null>;
	save(session: PlaybackSession): Promise<void>;
}
