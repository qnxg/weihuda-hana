import type { ReactNode } from "react"
import { Image } from "@tarojs/components"
import { PALETTE } from "@/config/theme"
import { useTheme } from "@/hooks/theme"

/** 环形进度, 用 svg 图渲染 */
export default function Ring({ progress }: Readonly<{ progress: number }>): ReactNode {
  const { theme, mode } = useTheme()
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(1, Math.max(0, progress)))

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">`
    + `<circle cx="18" cy="18" r="${radius}" fill="none" stroke="${PALETTE.ink[mode]}" stroke-opacity="0.2" stroke-width="4"/>`
    + `<circle cx="18" cy="18" r="${radius}" fill="none" stroke="${PALETTE.primary[theme][mode]}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${circumference.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" transform="rotate(-90 18 18)"/>`
    + `</svg>`

  return (
    <Image
      className="h-4h w-4h"
      src={`data:image/svg+xml,${encodeURIComponent(svg)}`}
    />
  )
}
