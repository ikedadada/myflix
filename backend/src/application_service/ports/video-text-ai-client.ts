export interface VideoTextAiClient {
  generate(params: {
    prompt: string;
    file: File;
    mimeType?: string;
    generationConfig?: Record<string, unknown>;
  }): Promise<{ text: string; model?: string; durationMs?: number }>;
}
