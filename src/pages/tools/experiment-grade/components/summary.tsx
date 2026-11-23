import type { ExperimentGrade } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"

/** 课程概览 */
export default function Summary({ grade }: Readonly<{ grade: ExperimentGrade }>): ReactNode {
  return (
    <Card className="flex items-center gap-3 border border-default p-3">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-xs text-soft">实验课程</Text>
        <Text className="text-sm text-strong">{grade.courseName}</Text>
        <Text className="text-xs text-soft">{`共 ${grade.labs.length} 项实验`}</Text>
      </View>
      <View className="flex shrink-0 flex-col items-end gap-1">
        <Text className="text-lg text-strong">{grade.courseScore?.trim() || "待发布"}</Text>
        <Text className="text-xs text-soft">总评</Text>
      </View>
    </Card>
  )
}
