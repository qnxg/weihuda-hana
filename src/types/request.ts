import { OhNetError } from "@xtwis/ohnet"

export type { ApiResponse } from "@contract/types"

/** 请求层错误 */
export class ApiError extends OhNetError {
  // @ts-expect-error ohnet 把 code 声明为 string, 业务错误的 code 是数字
  declare readonly code: string | number
  /** 是否已处理 */
  handled: boolean

  constructor(
    type: string,
    code: string | number,
    message: string,
    options: { data?: unknown, error?: unknown, handled?: boolean } = {},
  ) {
    super(type, code as unknown as string, message, options.data, options.error)
    this.handled = options.handled ?? false
  }

  /** 由 ohnet 错误构造 */
  static from(error: OhNetError): ApiError {
    return error instanceof ApiError
      ? error
      : new ApiError(error.type, error.code, error.message, { data: error.data, error })
  }

  /** 标记为已处理 */
  handle(): void {
    this.handled = true
  }
}
