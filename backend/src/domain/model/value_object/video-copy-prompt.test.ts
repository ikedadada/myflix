import { describe, expect, it } from 'vitest';
import { buildVideoCopyPrompt } from './video-copy-prompt';

describe('buildVideoCopyPrompt', () => {
  it('includes tone style and constraints', () => {
    const prompt = buildVideoCopyPrompt({ tone: 'playful', userContext: 'YouTube向け' });
    expect(prompt).toContain('動画のコピーライター');
    expect(prompt).toContain('トーン');
    expect(prompt).toContain('60文字以内');
    expect(prompt).toContain('YouTube向け');
    expect(prompt).toContain('コードフェンス');
  });
});
