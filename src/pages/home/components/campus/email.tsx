import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import { Mail } from "lucide-react-taro"
import Skeleton from "@/components/common/skeleton"
import Panel from "@/pages/home/components/campus/panel"
import Value from "@/pages/home/components/campus/value"
import { useEmail } from "@/pages/home/hooks/campus"

/** 邮箱未绑定时的提示 */
const UNBOUND = "获取失败, 请到\"个人门户/安全中心\"绑定邮箱"

/** 邮件 */
export default function Email(): ReactNode {
  const { count, failed, loading } = useEmail()

  return (
    <Panel icon={Mail} title="邮件" color="cyan">
      {failed
        ? <Text className="text-xs text-soft">{UNBOUND}</Text>
        : loading || count === undefined
          ? (
              <>
                <Skeleton className="h-4h w-8r bg-ink-line" />
                <Skeleton className="h-2 w-full bg-ink-line" />
              </>
            )
          : (
              <>
                <Value value={count} unit="封" digits={0} />
                <Text className="text-xs text-soft">未读邮件</Text>
              </>
            )}
    </Panel>
  )
}
