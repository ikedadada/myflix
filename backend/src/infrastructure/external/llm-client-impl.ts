export interface LlmPrompt {
  prompt: string;
}

export interface LlmResponse {
  content: string;
}

export class StubLlmClient {
  async generate(_: LlmPrompt): Promise<LlmResponse> {
    return { content: 'LLM integration placeholder' };
  }
}
