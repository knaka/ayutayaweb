import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const knaka_ayutayasvr_init_1_func1_Body = z
  .object({ name: z.string().min(3), token: z.string() })
  .passthrough();
const knaka_ayutayasvr_init_0_func1_Body = z
  .object({
    name: z.string().default("admin"),
    password: z.string().default("password"),
  })
  .passthrough();

export const schemas = {
  knaka_ayutayasvr_init_1_func1_Body,
  knaka_ayutayasvr_init_0_func1_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/hello",
    alias: "knaka/ayutayasvr.init.1.func1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: knaka_ayutayasvr_init_1_func1_Body,
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
  {
    method: "post",
    path: "/login",
    alias: "knaka/ayutayasvr.init.0.func1",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: knaka_ayutayasvr_init_0_func1_Body,
      },
    ],
    response: z
      .object({
        expires_at: z.string().datetime({ offset: true }),
        message: z.string(),
        token: z.string(),
      })
      .passthrough(),
  },
  {
    method: "post",
    path: "/logout",
    alias: "knaka/ayutayasvr.init.0.func12",
    requestFormat: "json",
    parameters: [
      {
        name: "Cookie",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: z.object({ message: z.string() }).passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

// const client = createApiClient("http://localhost:3000");
// client.post("/hello", {token: "foo", name: "John"})
// client.post("/login", {})
