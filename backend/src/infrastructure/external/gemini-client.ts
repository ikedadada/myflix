
import type { VideoTextAiClient } from "@/application_service/video-analyze-service";

export interface GeminiGenerateParams {
	prompt: string;
	file: File;
	mimeType?: string;
	generationConfig?: Record<string, unknown>;
}

export interface GeminiGenerateResult {
	text: string;
	model?: string;
	durationMs?: number;
}

export class GeminiClient implements VideoTextAiClient {
	constructor(
		private readonly apiKey: string | undefined,
		private readonly model: string = "gemini-1.5-pro",
	) {}

	async generate(params: GeminiGenerateParams): Promise<GeminiGenerateResult> {
		if (!this.apiKey) {
			throw new Error("Gemini API key not configured");
		}

		const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
		const base64 = await this.toBase64(params.file);

		const body = {
			contents: [
				{
					role: "user",
					parts: [
						{ text: params.prompt },
						{
							inlineData: {
								mimeType: params.mimeType || params.file.type || "video/mp4",
								data: base64,
							},
						},
					],
				},
			],
			...(params.generationConfig
				? { generationConfig: params.generationConfig }
				: {}),
		};

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30_000);
		let response: Response;
		try {
			response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				signal: controller.signal,
			});
		} finally {
			clearTimeout(timeoutId);
		}

		const errorText = response.ok
			? null
			: await response.text().catch(() => null);
		if (!response.ok) {
			throw new Error(
				`Gemini request failed: ${response.status}${errorText ? ` ${errorText}` : ""}`,
			);
		}

		const data = (await response.json().catch(async () => {
			const text = await response.text().catch(() => "");
			throw new Error(`Gemini response parse failed: ${text}`);
		})) as {
			candidates?: Array<{
				content?: { parts?: Array<{ text?: string }> };
				model?: string;
			}>;
		};
		const text = data.candidates?.[0]?.content?.parts?.find(
			(part) => typeof part.text === "string",
		)?.text;
		if (!text) {
			throw new Error("Gemini response missing text");
		}

		return {
			text,
			model: data.candidates?.[0]?.model,
			durationMs: undefined,
		};
	}

	private async toBase64(file: File): Promise<string> {
		const buffer = await file.arrayBuffer();
		let binary = "";
		const bytes = new Uint8Array(buffer);
		const chunkSize = 0x8000;
		for (let i = 0; i < bytes.length; i += chunkSize) {
			const chunk = bytes.subarray(i, i + chunkSize);
			binary += String.fromCharCode(...chunk);
		}
		return btoa(binary);
	}
}
