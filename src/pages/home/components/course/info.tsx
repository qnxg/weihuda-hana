import type { CourseItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Ring from "@/pages/home/components/course/ring"
import Status from "@/pages/home/components/course/status"
import { labelOf, periodOf, progressOf, timeOf } from "@/pages/home/components/course/text"

export interface InfoProps {
  /** 课程 */
  course: CourseItem
  /** 上课日期 */
  date: Date
  /** 当前时刻 */
  now: Date
}

/** 选中课程的信息 */
export default function Info({ course, date, now }: Readonly<InfoProps>): ReactNode {
  const { status, progress, minutes } = progressOf(course, date, now)

  return (
    <View className="flex items-center justify-between gap-2 border-b border-default pb-1h">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-lg text-strong">{course.courseName}</Text>
        <Text className="text-xs text-soft">
          {`${periodOf(course.time)} | ${timeOf(course.time)} | ${course.place ?? "暂无地点"} | ${course.teacher ?? "暂无教师"}`}
        </Text>
      </View>
      {minutes === undefined
        ? <Status status={status} />
        : (
            <View className="flex shrink-0 flex-col items-center gap-1">
              <Text className="text-xs text-soft">{labelOf(status)}</Text>
              <View className="relative">
                <Ring progress={progress} />
                <View className="absolute inset-0 flex items-center justify-center">
                  <Text className="text-xs text-primary-strong">{`${minutes}m`}</Text>
                </View>
              </View>
            </View>
          )}
    </View>
  )
}
