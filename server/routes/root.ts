import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

export const root: Handlers<typeof contract.root> = {
  health: () => ok({ hello: "world" }),
}
