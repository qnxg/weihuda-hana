import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { CODE } from "@shared/codes"

/** 演示用密码 */
const demoPassword = "123456"

/** 演示用验证码 */
const demoCaptcha = "123456"

/** 触发二次验证的密码 */
const tfaPassword = "tfa"

let seed = 0

/** 签发一对令牌 */
function issue() {
  seed += 1
  return { access: `access-${seed}`, refresh: `refresh-${seed}` }
}

export const auth: Handlers<typeof contract.auth> = {
  login: ({ body }) => {
    if (body.password === tfaPassword)
      return ok<{ tfa: true }>({ tfa: true })

    if (body.password !== demoPassword)
      return fail(CODE.auth.loginFailed, "账号或密码错误")

    return ok(issue())
  },
  loginCaptcha: ({ body }) =>
    body.code === demoCaptcha
      ? ok(issue())
      : fail(CODE.auth.captchaInvalid, "验证码错误"),
  refresh: ({ body }) =>
    body.refresh
      ? ok(issue())
      : fail(CODE.auth.tokenInvalid, "令牌无效"),
  logout: () => ok(null),
  captchaSend: () => ok({ cooldown: 60 }),
  captchaVerify: ({ body }) =>
    body.code === demoCaptcha
      ? ok(null)
      : fail(CODE.auth.captchaInvalid, "验证码错误"),
  me: () => ok({ id: "2022000000", name: "Hana" }),
}
