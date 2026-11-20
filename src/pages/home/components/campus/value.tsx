import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { splitOf } from "@/pages/home/components/campus/text"

export interface ValueProps {
  /** 数值 */
  value: number
  /** 单位 */
  unit: string
  /** 前置符号 */
  symbol?: string
  /** 小数位数, 0 为只取整数 */
  digits?: number
}

/** 数值展示, 整数放大加粗, 小数与单位缩小 */
export default function Value({ value, unit, symbol, digits = 2 }: Readonly<ValueProps>): ReactNode {
  const { integer, decimal } = splitOf(value, digits)

  return (
    <View className="flex items-baseline">
      {symbol && <Text className="mr-1 text-xs text-soft">{symbol}</Text>}
      <Text className="text-lg text-strong font-bold">{integer}</Text>
      {decimal && <Text className="text-sm text-soft">{`.${decimal}`}</Text>}
      <Text className="ml-1 text-xs text-soft">{unit}</Text>
    </View>
  )
}
