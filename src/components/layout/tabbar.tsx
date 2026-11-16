import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { getCurrentPages } from "@tarojs/taro"
import Icon from "@/components/common/icon"
import { tabbar } from "@/config/tabbar"
import { navigate } from "@/utils/navigate"

/** 当前页面路径, 与 app.config 的 pages 一致 */
function currentPath(): string {
  const pages = getCurrentPages()
  return pages[pages.length - 1]?.route ?? ""
}

export default function Tabbar(): ReactNode {
  const active = currentPath()

  return (
    <View className="h-4r shrink-0 flex border-t border-default bg-default">
      {tabbar.map(({ path, text, icon }) => {
        const selected = path === active

        return (
          <View
            key={path}
            className="flex-1 flex flex-col items-center justify-center gap-1"
            onClick={() => {
              if (!selected)
                navigate(`/${path}`)
            }}
          >
            <Icon
              icon={icon}
              color={selected ? "primary" : "ink"}
              className="h-3h w-3h"
            />
            <Text className={`text-xs ${selected ? "text-primary" : "text-soft"}`}>{text}</Text>
          </View>
        )
      })}
    </View>
  )
}
