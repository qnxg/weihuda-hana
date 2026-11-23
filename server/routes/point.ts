import type { contract, PointExchangeItem, PointGoodsItem, PointRecordItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { now } from "@server/time"
import { CODE } from "@shared/codes"

const goods: PointGoodsItem[] = [
  {
    id: 1,
    name: "校园文创帆布包",
    cover: "",
    count: 12,
    price: 120,
    description: "微生活限定",
  },
  {
    id: 2,
    name: "印有校徽的马克杯",
    cover: "",
    count: 30,
    price: 80,
    description: null,
  },
  {
    id: 3,
    name: "奶茶券",
    cover: "",
    count: 0,
    price: 50,
    description: "库存为 0 时不可兑换",
  },
]

/** 补零 */
function pad(value: number): string {
  return String(value).padStart(2, "0")
}

/** 记录模板 */
const RECORD_TEMPLATES = [
  { description: "每日签到", delta: 5 },
  { description: "连续签到奖励", delta: 20 },
  { description: "参与校园活动", delta: 10 },
  { description: "校园问答奖励", delta: 15 },
  { description: "兑换奶茶券", delta: -50 },
  { description: "兑换校园文创帆布包", delta: -120 },
] as const

/** 生成历史记录, 最新在前 */
function createRecords(count: number): PointRecordItem[] {
  const base = Date.now()
  const list: PointRecordItem[] = []

  for (let index = 0; index < count; index += 1) {
    const template = RECORD_TEMPLATES[index % RECORD_TEMPLATES.length]
    const date = new Date(base - index * 6 * 60 * 60 * 1000)
    const createdAt = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:00`

    list.push({
      id: count - index,
      delta: template.delta,
      description: template.description,
      createdAt,
    })
  }

  return list
}

const records: PointRecordItem[] = createRecords(240)

const exchanges: PointExchangeItem[] = [
  {
    id: 1,
    goodsId: 2,
    goodsName: "印有校徽的马克杯",
    price: 80,
    code: "MK8Q-2F7D",
    status: "pending",
    createdAt: "2025-11-09 18:00:00",
    finishedAt: null,
  },
]

let value = 96

let combo = 3

let checked = false

let seed = exchanges.length

let recordSeed = records.length

export const point: Handlers<typeof contract.point> = {
  get: () => ok({ value, combo, checked }),
  check: () => {
    if (checked)
      return fail(CODE.rejected, "今日已签到")

    checked = true
    combo += 1
    value += 5
    recordSeed += 1
    records.unshift({
      id: recordSeed,
      delta: 5,
      description: "每日签到",
      createdAt: now(),
    })
    return ok({ delta: 5 })
  },
  recordList: ({ query }) => {
    const page = Number(query.page) || 1
    const size = Number(query.size) || 20
    const start = (page - 1) * size

    return ok({
      page,
      size,
      total: records.length,
      list: records.slice(start, start + size),
    })
  },
  goodsList: () => ok(goods),
  exchange: ({ params }) => {
    const target = goods.find(item => item.id === Number(params.id))

    if (!target || target.count <= 0)
      return fail(CODE.notFound, "商品不存在或已下架")

    if (target.price > value)
      return fail(CODE.rejected, "积分不足")

    value -= target.price
    target.count -= 1
    seed += 1

    const item: PointExchangeItem = {
      id: seed,
      goodsId: target.id,
      goodsName: target.name,
      price: target.price,
      code: `HN${String(seed).padStart(2, "0")}-QR`,
      status: "pending",
      createdAt: now(),
      finishedAt: null,
    }

    exchanges.unshift(item)
    return ok(item)
  },
  exchangeList: () => ok(exchanges.filter(item => item.status === "pending")),
  desc: () => ok({ description: "签到得积分, 积分可在积分商城兑换实物或券, 兑换后到学生活动中心领取" }),
}
