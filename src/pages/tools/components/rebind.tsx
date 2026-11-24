import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Button from "@/components/common/button"
import Dialog from "@/components/modal/dialog"
import { PAGE } from "@/config/page"
import { navigateTo } from "@/utils/navigate"

export interface RebindProps {
  /** 显隐 */
  visible: boolean
  /** 关闭 */
  onClose: () => void
}

/** 未绑定大物实验平台时的引导弹窗 */
export default function Rebind({ visible, onClose }: Readonly<RebindProps>): ReactNode {
  return (
    <Dialog
      visible={visible}
      title="需要绑定大物实验平台"
      onClose={onClose}
      footer={(
        <>
          <Button variant="outline" color="ink" className="flex-1 py-1" onClick={onClose}>
            <Text>稍后</Text>
          </Button>
          <Button
            className="flex-1 py-1"
            onClick={() => {
              onClose()
              navigateTo(PAGE.auth.lab)
            }}
          >
            <Text>去绑定</Text>
          </Button>
        </>
      )}
    >
      <Text className="text-sm text-default">
        绑定大物实验平台账号后, 才能查看实验安排与实验成绩.
      </Text>
    </Dialog>
  )
}
