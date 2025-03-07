import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { setup, tearDown } from './test_utils.js';
import { featuresAsync } from './index.js';

beforeEach(async (ctx) => {
  await setup(ctx);
});

afterEach(async (ctx) => {
  await tearDown(ctx);
});

describe('Schema', () => {
  test('Features', async (ctx) => {
    const result = await featuresAsync(ctx.d1);
    expect(result).not.toBeNull();
    expect(result).contains('initial');
  });
});
