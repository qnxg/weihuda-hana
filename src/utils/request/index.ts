import type { OhNetClient as OhNetClientType } from "@xtwis/ohnet"
import { OhNetClient } from "@xtwis/ohnet"
import { env } from "@/config/env"
import { adapter } from "@/utils/request/adapter"

/** 放宽 get 的签名: params 是查询参数对象 */
type RequestClient = Omit<OhNetClientType, "get"> & {
  get: <T>(path?: string, params?: unknown) => Promise<T>
}

/** 全局请求实例 */
export const request = OhNetClient.create({
  url: env.baseUrl,
  adapter,
}) as unknown as RequestClient
