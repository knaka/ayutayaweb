import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator';

export const app = new Hono();

const route = app
  .post('/api/hello',
    zValidator(
      "json",
      z.object({
        name: z.string(),
      }),
      (result, ctx) => {
        if (!result.success) {
          return ctx.text('Invalid input', { status: 400 });
        }
      },
    ),
    async (c) => {
      console.log('cb0ceb3', c.req);
      const body: { name: string } = await c.req.json();
      return c.json({
        message: `Hello, ${body.name}!`,
      });
    }
  )
  .get('/api/echo', async (c) => {
    console.log('9ceab1d');
    const headers = c.req.header();
    return c.json({
      headers,
      body: await c.req.text(),
    });
  })
  .post('*', async (c) => {
    console.log('cc933c9');
    const headers = c.req.header();
    return c.json({
      headers,
      body: await c.req.text(),
    });
  })
;

export type AppType = typeof route;
