import { Hono } from 'hono'
import * as honoPages from 'hono/cloudflare-pages'

type Bindings = {
  ASSETS: {
    fetch: typeof fetch;
  },
};

const app = new Hono<{ Bindings: Bindings }>();

app.get('*', async (c) => {
  const headers = c.req.header();
  return c.json({
    headers,
    body: await c.req.text(),
  });
});

app.post('*', async (c) => {
  const headers = c.req.header();
  return c.json({
    headers,
    body: await c.req.text(),
  });
});

export const onRequest = honoPages.handle(app);
