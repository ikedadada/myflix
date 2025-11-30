import type { Context } from 'hono';
import type { HonoEnv } from '../hono-env';
import { VideoService } from '@/application_service/video-service';
import { MetadataService } from '@/application_service/metadata-service';
import { VideoId } from '@/domain/model/value_object/video-id';
import { UploadSessionId } from '@/domain/model/value_object/upload-session-id';
import {
  AnalyzeAiResponseError,
  AnalyzeValidationError,
  VideoAnalyzeService
} from '@/application_service/video-analyze-service';

export class VideoHandler {
  constructor(
    private readonly videoService: VideoService,
    private readonly metadataService: MetadataService,
    private readonly videoAnalyzeService: VideoAnalyzeService
  ) {}

  list = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const videos = await this.videoService.listForUser(authContext.userId);
    return c.json(videos);
  };

  create = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const body = await c.req.json().catch(() => null);
    if (
      !body ||
      typeof body.uploadId !== 'string' ||
      typeof body.title !== 'string' ||
      typeof body.description !== 'string' ||
      typeof body.durationSeconds !== 'number' ||
      body.durationSeconds <= 0
    ) {
      return c.json({ message: 'Invalid payload' }, 400);
    }
    const thumbnailKey =
      typeof body.thumbnailObjectKey === 'string' && body.thumbnailObjectKey.length > 0
        ? body.thumbnailObjectKey
        : null;

    try {
      const video = await this.videoService.createFromUpload({
        ownerId: authContext.userId,
        uploadId: new UploadSessionId(body.uploadId),
        title: body.title,
        description: body.description,
        durationSeconds: body.durationSeconds,
        thumbnailKey
      });
      return c.json(
        {
          id: video.id().toString(),
          title: video.title(),
          description: video.description(),
          durationSeconds: video.durationSeconds(),
          objectKey: video.objectKey(),
          thumbnailUrl: video.thumbnailKey()
            ? `/api/videos/${video.id().toString()}/thumbnail`
            : null
        },
        201
      );
    } catch (error) {
      console.error('Create video failed', error);
      return c.json({ message: 'Failed to create video' }, 400);
    }
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

  stream = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const videoId = new VideoId(c.req.param('id'));
    const content = await this.videoService.getContent(authContext.userId, videoId);
    if (!content) {
      return c.json({ message: 'Video not found' }, 404);
    }
    return content;
  };

  thumbnail = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const videoId = new VideoId(c.req.param('id'));
    const content = await this.videoService.getThumbnail(authContext.userId, videoId);
    if (!content) {
      return c.json({ message: 'Thumbnail not found' }, 404);
    }
    return content;
  };

  analyze = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const body = await c.req.parseBody();
    const video = body['video'];
    const toneRaw = body['tone'];
    const userContext = typeof body['userContext'] === 'string' ? body['userContext'] : undefined;

    if (!(video instanceof File)) {
      return c.json({ message: 'Invalid payload: video is required' }, 400);
    }
    if (typeof toneRaw !== 'string') {
      return c.json({ message: 'Invalid payload: tone is required' }, 400);
    }

    try {
      const result = await this.videoAnalyzeService.analyze({
        file: video,
        tone: toneRaw,
        userContext
      });
      return c.json(result);
    } catch (error) {
      if (error instanceof AnalyzeValidationError) {
        return c.json({ message: error.message }, 400);
      }
      if (error instanceof AnalyzeAiResponseError) {
        return c.json({ message: error.message }, 502);
      }
      console.error('Analyze video failed', error);
      return c.json({ message: 'Failed to analyze video' }, 500);
    }
  };
}
