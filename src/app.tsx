import type { PropsWithChildren } from "react"
import { queryClient, QueryClientProvider } from "@/hooks/query"

import "./app.css"

function App({ children }: PropsWithChildren<any>) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default App
