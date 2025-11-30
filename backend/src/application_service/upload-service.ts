import { UploadSession } from '@/domain/model/entity/upload-session';
import { UploadSessionId } from '@/domain/model/value_object/upload-session-id';
import { UserId } from '@/domain/model/value_object/user-id';
import { UploadSessionRepository } from '@/domain/repository/upload-session-repository';

export class UploadService {
  constructor(
    private readonly repository: UploadSessionRepository,
    private readonly bucket: R2Bucket
  ) {}

  async list(ownerId: UserId): Promise<UploadSession[]> {
    return this.repository.listByOwner(ownerId);
  }

  async start(session: UploadSession): Promise<void> {
    await this.repository.save(session);
  }

  async findById(id: UploadSessionId): Promise<UploadSession | null> {
    return this.repository.findById(id);
  }

  async uploadObject(params: {
    ownerId: UserId;
    data: ArrayBuffer;
    contentType?: string;
    kind?: 'video' | 'thumbnail';
  }): Promise<{ session: UploadSession; objectKey: string }> {
    const id = new UploadSessionId(crypto.randomUUID());
    const prefix = params.kind === 'thumbnail' ? 'thumbnails' : 'videos';
    const objectKey = `${prefix}/${params.ownerId.toString()}/${id.toString()}`;

    await this.bucket.put(objectKey, params.data, {
      httpMetadata: params.contentType ? { contentType: params.contentType } : undefined
    });

    const session = new UploadSession({
      id,
      ownerId: params.ownerId,
      status: 'completed',
      createdAt: new Date(),
      objectKey
    });

    await this.repository.save(session);
    return { session, objectKey };
  }
}
