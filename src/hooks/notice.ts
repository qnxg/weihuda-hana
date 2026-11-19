import type { ReactNode } from "react"
import type { NoticeEntry } from "@/types/notice"
import { od } from "@xtwis/ohday"
import { useEffect, useState } from "react"
import { DURATION } from "@/config/duration"
import { useNoticeStore } from "@/stores/notice"

/** 刷新间隔 */
const tick = 50

/** 到期计时 */
export function useExpire(
  item: { startAt: number, duration: number } | null,
  onExpire: () => void,
): number {
  const [now, setNow] = useState(() => od().ts)

  useEffect(() => {
    if (!item)
      return

    const initial = setTimeout(() => setNow(od().ts), 0)

    const timer = setInterval(() => {
      const time = od().ts
      setNow(time)

      if (item.duration === 0) {
        if (time - item.startAt >= DURATION.animation)
          clearInterval(timer)
        return
      }

      if (time >= item.startAt + item.duration)
        onExpire()
    }, tick)

    return () => {
      clearTimeout(initial)
      clearInterval(timer)
    }
  }, [item, onExpire])

  return now
}

export interface UseNoticeResult {
  /** 提示列表 */
  entries: NoticeEntry[]
  /** 挂载节点 */
  mount: (node: ReactNode) => string
  /** 卸载节点 */
  unmount: (id: string) => void
}

/** 提示层状态 */
export function useNotice(): UseNoticeResult {
  const entries = useNoticeStore(state => state.entries)
  const mount = useNoticeStore(state => state.mount)
  const unmount = useNoticeStore(state => state.unmount)

  return { entries, mount, unmount }
}
