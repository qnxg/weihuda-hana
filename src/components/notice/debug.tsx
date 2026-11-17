import type { ReactNode } from "react"
import { env } from "@shared/env"
import { Text } from "@tarojs/components"
import Button from "@/components/common/button"
import { navigate } from "@/utils/navigate"

/** 调试入口 */
export default function Debug(): ReactNode {
  if (!env.debug)
    return null

  return (
    <Button
      className="absolute bottom-2r right-2r pointer-events-auto px-2 py-1 text-xs"
      onClick={() => navigate("/packages/debug/pages/index/index")}
    >
      <Text>调试</Text>
    </Button>
  )
}
