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
    async (ctx) => {
      const body: { name: string } = await ctx.req.json();
      return ctx.json({
        message: `Hello, ${body.name}!`,
      });
    }
  )
  .get('/api/echo', async (ctx) => ctx.json({
    header: ctx.req.header(),
  }))
  .post('/api/echo', async (ctx) => ctx.json({
    header: ctx.req.header(),
    body: await ctx.req.text(),
  }))
;

export type AppType = typeof route;
