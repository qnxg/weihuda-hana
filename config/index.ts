import type { Compiler } from "webpack"
import path from "node:path"
import { defineConfig } from "@tarojs/cli"
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin"
import { WeappTailwindcss } from "weapp-tailwindcss/webpack"
import { MockServer } from "./mock"
import { reportTuneDiagnostics, tune } from "./tune"

const projectRoot = path.resolve(__dirname, "..")

const weappTailwindcssOptions = {
  cssOptions: {
    rem2rpx: true,
  },
  tailwindcssBasedir: projectRoot,
  cssEntries: [
    path.resolve(projectRoot, "src/app.css"),
  ],
  postcssOptions: {
    plugins: [
      tune(),
    ],
  },
}

class TuneReport {
  apply(compiler: Compiler): void {
    compiler.hooks.done.tap("tune-report", () => {
      reportTuneDiagnostics()
    })
  }
}

export default defineConfig<"webpack5">({
  projectName: "weihuda-hana",
  date: "2026-11-14",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    375: 2,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [
    "@tarojs/plugin-generator",
  ],
  framework: "preact",
  compiler: "webpack5",
  logger: {
    quiet: false,
    stats: true,
  },
  cache: {
    enable: false,
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: "module",
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    webpackChain(chain) {
      chain.resolve.plugin("tsconfig-paths").use(TsconfigPathsPlugin)
      chain.plugin("tune-report").use(TuneReport)
      chain.plugin("mock-server").use(MockServer)
      chain.merge({
        plugin: {
          install: {
            plugin: WeappTailwindcss,
            args: [weappTailwindcssOptions],
          },
        },
      })
    },
  },
})
