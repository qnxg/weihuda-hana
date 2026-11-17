import type { PropsWithChildren } from "react"
import { useLaunch } from "@tarojs/taro"
import { queryClient, QueryClientProvider } from "@/hooks/query"
import { initTheme } from "@/hooks/theme"
import { hydrateToken } from "@/utils/auth"
import { installAbortController } from "@/utils/request/abort"

import "./app.css"

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    installAbortController()
    hydrateToken()
    initTheme()
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default App
