import type { Video } from '../model/entity/video'
import type { UserId } from '../model/value_object/user-id'
import type { VideoId } from '../model/value_object/video-id'

export interface VideoRepository {
  findById(id: VideoId): Promise<Video | null>
  listByOwner(ownerId: UserId): Promise<Video[]>
  save(video: Video): Promise<void>
  updateThumbnailKey(params: {
    videoId: VideoId
    ownerId: UserId
    thumbnailKey: string | null
  }): Promise<void>
}
