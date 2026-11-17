import { OhNetController } from "@xtwis/ohnet"

/** 安装 AbortController, 小程序确实此全局对象, 但 tanstack query 在 useQuery 中需要 */
export function installAbortController(): void {
  if (typeof globalThis.AbortController !== "undefined")
    return

  globalThis.AbortController = OhNetController as unknown as typeof globalThis.AbortController
}
