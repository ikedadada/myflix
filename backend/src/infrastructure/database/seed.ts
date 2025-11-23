import { UserId } from '@/domain/model/value_object/user-id';

const DEMO_USER_ID = new UserId('demo@myflix');
const DEMO_EMAIL = 'demo@myflix';
const DEMO_DISPLAY_NAME = 'Demo User';

const demoVideos = [
  {
    id: 'demo-video-1',
    title: 'Welcome to MYFLIX',
    description: 'Walkthrough of the dev environment.',
    durationSeconds: 185
  },
  {
    id: 'demo-video-2',
    title: 'Playback controls',
    description: 'Keyboard shortcuts and advanced playback tips.',
    durationSeconds: 242
  }
];

export const seedDemoData = async (db: D1Database): Promise<void> => {
  const user = await db
    .prepare('SELECT id FROM users WHERE id = ?1')
    .bind(DEMO_USER_ID.toString())
    .first();
  if (!user) {
    await db
      .prepare('INSERT INTO users (id, email, display_name, created_at) VALUES (?1, ?2, ?3, ?4)')
      .bind(DEMO_USER_ID.toString(), DEMO_EMAIL, DEMO_DISPLAY_NAME, new Date().toISOString())
      .run();
  }

  for (const video of demoVideos) {
    await db
      .prepare('INSERT OR IGNORE INTO videos (id, owner_id, title, description, duration_seconds, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
      .bind(
        video.id,
        DEMO_USER_ID.toString(),
        video.title,
        video.description,
        video.durationSeconds,
        new Date().toISOString()
      )
      .run();
  }
};
