import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { navigateBack, useRouter } from "@tarojs/taro"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Login from "@/pages/auth/components/login"
import Verify from "@/pages/auth/components/verify"
import { navigate } from "@/utils/navigate"

/** 鉴权页模式 */
type AuthMode = "login" | "verify"

/** 回到来源页 */
function back(): void {
  navigateBack().catch(() => navigate("/pages/home/index"))
}

/** 鉴权页 */
export default function Auth(): ReactNode {
  const router = useRouter()
  const mode: AuthMode = router.params.mode === "verify"
    ? "verify"
    : "login"

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
