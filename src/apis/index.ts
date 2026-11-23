import { announcement } from "@/apis/announcement"
import { auth } from "@/apis/auth"
import { card } from "@/apis/card"
import { course } from "@/apis/course"
import { dorm } from "@/apis/dorm"
import { email } from "@/apis/email"
import { exam } from "@/apis/exam"
import { experiment } from "@/apis/experiment"
import { grade } from "@/apis/grade"
import { netflow } from "@/apis/netflow"
import { physical } from "@/apis/physical"
import { point } from "@/apis/point"
import { rank } from "@/apis/rank"
import { root } from "@/apis/root"
import { semester } from "@/apis/semester"
import { todo } from "@/apis/todo"

export const api = {
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
}
