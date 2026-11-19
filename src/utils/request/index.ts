import type { OhNetClient as OhNetClientType, OhNetConfig } from "@xtwis/ohnet"
import { OhNetClient } from "@xtwis/ohnet"
import { adapter } from "@/utils/request/adapter"
import { resolveBaseUrl } from "@/utils/request/base"
import { auth } from "@/utils/request/middleware/auth"
import { normalize } from "@/utils/request/middleware/normalize"

/** 放宽 client 的签名 */
type RequestClient = Omit<OhNetClientType, "add" | "get"> & {
  get: <T>(path?: string, params?: unknown) => Promise<T>
  add: (config: OhNetConfig) => RequestClient
}

const client = OhNetClient.create({
  url: resolveBaseUrl(),
  adapter,
})
  .with(auth)
  .with(normalize)

/** 全局请求实例 */
export const request = client as unknown as RequestClient
