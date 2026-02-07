import { describe, expect, it } from 'vitest'
import { buildVideoTextFromJson } from './video-text'

describe('buildVideoTextFromJson', () => {
  it('parses valid payload', () => {
    const result = buildVideoTextFromJson(
      { title: 'テスト', description: '説明文です。', model: 'gemini' },
      'friendly',
    )
    expect(result.title).toBe('テスト')
    expect(result.description).toBe('説明文です。')
    expect(result.tone).toBe('friendly')
    expect(result.model).toBe('gemini')
  })

  it('rejects missing title', () => {
    expect(() => buildVideoTextFromJson({ description: '説明' }, 'friendly')).toThrowError()
  })

  it('rejects too long title', () => {
    const longTitle = 'a'.repeat(61)
    expect(() =>
      buildVideoTextFromJson({ title: longTitle, description: '説明' }, 'friendly'),
    ).toThrowError()
  })
})
