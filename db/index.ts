import { D1Database } from "@cloudflare/workers-types";

export async function featuresAsync(d1: D1Database): Promise<null | string[]> {
  const result = await d1.prepare("PRAGMA table_info('schema_features')").all();
  if (!result.success) {
    return null;
  }
  return result.results.filter(row => row.name !== 'created_at').map(row => row.name as string);
}
