import { UploadSession } from '@/domain/model/entity/upload-session';
import { UploadSessionId } from '@/domain/model/value_object/upload-session-id';
import { UserId } from '@/domain/model/value_object/user-id';
import { UploadSessionRepository } from '@/domain/repository/upload-session-repository';

interface UploadSessionRow {
  id: string;
  owner_id: string;
  status: string;
  created_at: string;
}

const mapRowToUploadSession = (row: UploadSessionRow): UploadSession =>
  new UploadSession({
    id: new UploadSessionId(row.id),
    ownerId: new UserId(row.owner_id),
    status: row.status as UploadSession['status'],
    createdAt: new Date(row.created_at)
  });

export class D1UploadSessionRepository implements UploadSessionRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: UploadSessionId): Promise<UploadSession | null> {
    const row = await this.db
      .prepare('SELECT id, owner_id, status, created_at FROM upload_sessions WHERE id = ?1')
      .bind(id.toString())
      .first<UploadSessionRow>();
    return row ? mapRowToUploadSession(row) : null;
  }

  async listByOwner(ownerId: UserId): Promise<UploadSession[]> {
    const { results } = await this.db
      .prepare(
        'SELECT id, owner_id, status, created_at FROM upload_sessions WHERE owner_id = ?1 ORDER BY created_at DESC'
      )
      .bind(ownerId.toString())
      .all<UploadSessionRow>();
    return (results ?? []).map(mapRowToUploadSession);
  }

  async save(session: UploadSession): Promise<void> {
    await this.db
      .prepare(
        'INSERT OR REPLACE INTO upload_sessions (id, owner_id, status, created_at) VALUES (?1, ?2, ?3, ?4)'
      )
      .bind(
        session.id().toString(),
        session.ownerId().toString(),
        session.status(),
        session.createdAt().toISOString()
      )
      .run();
  }
}
