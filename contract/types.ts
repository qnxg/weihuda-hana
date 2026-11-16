import type { AppRoute, ContractNoBodyType, ContractNullType, ContractPlainType, ParamsFromUrl } from "@sapporta/rest-core"
import type { z } from "zod"

/** 服务端统一响应 */
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

/** 契约里声明的类型收窄成纯类型, 纯类型原样返回 */
type Plain<T, Z> = T extends ContractPlainType<infer U>
  ? U
  : T extends ContractNoBodyType
    ? undefined
    : T extends ContractNullType
      ? null
      : T extends z.ZodType
        ? Z
        : T

/** 客户端发出的形态: zod schema 取 input */
export type Input<T> = Plain<T, T extends z.ZodType ? z.input<T> : never>

/** 客户端收到的形态: zod schema 取 output */
export type Output<T> = Plain<T, T extends z.ZodType ? z.output<T> : never>

/** 取端点上的可选字段 */
type Field<T, K extends PropertyKey> = K extends keyof T ? T[K] : never

/** 后者覆盖前者, 展平成一层便于悬停查看 */
type Merge<A, B> = {
  [K in keyof (Omit<A, keyof B> & B)]: (Omit<A, keyof B> & B)[K]
} & {}

/** 端点声明的 2xx 响应体 */
type Ok<E extends AppRoute> = Output<E["responses"][Extract<keyof E["responses"], 200 | 201 | 202 | 204>]>

/** 契约端点在应用侧的四类类型 */
export interface ApiSpec<E extends AppRoute> {
  /** 路径参数, pathParams 覆盖 path 冒号段推出的类型 */
  params: [Input<Field<E, "pathParams">>] extends [never]
    ? ParamsFromUrl<E["path"]>
    : Merge<ParamsFromUrl<E["path"]>, Input<Field<E, "pathParams">>>
  /** 查询参数 */
  queries: Input<Field<E, "query">>
  /** 请求体 */
  payload: Input<Field<E, "body">>
  /** 成功响应解包后的 data, 无包体时为 undefined */
  data: Ok<E> extends ApiResponse<infer D> ? D : Ok<E>
}

/** 路径参数 */
export type Params<S> = Field<S, "params">

/** 查询参数 */
export type Queries<S> = Field<S, "queries">

/** 请求体 */
export type Payload<S> = Field<S, "payload">

/** 成功响应解包后的 data */
export type Data<S> = Field<S, "data">
