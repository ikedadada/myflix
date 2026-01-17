import { Video } from "@/domain/model/entity/video";
import type { UploadSessionId } from "@/domain/model/value_object/upload-session-id";
import type { UserId } from "@/domain/model/value_object/user-id";
import { VideoId } from "@/domain/model/value_object/video-id";
import type { UploadSessionRepository } from "@/domain/repository/upload-session-repository";
import type { VideoRepository } from "@/domain/repository/video-repository";
import { toVideoSummaryDto, type VideoSummaryDto } from "./dto/video-dto";

export class VideoService {
	constructor(
		private readonly videoRepository: VideoRepository,
		private readonly uploadSessionRepository: UploadSessionRepository,
		private readonly bucket: R2Bucket,
	) {}

	async listForUser(userId: UserId): Promise<VideoSummaryDto[]> {
		const videos = await this.videoRepository.listByOwner(userId);
		return videos.map(toVideoSummaryDto);
	}

	async findById(id: VideoId): Promise<Video | null> {
		return this.videoRepository.findById(id);
	}

	async createFromUpload(params: {
		ownerId: UserId;
		uploadId: UploadSessionId;
		title: string;
		description: string;
		durationSeconds: number;
		thumbnailKey?: string | null;
	}): Promise<Video> {
		const session = await this.uploadSessionRepository.findById(
			params.uploadId,
		);
		if (
			!session ||
			session.ownerId().toString() !== params.ownerId.toString()
		) {
			throw new Error("Upload session not found or unauthorized");
		}
		if (session.status() !== "completed" || !session.objectKey()) {
			throw new Error("Upload session not ready");
		}

		const video = new Video({
			id: new VideoId(crypto.randomUUID()),
			ownerId: params.ownerId,
			title: params.title,
			description: params.description,
			durationSeconds: params.durationSeconds,
			createdAt: new Date(),
			objectKey: session.objectKey(),
			thumbnailKey: params.thumbnailKey ?? null,
		});

		await this.videoRepository.save(video);
		await this.uploadSessionRepository.updateStatus(session, "completed");
		return video;
	}

	async getContent(
		ownerId: UserId,
		videoId: VideoId,
	): Promise<Response | null> {
		const video = await this.videoRepository.findById(videoId);
		if (!video || video.ownerId().toString() !== ownerId.toString()) {
			return null;
		}
		const object = await this.bucket.get(video.objectKey());
		if (!object || !object.body) {
			return null;
		}
		const contentType =
			object.httpMetadata?.contentType ?? "application/octet-stream";
		return new Response(object.body, {
			headers: { "Content-Type": contentType },
		});
	}

	async getThumbnail(
		ownerId: UserId,
		videoId: VideoId,
	): Promise<Response | null> {
		const video = await this.videoRepository.findById(videoId);
		if (
			!video ||
			video.ownerId().toString() !== ownerId.toString() ||
			!video.thumbnailKey()
		) {
			return null;
		}
		const object = await this.bucket.get(video.thumbnailKey() as string);
		if (!object || !object.body) {
			return null;
		}
		const contentType = object.httpMetadata?.contentType ?? "image/jpeg";
		return new Response(object.body, {
			headers: { "Content-Type": contentType },
		});
	}

	async updateThumbnailKey(params: {
		ownerId: UserId;
		videoId: VideoId;
		thumbnailKey: string | null;
	}): Promise<void> {
		const video = await this.videoRepository.findById(params.videoId);
		if (!video || video.ownerId().toString() !== params.ownerId.toString()) {
			throw new Error("Video not found or unauthorized");
		}

		await this.videoRepository.updateThumbnailKey({
			videoId: params.videoId,
			ownerId: params.ownerId,
			thumbnailKey: params.thumbnailKey,
		});
	}
}
