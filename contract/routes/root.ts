import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"

interface HealthData {
  /** 占位 */
  hello: "world"
}

interface AboutData {
  /** 版本号 */
  version: string
  /** 官网链接 */
  home: string
  /** 招新链接 */
  join: string
  /** 标语 */
  slogans: string[]
}

export const root = {
  health: endpoint.get<never, never, HealthData>("/", "健康检查"),
  about: endpoint.get<never, never, AboutData>("/about", "关于"),
}

export type RootHealth = ApiSpec<typeof root.health>
export type RootHealthData = Data<RootHealth>

export type RootAbout = ApiSpec<typeof root.about>
export type RootAboutData = Data<RootAbout>
