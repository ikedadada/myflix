import type { UploadSession, UploadSessionStatus } from '../model/entity/upload-session'
import type { UploadSessionId } from '../model/value_object/upload-session-id'
import type { UserId } from '../model/value_object/user-id'

export interface UploadSessionRepository {
  findById(id: UploadSessionId): Promise<UploadSession | null>
  listByOwner(ownerId: UserId): Promise<UploadSession[]>
  save(session: UploadSession): Promise<void>
  updateStatus(session: UploadSession, status: UploadSessionStatus): Promise<UploadSession>
}
