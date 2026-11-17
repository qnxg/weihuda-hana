import type { AppRoute } from "@sapporta/rest-core"
import type { Result } from "@server/endpoint"
import process from "node:process"
import { pathToFileURL } from "node:url"
import { contract } from "@contract/routes"
import { serve } from "@hono/node-server"
import { TsRestApi } from "@sapporta/honest"
import { route } from "@server/routes"
import { env } from "@shared/env"

type Domain = keyof typeof contract

/** 纯类型契约没有 zod 校验, 请求体需要自己读 */
async function readBody(c: { req: { json: <T>() => Promise<T> } }, endpoint: AppRoute, body: unknown): Promise<unknown> {
  if (body !== undefined || !("body" in endpoint))
    return body

  try {
    return await c.req.json()
  }
  catch {
    return undefined
  }
}

/** 按契约注册全部端点 */
export function createMockApi() {
  const api = new TsRestApi()

  for (const domain of Object.keys(contract) as Domain[]) {
    const endpoints = contract[domain] as Record<string, AppRoute>
    const handlers = route[domain] as unknown as Record<string, (input: unknown) => Result<unknown>>

    for (const [name, endpoint] of Object.entries(endpoints)) {
      const handler = handlers[name]

      api.register(`${domain}.${name}`, endpoint, (async ({ c, request }) => {
        const body = await readBody(c, endpoint, request.body)
        return handler({ params: request.params, query: request.query, body } as never)
      }) as never)
    }
  }

  return api
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  serve({
    fetch: createMockApi().fetch,
    port: env.mockPort,
    hostname: "localhost",
  })
}
