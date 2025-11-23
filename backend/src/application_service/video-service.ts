import { Video } from '@/domain/model/entity/video';
import { UserId } from '@/domain/model/value_object/user-id';
import { VideoId } from '@/domain/model/value_object/video-id';
import { VideoRepository } from '@/domain/repository/video-repository';
import { VideoSummaryDto, toVideoSummaryDto } from './dto/video-dto';

export class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async listForUser(userId: UserId): Promise<VideoSummaryDto[]> {
    const videos = await this.videoRepository.listByOwner(userId);
    return videos.map(toVideoSummaryDto);
  }

  async findById(id: VideoId): Promise<Video | null> {
    return this.videoRepository.findById(id);
  }
}
