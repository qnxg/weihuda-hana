import type { AuthMeData } from "@contract/routes"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { hasToken } from "@/utils/auth"

export interface UserState {
  /** 当前账号 */
  user: AuthMeData | null
  /** 是否加载中 */
  loading: boolean
}

/** 当前账号, 未登录时不请求 */
export function useUser(): UserState {
  const query = useQuery({
    queryKey: QUERY_KEY.auth.me,
    queryFn: ({ signal }) => api.auth.me(signal),
    enabled: hasToken(),
  })

  return {
    user: query.data ?? null,
    loading: query.isLoading,
  }
}
