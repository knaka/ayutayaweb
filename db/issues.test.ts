import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { newIssueAsync, issueAsync } from './sqlcgen/querier.js'
import { setup, tearDown } from './test_utils.js';

beforeEach(async (ctx) => {
  await setup(ctx);
});

afterEach(async (ctx) => {
  await tearDown(ctx);
});

describe('issue', () => {
  test('basic operations', async (ctx) => {
    const result = await newIssueAsync(ctx.d1, { title: 'Issue 1', description: 'Description 1' });
    expect(result.success).toBe(true);
    const id = result.meta.last_row_id;

    const issue = await issueAsync(ctx.d1, { id });
    expect(issue.id).toBe(id);
    expect(issue.description).toBe('Description 1');
  });
});
