import type {
  TodoCreateData,
  TodoCreatePayload,
  TodoListData,
  TodoListQueries,
  TodoRemoveParams,
  TodoUpdateData,
  TodoUpdateParams,
  TodoUpdatePayload,
} from "@contract/routes"
import { request } from "@/utils/request"

export const todo = {
  list: (queries: TodoListQueries, signal?: AbortSignal) => request.add({ signal }).get<TodoListData>("/todo", queries),
  create: (payload: TodoCreatePayload) => request.post<TodoCreateData>("/todo", payload),
  update: ({ id }: TodoUpdateParams, payload: TodoUpdatePayload) => request.put<TodoUpdateData>(`/todo/${id}`, payload),
  remove: ({ id }: TodoRemoveParams) => request.delete<null>(`/todo/${id}`),
}
