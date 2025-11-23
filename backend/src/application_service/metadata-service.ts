import { VideoService } from './video-service';
import { PlaybackService } from './playback-service';
import { UserId } from '@/domain/model/value_object/user-id';
import { VideoId } from '@/domain/model/value_object/video-id';

export interface VideoMetadataDto {
  videoId: string;
  lastPositionSeconds: number | null;
}

export class MetadataService {
  constructor(
    private readonly videoService: VideoService,
    private readonly playbackService: PlaybackService
  ) {}

  async summarize(userId: UserId, videoId: VideoId): Promise<VideoMetadataDto | null> {
    const video = await this.videoService.findById(videoId);
    if (!video) {
      return null;
    }
    const playback = await this.playbackService.getProgress(userId, videoId);
    return {
      videoId: video.id().toString(),
      lastPositionSeconds: playback ? playback.lastPosition().value() : null
    };
  }
}
