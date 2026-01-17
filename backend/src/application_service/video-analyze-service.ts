import {
	buildVideoTextFromJson,
	type VideoText,
} from "@/domain/model/value_object/video-text";
import { buildVideoTextPrompt } from "@/domain/model/value_object/video-text-prompt";
import {
	isVideoTone,
	type VideoTone,
} from "@/domain/model/value_object/video-tone";


// TODO: If there is a common place for application service ports, move this interface there.
export interface VideoTextAiClient {
  generate(params: {
    prompt: string;
    file: File;
    mimeType?: string;
    generationConfig?: Record<string, unknown>;
  }): Promise<{ text: string; model?: string; durationMs?: number }>;
}

export class AnalyzeValidationError extends Error {}
export class AnalyzeAiResponseError extends Error {}

const MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED_MIME = ["video/mp4", "video/quicktime"];
const USER_CONTEXT_MAX = 300;

export interface AnalyzeVideoCommand {
	file: File;
	tone: string;
	userContext?: string;
}

export class VideoAnalyzeService {
	constructor(private readonly aiClient: VideoTextAiClient) {}

	async analyze(command: AnalyzeVideoCommand): Promise<VideoText> {
		const tone = this.parseTone(command.tone);
		this.validateFile(command.file);
		const userContext = this.parseUserContext(command.userContext);

		const prompt = buildVideoTextPrompt({ tone, userContext });
		const response = await this.aiClient.generate({
			file: command.file,
			prompt,
			generationConfig: {
				responseMimeType: "application/json",
				responseSchema: {
					type: "object",
					properties: {
						title: { type: "string", maxLength: 60 },
						description: { type: "string" },
					},
					required: ["title", "description"],
				},
			},
		});

		let parsed: VideoText;
		try {
			const json = JSON.parse(response.text);
			parsed = buildVideoTextFromJson(json, tone);
		} catch (error) {
			throw new AnalyzeAiResponseError(
				error instanceof Error ? error.message : "Invalid AI response",
			);
		}

		return {
			...parsed,
			tone,
			model: parsed.model ?? response.model,
			durationMs: parsed.durationMs ?? response.durationMs,
		};
	}

	private parseTone(value: string): VideoTone {
		if (!isVideoTone(value)) {
			throw new AnalyzeValidationError("Invalid tone");
		}
		return value;
	}

	private validateFile(file: File) {
		if (!(file instanceof File)) {
			throw new AnalyzeValidationError("Video file is required");
		}
		if (!Number.isFinite(file.size) || file.size <= 0) {
			throw new AnalyzeValidationError("Video file is empty");
		}
		if (file.size > MAX_BYTES) {
			throw new AnalyzeValidationError("Video file too large");
		}
		if (file.type && !ALLOWED_MIME.includes(file.type)) {
			throw new AnalyzeValidationError("Unsupported video mime type");
		}
	}

	private parseUserContext(value?: string): string | undefined {
		if (!value) return undefined;
		const trimmed = value.trim();
		if (!trimmed) return undefined;
		if (trimmed.length > USER_CONTEXT_MAX) {
			throw new AnalyzeValidationError("User context too long");
		}
		return trimmed;
	}
}
