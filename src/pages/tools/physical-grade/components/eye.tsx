import type { PhysicalGrade } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { EYES } from "@/pages/tools/physical-grade/model/physical"
import { cn } from "@/utils/cn"

/** 视力详情 */
export default function Eye({ eye }: Readonly<{ eye: PhysicalGrade["eye"] }>): ReactNode {
  return (
    <Card className="flex flex-col overflow-hidden border border-default p-0">
      {EYES.map((item, index) => {
        const value = eye[item.key]

        return (
          <View
            key={item.key}
            className={cn(
              "flex flex-col gap-1 px-3 py-1h",
              index < EYES.length - 1 && "border-b border-default",
            )}
          >
            <Text className="text-sm text-default">{item.label}</Text>
            <View className="flex gap-3">
              <Text className="text-xs text-soft">
                {`左 ${value.left.value} ${value.left.description}`}
              </Text>
              <Text className="text-xs text-soft">
                {`右 ${value.right.value} ${value.right.description}`}
              </Text>
            </View>
          </View>
        )
      })}
    </Card>
  )
}
