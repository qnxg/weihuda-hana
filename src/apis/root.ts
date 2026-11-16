import type { RootHealthData } from "@contract/routes"
import { request } from "@/utils/request"

export const root = {
  health: () => request.get<RootHealthData>("/"),
}
