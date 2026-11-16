import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"

interface HealthData {
  hello: "world"
}

export const root = {
  health: endpoint.get<never, never, HealthData>("/", "健康检查"),
}

export type RootHealth = ApiSpec<typeof root.health>
export type RootHealthData = Data<RootHealth>
