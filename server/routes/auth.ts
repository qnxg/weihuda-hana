import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { CODE } from "@shared/codes"

/** 演示用密码 */
const demoPassword = "123456"

/** 演示用验证码 */
const demoCaptcha = "123456"

/** 演示用手机号 */
const demoPhone = "138****8000"

let seed = 0

/** 签发一对令牌 */
function issue() {
  seed += 1
  return { access: `access-${seed}`, refresh: `refresh-${seed}` }
}

export const auth: Handlers<typeof contract.auth> = {
  login: ({ body }) =>
    body.password === demoPassword
      ? ok(issue())
      : fail(CODE.auth.loginFailed, "账号或密码错误"),
  refresh: ({ body }) =>
    body.refresh
      ? ok(issue())
      : fail(CODE.auth.tokenInvalid, "令牌无效"),
  logout: () => ok(null),
  verify: () => ok({ phone: demoPhone }),
  captchaSend: () => ok({ cooldown: 60 }),
  captchaVerify: ({ body }) =>
    body.code === demoCaptcha
      ? ok(null)
      : fail(CODE.auth.captchaInvalid, "验证码错误"),
  me: () => ok({ id: "2022000000", name: "Hana" }),
}
