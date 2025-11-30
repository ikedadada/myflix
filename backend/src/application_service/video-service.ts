import { Video } from '@/domain/model/entity/video';
import { UploadSession } from '@/domain/model/entity/upload-session';
import { UploadSessionId } from '@/domain/model/value_object/upload-session-id';
import { UserId } from '@/domain/model/value_object/user-id';
import { VideoId } from '@/domain/model/value_object/video-id';
import { UploadSessionRepository } from '@/domain/repository/upload-session-repository';
import { VideoRepository } from '@/domain/repository/video-repository';
import { VideoSummaryDto, toVideoSummaryDto } from './dto/video-dto';

export class VideoService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly uploadSessionRepository: UploadSessionRepository,
    private readonly bucket: R2Bucket
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
    const session = await this.uploadSessionRepository.findById(params.uploadId);
    if (!session || session.ownerId().toString() !== params.ownerId.toString()) {
      throw new Error('Upload session not found or unauthorized');
    }
    if (session.status() !== 'completed' || !session.objectKey()) {
      throw new Error('Upload session not ready');
    }

    const video = new Video({
      id: new VideoId(crypto.randomUUID()),
      ownerId: params.ownerId,
      title: params.title,
      description: params.description,
      durationSeconds: params.durationSeconds,
      createdAt: new Date(),
      objectKey: session.objectKey(),
      thumbnailKey: params.thumbnailKey ?? null
    });

    await this.videoRepository.save(video);
    await this.uploadSessionRepository.updateStatus(session, 'completed');
    return video;
  }

  async getContent(ownerId: UserId, videoId: VideoId): Promise<Response | null> {
    const video = await this.videoRepository.findById(videoId);
    if (!video || video.ownerId().toString() !== ownerId.toString()) {
      return null;
    }
    const object = await this.bucket.get(video.objectKey());
    if (!object || !object.body) {
      return null;
    }
    const contentType = object.httpMetadata?.contentType ?? 'application/octet-stream';
    return new Response(object.body, {
      headers: { 'Content-Type': contentType }
    });
  }

  async getThumbnail(ownerId: UserId, videoId: VideoId): Promise<Response | null> {
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
    const contentType = object.httpMetadata?.contentType ?? 'image/jpeg';
    return new Response(object.body, {
      headers: { 'Content-Type': contentType }
    });
  }

  async updateThumbnailKey(params: {
    ownerId: UserId;
    videoId: VideoId;
    thumbnailKey: string | null;
  }): Promise<void> {
    const video = await this.videoRepository.findById(params.videoId);
    if (!video || video.ownerId().toString() !== params.ownerId.toString()) {
      throw new Error('Video not found or unauthorized');
    }

    await this.videoRepository.updateThumbnailKey({
      videoId: params.videoId,
      ownerId: params.ownerId,
      thumbnailKey: params.thumbnailKey
    });
  }

  async setDefaultThumbnail(ownerId: UserId, videoId: VideoId): Promise<string> {
    const video = await this.videoRepository.findById(videoId);
    if (!video || video.ownerId().toString() !== ownerId.toString()) {
      throw new Error('Video not found or unauthorized');
    }
    const key = `uploads/${ownerId.toString()}/${videoId.toString()}/thumbnail-default.png`;
    const transparentPng = Uint8Array.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48,
      0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x06, 0x00, 0x00,
      0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41, 0x54, 0x78,
      0x9c, 0x63, 0x60, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xe2, 0x21, 0xbc, 0x33, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);
    await this.bucket.put(key, transparentPng, { httpMetadata: { contentType: 'image/png' } });
    await this.videoRepository.updateThumbnailKey({
      videoId,
      ownerId,
      thumbnailKey: key
    });
    return key;
  }
}
