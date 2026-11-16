import type { ApiResponse, ApiSpec, Data } from "@contract/types"
import type { AppRoute } from "@sapporta/rest-core"

/** 处理器返回值 */
export interface Result<T> {
  status: 200
  body: ApiResponse<T>
}

/** 端点处理器 */
export type Handler = () => Result<unknown>

/** 一个域的处理器集合 */
export type Handlers<D> = {
  [K in keyof D]: D[K] extends AppRoute ? () => Result<Data<ApiSpec<D[K]>>> : never
}

/** 业务成功 */
export function ok<T>(data: T, message = "ok"): Result<T> {
  return {
    status: 200,
    body: { code: 0, data, message },
  }
}

/** 业务失败 */
export function fail(code: number, message: string): Result<never> {
  return {
    status: 200,
    body: { code, data: null as never, message },
  }
}
