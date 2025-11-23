import { describe, expect, it } from 'vitest';
import { UserId } from './user-id';

describe('UserId', () => {
  it('stores trimmed value', () => {
    const id = new UserId('abc');
    expect(id.toString()).toBe('abc');
  });

  it('throws on empty input', () => {
    expect(() => new UserId('')).toThrowError();
  });
});
