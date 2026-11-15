import type { OhNetClient as OhNetClientType } from "@xtwis/ohnet"
import { OhNetClient } from "@xtwis/ohnet"
import { env } from "@/config/env"
import { adapter } from "@/utils/request/adapter"
import { normalize } from "@/utils/request/middleware/normalize"
import { notice } from "@/utils/request/middleware/notice"

/** 放宽 get 的签名: params 是查询参数对象 */
type RequestClient = Omit<OhNetClientType, "get"> & {
  get: <T>(path?: string, params?: unknown) => Promise<T>
}

const client = OhNetClient.create({
  url: env.baseUrl,
  adapter,
})
  .with(notice)
  .with(normalize)

/** 全局请求实例 */
export const request = client as unknown as RequestClient
