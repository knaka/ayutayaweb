import { Hono, Context } from 'hono'
import { handle as pagesHandle } from 'hono/cloudflare-pages'
import { D1Database } from "@cloudflare/workers-types";
import { IssueList, Issue } from '#src_astro/components/types.js';
import { issueAsync, issuesAsync } from 'db/sqlcgen/querier.js';
import { toExternalId, toInternalId } from '#src/extid.js';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  },
  DB: D1Database,
  PAGES_CONTENT_PORT?: string,
};

/**
 * Fetch an asset from the content server or Cloudflare Pages
 */
async function assetAsync(c: Context<{Bindings: Bindings}>, path: string) {
  if (c.env.PAGES_CONTENT_PORT) {
    const assetUrl = new URL(`http://127.0.0.1:${c.env.PAGES_CONTENT_PORT}${path}`);
    const resp = await fetch(assetUrl);
    return await resp.text();
  }
  const assetUrl = URL.parse(c.req.url)
  if (! assetUrl) {
    throw new Error("Failed to parse URL")
  }
  assetUrl.pathname = path
  const resp = await c.env.ASSETS.fetch(assetUrl)
  return await resp.text()
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/var/issues', async (c) => {
  const issues = await issuesAsync(c.env.DB);
  if (!issues.success) {
    return c.text(issues.error);
  }
  const issueList: IssueList = {
    type: "issues",
    items: issues.results.map(issue => ({
      id: toExternalId(issue.id),
      title: issue.title,
    })),
  };
  const body = await assetAsync(c, "/tmpl/issues");
  const serverDataScript = `<script>window.__SERVER_DATA__=${JSON.stringify(issueList)}</script>`;
  return c.html(body.replace('</head>', `${serverDataScript}</head>`));
});

app.get('/var/issues/:id', async (c) => {
  const extId = c.req.param("id") || "";
  const body = await assetAsync(c, "/tmpl/issue");
  const issue = await issueAsync(c.env.DB, { id: toInternalId(extId) });
  if (!issue) {
    return c.text("Issue not found");
  }
  const issueData: Issue = {
    type: "issue",
    id: extId,
    title: issue.title,
    description: issue.description,
  }
  const serverDataScript = `<script>window.__SERVER_DATA__=${JSON.stringify(issueData)}</script>`;
  return c.html(body.replace('</head>', `${serverDataScript}</head>`));
});

export const onRequest = pagesHandle(app);
