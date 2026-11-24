import type { ReactNode } from "react"
import type { GradeGroup, LevelTone, StandardRow } from "@/pages/tools/physical-standard/model/standard"
import { Text, View } from "@tarojs/components"
import { gradeIndexOf, rowLevelOf } from "@/pages/tools/physical-standard/model/standard"
import { cn } from "@/utils/cn"

/** 等级色调 */
const TONE: Record<LevelTone, string> = {
  excellent: "bg-primary text-primary-strong",
  good: "raw:bg-sky-bg raw:text-sky-fgstrong",
  pass: "raw:bg-amber-bg raw:text-amber-fgstrong",
  fail: "bg-error text-error-strong",
}

export interface ScoreProps {
  /** 评分行 */
  rows: readonly StandardRow[]
  /** 年级组 */
  grade: GradeGroup
  /** 成绩单位 */
  unit: string
  /** 是否附加分 */
  bonus?: boolean
}

/** 评分表, 附加分不显示等级 */
export default function Score({ rows, grade, unit, bonus = false }: Readonly<ScoreProps>): ReactNode {
  const index = gradeIndexOf(grade)

  return (
    <View className="flex flex-col">
      <View className="flex items-center gap-2 border-b border-default pb-1">
        <Text className="w-3r shrink-0 text-xs text-soft">分值</Text>
        <Text className="flex-1 text-xs text-soft">{`成绩要求（${unit}）`}</Text>
        {!bonus && <Text className="w-4r shrink-0 text-center text-xs text-soft">等级</Text>}
      </View>

      {rows.map((row, order) => {
        const level = rowLevelOf(row)

        return (
          <View
            key={`${row.kind}-${row.score}-${row.category ?? ""}`}
            className={cn(
              "flex items-center gap-2 py-1",
              order < rows.length - 1 && "border-b border-default",
            )}
          >
            <Text className="w-3r shrink-0 text-sm text-strong">
              {bonus
                ? `+${row.score}`
                : row.score}
            </Text>
            <Text className="flex-1 text-sm text-default">{row.thresholds[index]}</Text>
            {!bonus && (
              <View className="w-4r flex shrink-0 justify-center">
                <Text className={cn("rounded-full px-1h py-1x text-xs leading-none", TONE[level.tone])}>
                  {level.label}
                </Text>
              </View>
            )}
          </View>
        )
      })}
    </View>
  )
}
