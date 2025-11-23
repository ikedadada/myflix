import { Video } from '../model/entity/video';
import { VideoId } from '../model/value_object/video-id';
import { UserId } from '../model/value_object/user-id';

export interface VideoRepository {
  findById(id: VideoId): Promise<Video | null>;
  listByOwner(ownerId: UserId): Promise<Video[]>;
  save(video: Video): Promise<void>;
}
