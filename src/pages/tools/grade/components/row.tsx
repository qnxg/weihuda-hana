import type { GradeItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import TypeBadge from "@/pages/tools/grade/components/type-badge"
import { badgesOf } from "@/pages/tools/grade/model/grade"

/** 一门成绩 */
export default function Row({ item, onSelect }: Readonly<{ item: GradeItem, onSelect: (item: GradeItem) => void }>): ReactNode {
  return (
    <Card className="flex items-center gap-3 border border-default p-3" onClick={() => onSelect(item)}>
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-sm text-strong">{item.courseName}</Text>
        <View className="flex flex-wrap items-center gap-1">
          {badgesOf(item).map(type => <TypeBadge key={type} text={type} />)}
        </View>
      </View>
      <View className="flex shrink-0 flex-col items-end gap-1">
        {item.score > 0
          ? (
              <View className="flex items-baseline">
                <Text className="text-base text-strong">{item.score}</Text>
                <Text className="text-xs text-soft">
                  {item.gpa === null
                    ? ""
                    : `/${item.gpa.toFixed(1)}`}
                </Text>
              </View>
            )
          : (
              <Text className="text-xs text-soft">
                {item.gradeTag ?? "未出分"}
              </Text>
            )}
        <Text className="text-xs text-soft">{`${item.credit} 学分`}</Text>
      </View>
    </Card>
  )
}
