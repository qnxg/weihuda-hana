import type { ApiResponse } from "@contract/types"
import type { AppRouteMutation, AppRouteQuery, ContractPlainType } from "@sapporta/rest-core"
import type { AppCode } from "@shared/codes"
import { initContract } from "@sapporta/rest-core"
import { CODE } from "@shared/codes"

const c = initContract()

/** 全局业务码 */
export const GLOBAL_CODES: readonly AppCode[] = [CODE.auth.tokenInvalid, CODE.auth.verifyRequired]

/** 端点附加信息 */
export interface EndpointMeta {
  /** 是否需要令牌 */
  auth: boolean
  /** 未通过二次验证时是否返回 verifyRequired */
  verify: boolean
  /** 端点专属业务码 */
  codes: readonly AppCode[]
}

/** 查询端点 */
export interface QueryRoute<Params, Queries, Data> extends AppRouteQuery {
  /** 附加信息 */
  meta: EndpointMeta
  /** 路径参数 */
  pathParams: ContractPlainType<Params>
  /** 查询参数 */
  query: ContractPlainType<Queries>
  /** 响应 */
  responses: { 200: ContractPlainType<ApiResponse<Data>> }
}

/** 变更端点 */
export interface MutationRoute<M extends AppRouteMutation["method"], Params, Payload, Data> extends AppRouteMutation {
  /** 附加信息 */
  meta: EndpointMeta
  /** 方法 */
  method: M
  /** 路径参数 */
  pathParams: ContractPlainType<Params>
  /** 请求体 */
  body: ContractPlainType<Payload>
  /** 响应 */
  responses: { 200: ContractPlainType<ApiResponse<Data>> }
}

/** 端点构造器 */
export interface EndpointBuilder {
  /** 自家后端 */
  internal: () => EndpointBuilder
  /** 公开接口 */
  public: () => EndpointBuilder
  /** 端点专属业务码 */
  codes: (codes: readonly AppCode[]) => EndpointBuilder
  /** 查询端点 */
  get: <Params = never, Queries = never, Data = never>(path: string, summary?: string) => QueryRoute<Params, Queries, Data>
  /** 新增端点 */
  post: <Params = never, Payload = never, Data = never>(path: string, summary?: string) => MutationRoute<"POST", Params, Payload, Data>
  /** 修改端点 */
  put: <Params = never, Payload = never, Data = never>(path: string, summary?: string) => MutationRoute<"PUT", Params, Payload, Data>
  /** 删除端点 */
  delete: <Params = never, Payload = never, Data = never>(path: string, summary?: string) => MutationRoute<"DELETE", Params, Payload, Data>
}

/** 端点可能返回的全部业务码 */
export function codesOf(route: { meta: EndpointMeta }): readonly AppCode[] {
  return [
    ...GLOBAL_CODES,
    ...route.meta.codes,
  ]
}

/** 构造查询端点 */
function query<Params, Queries, Data>(meta: EndpointMeta, path: string, summary: string): QueryRoute<Params, Queries, Data> {
  return {
    meta,
    summary,
    method: "GET",
    path,
    pathParams: c.type<Params>() as ContractPlainType<Params>,
    query: c.type<Queries>() as ContractPlainType<Queries>,
    responses: {
      200: c.type<ApiResponse<Data>>() as ContractPlainType<ApiResponse<Data>>,
    },
  }
}

/** 构造变更端点 */
function mutation<M extends AppRouteMutation["method"], Params, Payload, Data>(
  meta: EndpointMeta,
  method: M,
  path: string,
  summary: string,
): MutationRoute<M, Params, Payload, Data> {
  return {
    meta,
    summary,
    method,
    path,
    pathParams: c.type<Params>() as ContractPlainType<Params>,
    body: c.type<Payload>() as ContractPlainType<Payload>,
    responses: {
      200: c.type<ApiResponse<Data>>() as ContractPlainType<ApiResponse<Data>>,
    },
  }
}

/** 用附加信息构造端点 */
function create(meta: EndpointMeta): EndpointBuilder {
  return {
    internal: () => create({ ...meta, verify: false }),
    public: () => create({ ...meta, auth: false, verify: false }),
    codes: codes => create({ ...meta, codes }),
    get: <Params = never, Queries = never, Data = never>(path: string, summary = "") => query<Params, Queries, Data>(meta, path, summary),
    post: <Params = never, Payload = never, Data = never>(path: string, summary = "") => mutation<"POST", Params, Payload, Data>(meta, "POST", path, summary),
    put: <Params = never, Payload = never, Data = never>(path: string, summary = "") => mutation<"PUT", Params, Payload, Data>(meta, "PUT", path, summary),
    delete: <Params = never, Payload = never, Data = never>(path: string, summary = "") => mutation<"DELETE", Params, Payload, Data>(meta, "DELETE", path, summary),
  }
}

/** 端点定义工具 */
export const endpoint: EndpointBuilder = create({ auth: true, verify: true, codes: [] })
