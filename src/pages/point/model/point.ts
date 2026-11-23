import type { PointGoodsItem } from "@contract/routes"

/** 页内 tab */
export type PointTab = "record" | "shop" | "rule"

/** 积分变动文本, 正数带加号 */
export function deltaOf(delta: number): string {
  return `${delta > 0
    ? "+"
    : ""}${delta}`
}

/** 时间文本, 到分钟 */
export function timeOf(value: string): string {
  return value.slice(0, 16)
}

/** 商品可选状态 */
export type GoodsState = "available" | "empty" | "short"

/** 按库存与积分判断商品状态 */
export function goodsStateOf(goods: PointGoodsItem, value: number): GoodsState {
  if (goods.count <= 0)
    return "empty"

  if (goods.price > value)
    return "short"

  return "available"
}

/** 商品状态文案 */
export const GOODS_LABEL: Record<GoodsState, string> = {
  available: "兑换",
  empty: "已兑完",
  short: "积分不足",
}

/** 说明段落 */
export interface PointParagraph {
  /** 段落键, 取行首偏移 */
  key: string
  /** 段落文本 */
  text: string
}

/** 说明文本分段, 去掉空行 */
export function paragraphsOf(text: string): PointParagraph[] {
  const result: PointParagraph[] = []
  let offset = 0

  for (const line of text.split("\n")) {
    const value = line.trim()

    if (value)
      result.push({ key: `${offset}`, text: value })

    offset += line.length + 1
  }

  return result
}
