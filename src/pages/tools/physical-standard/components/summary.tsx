import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { LEVELS } from "@/pages/tools/physical-standard/model/standard"

/** 单项构成 */
const PARTS = [
  { label: "标准分", value: "100" },
  { label: "附加分", value: "20" },
  { label: "总分", value: "120" },
] as const

/** 总分构成与等级划分 */
export default function Summary(): ReactNode {
  return (
    <Card className="flex flex-col gap-2 border border-default p-3">
      <View className="flex items-center justify-between">
        <Text className="text-sm text-strong">总分构成</Text>
        <Text className="text-xs text-soft">满分 120 分</Text>
      </View>

      <View className="flex items-center justify-center gap-2">
        {PARTS.map((item, index) => (
          <View key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <Text className="text-sm text-soft">
                {index === 1
                  ? "+"
                  : "="}
              </Text>
            )}
            <View className="flex flex-col items-center">
              <Text className="text-lg text-strong">{item.value}</Text>
              <Text className="text-xs text-soft">{item.label}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text className="text-xs text-soft">等级划分</Text>
      <View className="flex gap-1">
        {LEVELS.map(item => (
          <View key={item.label} className="flex flex-1 flex-col items-center gap-1 rounded-md bg-default py-1">
            <Text className="text-xs text-default">{item.label}</Text>
            <Text className="text-xs text-soft">{item.range}</Text>
          </View>
        ))}
      </View>
    </Card>
  )
}
