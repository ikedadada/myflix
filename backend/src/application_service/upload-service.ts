import { UploadSession } from '@/domain/model/entity/upload-session';
import { UploadSessionId } from '@/domain/model/value_object/upload-session-id';
import { UserId } from '@/domain/model/value_object/user-id';
import { UploadSessionRepository } from '@/domain/repository/upload-session-repository';

export class UploadService {
  constructor(private readonly repository: UploadSessionRepository) {}

  async list(ownerId: UserId): Promise<UploadSession[]> {
    return this.repository.listByOwner(ownerId);
  }

  async start(session: UploadSession): Promise<void> {
    await this.repository.save(session);
  }

  async findById(id: UploadSessionId): Promise<UploadSession | null> {
    return this.repository.findById(id);
  }
}
