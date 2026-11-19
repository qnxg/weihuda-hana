import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import { CalendarCheck, Check } from "lucide-react-taro"
import { useEffect, useRef, useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import { DURATION } from "@/config/duration"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"
import { navigateTo } from "@/utils/navigate"

/** 签到按钮 */
export default function Sign(): ReactNode {
  const [ticked, setTicked] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const point = useQuery({
    queryKey: QUERY_KEY.point.get,
    queryFn: ({ signal }) => api.point.get(signal),
  })

  useRefreshable(QUERY_KEY.point.get)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const check = useMutation({
    mutationFn: () => api.point.check(),
    onSuccess: () => {
      setTicked(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(setTicked, DURATION.toast, false)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.get })
    },
  })

  if (point.isLoading)
    return null

  const done = point.data?.checked === true || check.isSuccess

  return (
    <Button
      variant={done ? "outline" : "solid"}
      color={done ? "primary" : "ink"}
      className={done
        ? "h-4h rounded-full px-1h"
        : "h-4h rounded-full bg-primary-invert px-1h text-invert"}
      icon={<Icon icon={ticked ? Check : CalendarCheck} color={done ? "primary" : "invert"} className="h-2h w-2h" />}
      loading={check.isPending}
      onClick={() => {
        if (done)
          navigateTo(PAGE.debug.index)
        else
          check.mutate()
      }}
    >
      <Text className="text-sm">
        {check.isPending
          ? "签到中"
          : done ? "已签到" : "未签到"}
      </Text>
    </Button>
  )
}
