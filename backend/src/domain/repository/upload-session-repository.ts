import { UploadSession } from '../model/entity/upload-session';
import { UploadSessionId } from '../model/value_object/upload-session-id';
import { UserId } from '../model/value_object/user-id';

export interface UploadSessionRepository {
  findById(id: UploadSessionId): Promise<UploadSession | null>;
  listByOwner(ownerId: UserId): Promise<UploadSession[]>;
  save(session: UploadSession): Promise<void>;
}
