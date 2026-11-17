import type { ApiResponse, ApiSpec, Data, Params, Payload, Queries } from "@contract/types"
import type { AppRoute } from "@sapporta/rest-core"
import { CODE } from "@shared/codes"

/** 读取请求头 */
export type HeaderReader = (name: string) => string | undefined

/** 端点入参 */
export interface HandlerInput<S> {
  /** 路径参数 */
  params: Params<S>
  /** 查询参数 */
  query: Queries<S>
  /** 请求体 */
  body: Payload<S>
  /** 读取请求头 */
  header: HeaderReader
}

/** 处理器返回值 */
export interface Result<T> {
  status: 200
  body: ApiResponse<T>
}

/** 端点处理器 */
export type Handler<D extends AppRoute> = (input: HandlerInput<ApiSpec<D>>) => Result<Data<ApiSpec<D>>>

/** 一个域的处理器集合 */
export type Handlers<D> = {
  [K in keyof D]: D[K] extends AppRoute ? Handler<D[K]> : never
}

/** 业务成功 */
export function ok<T>(data: T, message = "ok"): Result<T> {
  return {
    status: 200,
    body: { code: CODE.ok, data, message },
  }
}

/** 业务失败 */
export function fail(code: number, message: string): Result<never> {
  return {
    status: 200,
    body: { code, data: null as never, message },
  }
}
