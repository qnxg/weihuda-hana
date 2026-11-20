import type { CardRecordItem, CardRecordType, contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const records: (CardRecordItem & { type: CardRecordType })[] = [
  {
    id: 3,
    name: "食堂消费",
    amount: -12.5,
    balance: 218.4,
    location: "五食堂",
    status: "正常",
    tradedAt: "2026-11-10 12:05:00",
    recordedAt: "2026-11-10 12:06:00",
    type: "consumption",
  },
  {
    id: 2,
    name: "超市消费",
    amount: -8,
    balance: 230.9,
    location: "校园超市",
    status: "正常",
    tradedAt: "2026-11-09 18:40:00",
    recordedAt: "2026-11-09 18:41:00",
    type: "consumption",
  },
  {
    id: 1,
    name: "微信充值",
    amount: 200,
    balance: 238.9,
    location: null,
    status: "正常",
    tradedAt: "2026-11-01 09:12:00",
    recordedAt: "2026-11-01 09:13:00",
    type: "recharge",
  },
]

export const card: Handlers<typeof contract.card> = {
  get: () => ok({ id: 2022000000, balance: 218.4 }),
  recordList: ({ query }) => {
    const month = `${query.year}-${String(query.month).padStart(2, "0")}`
    const filtered = records.filter(item => item.type === query.type && item.tradedAt.startsWith(month))
    const total = filtered.reduce((sum, item) => sum + item.amount, 0)

    return ok({
      total: Number(total.toFixed(2)),
      count: filtered.length,
      records: filtered.map(({ type: _type, ...item }) => item),
    })
  },
}
