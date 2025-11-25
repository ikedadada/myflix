import { AuthService } from '@/application_service/auth-service';
import { MetadataService } from '@/application_service/metadata-service';
import { PlaybackService } from '@/application_service/playback-service';
import { SettingsService } from '@/application_service/settings-service';
import { UploadService } from '@/application_service/upload-service';
import { VideoService } from '@/application_service/video-service';
import { D1PlaybackRepository } from '@/infrastructure/database/playback-repository-impl';
import { D1SettingsRepository } from '@/infrastructure/database/settings-repository-impl';
import { D1UploadSessionRepository } from '@/infrastructure/database/upload-session-repository-impl';
import { D1UserRepository } from '@/infrastructure/database/user-repository-impl';
import { D1VideoRepository } from '@/infrastructure/database/video-repository-impl';
import { seedDemoData } from '@/infrastructure/database/seed';
import type { ServiceBindings } from '@/infrastructure/config/env';
import { Logger } from '@/infrastructure/logging/logger';
import { AuthHandler } from './handler/auth-handler';
import { PlaybackHandler } from './handler/playback-handler';
import { SettingsHandler } from './handler/settings-handler';
import { UploadHandler } from './handler/upload-handler';
import { VideoHandler } from './handler/video-handler';

export interface AppContainer {
  authHandler: AuthHandler;
  videoHandler: VideoHandler;
  uploadHandler: UploadHandler;
  playbackHandler: PlaybackHandler;
  settingsHandler: SettingsHandler;
  logger: Logger;
}

export const createContainer = (bindings: ServiceBindings): AppContainer => {
  const logger = new Logger('api');

  const userRepository = new D1UserRepository(bindings.DB);
  const videoRepository = new D1VideoRepository(bindings.DB);
  const uploadRepository = new D1UploadSessionRepository(bindings.DB);
  const playbackRepository = new D1PlaybackRepository(bindings.DB);
  const settingsRepository = new D1SettingsRepository(bindings.DB);

  const authService = new AuthService(userRepository);
  const videoService = new VideoService(videoRepository, uploadRepository, bindings.MEDIA_BUCKET);
  const uploadService = new UploadService(uploadRepository, bindings.MEDIA_BUCKET);
  const playbackService = new PlaybackService(playbackRepository);
  const metadataService = new MetadataService(videoService, playbackService);
  const settingsService = new SettingsService(settingsRepository);

  seedDemoData(bindings.DB).catch((error) => logger.error('Seed demo data failed', { error }));

  return {
    authHandler: new AuthHandler(authService),
    videoHandler: new VideoHandler(videoService, metadataService),
    uploadHandler: new UploadHandler(uploadService),
    playbackHandler: new PlaybackHandler(playbackService),
    settingsHandler: new SettingsHandler(settingsService),
    logger
  };
};
