import type { Context } from 'hono';
import type { HonoEnv } from '../hono-env';
import { PlaybackService } from '@/application_service/playback-service';
import { VideoId } from '@/domain/model/value_object/video-id';
import { PlaybackPosition } from '@/domain/model/value_object/playback-position';

export class PlaybackHandler {
  constructor(private readonly playbackService: PlaybackService) {}

  getProgress = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const videoId = new VideoId(c.req.param('id'));
    const session = await this.playbackService.getProgress(authContext.userId, videoId);
    if (!session) {
      return c.json({ position: null });
    }
    return c.json({ position: session.lastPosition().value() });
  };

  updateProgress = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const body = await c.req.json<{ position: number }>();
    const videoId = new VideoId(c.req.param('id'));
    await this.playbackService.persistProgress(
      authContext.userId,
      videoId,
      new PlaybackPosition(body.position)
    );
    return c.json({ ok: true });
  };
}
