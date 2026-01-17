import type { UserId } from "@/domain/model/value_object/user-id";
import type { VideoId } from "@/domain/model/value_object/video-id";
import type { PlaybackService } from "./playback-service";
import type { VideoService } from "./video-service";

export interface VideoMetadataDto {
	videoId: string;
	lastPositionSeconds: number | null;
	thumbnailUrl: string | null;
}

export class MetadataService {
	constructor(
		private readonly videoService: VideoService,
		private readonly playbackService: PlaybackService,
	) {}

	async summarize(
		userId: UserId,
		videoId: VideoId,
	): Promise<VideoMetadataDto | null> {
		const video = await this.videoService.findById(videoId);
		if (!video) {
			return null;
		}
		const playback = await this.playbackService.getProgress(userId, videoId);
		return {
			videoId: video.id().toString(),
			lastPositionSeconds: playback ? playback.lastPosition().value() : null,
			thumbnailUrl: video.thumbnailKey()
				? `/api/videos/${video.id().toString()}/thumbnail`
				: null,
		};
	}
}
