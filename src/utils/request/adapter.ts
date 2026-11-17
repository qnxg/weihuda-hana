import type { OhNetAdapter, OhNetContext, OhNetResponse } from "@xtwis/ohnet"
import { ENV } from "@shared/env"
import { request } from "@tarojs/taro"
import {
  createResponse,
  OHNET_ADAPTER_ERROR_CODE,
  OHNET_ADAPTER_ERROR_MESSAGE,
  OhNetAdapterError,
  subscribeAbort,
} from "@xtwis/ohnet"
import { METHOD_CODE } from "@/config/request"

/** 支持的请求方法 */
const METHODS: readonly string[] = ["GET", "POST", "PUT", "DELETE"]

/** 可重试的传输层错误码 */
const RETRYABLE: readonly string[] = [OHNET_ADAPTER_ERROR_CODE.NETWORK, OHNET_ADAPTER_ERROR_CODE.TIMEOUT]

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
        // 只有 200 视为传输成功, 其余状态码视为服务器没有给出有效响应
        if (response.statusCode !== 200) {
          reject(new OhNetAdapterError(String(response.statusCode), "adapter: http error", response.data))
          return
        }

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

        const timedOut = error.errMsg.includes("timeout")
        reject(new OhNetAdapterError(
          timedOut ? OHNET_ADAPTER_ERROR_CODE.TIMEOUT : OHNET_ADAPTER_ERROR_CODE.NETWORK,
          timedOut ? OHNET_ADAPTER_ERROR_MESSAGE.TIMEOUT : OHNET_ADAPTER_ERROR_MESSAGE.NETWORK,
          error.errMsg,
          error,
        ))
      },
    })

    subscribeAbort(signal, () => task.abort())
  })
}

/** 基于 Taro.request 的 ohnet 适配器, 传输失败时按 ENV.attempts 重试 */
export const adapter: OhNetAdapter = async (context: OhNetContext): Promise<OhNetResponse> => {
  const { method } = context.request

  if (!METHODS.includes(method))
    throw new OhNetAdapterError(METHOD_CODE, `adapter: unsupported method: ${method}`)

  let last: unknown

  for (let attempt = 1; attempt <= ENV.attempts; attempt++) {
    try {
      return await send(context)
    }
    catch (error) {
      if (!(error instanceof OhNetAdapterError && RETRYABLE.includes(error.code)))
        throw error

      last = error
    }
  }

  throw last
}
