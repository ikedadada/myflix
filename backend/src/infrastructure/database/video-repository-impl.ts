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
  object_key: string;
  thumbnail_key: string | null;
  thumbnail_status: 'pending' | 'processing' | 'succeeded' | 'failed' | null;
  thumbnail_error: string | null;
}

const mapRowToVideo = (row: VideoRow): Video =>
  new Video({
    id: new VideoId(row.id),
    ownerId: new UserId(row.owner_id),
    title: row.title,
    description: row.description,
    durationSeconds: row.duration_seconds,
    createdAt: new Date(row.created_at),
    objectKey: row.object_key,
    thumbnailKey: row.thumbnail_key,
    thumbnailStatus: row.thumbnail_status ?? null,
    thumbnailError: row.thumbnail_error
  });

export class D1VideoRepository implements VideoRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: VideoId): Promise<Video | null> {
    const row = await this.db
      .prepare(
        'SELECT id, owner_id, title, description, duration_seconds, created_at, object_key, thumbnail_key, thumbnail_status, thumbnail_error FROM videos WHERE id = ?1'
      )
      .bind(id.toString())
      .first<VideoRow>();
    return row ? mapRowToVideo(row) : null;
  }

  async listByOwner(ownerId: UserId): Promise<Video[]> {
    const { results } = await this.db
      .prepare(
        'SELECT id, owner_id, title, description, duration_seconds, created_at, object_key, thumbnail_key, thumbnail_status, thumbnail_error FROM videos WHERE owner_id = ?1 ORDER BY created_at DESC'
      )
      .bind(ownerId.toString())
      .all<VideoRow>();
    return (results ?? []).map(mapRowToVideo);
  }

  async save(video: Video): Promise<void> {
    await this.db
      .prepare(
        'INSERT OR REPLACE INTO videos (id, owner_id, title, description, duration_seconds, created_at, object_key, thumbnail_key, thumbnail_status, thumbnail_error) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)'
      )
      .bind(
        video.id().toString(),
        video.ownerId().toString(),
        video.title(),
        video.description(),
        video.durationSeconds(),
        video.createdAt().toISOString(),
        video.objectKey(),
        video.thumbnailKey(),
        video.thumbnailStatus() ?? 'pending',
        video.thumbnailError()
      )
      .run();
  }

  async updateThumbnail(params: {
    videoId: VideoId;
    ownerId: UserId;
    thumbnailKey: string | null;
    thumbnailStatus: 'pending' | 'processing' | 'succeeded' | 'failed';
    thumbnailError?: string | null;
  }): Promise<void> {
    await this.db
      .prepare(
        'UPDATE videos SET thumbnail_key = ?1, thumbnail_status = ?2, thumbnail_error = ?3 WHERE id = ?4 AND owner_id = ?5'
      )
      .bind(
        params.thumbnailKey,
        params.thumbnailStatus,
        params.thumbnailError ?? null,
        params.videoId.toString(),
        params.ownerId.toString()
      )
      .run();
  }
}
