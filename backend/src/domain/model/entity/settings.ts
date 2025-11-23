import { SettingsId } from '../value_object/settings-id';
import { UserId } from '../value_object/user-id';

export interface SettingsProps {
  id: SettingsId;
  ownerId: UserId;
  theme: 'light' | 'dark' | 'system';
  autoplay: boolean;
}

export class Settings {
  constructor(private readonly props: SettingsProps) {}

  id(): SettingsId {
    return this.props.id;
  }

  ownerId(): UserId {
    return this.props.ownerId;
  }

  theme(): SettingsProps['theme'] {
    return this.props.theme;
  }

  autoplay(): boolean {
    return this.props.autoplay;
  }

  update(partial: Partial<Omit<SettingsProps, 'id' | 'ownerId'>>): Settings {
    return new Settings({
      ...this.props,
      ...partial
    });
  }
}
