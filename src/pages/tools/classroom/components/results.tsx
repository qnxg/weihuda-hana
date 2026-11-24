import type { RoomItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { cn } from "@/utils/cn"

/** 空教室列表 */
export default function Results({ rooms }: Readonly<{ rooms: readonly RoomItem[] }>): ReactNode {
  if (rooms.length === 0)
    return <Text className="py-6 text-center text-sm text-soft">所选节次暂无空教室</Text>

  return (
    <View className="flex flex-col">
      {rooms.map((item, index) => (
        <View
          key={item.name}
          className={cn(
            "flex flex-col gap-1 py-2",
            index < rooms.length - 1 && "border-b border-default",
          )}
        >
          <View className="flex items-center gap-2">
            <Text className="flex-1 text-sm text-strong">{item.name}</Text>
            <Text className="shrink-0 rounded-full bg-default px-1h py-1x text-xs leading-none text-soft">{item.type}</Text>
          </View>
          <Text className="text-xs text-soft">{`普通座位 ${item.seats} / 考试座位 ${item.examSeats}`}</Text>
        </View>
      ))}
    </View>
  )
}
