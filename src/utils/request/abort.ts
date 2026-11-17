import { OhNetController } from "@xtwis/ohnet"

/** 安装 AbortController, 小程序没有这个全局对象 */
export function installAbortController(): void {
  if (typeof globalThis.AbortController !== "undefined")
    return

  globalThis.AbortController = OhNetController as unknown as typeof globalThis.AbortController
}
