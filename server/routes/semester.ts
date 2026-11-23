import type { contract, TermInfo } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const list: TermInfo[] = [
  {
    year: 2026,
    semester: "autumn",
    start: "2026-09-13",
    weeks: 18,
  },
  {
    year: 2025,
    semester: "summer",
    start: "2026-07-05",
    weeks: 10,
  },
  {
    year: 2025,
    semester: "spring",
    start: "2026-03-01",
    weeks: 18,
  },
  {
    year: 2025,
    semester: "autumn",
    start: "2025-09-21",
    weeks: 18,
  },
  {
    year: 2024,
    semester: "summer",
    start: "2025-06-22",
    weeks: 10,
  },
  {
    year: 2024,
    semester: "spring",
    start: "2025-02-16",
    weeks: 18,
  },
  {
    year: 2024,
    semester: "autumn",
    start: "2024-09-08",
    weeks: 18,
  },
]

export const semester: Handlers<typeof contract.semester> = {
  get: () => ok({ current: list[0], list }),
}
