import { Hono, Context } from 'hono'
import { handle as pagesHandle } from 'hono/cloudflare-pages'
import { D1Database } from "@cloudflare/workers-types";
import { IssueAbstract } from '#src_astro/components/ReactIssueList.js';
import { Issue } from '#src_astro/components/ReactIssue.js';

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  },
  DB: D1Database,
  PAGES_CONTENT_PORT?: string,
};

const app = new Hono<{ Bindings: Bindings }>();

const getAssetBody = async (c: Context<{Bindings: Bindings}>, path: string) => {
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

app.get('/var/issues', async (c) => {
  const serverData: IssueAbstract[] = [
    { id: '001', title: 'Issue 1' },
    { id: '002', title: 'Issue 2' },
    { id: '003', title: 'Issue 3' },
  ];
  const assetBody = await getAssetBody(c, "/tmpl/issues");
  const serverDataScript = `<script>window.issueAbstracts=${JSON.stringify(serverData)}</script>`;
  return c.html(assetBody.replace('</head>', `${serverDataScript}</head>`));
});

app.get('/var/issues/:id', async (c) => {
  const id = parseInt(c.req.param("id") || "0");
  const assetBody = await getAssetBody(c, "/tmpl/issue");
  const serverData: Issue = {
    id: id.toString(),
    title: "Foo Title",
    description: "Foo Description",
  };
  const serverDataScript = `<script>window.issue=${JSON.stringify(serverData)}</script>`;
  return c.html(assetBody.replace('</head>', `${serverDataScript}</head>`));
});

export const onRequest = pagesHandle(app);
