import type { Video } from "@/domain/model/entity/video";

export interface VideoSummaryDto {
	id: string;
	title: string;
	description: string;
	durationSeconds: number;
	objectKey: string;
	thumbnailUrl: string | null;
}

export const toVideoSummaryDto = (video: Video): VideoSummaryDto => ({
	id: video.id().toString(),
	title: video.title(),
	description: video.description(),
	durationSeconds: video.durationSeconds(),
	objectKey: video.objectKey(),
	thumbnailUrl: video.thumbnailKey()
		? `/api/videos/${video.id().toString()}/thumbnail`
		: null,
});
