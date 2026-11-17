import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { login, logout, refresh, sessionFrom, verify } from "@server/session"
import { CODE } from "@shared/codes"

/** 演示用密码 */
const password = "123456"

/** 演示用验证码 */
const captcha = "123456"

/** 演示用手机号 */
const phone = "138****8000"

export const auth: Handlers<typeof contract.auth> = {
  login: ({ body }) => {
    if (body.password !== password)
      return fail(CODE.auth.loginFailed, "账号或密码错误")

    const token = login(body.account)
    return token
      ? ok(token)
      : fail(CODE.auth.loginFailed, "账号不能为空")
  },
  refresh: ({ body }) => {
    const token = refresh(body.refresh)
    return token
      ? ok(token)
      : fail(CODE.auth.tokenInvalid, "令牌无效")
  },
  logout: ({ header }) => {
    const session = sessionFrom(header)

    if (session)
      logout(session)

    return ok(null)
  },
  verify: () => ok({ phone }),
  captchaSend: () => ok({ cooldown: 60 }),
  captchaVerify: ({ header, body }) => {
    if (body.code !== captcha)
      return fail(CODE.auth.captchaInvalid, "验证码错误")

    const session = sessionFrom(header)

    if (!session)
      return fail(CODE.auth.tokenInvalid, "令牌无效")

    verify(session)
    return ok(null)
  },
  me: ({ header }) => {
    const session = sessionFrom(header)
    return ok({ id: session?.account ?? "", name: "Hana" })
  },
}
