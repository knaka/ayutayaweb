import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator';

import { addLogAsync } from 'db/sqlcgen/querier';

// type Bindings = {
//   // ASSETS: {
//   //   fetch: typeof fetch;
//   // },
// } & Env;

export const app = new Hono<{ Bindings: Env }>();

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
  .get('/api/echo', async (ctx) => {
    // console.log(ctx.env.DB)
    await addLogAsync(ctx.env.DB, { message: 'hello' });
    return ctx.json({
      header: ctx.req.header(),
      foo: "e6e8769",
    })
  })
  .post('/api/echo', async (ctx) => ctx.json({
    header: ctx.req.header(),
    body: await ctx.req.text(),
  }))
;

export type AppType = typeof route;
