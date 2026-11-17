import { currentRoute, navigate } from "@/utils/navigate"
import { toast } from "@/utils/toast"

/** 验证页路径 */
const VERIFY_PAGE = "/pages/auth/index?mode=verify"

/** 验证页路由 */
const VERIFY_ROUTE = "pages/auth/index"

/** 需要二次验证: 提示并跳验证页, 已在验证页则不跳 */
export function requireVerify(): void {
  if (currentRoute() === VERIFY_ROUTE)
    return

  toast.info("请完成二次验证")
  navigate(VERIFY_PAGE)
}
