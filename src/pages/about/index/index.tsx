import type { ReactNode } from "react"
import { Image, Text, View } from "@tarojs/components"
import { setClipboardData, useDidHide, useDidShow } from "@tarojs/taro"
import { useEffect, useState } from "react"
import { api } from "@/apis"
import Logo from "@/assets/about/logo.jpg"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { DURATION } from "@/config/duration"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useTyping } from "@/pages/about/hooks/typing"
import { ABOUT_FALLBACK, copyrightOf, hostOf } from "@/pages/about/model/about"
import { cn } from "@/utils/cn"
import { navigateTo } from "@/utils/navigate"
import { toast } from "@/utils/toast"

/** 复制链接并提示 */
async function copy(url: string): Promise<void> {
  try {
    await setClipboardData({ data: url })
    toast.success("链接已复制, 请在浏览器打开")
  }
  catch {
    toast.error("复制失败")
  }
}

/** 关于 */
export default function About(): ReactNode {
  const query = useQuery({
    queryKey: QUERY_KEY.root.about,
    queryFn: ({ signal }) => api.root.about(signal),
  })

  const slogans = query.data?.slogans?.length
    ? query.data.slogans
    : ABOUT_FALLBACK.slogans
  const version = query.data?.version || ABOUT_FALLBACK.version
  const home = query.data?.home || ABOUT_FALLBACK.home
  const join = query.data?.join || ABOUT_FALLBACK.join
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [spin, setSpin] = useState(0)
  const [flipping, setFlipping] = useState(false)

  const slogan = slogans[index % slogans.length]
  const { displayed } = useTyping(slogan, {
    initialDelay: 5,
    typingSpeed: 100,
    deletingSpeed: 50,
    enabled: visible,
  })

  useDidShow(() => {
    setVisible(true)
    setFlipping(true)
    setSpin(current => current + 1)
  })

  useDidHide(() => {
    setVisible(false)
    setFlipping(false)
  })

  useEffect(() => {
    if (!flipping)
      return

    const timer = setTimeout(setFlipping, DURATION.flip, false)
    return () => clearTimeout(timer)
  }, [flipping, spin])

  function flip(): void {
    if (flipping)
      return

    setFlipping(true)
    setSpin(current => current + 1)
  }

  return (
    <Page title="关于">
      <Main>
        <Scroll>
          <View className="flex flex-col gap-3 py-2r">
            <View className="flex flex-col items-center gap-2 py-2r">
              <View className="relative mb-2 flex items-center justify-center">
                <View
                  key={spin}
                  className={cn(
                    "h-4r w-4r overflow-hidden rounded-lg",
                    flipping && "flip-in",
                  )}
                  onClick={flip}
                >
                  <Image src={Logo} mode="aspectFill" className="h-full w-full" />
                </View>
              </View>
              <Text className="text-base text-strong">湖南大学微生活</Text>
              <View
                className="flex items-center gap-1"
                onClick={() => setIndex(current => current + 1)}
              >
                <Text className="text-primary">{"<"}</Text>
                <Text className="text-xs text-soft">{displayed || " "}</Text>
                <Text className="text-primary">{"/>"}</Text>
              </View>
            </View>

            <Card className="overflow-hidden border border-default p-0">
              <Cell title="版本" description={version} />
              <Cell
                title="官网"
                description={hostOf(home)}
                link
                onClick={() => void copy(home)}
              />
              <Cell
                title="招新"
                description={hostOf(join)}
                border={false}
                link
                onClick={() => void copy(join)}
              />
            </Card>

            <Card className="overflow-hidden border border-default p-0">
              <Cell
                title="开源许可"
                link
                onClick={() => navigateTo(PAGE.about.credit)}
              />
              <Cell
                title="隐私政策"
                border={false}
                link
                onClick={() => navigateTo(PAGE.about.privacy)}
              />
            </Card>

            <Text className="py-1 text-center text-xs text-soft">{copyrightOf()}</Text>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
