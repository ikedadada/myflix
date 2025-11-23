export interface UserSettings {
  id: string;
  ownerId: string;
  theme: 'light' | 'dark' | 'system';
  autoplay: boolean;
}
