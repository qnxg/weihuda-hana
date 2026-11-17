import type { contract, TermInfo } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const list: TermInfo[] = [
  {
    year: 2025,
    semester: "autumn",
    start: "2025-09-01",
    weeks: 20,
  },
  {
    year: 2025,
    semester: "spring",
    start: "2025-02-17",
    weeks: 20,
  },
  {
    year: 2024,
    semester: "autumn",
    start: "2024-09-02",
    weeks: 20,
  },
]

export const semester: Handlers<typeof contract.semester> = {
  get: () => ok({ current: list[0], list }),
}
