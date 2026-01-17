import { describe, expect, it } from "vitest";
import type {
	GeminiGenerateParams,
	GeminiGenerateResult,
} from "@/infrastructure/external/gemini-client";
import {
	AnalyzeValidationError,
  VideoAnalyzeServiceImpl,
} from "./video-analyze-service";

class StubGeminiClient {
	async generate(_: GeminiGenerateParams): Promise<GeminiGenerateResult> {
		return {
			text: JSON.stringify({ title: "テスト", description: "説明文" }),
			model: "stub",
		};
	}
}

const createFile = (size = 10): File =>
	new File([new Uint8Array(size)], "sample.mp4", { type: "video/mp4" });

describe("VideoAnalyzeService", () => {
	it("returns parsed copy", async () => {
		const service = new VideoAnalyzeServiceImpl(new StubGeminiClient() as never);
		const result = await service.analyze({
			file: createFile(),
			tone: "friendly",
		});
		expect(result.title).toBe("テスト");
		expect(result.description).toBe("説明文");
		expect(result.tone).toBe("friendly");
		expect(result.model).toBe("stub");
	});

	it("rejects invalid tone", async () => {
		const service = new VideoAnalyzeServiceImpl(new StubGeminiClient() as never);
		await expect(
			service.analyze({ file: createFile(), tone: "invalid" }),
		).rejects.toBeInstanceOf(AnalyzeValidationError);
	});

	it("rejects oversized file", async () => {
		const service = new VideoAnalyzeServiceImpl(new StubGeminiClient() as never);
		const bigFile = createFile(101 * 1024 * 1024);
		await expect(
			service.analyze({ file: bigFile, tone: "friendly" }),
		).rejects.toBeInstanceOf(AnalyzeValidationError);
	});
});
