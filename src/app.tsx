import type { PropsWithChildren } from "react"
import { useLaunch } from "@tarojs/taro"
import { queryClient, QueryClientProvider } from "@/hooks/query"
import { initTheme } from "@/hooks/theme"

import "./app.css"

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => initTheme())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default App
