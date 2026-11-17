import type { QueryClient as QueryClientType } from "@tanstack/preact-query"
import type { ComponentType, ReactNode } from "react"
import { MutationCache, QueryClientProvider as PreactQueryClientProvider, QueryCache, QueryClient } from "@tanstack/preact-query"
import {
  OHNET_ADAPTER_ERROR_CODE,
  OHNET_UNKNOWN_ERROR_CODE,
  OHNET_UNKNOWN_ERROR_MESSAGE,
  OHNET_UNKNOWN_ERROR_TYPE,
  OhNetError,
} from "@xtwis/ohnet"
import { LABEL } from "@/config/label"
import { MESSAGE } from "@/config/message"
import { BIZ_ERROR_TYPE } from "@/config/request"
import { ApiError } from "@/types/request"
import { logger } from "@/utils/logger"
import { snackbar } from "@/utils/snackbar"

/** 非业务错误统一提示并标记已处理 */
function notifyError(error: unknown): void {
  let apiError: ApiError

  if (error instanceof ApiError)
    apiError = error
  else if (error instanceof OhNetError)
    apiError = ApiError.from(error)
  else
    apiError = new ApiError(OHNET_UNKNOWN_ERROR_TYPE, OHNET_UNKNOWN_ERROR_CODE, OHNET_UNKNOWN_ERROR_MESSAGE, { error })

  if (apiError.type === BIZ_ERROR_TYPE || apiError.code === OHNET_ADAPTER_ERROR_CODE.ABORT)
    return

  logger.error(LABEL.request.error, apiError)
  snackbar.show(`${MESSAGE.request.failed}: ${MESSAGE.request.reason[apiError.code] ?? apiError.message}`)
  apiError.handle()
}

/** 全局查询客户端 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => notifyError(error),
  }),
  mutationCache: new MutationCache({
    onError: error => notifyError(error),
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

/** preact 组件无法直接用作 react 的 JSX 类型, 在此桥接 */
export const QueryClientProvider = PreactQueryClientProvider as unknown as ComponentType<{
  client: QueryClientType
  children?: ReactNode
}>

export { useMutation, useQuery, useQueryClient } from "@tanstack/preact-query"
