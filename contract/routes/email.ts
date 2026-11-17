import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"

interface EmailData {
  /** 未读邮件数 */
  count: number
}

export const email = {
  get: endpoint.get<never, never, EmailData>("/email", "校园邮箱"),
}

export type EmailGet = ApiSpec<typeof email.get>
export type EmailGetData = Data<EmailGet>
