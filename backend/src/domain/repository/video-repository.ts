import { Video } from '../model/entity/video';
import { VideoId } from '../model/value_object/video-id';
import { UserId } from '../model/value_object/user-id';

export interface VideoRepository {
  findById(id: VideoId): Promise<Video | null>;
  listByOwner(ownerId: UserId): Promise<Video[]>;
  save(video: Video): Promise<void>;
  updateThumbnail(params: {
    videoId: VideoId;
    ownerId: UserId;
    thumbnailKey: string | null;
    thumbnailStatus: 'pending' | 'processing' | 'succeeded' | 'failed';
    thumbnailError?: string | null;
  }): Promise<void>;
}
