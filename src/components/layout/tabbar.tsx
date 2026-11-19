import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { getCurrentPages } from "@tarojs/taro"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import { TABBAR } from "@/config/tabbar"
import { navigateTo } from "@/utils/navigate"

/** 当前页面路径, 与 app.config 的 pages 一致 */
function currentPath(): string {
  const pages = getCurrentPages()
  return pages[pages.length - 1]?.route ?? ""
}

export default function Tabbar(): ReactNode {
  const active = currentPath()

  return (
    <View className="shrink-0 border-t border-default bg-default">
      <View className="h-4r flex">
        {TABBAR.map(({ path, text, icon }) => {
          const selected = path === `/${active}`

          return (
            <Button
              key={path}
              variant="ghost"
              color={selected ? "primary" : "ink"}
              className="flex-1 flex-col gap-1"
              onClick={() => {
                if (!selected)
                  navigateTo(path)
              }}
            >
              <Icon icon={icon} color={selected ? "primary" : "ink"} className="h-3h w-3h" />
              <Text className="text-xs">{text}</Text>
            </Button>
          )
        })}
      </View>
    </View>
  )
}
