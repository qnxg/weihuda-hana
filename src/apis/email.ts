import type { EmailGetData } from "@contract/routes"
import { request } from "@/utils/request"

export const email = {
  get: (signal?: AbortSignal) => request.add({ signal }).get<EmailGetData>("/email"),
}
