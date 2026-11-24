import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Lab from "@/pages/auth/components/lab"
import Login from "@/pages/auth/components/login"
import Verify from "@/pages/auth/components/verify"
import { navigateBack } from "@/utils/navigate"

/** 鉴权页模式 */
type AuthMode = "login" | "verify" | "lab"

/** 模式对应标题 */
const TITLE: Record<AuthMode, string> = {
  login: "鉴权",
  verify: "鉴权",
  lab: "大物实验平台",
}

/** 解析模式 */
function modeOf(value: string | undefined): AuthMode {
  if (value === "verify")
    return "verify"

  return value === "lab"
    ? "lab"
    : "login"
}

/** 鉴权页 */
export default function Auth(): ReactNode {
  const router = useRouter()
  const mode = modeOf(router.params.mode)

  return (
    <Page title={TITLE[mode]}>
      <Main>
        <Scroll>
          <View className="py-1r flex flex-col gap-3">
            {mode === "login" && <Login onBack={navigateBack} />}
            {mode === "verify" && <Verify onBack={navigateBack} />}
            {mode === "lab" && <Lab onBack={navigateBack} />}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
