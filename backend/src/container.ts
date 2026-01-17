import { AuthServiceImpl } from "@/application_service/auth-service";
import { PlaybackService } from "@/application_service/playback-service";
import { SettingsServiceImpl } from "@/application_service/settings-service";
import { UploadService } from "@/application_service/upload-service";
import { VideoAnalyzeService } from "@/application_service/video-analyze-service";
import { VideoServiceImpl } from "@/application_service/video-service";
import type { ServiceBindings } from "@/env";
import { D1PlaybackRepository } from "@/infrastructure/database/playback-repository-impl";
import { seedDemoData } from "@/infrastructure/database/seed";
import { D1SettingsRepository } from "@/infrastructure/database/settings-repository-impl";
import { D1UploadSessionRepository } from "@/infrastructure/database/upload-session-repository-impl";
import { D1UserRepository } from "@/infrastructure/database/user-repository-impl";
import { D1VideoRepository } from "@/infrastructure/database/video-repository-impl";
import { GeminiClient } from "@/infrastructure/external/gemini-client";
import { AuthHandler } from "@/presentation/handler/auth-handler";
import { PlaybackHandler } from "@/presentation/handler/playback-handler";
import { SettingsHandler } from "@/presentation/handler/settings-handler";
import { UploadHandler } from "@/presentation/handler/upload-handler";
import { VideoHandler } from "@/presentation/handler/video-handler";
import { type Logger, LoggerImpl } from "@/utils/logger";

export interface AppContainer {
	authHandler: AuthHandler;
	videoHandler: VideoHandler;
	uploadHandler: UploadHandler;
	playbackHandler: PlaybackHandler;
	settingsHandler: SettingsHandler;
	logger: Logger;
}

export const createContainer = (bindings: ServiceBindings): AppContainer => {
	const logger = new LoggerImpl("api");

	const userRepository = new D1UserRepository(bindings.DB);
	const videoRepository = new D1VideoRepository(bindings.DB);
	const uploadRepository = new D1UploadSessionRepository(bindings.DB);
	const playbackRepository = new D1PlaybackRepository(bindings.DB);
	const settingsRepository = new D1SettingsRepository(bindings.DB);

	const authService = new AuthServiceImpl(userRepository);
	const videoService = new VideoServiceImpl(
		videoRepository,
		uploadRepository,
		bindings.MEDIA_BUCKET,
	);
	const uploadService = new UploadService(
		uploadRepository,
		bindings.MEDIA_BUCKET,
	);
	const playbackService = new PlaybackService(playbackRepository);
	const settingsService = new SettingsServiceImpl(settingsRepository);
	const geminiClient = new GeminiClient(
		bindings.GEMINI_API_KEY,
		bindings.GEMINI_MODEL,
	);
	const videoAnalyzeService = new VideoAnalyzeService(geminiClient);

	seedDemoData(bindings.DB).catch((error) =>
		logger.error("Seed demo data failed", { error }),
	);

	return {
		authHandler: new AuthHandler(authService),
		videoHandler: new VideoHandler(
			videoService,
			videoAnalyzeService,
      logger,
		),
		uploadHandler: new UploadHandler(uploadService),
		playbackHandler: new PlaybackHandler(playbackService),
		settingsHandler: new SettingsHandler(settingsService),
		logger,
	};
};
