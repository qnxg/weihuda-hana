import type { Building, contract, RoomItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const buildings: Building[] = [
  { id: "106", name: "综合楼", description: null },
  { id: "302", name: "研究生楼", description: null },
  { id: "102", name: "复临舍", description: null },
  { id: "123", name: "中楼", description: null },
  { id: "122", name: "东楼", description: null },
  { id: "201", name: "梯教", description: "北校区" },
  { id: "202", name: "二教楼", description: "北校区" },
  { id: "204", name: "水上教学楼", description: "北校区" },
]

interface MockRoom extends RoomItem {
  /** 被占用的节次 */
  unavailable: readonly number[]
}

const rooms: readonly MockRoom[] = [
  {
    name: "101",
    type: "多媒体教室",
    seats: 48,
    examSeats: 30,
    unavailable: [12],
  },
  {
    name: "103",
    type: "普通教室",
    seats: 54,
    examSeats: 40,
    unavailable: [1],
  },
  {
    name: "105",
    type: "阶梯教室",
    seats: 96,
    examSeats: 72,
    unavailable: [3, 4],
  },
  {
    name: "201",
    type: "智慧教室",
    seats: 40,
    examSeats: 36,
    unavailable: [5, 6],
  },
  {
    name: "203",
    type: "研讨教室",
    seats: 24,
    examSeats: 20,
    unavailable: [2],
  },
  {
    name: "205",
    type: "制图教室",
    seats: 36,
    examSeats: 30,
    unavailable: [7, 8],
  },
  {
    name: "305",
    type: "普通教室",
    seats: 60,
    examSeats: 45,
    unavailable: [9, 10, 11],
  },
  {
    name: "307",
    type: "多媒体教室",
    seats: 48,
    examSeats: 36,
    unavailable: [4, 12],
  },
  {
    name: "309",
    type: "智慧教室",
    seats: 40,
    examSeats: 36,
    unavailable: [1, 12],
  },
  {
    name: "401",
    type: "阶梯教室",
    seats: 90,
    examSeats: 68,
    unavailable: [6, 7],
  },
  {
    name: "403",
    type: "研讨教室",
    seats: 28,
    examSeats: 24,
    unavailable: [3, 5],
  },
  {
    name: "B101",
    type: "计算机房",
    seats: 70,
    examSeats: 51,
    unavailable: [8, 9],
  },
]

/** 首个节次所在的大节 */
function majorOf(time: number): number {
  if (time <= 8)
    return Math.ceil(time / 2)

  return time <= 11
    ? 5
    : 6
}

export const roomHandlers: Handlers<typeof contract.room> = {
  buildings: () => ok(buildings),
  list: ({ query }) => {
    const building = buildings.find(item => item.id === query.building)
    const times = query.times.split(",").map(Number)

    return ok({
      time: majorOf(times[0] ?? 1),
      items: building
        ? rooms
            .filter(item => times.every(time => !item.unavailable.includes(time)))
            .map(item => ({
              name: `${building.name} ${item.name}`,
              type: item.type,
              seats: item.seats,
              examSeats: item.examSeats,
            }))
        : [],
    })
  },
}

export { roomHandlers as room }
