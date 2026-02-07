import { Video } from '@/domain/model/entity/video'
import type { UploadSessionId } from '@/domain/model/value_object/upload-session-id'
import type { UserId } from '@/domain/model/value_object/user-id'
import { VideoId } from '@/domain/model/value_object/video-id'
import type { UploadSessionRepository } from '@/domain/repository/upload-session-repository'
import type { VideoRepository } from '@/domain/repository/video-repository'

export interface createVideoFromUploadSessionParams {
  ownerId: UserId
  uploadId: UploadSessionId
  title: string
  description: string
  durationSeconds: number
  thumbnailKey?: string | null
}

export interface VideoService {
  listVideosByUserId(userId: UserId): Promise<Video[]>
  findVideo(id: VideoId): Promise<Video | null>
  createVideoFromUploadSession(params: createVideoFromUploadSessionParams): Promise<Video>
  findVideoFileObject(ownerId: UserId, videoId: VideoId): Promise<R2ObjectBody | null>
  findThumbnailFileObject(ownerId: UserId, videoId: VideoId): Promise<R2ObjectBody | null>
}

export class VideoServiceImpl implements VideoService {
  constructor(
    private readonly videoRepository: VideoRepository,
    private readonly uploadSessionRepository: UploadSessionRepository,
    private readonly bucket: R2Bucket,
  ) {}

  async listVideosByUserId(userId: UserId): Promise<Video[]> {
    const videos = await this.videoRepository.listByOwner(userId)
    return videos
  }

  async findVideo(id: VideoId): Promise<Video | null> {
    return this.videoRepository.findById(id)
  }

  async createVideoFromUploadSession(params: createVideoFromUploadSessionParams): Promise<Video> {
    const session = await this.uploadSessionRepository.findById(params.uploadId)
    if (!session || session.ownerId().toString() !== params.ownerId.toString()) {
      throw new Error('Upload session not found or unauthorized')
    }
    if (session.status() !== 'completed' || !session.objectKey()) {
      throw new Error('Upload session not ready')
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
    })

    await this.videoRepository.save(video)
    await this.uploadSessionRepository.updateStatus(session, 'completed')
    return video
  }

  async findVideoFileObject(ownerId: UserId, videoId: VideoId): Promise<R2ObjectBody | null> {
    const video = await this.videoRepository.findById(videoId)
    if (!video || video.ownerId().toString() !== ownerId.toString()) {
      return null
    }
    const object = await this.bucket.get(video.objectKey())
    if (!object || !object.body) {
      return null
    }

    return object
  }

  async findThumbnailFileObject(ownerId: UserId, videoId: VideoId): Promise<R2ObjectBody | null> {
    const video = await this.videoRepository.findById(videoId)
    if (!video || video.ownerId().toString() !== ownerId.toString() || !video.thumbnailKey()) {
      return null
    }
    const object = await this.bucket.get(video.thumbnailKey() as string)
    if (!object || !object.body) {
      return null
    }

    return object
  }
}
