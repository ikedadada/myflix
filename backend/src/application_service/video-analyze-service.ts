import { buildVideoCopyPrompt } from '@/domain/model/value_object/video-copy-prompt';
import {
  GeneratedVideoCopyValidator,
  type GeneratedVideoCopy
} from '@/domain/model/value_object/generated-video-copy';
import { isVideoTone, type VideoTone } from '@/domain/model/value_object/video-tone';
import { GeminiClient } from '@/infrastructure/external/gemini-client';

export class AnalyzeValidationError extends Error {}
export class AnalyzeAiResponseError extends Error {}

const MAX_BYTES = 100 * 1024 * 1024;
const ALLOWED_MIME = ['video/mp4', 'video/quicktime'];
const USER_CONTEXT_MAX = 300;

export interface AnalyzeVideoCommand {
  file: File;
  tone: string;
  userContext?: string;
}

export class VideoAnalyzeService {
  constructor(private readonly geminiClient: GeminiClient) {}

  async analyze(command: AnalyzeVideoCommand): Promise<GeneratedVideoCopy> {
    const tone = this.parseTone(command.tone);
    this.validateFile(command.file);
    const userContext = this.parseUserContext(command.userContext);

    const prompt = buildVideoCopyPrompt({ tone, userContext });
    const response = await this.geminiClient.generateVideoCopy({
      file: command.file,
      tone,
      userContext,
      prompt
    });

    let parsed: GeneratedVideoCopy;
    try {
      const json = JSON.parse(response.text);
      parsed = GeneratedVideoCopyValidator.parse(json, tone);
    } catch (error) {
      throw new AnalyzeAiResponseError(
        error instanceof Error ? error.message : 'Invalid AI response'
      );
    }

    return {
      ...parsed,
      tone,
      model: parsed.model ?? response.model,
      durationMs: parsed.durationMs ?? response.durationMs
    };
  }

  private parseTone(value: string): VideoTone {
    if (!isVideoTone(value)) {
      throw new AnalyzeValidationError('Invalid tone');
    }
    return value;
  }

  private validateFile(file: File) {
    if (!(file instanceof File)) {
      throw new AnalyzeValidationError('Video file is required');
    }
    if (!Number.isFinite(file.size) || file.size <= 0) {
      throw new AnalyzeValidationError('Video file is empty');
    }
    if (file.size > MAX_BYTES) {
      throw new AnalyzeValidationError('Video file too large');
    }
    if (file.type && !ALLOWED_MIME.includes(file.type)) {
      throw new AnalyzeValidationError('Unsupported video mime type');
    }
  }

  private parseUserContext(value?: string): string | undefined {
    if (!value) return undefined;
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.length > USER_CONTEXT_MAX) {
      throw new AnalyzeValidationError('User context too long');
    }
    return trimmed;
  }
}
