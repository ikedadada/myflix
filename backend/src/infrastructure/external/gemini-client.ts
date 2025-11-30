import type { VideoTone } from '@/domain/model/value_object/video-tone';

export interface GeminiGenerateVideoParams {
  file: File;
  tone: VideoTone;
  prompt: string;
  userContext?: string;
}

export interface GeminiGenerateVideoResult {
  text: string;
  model?: string;
  durationMs?: number;
}

export class GeminiClient {
  constructor(
    private readonly apiKey: string | undefined,
    private readonly model: string = 'gemini-1.5-pro'
  ) {}

  async generateVideoCopy(params: GeminiGenerateVideoParams): Promise<GeminiGenerateVideoResult> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const base64 = await this.toBase64(params.file);

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: params.prompt },
            {
              inlineData: {
                mimeType: params.file.type || 'video/mp4',
                data: base64
              }
            }
          ]
        }
      ]
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Gemini request failed: ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        model?: string;
      }>;
      usageMetadata?: { totalTokenCount?: number };
    };
    const text =
      data.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text;
    if (!text) {
      throw new Error('Gemini response missing text');
    }

    return {
      text,
      model: data.candidates?.[0]?.model,
      durationMs: undefined
    };
  }

  private async toBase64(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode(...chunk);
    }
    return btoa(binary);
  }
}
