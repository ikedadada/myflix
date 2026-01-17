import type { Settings } from "@/domain/model/entity/settings";

export interface SettingsDto {
	id: string;
	ownerId: string;
	autoplay: boolean;
}

export const toSettingsDto = (settings: Settings): SettingsDto => ({
	id: settings.id().toString(),
	ownerId: settings.ownerId().toString(),
	autoplay: settings.autoplay(),
});
