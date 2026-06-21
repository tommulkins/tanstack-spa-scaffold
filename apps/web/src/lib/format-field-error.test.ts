import { describe, expect, it } from 'vitest';

import { formatFieldError } from './format-field-error.js';

describe('formatFieldError', () => {
  it('returns string errors as-is', () => {
    expect(formatFieldError('Text is required')).toBe('Text is required');
  });

  it('returns message from zod-like issue objects', () => {
    expect(formatFieldError({ message: 'Text is required' })).toBe(
      'Text is required',
    );
  });

  it('falls back for unknown shapes', () => {
    expect(formatFieldError({ code: 'too_small' })).toBe('Invalid input');
  });
});
