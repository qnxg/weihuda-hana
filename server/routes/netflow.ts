import type { contract, NetflowDetailItem, NetflowOrderItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const orders: NetflowOrderItem[] = [
  {
    year: 2025,
    month: 10,
    download: "18.2 GB",
    upload: "2.1 GB",
    over: "0 B",
    amount: 0,
    updatedAt: "2025-11-01 00:10:00",
  },
  {
    year: 2025,
    month: 9,
    download: "42.6 GB",
    upload: "3.4 GB",
    over: "12.6 GB",
    amount: 5,
    updatedAt: "2025-10-01 00:10:00",
  },
]

const apps: NetflowDetailItem[] = [
  {
    app: "哔哩哔哩",
    total: "6.4 GB",
    download: "6.2 GB",
    upload: "0.2 GB",
    percentage: 48,
  },
  {
    app: "网盘",
    total: "3.1 GB",
    download: "3 GB",
    upload: "0.1 GB",
    percentage: 23,
  },
  {
    app: "其他",
    total: "3.9 GB",
    download: "2.6 GB",
    upload: "1.3 GB",
    percentage: 29,
  },
]

export const netflow: Handlers<typeof contract.netflow> = {
  get: () => ok({
    overduePayment: 0,
    total: "13.4 GB",
    upload: "1.6 GB",
    download: "11.8 GB",
    baseAmount: "20 GB",
    baseUsage: 13400,
    basePercentage: 67,
    extendUsage: 0,
    locked: false,
  }),
  orderList: () => ok(orders),
  detail: () => ok({
    total: "13.4 GB",
    upload: "1.6 GB",
    download: "11.8 GB",
    items: apps,
  }),
}
