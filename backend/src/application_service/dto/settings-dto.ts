import { Settings } from '@/domain/model/entity/settings';

export interface SettingsDto {
  id: string;
  ownerId: string;
  theme: 'light' | 'dark' | 'system';
  autoplay: boolean;
}

export const toSettingsDto = (settings: Settings): SettingsDto => ({
  id: settings.id().toString(),
  ownerId: settings.ownerId().toString(),
  theme: settings.theme(),
  autoplay: settings.autoplay()
});
