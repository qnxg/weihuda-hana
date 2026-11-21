import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Payload, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

/** 待办项 */
interface TodoItem {
  /** id */
  id: number
  /** 标题 */
  title: string
  /** 关联课程名, 无关联为 null */
  courseName: string | null
  /** 日期, 格式 YYYY-MM-DD */
  date: string
  /** 开始时间, 格式 HH:mm, 无具体时间为 null */
  startTime: string | null
  /** 结束时间, 格式 HH:mm, 无具体时间为 null */
  endTime: string | null
  /** 地点 */
  place: string | null
  /** 座位号, 无则为 null */
  seat: string | null
  /** 备注 */
  note: string | null
}

/** 路径参数 */
interface TodoParams {
  /** 待办 id */
  id: string
}

/** 待办内容 */
interface TodoPayload {
  /** 标题 */
  title: string
  /** 关联课程名 */
  courseName: string | null
  /** 日期, 格式 YYYY-MM-DD */
  date: string
  /** 开始时间, 格式 HH:mm */
  startTime: string | null
  /** 结束时间, 格式 HH:mm */
  endTime: string | null
  /** 地点 */
  place: string | null
  /** 座位号 */
  seat: string | null
  /** 备注 */
  note: string | null
}

/** 新增入参, 需要带上学期 */
interface CreatePayload extends TodoPayload, Term {}

export const todo = {
  /** 待办列表, 按日期与开始时间升序 */
  list: endpoint.get<never, Term, TodoItem[]>("/todo", "待办列表"),
  create: endpoint.internal().codes([CODE.invalid]).post<never, CreatePayload, TodoItem>("/todo", "新增待办"),
  update: endpoint.internal().codes([CODE.invalid, CODE.notFound]).put<TodoParams, TodoPayload, TodoItem>("/todo/:id", "修改待办"),
  remove: endpoint.internal().codes([CODE.notFound]).delete<TodoParams, never, null>("/todo/:id", "删除待办"),
}

export type TodoList = ApiSpec<typeof todo.list>
export type TodoListQueries = Queries<TodoList>
export type TodoListData = Data<TodoList>

export type TodoCreate = ApiSpec<typeof todo.create>
export type TodoCreatePayload = Payload<TodoCreate>
export type TodoCreateData = Data<TodoCreate>

export type TodoUpdate = ApiSpec<typeof todo.update>
export type TodoUpdateParams = ApiSpec<typeof todo.update>["params"]
export type TodoUpdatePayload = Payload<TodoUpdate>
export type TodoUpdateData = Data<TodoUpdate>

export type TodoRemove = ApiSpec<typeof todo.remove>
export type TodoRemoveParams = ApiSpec<typeof todo.remove>["params"]

export type { TodoItem }
