import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

export const root: Handlers<typeof contract.root> = {
  health: () => ok({ hello: "world" }),
  about: () => ok({
    version: "0.0.0",
    home: "https://weihuda.qnxg.net",
    join: "https://weixiao.qq.com",
    slogans: ["湖南大学微生活", "Hana"],
  }),
}
