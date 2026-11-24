import { announcement } from "@contract/routes/announcement"
import { auth } from "@contract/routes/auth"
import { card } from "@contract/routes/card"
import { course } from "@contract/routes/course"
import { dorm } from "@contract/routes/dorm"
import { email } from "@contract/routes/email"
import { exam } from "@contract/routes/exam"
import { experiment } from "@contract/routes/experiment"
import { grade } from "@contract/routes/grade"
import { netflow } from "@contract/routes/netflow"
import { physical } from "@contract/routes/physical"
import { point } from "@contract/routes/point"
import { rank } from "@contract/routes/rank"
import { room } from "@contract/routes/room"
import { root } from "@contract/routes/root"
import { semester } from "@contract/routes/semester"
import { todo } from "@contract/routes/todo"

export const contract = {
  root,
  auth,
  announcement,
  semester,
  exam,
  experiment,
  todo,
  grade,
  rank,
  physical,
  point,
  email,
  card,
  course,
  dorm,
  netflow,
  room,
}

export * from "@contract/routes/announcement"
export * from "@contract/routes/auth"
export * from "@contract/routes/card"
export * from "@contract/routes/course"
export * from "@contract/routes/dorm"
export * from "@contract/routes/email"
export * from "@contract/routes/exam"
export * from "@contract/routes/experiment"
export * from "@contract/routes/grade"
export * from "@contract/routes/model"
export * from "@contract/routes/netflow"
export * from "@contract/routes/physical"
export * from "@contract/routes/point"
export * from "@contract/routes/rank"
export * from "@contract/routes/room"
export * from "@contract/routes/root"
export * from "@contract/routes/semester"
export * from "@contract/routes/todo"
