import type { IconProps } from "lucide-react-taro"
import type { FC } from "react"
import type { BadgeTint } from "@/config/theme"
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  DoorOpen,
  Dumbbell,
  FlaskConical,
  GraduationCap,
  Mail,
  Medal,
  Microscope,
  Ruler,
  Trophy,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react-taro"

/** 入口图标与颜色 */
export interface EntryTint {
  /** 图标 */
  icon: FC<IconProps>
  /** 图标颜色 */
  color: BadgeTint
}

/** 入口图标与颜色映射, 调用点只写语义键 */
export const ENTRY_TINT = {
  grade: { icon: GraduationCap, color: "emerald" },
  experimentGrade: { icon: FlaskConical, color: "sky" },
  physicalGrade: { icon: Dumbbell, color: "teal" },
  rank: { icon: Medal, color: "orange" },
  physicalStandard: { icon: Ruler, color: "orange" },
  experimentSchedule: { icon: Microscope, color: "cyan" },
  examSchedule: { icon: CalendarCheck, color: "indigo" },
  calendar: { icon: CalendarDays, color: "fuchsia" },
  classroom: { icon: DoorOpen, color: "violet" },
  card: { icon: Wallet, color: "sky" },
  netflow: { icon: Wifi, color: "indigo" },
  electricity: { icon: Zap, color: "teal" },
  point: { icon: Trophy, color: "violet" },
  email: { icon: Mail, color: "cyan" },
  todo: { icon: CalendarClock, color: "fuchsia" },
} as const satisfies Record<string, EntryTint>

/** 入口语义键 */
export type EntryTintKey = keyof typeof ENTRY_TINT
