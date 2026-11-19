import type { ReactNode } from "react"
import { ENV } from "@shared/env"
import { Text } from "@tarojs/components"
import Button from "@/components/common/button"
import { PAGE } from "@/config/page"
import { navigateTo } from "@/utils/navigate"

/** 调试入口 */
export default function Debug(): ReactNode {
  if (!ENV.debug)
    return null

  return (
    <Button
      className="absolute bottom-2r right-2r pointer-events-auto px-2 py-1 text-xs"
      onClick={() => navigateTo(PAGE.debug.index)}
    >
      <Text>调试</Text>
    </Button>
  )
}
