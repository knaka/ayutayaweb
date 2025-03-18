import { describe, expect, test, beforeEach, afterEach } from 'vitest'
import { newIssueAsync, issueAsync, updateIssueAsync, deleteIssueAsync } from './sqlcgen/querier.js'
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

    const result2 = await updateIssueAsync(ctx.d1, { id, optDescription: 'Description modified' });
    expect(result2.success).toBe(true);

    const issue2 = await issueAsync(ctx.d1, { id });
    expect(issue2.id).toBe(id);
    expect(issue2.title).toBe('Issue 1');
    expect(issue2.description).toBe('Description modified');
    
    const result3 = await updateIssueAsync(ctx.d1, { id, optTitle: 'Title modified' });
    expect(result3.success).toBe(true);

    const issue3 = await issueAsync(ctx.d1, { id });
    expect(issue3.id).toBe(id);
    expect(issue3.title).toBe('Title modified');
    expect(issue3.description).toBe('Description modified');

    const result4 = await deleteIssueAsync(ctx.d1, { id });
    expect(result4.success).toBe(true);

    const issue4 = await issueAsync(ctx.d1, { id });
    expect(issue4).toBe(null);
  });
});
