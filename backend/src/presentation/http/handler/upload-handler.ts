import type { Context } from 'hono';
import type { HonoEnv } from '../hono-env';
import { UploadService } from '@/application_service/upload-service';
import { UploadSession } from '@/domain/model/entity/upload-session';
import { UploadSessionId } from '@/domain/model/value_object/upload-session-id';
import { UserId } from '@/domain/model/value_object/user-id';

export class UploadHandler {
  constructor(private readonly uploadService: UploadService) {}

  list = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const sessions = await this.uploadService.list(authContext.userId);
    return c.json(
      sessions.map((session) => ({
        id: session.id().toString(),
        status: session.status(),
        createdAt: session.createdAt().toISOString()
      }))
    );
  };

  create = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const id = crypto.randomUUID();
    const session = new UploadSession({
      id: new UploadSessionId(id),
      ownerId: authContext.userId,
      status: 'pending',
      createdAt: new Date()
    });
    await this.uploadService.start(session);
    return c.json({ id });
  };
}
