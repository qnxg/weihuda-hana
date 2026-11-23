import type { PhysicalGetData, PhysicalGetQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const physical = {
  get: (queries: PhysicalGetQueries, signal?: AbortSignal) => request.add({ signal }).get<PhysicalGetData>("/physical", queries),
}
