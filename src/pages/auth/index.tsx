import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Login from "@/pages/auth/components/login"
import Verify from "@/pages/auth/components/verify"
import { navigateBack } from "@/utils/navigate"

/** 鉴权页模式 */
type AuthMode = "login" | "verify"

/** 鉴权页 */
export default function Auth(): ReactNode {
  const router = useRouter()
  const mode: AuthMode = router.params.mode === "verify"
    ? "verify"
    : "login"

  return (
    <Page title="鉴权">
      <Main>
        <View className="py-1r flex flex-col gap-3">
          {mode === "login" && <Login onBack={navigateBack} />}
          {mode === "verify" && <Verify onBack={navigateBack} />}
        </View>
      </Main>
    </Page>
  )
}
