import type { ErrorCode } from "@shared/codes"
import { OHNET_ADAPTER_ERROR_CODE } from "@xtwis/ohnet"
import { ApiError } from "@/types/request"
import { toast } from "@/utils/toast"

/** 业务码对应的处理 */
export type ErrorAction = string | ((error: ApiError) => void)

/** 业务码到处理动作的映射 */
export type ErrorHandlers = Partial<Record<ErrorCode, ErrorAction>> & {
  /** 兜底处理 */
  default?: ErrorAction
}

/** 执行处理 */
function run(action: ErrorAction, error: ApiError): void {
  if (typeof action === "string")
    toast.error(action)
  else
    action(error)
}

/** 组件层错误分派 */
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

    const actions = handlers as Record<number, ErrorAction | undefined>
    const action = actions[Number(error.code)] ?? handlers.default

    if (action === undefined)
      toast.error(error.message)
    else
      run(action, error)
  }
}
