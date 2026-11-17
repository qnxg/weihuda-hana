import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { navigateBack, useLoad } from "@tarojs/taro"
import { useState } from "react"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Login from "@/pages/auth/components/login"
import Verify from "@/pages/auth/components/verify"
import { hasToken } from "@/utils/auth"
import { navigate } from "@/utils/navigate"

/** 鉴权页模式 */
type AuthMode = "login" | "verify"

/** 回到来源页 */
function back(): void {
  navigateBack().catch(() => navigate("/pages/home/index"))
}

/** 鉴权页 */
export default function Auth(): ReactNode {
  const [mode, setMode] = useState<AuthMode | null>(null)

  useLoad((params) => {
    const next = params.mode === "verify"
      ? "verify"
      : "login"
    setMode(next)

    if (next === "login" && hasToken())
      back()
  })

  return (
    <Page>
      <Main>
        <View className="py-1r flex flex-col gap-3">
          {mode === "login" && <Login onBack={back} />}
          {mode === "verify" && <Verify onBack={back} />}
        </View>
      </Main>
    </Page>
  )
}
