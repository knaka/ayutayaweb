import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { setup, tearDown } from './test_utils.js';
import { featuresAsync } from './index.js';
import { newAuthorAsync, newBookAsync } from './sqlcgen/querier.js';

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

describe('Foreign keys', () => {
  test('Constraint violation', async (ctx) => {
    expect(newBookAsync(ctx.d1, { title: 'The Book', authorId: 100 })).rejects.toThrowError('FOREIGN KEY constraint');
  });

  test('Insert author and book', async (ctx) => {
    const author = await newAuthorAsync(ctx.d1, { name: 'The Author' });
    const book = await newBookAsync(ctx.d1, { title: 'The Book', authorId: author.meta.last_row_id });
    expect(book.success).toBeTruthy();
  });
});
