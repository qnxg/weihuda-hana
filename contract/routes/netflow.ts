import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"

interface MonthNetflow {
  /** 欠费 */
  overduePayment: number
  /** 总用量 */
  total: string
  /** 上传用量 */
  upload: string
  /** 下载用量 */
  download: string
  /** 免费流量额度 */
  baseAmount: string
  /** 免费流量用量 */
  baseUsage: number
  /** 免费流量使用率, 0 - 100 */
  basePercentage: number
  /** 超出流量用量 */
  extendUsage: number
  /** 是否锁定 */
  locked: boolean
}

interface NetflowOrderItem {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 下载流量 */
  download: string
  /** 上传流量 */
  upload: string
  /** 超出流量 */
  over: string
  /** 需缴费用 */
  amount: number
  /** 更新时间, 格式 YYYY-MM-DD HH:mm:ss */
  updatedAt: string
}

interface NetflowDetailItem {
  /** 应用名称 */
  app: string
  /** 总用量 */
  total: string
  /** 下载用量 */
  download: string
  /** 上传用量 */
  upload: string
  /** 占比, 0 - 100 */
  percentage: number
}

interface NetflowDetail {
  /** 总用量 */
  total: string
  /** 上传用量 */
  upload: string
  /** 下载用量 */
  download: string
  /** 明细项 */
  items: NetflowDetailItem[]
}

interface DetailQueries {
  /** 年份 */
  year: number
  /** 月份 */
  month: number
  /** 日期, 不传按月查询 */
  day?: number
}

export const netflow = {
  get: endpoint.get<never, never, MonthNetflow>("/netflow", "本月流量"),
  orderList: endpoint.get<never, never, NetflowOrderItem[]>("/netflow/order", "流量账单"),
  detail: endpoint.get<never, DetailQueries, NetflowDetail>("/netflow/detail", "流量明细"),
}

export type NetflowGet = ApiSpec<typeof netflow.get>
export type NetflowGetData = Data<NetflowGet>

export type NetflowOrderList = ApiSpec<typeof netflow.orderList>
export type NetflowOrderListData = Data<NetflowOrderList>

export type NetflowDetailGet = ApiSpec<typeof netflow.detail>
export type NetflowDetailGetQueries = Queries<NetflowDetailGet>
export type NetflowDetailGetData = Data<NetflowDetailGet>

export type { NetflowDetailItem, NetflowOrderItem }
