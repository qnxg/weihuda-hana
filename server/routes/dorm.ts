import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const dorm = { park: "南校区", build: "天马 2 区", room: "312" }

let balance = "46.8"

export const dormHandlers: Handlers<typeof contract.dorm> = {
  get: () => ok(dorm),
  refresh: () => ok(null),
  electricityGet: () => ok({ balance }),
  electricityRefresh: () => {
    balance = (Number(balance) - Math.random() * 0.5).toFixed(1)
    return ok(null)
  },
}

export { dormHandlers as dorm }
