import { Miniflare } from "miniflare";
import { D1Database } from "@cloudflare/workers-types";
import { TestContext } from "vitest";

// Static Asset Handling | Vite https://vite.dev/guide/assets#importing-asset-as-string
import dbSchema from './schema.sql?raw'

function splitSqls(sqls: string): string[] {
  return sqls.replaceAll(/--.*\n/g, '\n') // Remove comments
    .split(/;\n+/) // Split by semicolons
    .map(s => s.replaceAll("\n", '').trim()) // Remove newlines and trim
    .filter(s => s !== '') // Remove empty strings
  ;
}

declare module 'vitest' {
  export interface TestContext {
    mf: Miniflare;
    d1: D1Database;
  }
}

export async function setup(ctx: TestContext) {
  const d1BindingName = "DB";
  const mf = ctx.mf = new Miniflare({
    modules: true,
    script: "",
    d1Databases: [d1BindingName],
  });
  const d1 = ctx.d1 = await mf.getD1Database(d1BindingName);
  for (const s of splitSqls(dbSchema)) {
    await d1.exec(s);
  }
}

export async function tearDown(ctx: TestContext) {
  await ctx.mf.dispose();
}
