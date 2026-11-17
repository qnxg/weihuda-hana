import type { EndpointMeta } from "@contract/endpoint"
import type { HeaderReader, Result } from "@server/endpoint"
import type { AppCode } from "@shared/codes"
import process from "node:process"
import { codesOf } from "@contract/endpoint"
import { fail } from "@server/endpoint"
import { sessionFrom, verifyRequired } from "@server/session"
import { CODE } from "@shared/codes"

/** 端点前置校验 */
export function guard(meta: EndpointMeta, header: HeaderReader): Result<never> | null {
  if (!meta.auth)
    return null

  const session = sessionFrom(header)

  if (!session || session.stale)
    return fail(CODE.auth.tokenInvalid, "令牌无效")

  if (meta.verify && verifyRequired(session))
    return fail(CODE.auth.verifyRequired, "需要二次验证")

  return null
}

/** 业务码不在契约声明里时终止 mock */
export function check(meta: EndpointMeta, name: string, code: number): void {
  if (code === CODE.ok || codesOf({ meta }).includes(code as AppCode))
    return

  process.stderr.write(`[mock] ${name} 返回未声明的业务码 ${code}\n`)
  process.exit(1)
}
