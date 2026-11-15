import type { OhNetAdapter, OhNetContext, OhNetResponse } from "@xtwis/ohnet"
import { request } from "@tarojs/taro"
import {
  createResponse,
  OHNET_ADAPTER_ERROR_CODE,
  OHNET_ADAPTER_ERROR_MESSAGE,
  OhNetAdapterError,
  subscribeAbort,
} from "@xtwis/ohnet"
import { env } from "@/config/env"

/** 支持的请求方法 */
const METHODS: readonly string[] = ["GET", "POST", "PUT", "DELETE"]

/** 复制请求头并按需补充 content-type */
function prepareHeaders(context: OhNetContext) {
  const headers = context.request.headers.clone()

  if (context.request.data !== undefined && !headers.has("content-type"))
    headers.set("content-type", "application/json")

  return headers
}

/** 单次请求, 不含重试 */
function send(context: OhNetContext): Promise<OhNetResponse> {
  const { url, method, data, signal, timeout } = context.request

  return new Promise<OhNetResponse>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new OhNetAdapterError(OHNET_ADAPTER_ERROR_CODE.ABORT, OHNET_ADAPTER_ERROR_MESSAGE.ABORT))
      return
    }

    const task = request({
      url,
      method,
      header: prepareHeaders(context).toRecord(),
      data,
      timeout,
      dataType: "json",
      success: (response) => {
        resolve(createResponse({
          status: response.statusCode,
          statusText: response.errMsg,
          headers: response.header,
          url,
          data: response.data,
        }))
      },
      fail: (error) => {
        if (signal?.aborted) {
          reject(new OhNetAdapterError(OHNET_ADAPTER_ERROR_CODE.ABORT, OHNET_ADAPTER_ERROR_MESSAGE.ABORT))
          return
        }

        reject(new OhNetAdapterError(
          OHNET_ADAPTER_ERROR_CODE.NETWORK,
          OHNET_ADAPTER_ERROR_MESSAGE.NETWORK,
          error.errMsg,
          error,
        ))
      },
    })

    subscribeAbort(signal, () => task.abort())
  })
}

/** 基于 Taro.request 的 ohnet 适配器 */
export const adapter: OhNetAdapter = async (context: OhNetContext): Promise<OhNetResponse> => {
  const { method, signal } = context.request

  if (!METHODS.includes(method))
    throw new OhNetAdapterError("OHNET_UNSUPPORTED_METHOD", `adapter: unsupported method: ${method}`)

  let last: unknown

  for (let attempt = 1; attempt <= env.attempts; attempt++) {
    try {
      return await send(context)
    }
    catch (error) {
      if (signal?.aborted)
        throw error

      last = error
    }
  }

  throw last
}
