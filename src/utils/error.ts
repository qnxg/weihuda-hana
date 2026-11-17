import { OHNET_ADAPTER_ERROR_CODE } from "@xtwis/ohnet"
import { ApiError } from "@/types/request"
import { toast } from "@/utils/toast"

/** 业务码对应的处理 */
export type ErrorAction = string | ((error: ApiError) => void)

export interface ErrorHandlers {
  /** 未命中业务码时的兜底 */
  default?: ErrorAction
  /** 按业务码分派 */
  [code: number]: ErrorAction | undefined
}

/** 执行处理: 文案直接提示, 函数交给它自己 */
function run(action: ErrorAction, error: ApiError): void {
  if (typeof action === "string")
    toast.error(action)
  else
    action(error)
}

/**
 * 组件层错误统一处理器
 * @param handlers 业务码到处理的映射, `default` 为兜底
 * @param inspect 拿到原始错误的回调, 缺省不调用
 */
export function handleError(
  handlers: ErrorHandlers = {},
  inspect?: (error: unknown) => void,
): (error: unknown) => void {
  return (error) => {
    inspect?.(error)

    if (!(error instanceof ApiError))
      return

    if (error.handled || error.code === OHNET_ADAPTER_ERROR_CODE.ABORT)
      return

    const action = handlers[error.code as number] ?? handlers.default

    if (action === undefined)
      toast.error(error.message)
    else
      run(action, error)
  }
}
