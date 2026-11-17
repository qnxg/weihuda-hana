import type { contract } from "@contract/routes"
import type { Handlers, Result } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { CODE } from "@shared/codes"

/** 演示用密码 */
const demoPassword = "123456"

/** 演示用验证码 */
const demoCaptcha = "123456"

/** 演示用手机号 */
const demoPhone = "138****8000"

/** 令牌类型 */
type TokenKind = "access" | "refresh"

/** 令牌对 */
interface Token {
  /** 访问令牌 */
  access: string
  /** 刷新令牌 */
  refresh: string
}

/** 演示账号的行为 */
interface Behavior {
  /** 访问令牌一开始就处于过期状态 */
  expired: boolean
  /** 刷新令牌能救回访问令牌 */
  refreshable: boolean
  /** 受保护接口要求二次验证 */
  verify: boolean
}

/** 会话 */
interface Session extends Behavior {
  /** 账号 */
  account: string
  /** 当前访问令牌是否过期 */
  stale: boolean
  /** 是否已通过二次验证 */
  verified: boolean
  /** 令牌序号 */
  seed: number
}

/** 普通账号 */
const normal: Behavior = { expired: false, refreshable: true, verify: false }

/**
 * 演示账号的行为, 密码均为 123456
 * - refresh: 访问令牌过期, 刷新后自动重试
 * - expire: 访问令牌过期, 刷新也失败
 * - verify: 受保护接口返回 1003, 二次验证后恢复
 */
const behaviors = new Map<string, Behavior>([
  [
    "refresh",
    { expired: true, refreshable: true, verify: false },
  ],
  [
    "expire",
    { expired: true, refreshable: false, verify: false },
  ],
  [
    "verify",
    { expired: false, refreshable: true, verify: true },
  ],
])

const sessions = new Map<string, Session>()

/** 签发一对令牌, 账号与序号编进令牌, 便于 mock 还原会话 */
function issue(session: Session): Token {
  session.seed += 1
  return {
    access: `access.${session.account}.${session.seed}`,
    refresh: `refresh.${session.account}.${session.seed}`,
  }
}

/** 从令牌解析账号 */
function parseToken(token: string, kind: TokenKind): string | null {
  const prefix = `${kind}.`

  if (!token.startsWith(prefix))
    return null

  const rest = token.slice(prefix.length)
  const index = rest.lastIndexOf(".")

  return index === -1
    ? null
    : rest.slice(0, index)
}

/** 从请求头取令牌 */
function bearer(header: string | undefined): string {
  return header?.replace(/^Bearer\s+/i, "") ?? ""
}

/** 读取令牌对应的会话 */
function sessionOf(token: string, kind: TokenKind): Session | null {
  const account = parseToken(token, kind)
  return account
    ? sessions.get(account) ?? null
    : null
}

/** 受保护接口: 按账号行为返回 1002 / 1003, 正常返回 null */
function guard(header: string | undefined): Result<never> | null {
  const session = sessionOf(bearer(header), "access")

  if (!session)
    return fail(CODE.auth.tokenInvalid, "令牌无效")

  if (session.stale)
    return fail(CODE.auth.tokenInvalid, "令牌已过期")

  if (session.verify && !session.verified)
    return fail(CODE.auth.verifyRequired, "需要二次验证")

  return null
}

export const auth: Handlers<typeof contract.auth> = {
  login: ({ body }) => {
    if (body.password !== demoPassword)
      return fail(CODE.auth.loginFailed, "账号或密码错误")

    const behavior = behaviors.get(body.account) ?? normal
    const session: Session = {
      ...behavior,
      account: body.account,
      stale: behavior.expired,
      verified: false,
      seed: 0,
    }

    sessions.set(body.account, session)
    return ok(issue(session))
  },
  refresh: ({ body }) => {
    const session = sessionOf(body.refresh, "refresh")

    if (!session || !session.refreshable)
      return fail(CODE.auth.tokenInvalid, "令牌无效")

    session.stale = false
    return ok(issue(session))
  },
  logout: ({ header }) => {
    const account = parseToken(bearer(header("authorization")), "access")

    if (account)
      sessions.delete(account)

    return ok(null)
  },
  verify: () => ok({ phone: demoPhone }),
  captchaSend: () => ok({ cooldown: 60 }),
  captchaVerify: ({ header, body }) => {
    if (body.code !== demoCaptcha)
      return fail(CODE.auth.captchaInvalid, "验证码错误")

    const session = sessionOf(bearer(header("authorization")), "access")

    if (!session)
      return fail(CODE.auth.tokenInvalid, "令牌无效")

    session.verified = true
    return ok(null)
  },
  me: ({ header }) => guard(header("authorization")) ?? ok({ id: "2022000000", name: "Hana" }),
}
