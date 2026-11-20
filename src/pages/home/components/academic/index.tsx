import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import { PAGE } from "@/config/page"
import Grade from "@/pages/home/components/academic/grade"
import Rank from "@/pages/home/components/academic/rank"
import Todo from "@/pages/home/components/academic/todo"
import { navigateTo } from "@/utils/navigate"

/** 学业服务 */
export default function Academic(): ReactNode {
  return (
    <View className="flex flex-col gap-1r">
      <View className="flex items-center justify-between gap-2">
        <Text className="text-lg text-strong">学业服务</Text>
        <Button
          variant="ghost"
          color="primary"
          className="px-1 py-0 text-xs"
          onClick={() => navigateTo(PAGE.debug.index)}
        >
          <Text>全部服务</Text>
        </Button>
      </View>
      <View className="flex flex-col gap-3">
        <Todo />
        <View className="flex gap-3">
          <Grade />
          <Rank />
        </View>
      </View>
    </View>
  )
}
