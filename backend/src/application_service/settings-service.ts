import { Settings } from "@/domain/model/entity/settings";
import { SettingsId } from "@/domain/model/value_object/settings-id";
import type { UserId } from "@/domain/model/value_object/user-id";
import type { SettingsRepository } from "@/domain/repository/settings-repository";

export interface UpdateSettingsParams {
  autoplay: boolean;
}

export interface SettingsService {
  findOrProvisionSettings(ownerId: UserId): Promise<Settings>;
  updateSettings(ownerId: UserId,settings: UpdateSettingsParams): Promise<Settings>;
}

export class SettingsNotFoundError extends Error {}

export class SettingsServiceImpl implements SettingsService {
	constructor(private readonly repository: SettingsRepository) {}

	async findOrProvisionSettings(ownerId: UserId): Promise<Settings> {
		const settings = await this.repository.findByOwner(ownerId);
    if (settings) return settings;

    const initialSettings = new Settings({
      id: new SettingsId(`settings-${ownerId.toString()}`),
      ownerId,
      autoplay: true,
    });
    await this.repository.save(initialSettings);
    return initialSettings;
  }

	async updateSettings(ownerId: UserId, settings: UpdateSettingsParams): Promise<Settings> {
    const existing = await this.repository.findByOwner(ownerId);
    if (!existing) {
      throw new SettingsNotFoundError("Settings not found for the given ownerId");
    }
    existing.update({
      autoplay: settings.autoplay,
    });
    const updatedSettings = existing; 
    await this.repository.save(updatedSettings);
    return updatedSettings;
	}
}
