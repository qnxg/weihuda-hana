import type { AppRoute } from "@sapporta/rest-core"
import type { Handler } from "@server/endpoint"
import process from "node:process"
import { pathToFileURL } from "node:url"
import { contract } from "@contract/routes"
import { serve } from "@hono/node-server"
import { TsRestApi } from "@sapporta/honest"
import { route } from "@server/routes"
import { env } from "@shared/env"

type Domain = keyof typeof contract

/** 按契约注册全部端点 */
export function createMockApi() {
  const api = new TsRestApi()

  for (const domain of Object.keys(contract) as Domain[]) {
    const endpoints = contract[domain] as Record<string, AppRoute>
    const handlers = route[domain] as Record<string, Handler>

    for (const [name, endpoint] of Object.entries(endpoints)) {
      api.register(`${domain}.${name}`, endpoint, handlers[name])
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
