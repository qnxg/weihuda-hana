import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

interface EmailData {
  /** 未读邮件数 */
  count: number
}

export const email = {
  get: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, never, EmailData>("/email", "校园邮箱"),
}

export type EmailGet = ApiSpec<typeof email.get>
export type EmailGetData = Data<EmailGet>
