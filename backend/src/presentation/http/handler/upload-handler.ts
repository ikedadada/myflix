import type { Context } from 'hono';
import type { HonoEnv } from '../hono-env';
import { UploadService } from '@/application_service/upload-service';

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
        createdAt: session.createdAt().toISOString(),
        objectKey: session.objectKey()
      }))
    );
  };

  create = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext;
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const contentType = c.req.header('content-type') ?? undefined;
    const body = await c.req.arrayBuffer();
    if (!body || body.byteLength === 0) {
      return c.json({ message: 'Empty upload payload' }, 400);
    }

    const { session, objectKey } = await this.uploadService.uploadObject({
      ownerId: authContext.userId,
      data: body,
      contentType
    });

    return c.json({
      id: session.id().toString(),
      status: session.status(),
      objectKey
    });
  };
}
