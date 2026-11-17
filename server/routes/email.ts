import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

export const email: Handlers<typeof contract.email> = {
  get: () => ok({ count: 3 }),
}
