import { Video } from '@/domain/model/entity/video';
import { UserId } from '@/domain/model/value_object/user-id';
import { VideoId } from '@/domain/model/value_object/video-id';
import { VideoRepository } from '@/domain/repository/video-repository';

interface VideoRow {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  duration_seconds: number;
  created_at: string;
}

const mapRowToVideo = (row: VideoRow): Video =>
  new Video({
    id: new VideoId(row.id),
    ownerId: new UserId(row.owner_id),
    title: row.title,
    description: row.description,
    durationSeconds: row.duration_seconds,
    createdAt: new Date(row.created_at)
  });

export class D1VideoRepository implements VideoRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: VideoId): Promise<Video | null> {
    const row = await this.db
      .prepare(
        'SELECT id, owner_id, title, description, duration_seconds, created_at FROM videos WHERE id = ?1'
      )
      .bind(id.toString())
      .first<VideoRow>();
    return row ? mapRowToVideo(row) : null;
  }

  async listByOwner(ownerId: UserId): Promise<Video[]> {
    const { results } = await this.db
      .prepare(
        'SELECT id, owner_id, title, description, duration_seconds, created_at FROM videos WHERE owner_id = ?1 ORDER BY created_at DESC'
      )
      .bind(ownerId.toString())
      .all<VideoRow>();
    return (results ?? []).map(mapRowToVideo);
  }

  async save(video: Video): Promise<void> {
    await this.db
      .prepare(
        'INSERT OR REPLACE INTO videos (id, owner_id, title, description, duration_seconds, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)'
      )
      .bind(
        video.id().toString(),
        video.ownerId().toString(),
        video.title(),
        video.description(),
        video.durationSeconds(),
        video.createdAt().toISOString()
      )
      .run();
  }
}
