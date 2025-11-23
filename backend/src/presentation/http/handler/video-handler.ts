import type { Context } from 'hono';
import type { HonoEnv } from '../hono-env';
import { VideoService } from '@/application_service/video-service';
import { MetadataService } from '@/application_service/metadata-service';
import { VideoId } from '@/domain/model/value_object/video-id';
import { UserId } from '@/domain/model/value_object/user-id';

export class VideoHandler {
  constructor(
    private readonly videoService: VideoService,
    private readonly metadataService: MetadataService
  ) {}

  list = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const videos = await this.videoService.listForUser(authContext.userId);
    return c.json(videos);
  };

  metadata = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const videoId = new VideoId(c.req.param('id'));
    const summary = await this.metadataService.summarize(authContext.userId, videoId);
    if (!summary) {
      return c.json({ message: 'Video not found' }, 404);
    }
    return c.json(summary);
  };
}
