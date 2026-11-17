import type { PageData, PageQueries } from "@contract/routes/model"
import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"

/** 兑换状态, 待领取 / 已完成 / 已过期 */
export type PointExchangeStatus = "pending" | "done" | "expired"

interface Point {
  /** 当前积分 */
  value: number
  /** 连续签到天数 */
  combo: number
  /** 今日是否已签到 */
  checked: boolean
}

interface CheckResult {
  /** 本次增加的积分 */
  delta: number
}

interface PointRecordItem {
  /** 记录 id */
  id: number
  /** 积分变动, 负数为消耗 */
  delta: number
  /** 描述 */
  description: string
  /** 时间, 格式 YYYY-MM-DD HH:mm:ss */
  createdAt: string
}

interface GoodsItem {
  /** 商品 id */
  id: number
  /** 名称 */
  name: string
  /** 封面 */
  cover: string
  /** 剩余数量 */
  count: number
  /** 所需积分 */
  price: number
  /** 描述 */
  description: string | null
}

interface ExchangeItem {
  /** 兑换记录 id */
  id: number
  /** 商品 id */
  goodsId: number
  /** 商品名称 */
  goodsName: string
  /** 消耗积分 */
  price: number
  /** 兑换码, 领取时出示 */
  code: string
  /** 状态, 只有 pending 会留在待兑换列表 */
  status: PointExchangeStatus
  /** 兑换时间, 格式 YYYY-MM-DD HH:mm:ss */
  createdAt: string
  /** 完成时间, 未完成为 null */
  finishedAt: string | null
}

/** 路径参数 */
interface ExchangeParams {
  /** 商品 id */
  id: string
}

interface Desc {
  /** 积分规则说明 */
  description: string
}

export const point = {
  get: endpoint.get<never, never, Point>("/point", "积分"),
  check: endpoint.post<never, never, CheckResult>("/point", "签到"),
  recordList: endpoint.get<never, PageQueries, PageData<PointRecordItem>>("/point/record", "积分记录"),
  goodsList: endpoint.get<never, never, GoodsItem[]>("/point/goods", "积分商品"),
  exchange: endpoint.post<ExchangeParams, never, ExchangeItem>("/point/goods/:id", "兑换商品"),
  exchangeList: endpoint.get<never, never, ExchangeItem[]>("/point/exchange", "待兑换"),
  desc: endpoint.get<never, never, Desc>("/point/desc", "积分说明"),
}

export type PointGet = ApiSpec<typeof point.get>
export type PointGetData = Data<PointGet>

export type PointCheck = ApiSpec<typeof point.check>
export type PointCheckData = Data<PointCheck>

export type PointRecordList = ApiSpec<typeof point.recordList>
export type PointRecordListQueries = PageQueries
export type PointRecordListData = PageData<PointRecordItem>

export type PointGoodsList = ApiSpec<typeof point.goodsList>
export type PointGoodsListData = Data<PointGoodsList>

export type PointExchange = ApiSpec<typeof point.exchange>
export type PointExchangeParams = ApiSpec<typeof point.exchange>["params"]
export type PointExchangeData = Data<PointExchange>

export type PointExchangeList = ApiSpec<typeof point.exchangeList>
export type PointExchangeListData = Data<PointExchangeList>

export type PointDesc = ApiSpec<typeof point.desc>
export type PointDescData = Data<PointDesc>

export type { ExchangeItem as PointExchangeItem, GoodsItem as PointGoodsItem, PointRecordItem }
