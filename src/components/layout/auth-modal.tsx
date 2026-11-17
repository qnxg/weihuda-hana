import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Button from "@/components/common/button"
import Dialog from "@/components/modal/dialog"
import { useAuthPrompt } from "@/hooks/auth"

/** 鉴权弹窗, 挂到模态层, 由状态驱动 */
export default function AuthModal(): ReactNode {
  const { showing, confirm, cancel } = useAuthPrompt()

  return (
    <>
      <Dialog
        visible={showing === "loginLost"}
        title="登录态已失效"
        footer={<Button className="flex-1 py-1" onClick={confirm}>去登录</Button>}
      >
        <Text className="text-sm text-soft">登录状态已失效, 请重新登录</Text>
      </Dialog>

      <Dialog
        visible={showing === "verify"}
        title="需要双因子验证"
        onClose={cancel}
        footer={(
          <>
            <Button variant="ghost" color="ink" className="flex-1 py-1" onClick={cancel}>取消</Button>
            <Button className="flex-1 py-1" onClick={confirm}>去验证</Button>
          </>
        )}
      >
        <Text className="text-sm text-soft">双因子认证已失效, 请重新认证</Text>
      </Dialog>
    </>
  )
}
