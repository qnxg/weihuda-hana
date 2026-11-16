import type { ChildProcess } from "node:child_process"
import type { Compiler } from "webpack"
import { spawn } from "node:child_process"
import { connect } from "node:net"
import path from "node:path"
import process from "node:process"
import { dotenvParse } from "@tarojs/helper"

const projectRoot = path.resolve(__dirname, "..")

let child: ChildProcess | null = null

/** 端口是否已有服务在听 */
function isListening(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ port, host: "localhost" })

    socket.setTimeout(300)
    socket.once("connect", () => {
      socket.destroy()
      resolve(true)
    })
    socket.once("error", () => resolve(false))
    socket.once("timeout", () => {
      socket.destroy()
      resolve(false)
    })
  })
}

/** 关掉子进程 */
function stop(): void {
  child?.kill()
  child = null
}

/** 以子进程方式拉起 server/ */
async function start(port: number): Promise<void> {
  if (child)
    return

  if (await isListening(port)) {
    console.warn(`mock: port ${port} in use, reuse it`)
    return
  }

  child = spawn(process.execPath, [
    "--import",
    "tsx",
    "--env-file-if-exists=.env",
    path.join(projectRoot, "server/index.ts"),
  ], { cwd: projectRoot, stdio: "inherit" })

  child.once("exit", () => {
    child = null
  })

  process.once("exit", stop)
  process.once("SIGINT", stop)
  process.once("SIGTERM", stop)
}

/** watch 构建时拉起 mock 服务 */
export class MockServer {
  apply(compiler: Compiler): void {
    compiler.hooks.watchRun.tap("mock-server", () => {
      if (child)
        return

      const parsed = dotenvParse(projectRoot)

      if (parsed.TARO_APP_MOCK !== "true")
        return

      void start(Number(parsed.TARO_APP_MOCK_PORT ?? 9300))
    })
  }
}
