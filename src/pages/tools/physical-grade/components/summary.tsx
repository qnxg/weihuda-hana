import type { PhysicalGrade } from "@contract/routes"
import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Card from "@/components/common/card"

/** 体测概览 */
export default function Summary({ grade }: Readonly<{ grade: PhysicalGrade }>): ReactNode {
  return (
    <Card className="flex items-center gap-2 border border-default p-3">
      <Text className="text-xs text-soft">总分</Text>
      <Text className="text-lg text-strong">{grade.score}</Text>
      <Text className="rounded-full bg-primary px-2 py-1 text-xs text-primary-strong">{grade.grade}</Text>
    </Card>
  )
}
