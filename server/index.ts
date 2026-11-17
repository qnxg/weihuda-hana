import type { EndpointMeta } from "@contract/endpoint"
import type { AppRoute } from "@sapporta/rest-core"
import type { HeaderReader, Result } from "@server/endpoint"
import process from "node:process"
import { pathToFileURL } from "node:url"
import { contract } from "@contract/routes"
import { serve } from "@hono/node-server"
import { TsRestApi } from "@sapporta/honest"
import { check, guard } from "@server/middleware"
import { route } from "@server/routes"
import { ENV } from "@shared/env"

type Domain = keyof typeof contract

/** 契约端点 */
type MetaRoute = AppRoute & { meta: EndpointMeta }

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
    const endpoints = contract[domain] as Record<string, MetaRoute>
    const handlers = route[domain] as unknown as Record<string, (input: unknown) => Result<unknown>>

    for (const [name, endpoint] of Object.entries(endpoints)) {
      const handler = handlers[name]
      const key = `${domain}.${name}`

      api.register(key, endpoint, (async ({ c, request }) => {
        const header: HeaderReader = key => c.req.header(key)

        const denied = guard(endpoint.meta, header)
        if (denied)
          return denied

        const body = await readBody(c, endpoint, request.body)
        const result = handler({
          params: request.params,
          query: request.query,
          body,
          header,
        })

        check(endpoint.meta, key, result.body.code)
        return result
      }) as never)
    }
  }

  return api
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  serve({
    fetch: createMockApi().fetch,
    port: ENV.mockPort,
    hostname: "localhost",
  })
}
