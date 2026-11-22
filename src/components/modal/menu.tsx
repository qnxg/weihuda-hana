import type { ReactElement, ReactNode } from "react"
import type { IconProps } from "@/components/common/icon"
import { getWindowInfo } from "@tarojs/taro"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Overlay from "@/components/modal/overlay"
import { DURATION } from "@/config/duration"
import { useModalPresence } from "@/hooks/modal"
import { cn } from "@/utils/cn"

/** 菜单宽度 */
const WIDTH = 144

/** 行高, Cell 的 py-1h 加一行 text-sm 再加底部分隔线 */
const HEIGHT = 29

/** 面板上下内边距 */
const PADDING = 8

/** 与触点及屏幕边缘的间距 */
const OFFSET = 8

/** 操作项 */
export interface MenuItem {
  /** 图标 */
  icon?: ReactElement<IconProps>
  /** 文本 */
  text: string
  /** 危险操作 */
  danger?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 点击回调, 在关闭前执行 */
  onClick?: () => void
}

export interface MenuProps {
  /** 显隐 */
  visible: boolean
  /** 锚点, 视口坐标 */
  at: { x: number, y: number } | null
  /** 操作项 */
  items: readonly MenuItem[]
  /** 关闭 */
  onClose?: () => void
  /** 面板样式 */
  className?: string
}

/** 落点与动画原点, 越界翻向触点另一侧 */
function placeOf(at: { x: number, y: number }, height: number): { left: number, top: number, origin: string } {
  const { windowWidth, windowHeight } = getWindowInfo()
  const flipX = at.x + OFFSET + WIDTH > windowWidth - OFFSET
  const flipY = at.y + OFFSET + height > windowHeight - OFFSET
  const left = flipX
    ? at.x - OFFSET - WIDTH
    : at.x + OFFSET
  const top = flipY
    ? at.y - OFFSET - height
    : at.y + OFFSET

  return {
    left: Math.max(OFFSET, Math.min(left, windowWidth - WIDTH - OFFSET)),
    top: Math.max(OFFSET, Math.min(top, windowHeight - height - OFFSET)),
    origin: `${flipX ? "right" : "left"} ${flipY ? "bottom" : "top"}`,
  }
}

/** 锚定菜单, 在触点上浮出 */
export default function Menu({ visible, at, items, onClose, className }: Readonly<MenuProps>): ReactNode {
  useModalPresence(visible && at !== null, (active) => {
    if (!at)
      return null

    const height = items.length * HEIGHT + PADDING * 2
    const { left, top, origin } = placeOf(at, height)

    function select(item: MenuItem): void {
      item.onClick?.()
      onClose?.()
    }

    return (
      <Overlay active={active} dim={false} className="pointer-events-none h-full w-full" onClick={onClose}>
        <Card
          className={cn("absolute flex flex-col border border-default p-1h pointer-events-auto", className)}
          style={{
            left,
            top,
            width: WIDTH,
            opacity: active ? 1 : 0,
            transform: active ? "scale(1)" : "scale(0.9)",
            transformOrigin: origin,
            transition: `opacity ${DURATION.transition}ms ease-out, transform ${DURATION.transition}ms ease-out`,
          }}
        >
          {items.map((item, index) => (
            <Cell
              key={item.text}
              title={item.text}
              icon={item.icon}
              color={item.danger ? "error" : "ink"}
              disabled={item.disabled}
              border={index < items.length - 1}
              className="px-2 py-2"
              onClick={() => select(item)}
            />
          ))}
        </Card>
      </Overlay>
    )
  })

  return null
}
