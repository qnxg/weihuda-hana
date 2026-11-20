import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import { PAGE } from "@/config/page"
import Balance from "@/pages/home/components/campus/balance"
import Email from "@/pages/home/components/campus/email"
import Flow from "@/pages/home/components/campus/flow"
import Point from "@/pages/home/components/campus/point"
import Power from "@/pages/home/components/campus/power"
import { navigateTo } from "@/utils/navigate"

/** 校园生活 */
export default function Campus(): ReactNode {
  return (
    <View className="flex flex-col gap-1r">
      <View className="flex items-center justify-between gap-2">
        <Text className="text-lg text-strong">校园生活</Text>
        <Button
          variant="ghost"
          color="ink"
          className="px-1 py-0 text-xs"
          onClick={() => navigateTo(PAGE.debug.index)}
        >
          <Text>全部服务</Text>
        </Button>
      </View>
      <View className="flex gap-3">
        <Balance />
        <Power />
      </View>
      <View className="flex gap-3">
        <Point />
        <Email />
      </View>
      <View className="flex">
        <Flow />
      </View>
    </View>
  )
}
