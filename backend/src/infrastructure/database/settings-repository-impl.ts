import { Settings } from '@/domain/model/entity/settings';
import { SettingsId } from '@/domain/model/value_object/settings-id';
import { UserId } from '@/domain/model/value_object/user-id';
import { SettingsRepository } from '@/domain/repository/settings-repository';

interface SettingsRow {
  id: string;
  owner_id: string;
  theme: string;
  autoplay: number;
}

const mapRowToSettings = (row: SettingsRow): Settings =>
  new Settings({
    id: new SettingsId(row.id),
    ownerId: new UserId(row.owner_id),
    theme: row.theme as Settings['theme'],
    autoplay: Boolean(row.autoplay)
  });

export class D1SettingsRepository implements SettingsRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: SettingsId): Promise<Settings | null> {
    const row = await this.db
      .prepare('SELECT id, owner_id, theme, autoplay FROM settings WHERE id = ?1')
      .bind(id.toString())
      .first<SettingsRow>();
    return row ? mapRowToSettings(row) : null;
  }

  async findByOwner(ownerId: UserId): Promise<Settings | null> {
    const row = await this.db
      .prepare('SELECT id, owner_id, theme, autoplay FROM settings WHERE owner_id = ?1')
      .bind(ownerId.toString())
      .first<SettingsRow>();
    return row ? mapRowToSettings(row) : null;
  }

  async save(settings: Settings): Promise<void> {
    await this.db
      .prepare('INSERT OR REPLACE INTO settings (id, owner_id, theme, autoplay) VALUES (?1, ?2, ?3, ?4)')
      .bind(
        settings.id().toString(),
        settings.ownerId().toString(),
        settings.theme(),
        Number(settings.autoplay())
      )
      .run();
  }
}
