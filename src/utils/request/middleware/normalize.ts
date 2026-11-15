import type { OhNetAdapter, OhNetContext } from "@xtwis/ohnet"
import type { ApiResponse } from "@/types/request"
import { OHNET_ADAPTER_ERROR_TYPE, OhNetMiddleware } from "@xtwis/ohnet"
import { BIZ_ERROR_TYPE, PROTOCOL_CODE, SUCCESS_CODE } from "@/config/request"
import { ApiError } from "@/types/request"

/** 是否是统一响应 */
function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (typeof value !== "object" || value === null)
    return false

  const body = value as Partial<ApiResponse<unknown>>
  return typeof body.code === "number" && typeof body.message === "string"
}

/** 归一化: 拆分响应成功为业务成功和业务错误, 解包业务成功, 封装所有为 ApiError */
export class Normalize extends OhNetMiddleware {
  readonly name = "normalize"

  async leave(_adapter: OhNetAdapter, context: OhNetContext): Promise<void> {
    // 非业务错误 (传输层失败)
    if (context.error !== null)
      throw ApiError.from(context.error)

    const response = context.response
    if (response === null)
      return

    const body = response.data
    // 非业务错误 (响应成功但结构异常)
    if (!isApiResponse(body))
      throw new ApiError(OHNET_ADAPTER_ERROR_TYPE, PROTOCOL_CODE, "adapter: invalid response body", { data: body })

    // 业务错误
    if (body.code !== SUCCESS_CODE)
      throw new ApiError(BIZ_ERROR_TYPE, body.code, body.message, { data: body.data })

    // 业务成功: 解包
    context.response = { ...response, data: body.data }
  }
}

/** 归一化中间件 */
export const normalize = new Normalize()
