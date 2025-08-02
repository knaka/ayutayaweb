import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
// import { issuesAsync } from "#root/db/sqlcgen/querier";
import { issuesAsync } from "../../db/sqlcgen/querier"
import { D1Database } from "@cloudflare/workers-types/2022-11-30";

interface Env {
  DB: D1Database;
}

// `curl http://127.0.0.1:59606/var/hello.data?_routes=routes/var.hello` returns JSON data.
// Single Fetch | Remix https://remix.run/docs/en/main/guides/single-fetch
export const loader = async ({ context }: LoaderFunctionArgs) => {
  let env = context.cloudflare.env as Env;
  let { results } = await issuesAsync(env.DB);
  return results;
};

export default function Hello() {
  const results = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Hello</h1>
      <div>
        A value from D1:
        {
          results.map((r, i) => <div key={i}>{r.title}</div>)
        }
      </div>
    </div>
  );
}
