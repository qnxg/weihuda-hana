import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

/** 交易类型, 充值 / 消费 */
export type CardRecordType = "recharge" | "consumption"

interface Card {
  /** 校园卡 id */
  id: number
  /** 余额 */
  balance: number
}

interface CardRecordItem {
  /** 交易 id */
  id: number
  /** 交易名称 */
  name: string
  /** 交易金额, 充值为正, 消费为负 */
  amount: number
  /** 交易后余额 */
  balance: number
  /** 交易地点 */
  location: string | null
  /** 交易状态 */
  status: string
  /** 交易时间, 格式 YYYY-MM-DD HH:mm:ss */
  tradedAt: string
  /** 记账时间, 格式 YYYY-MM-DD HH:mm:ss */
  recordedAt: string
}

interface CardRecordData {
  /** 交易总金额 */
  total: number
  /** 交易笔数 */
  count: number
  /** 交易记录 */
  records: CardRecordItem[]
}

interface CardRecordQueries {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 交易类型 */
  type: CardRecordType
}

export const card = {
  get: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, never, Card>("/card", "校园卡"),
  recordList: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, CardRecordQueries, CardRecordData>("/card/record", "校园卡流水"),
}

export type CardGet = ApiSpec<typeof card.get>
export type CardGetData = Data<CardGet>

export type CardRecordList = ApiSpec<typeof card.recordList>
export type CardRecordListQueries = Queries<CardRecordList>
export type CardRecordListData = Data<CardRecordList>

export type { CardRecordItem }
