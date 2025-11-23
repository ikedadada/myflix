import { Settings } from '../model/entity/settings';
import { SettingsId } from '../model/value_object/settings-id';
import { UserId } from '../model/value_object/user-id';

export interface SettingsRepository {
  findById(id: SettingsId): Promise<Settings | null>;
  findByOwner(ownerId: UserId): Promise<Settings | null>;
  save(settings: Settings): Promise<void>;
}
