import type { ApiResponse } from "@contract/types"
import type { AppRouteMutation, AppRouteQuery, ContractPlainType } from "@sapporta/rest-core"
import { initContract } from "@sapporta/rest-core"

const c = initContract()

/** 端点可附带的额外字段 */
type Extra = Partial<Pick<AppRouteQuery, "deprecated" | "metadata">>

/** 查询端点 */
export interface QueryRoute<Params, Queries, Data> extends AppRouteQuery {
  pathParams: ContractPlainType<Params>
  query: ContractPlainType<Queries>
  responses: { 200: ContractPlainType<ApiResponse<Data>> }
}

/** 变更端点 */
export interface MutationRoute<M extends AppRouteMutation["method"], Params, Payload, Data> extends AppRouteMutation {
  method: M
  pathParams: ContractPlainType<Params>
  body: ContractPlainType<Payload>
  responses: { 200: ContractPlainType<ApiResponse<Data>> }
}

/** 端点定义工具 */
export const endpoint = {
  get<Params = never, Queries = never, Data = never>(path: string, summary = "", extra: Extra = {}): QueryRoute<Params, Queries, Data> {
    return {
      ...extra,
      summary,
      method: "GET",
      path,
      pathParams: c.type<Params>() as ContractPlainType<Params>,
      query: c.type<Queries>() as ContractPlainType<Queries>,
      responses: {
        200: c.type<ApiResponse<Data>>() as ContractPlainType<ApiResponse<Data>>,
      },
    }
  },
  post<Params = never, Payload = never, Data = never>(path: string, summary = "", extra: Extra = {}): MutationRoute<"POST", Params, Payload, Data> {
    return {
      ...extra,
      summary,
      method: "POST",
      path,
      pathParams: c.type<Params>() as ContractPlainType<Params>,
      body: c.type<Payload>() as ContractPlainType<Payload>,
      responses: {
        200: c.type<ApiResponse<Data>>() as ContractPlainType<ApiResponse<Data>>,
      },
    }
  },
  put<Params = never, Payload = never, Data = never>(path: string, summary = "", extra: Extra = {}): MutationRoute<"PUT", Params, Payload, Data> {
    return {
      ...extra,
      summary,
      method: "PUT",
      path,
      pathParams: c.type<Params>() as ContractPlainType<Params>,
      body: c.type<Payload>() as ContractPlainType<Payload>,
      responses: {
        200: c.type<ApiResponse<Data>>() as ContractPlainType<ApiResponse<Data>>,
      },
    }
  },
  delete<Params = never, Payload = never, Data = never>(path: string, summary = "", extra: Extra = {}): MutationRoute<"DELETE", Params, Payload, Data> {
    return {
      ...extra,
      summary,
      method: "DELETE",
      path,
      pathParams: c.type<Params>() as ContractPlainType<Params>,
      body: c.type<Payload>() as ContractPlainType<Payload>,
      responses: {
        200: c.type<ApiResponse<Data>>() as ContractPlainType<ApiResponse<Data>>,
      },
    }
  },
}
