import { announcement } from "@server/routes/announcement"
import { auth } from "@server/routes/auth"
import { card } from "@server/routes/card"
import { course } from "@server/routes/course"
import { dorm } from "@server/routes/dorm"
import { email } from "@server/routes/email"
import { exam } from "@server/routes/exam"
import { grade } from "@server/routes/grade"
import { netflow } from "@server/routes/netflow"
import { point } from "@server/routes/point"
import { rank } from "@server/routes/rank"
import { root } from "@server/routes/root"
import { semester } from "@server/routes/semester"

export const route = {
  root,
  auth,
  announcement,
  semester,
  exam,
  grade,
  rank,
  point,
  email,
  card,
  dorm,
  netflow,
  course,
}

export * from "@server/routes/announcement"
export * from "@server/routes/auth"
export * from "@server/routes/card"
export * from "@server/routes/course"
export * from "@server/routes/dorm"
export * from "@server/routes/email"
export * from "@server/routes/exam"
export * from "@server/routes/grade"
export * from "@server/routes/netflow"
export * from "@server/routes/point"
export * from "@server/routes/rank"
export * from "@server/routes/root"
export * from "@server/routes/semester"
