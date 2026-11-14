import type { QueryClient as QueryClientType } from "@tanstack/preact-query"
import type { ComponentType, ReactNode } from "react"
import { QueryClientProvider as PreactQueryClientProvider, QueryClient } from "@tanstack/preact-query"
import { OHNET_ADAPTER_ERROR_CODE, OhNetError } from "@xtwis/ohnet"

/** preact 组件无法直接用作 react 的 JSX 类型, 在此桥接 */
export const QueryClientProvider = PreactQueryClientProvider as unknown as ComponentType<{
  client: QueryClientType
  children?: ReactNode
}>

/** 全局查询客户端 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: (count, error) =>
        error instanceof OhNetError
        && error.code === OHNET_ADAPTER_ERROR_CODE.NETWORK
        && count < 2,
    },
  },
})

export { useMutation, useQuery, useQueryClient } from "@tanstack/preact-query"
