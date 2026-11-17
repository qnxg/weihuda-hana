import type { contract, Rank } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"
import { now } from "@server/time"

const detail = {
  arithmetic: "88.20",
  arithmeticRank: "12/180",
  weighted: "87.60",
  weightedRank: "15/180",
  gpa: "3.62",
  gpaRank: "14/180",
}

const rank: Rank = { all: detail, compulsory: detail, core: null }

const ca: { updatedAt: string, rank: Rank } = { updatedAt: "2025-11-01 09:00:00", rank }

export const rankHandlers: Handlers<typeof contract.rank> = {
  caGet: () => ok(ca),
  caRefresh: () => {
    ca.updatedAt = now()
    return ok(null)
  },
  get: () => ok(rank),
}

export { rankHandlers as rank }
