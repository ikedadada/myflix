import { Video } from '@/domain/model/entity/video';

export interface VideoSummaryDto {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
}

export const toVideoSummaryDto = (video: Video): VideoSummaryDto => ({
  id: video.id().toString(),
  title: video.title(),
  description: video.description(),
  durationSeconds: video.durationSeconds()
});
