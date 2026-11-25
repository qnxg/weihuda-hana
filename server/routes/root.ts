import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

export const root: Handlers<typeof contract.root> = {
  health: () => ok({ hello: "world" }),
  about: () => ok({
    version: "0.1.0",
    home: "https://qnxg.cn",
    join: "https://join.qnxg.cn",
    slogans: [
      "遵循本心, 自我驱动, 无限创造",
      "易千网络文化工作室欢迎你 ~",
      "用代码构建我们的微生活 !",
    ],
  }),
}
