import { PlaybackSession } from '@/domain/model/entity/playback-session'
import type { PlaybackPosition } from '@/domain/model/value_object/playback-position'
import type { UserId } from '@/domain/model/value_object/user-id'
import type { VideoId } from '@/domain/model/value_object/video-id'
import type { PlaybackRepository } from '@/domain/repository/playback-repository'

export interface PlaybackService {
  upsertProgress(userId: UserId, videoId: VideoId, position: PlaybackPosition): Promise<void>
  findProgress(userId: UserId, videoId: VideoId): Promise<PlaybackSession | null>
}

export class PlaybackServiceImpl implements PlaybackService {
  constructor(private readonly repository: PlaybackRepository) {}

  async upsertProgress(
    userId: UserId,
    videoId: VideoId,
    position: PlaybackPosition,
  ): Promise<void> {
    const existing = await this.repository.findByUserAndVideo(userId, videoId)
    const session = existing
      ? existing.touch(position)
      : new PlaybackSession({
          userId,
          videoId,
          lastPosition: position,
          updatedAt: new Date(),
        })
    await this.repository.save(session)
  }

  async findProgress(userId: UserId, videoId: VideoId): Promise<PlaybackSession | null> {
    return this.repository.findByUserAndVideo(userId, videoId)
  }
}
