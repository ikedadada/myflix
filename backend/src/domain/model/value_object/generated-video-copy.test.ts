import { describe, expect, it } from 'vitest';
import { GeneratedVideoCopyValidator } from './generated-video-copy';

describe('GeneratedVideoCopyValidator', () => {
  it('parses valid payload', () => {
    const result = GeneratedVideoCopyValidator.parse(
      { title: 'テスト', description: '説明文です。', model: 'gemini' },
      'friendly'
    );
    expect(result.title).toBe('テスト');
    expect(result.description).toBe('説明文です。');
    expect(result.tone).toBe('friendly');
    expect(result.model).toBe('gemini');
  });

  it('rejects missing title', () => {
    expect(() =>
      GeneratedVideoCopyValidator.parse({ description: '説明' }, 'friendly')
    ).toThrowError();
  });

  it('rejects too long title', () => {
    const longTitle = 'a'.repeat(61);
    expect(() =>
      GeneratedVideoCopyValidator.parse({ title: longTitle, description: '説明' }, 'friendly')
    ).toThrowError();
  });
});
