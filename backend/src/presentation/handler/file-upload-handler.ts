import type { Context } from 'hono'
import type { FileUploadService } from '@/application_service/file-upload-service'
import type { HonoEnv } from '@/env'

export class FileUploadHandler {
  constructor(private readonly fileUploadService: FileUploadService) {}

  list = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401)
    }
    const sessions = await this.fileUploadService.listUploadSessions(authContext.userId)
    return c.json(
      sessions.map((session) => ({
        id: session.id().toString(),
        status: session.status(),
        createdAt: session.createdAt().toISOString(),
        objectKey: session.objectKey(),
      })),
    )
  }

  create = async (c: Context<HonoEnv>) => {
    const authContext = c.var.authContext
    if (!authContext) {
      return c.json({ message: 'Unauthorized' }, 401)
    }
    const kindParam = c.req.query('kind')
    const kind = kindParam === 'thumbnail' ? 'thumbnail' : 'video'
    const contentType = c.req.header('content-type') ?? undefined
    const body = await c.req.arrayBuffer()
    if (!body || body.byteLength === 0) {
      return c.json({ message: 'Empty upload payload' }, 400)
    }

    const { session, objectKey } = await this.fileUploadService.uploadFile({
      ownerId: authContext.userId,
      data: body,
      contentType,
      kind,
    })

    return c.json({
      id: session.id().toString(),
      status: session.status(),
      objectKey,
    })
  }
}
