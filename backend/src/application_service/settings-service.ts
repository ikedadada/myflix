import type { Settings } from "@/domain/model/entity/settings";
import type { SettingsId } from "@/domain/model/value_object/settings-id";
import type { UserId } from "@/domain/model/value_object/user-id";
import type { SettingsRepository } from "@/domain/repository/settings-repository";
import { type SettingsDto, toSettingsDto } from "./dto/settings-dto";

export class SettingsService {
	constructor(private readonly repository: SettingsRepository) {}

	async findByOwner(ownerId: UserId): Promise<SettingsDto | null> {
		const settings = await this.repository.findByOwner(ownerId);
		return settings ? toSettingsDto(settings) : null;
	}

	async update(settings: Settings): Promise<SettingsDto> {
		await this.repository.save(settings);
		return toSettingsDto(settings);
	}

	async findById(id: SettingsId): Promise<SettingsDto | null> {
		const settings = await this.repository.findById(id);
		return settings ? toSettingsDto(settings) : null;
	}
}
