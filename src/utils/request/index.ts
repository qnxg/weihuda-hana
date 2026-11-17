import type { OhNetClient as OhNetClientType } from "@xtwis/ohnet"
import { ENV } from "@shared/env"
import { OhNetClient } from "@xtwis/ohnet"
import { adapter } from "@/utils/request/adapter"
import { normalize } from "@/utils/request/middleware/normalize"
import { notice } from "@/utils/request/middleware/notice"

/** 放宽 get 的签名: params 是查询参数对象 */
type RequestClient = Omit<OhNetClientType, "get"> & {
  get: <T>(path?: string, params?: unknown) => Promise<T>
}

/** 解析请求地址, mock 开启时直连本地 mock 服务 */
function resolveBaseUrl() {
  return ENV.mock
    ? `http://localhost:${ENV.mockPort}`
    : ENV.baseUrl
}

const client = OhNetClient.create({
  url: resolveBaseUrl(),
  adapter,
})
  .with(notice)
  .with(normalize)

/** 全局请求实例 */
export const request = client as unknown as RequestClient
