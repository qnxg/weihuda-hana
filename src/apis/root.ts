import type { RootAboutData, RootHealthData } from "@contract/routes"
import { request } from "@/utils/request"

export const root = {
  health: (signal?: AbortSignal) => request.add({ signal }).get<RootHealthData>("/"),
  about: (signal?: AbortSignal) => request.add({ signal }).get<RootAboutData>("/about"),
}
