import { describe, it, expect } from 'vitest';
import { env } from '../env';

describe('Environment Validation', () => {
  it('validates default application variables with Zod', () => {
    expect(env.NEXT_PUBLIC_APP_NAME).toBe('Dr Khojo');
    expect(env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
  });
});
