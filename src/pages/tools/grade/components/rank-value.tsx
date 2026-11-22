import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"

/** 排名值, 斜杠后的人数用小字 */
export default function RankValue({ value }: Readonly<{ value: string | null }>): ReactNode {
  if (!value)
    return <Text className="text-lg text-strong">--</Text>

  const index = value.indexOf("/")

  if (index === -1)
    return <Text className="text-lg text-strong">{value}</Text>

  return (
    <View className="flex items-baseline">
      <Text className="text-lg text-strong">{value.slice(0, index)}</Text>
      <Text className="text-xs text-soft">{value.slice(index)}</Text>
    </View>
  )
}
