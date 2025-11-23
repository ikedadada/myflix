import { PlaybackSession } from '@/domain/model/entity/playback-session';
import { PlaybackPosition } from '@/domain/model/value_object/playback-position';
import { UserId } from '@/domain/model/value_object/user-id';
import { VideoId } from '@/domain/model/value_object/video-id';
import { PlaybackRepository } from '@/domain/repository/playback-repository';

interface PlaybackRow {
  user_id: string;
  video_id: string;
  last_position_seconds: number;
  updated_at: string;
}

const mapRowToPlayback = (row: PlaybackRow): PlaybackSession =>
  new PlaybackSession({
    userId: new UserId(row.user_id),
    videoId: new VideoId(row.video_id),
    lastPosition: new PlaybackPosition(row.last_position_seconds),
    updatedAt: new Date(row.updated_at)
  });

export class D1PlaybackRepository implements PlaybackRepository {
  constructor(private readonly db: D1Database) {}

  async findByUserAndVideo(userId: UserId, videoId: VideoId): Promise<PlaybackSession | null> {
    const row = await this.db
      .prepare(
        'SELECT user_id, video_id, last_position_seconds, updated_at FROM playback_sessions WHERE user_id = ?1 AND video_id = ?2'
      )
      .bind(userId.toString(), videoId.toString())
      .first<PlaybackRow>();
    return row ? mapRowToPlayback(row) : null;
  }

  async save(session: PlaybackSession): Promise<void> {
    await this.db
      .prepare(
        'INSERT OR REPLACE INTO playback_sessions (user_id, video_id, last_position_seconds, updated_at) VALUES (?1, ?2, ?3, ?4)'
      )
      .bind(
        session.userId().toString(),
        session.videoId().toString(),
        session.lastPosition().value(),
        session.updatedAt().toISOString()
      )
      .run();
  }
}
