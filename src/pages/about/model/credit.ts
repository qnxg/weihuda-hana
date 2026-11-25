/** 依赖条目 */
export interface CreditItem {
  /** 名称 */
  name: string
  /** 用途 */
  description: string
  /** 许可协议 */
  license: string
}

/** 依赖分组 */
export interface CreditSection {
  /** 分组标题 */
  title: string
  /** 条目 */
  items: readonly CreditItem[]
}

/** 依赖清单, 按用途分组 */
export const CREDITS: readonly CreditSection[] = [
  {
    title: "框架",
    items: [
      {
        name: "Taro",
        description: "跨端跨框架的编译方案, 本项目以微信小程序为目标平台",
        license: "MIT",
      },
      {
        name: "Preact",
        description: "轻量的视图库, 由 Taro 渲染为小程序组件",
        license: "MIT",
      },
      {
        name: "TypeScript",
        description: "JavaScript 的类型化超集, 在编译期做静态检查",
        license: "Apache-2.0",
      },
    ],
  },
  {
    title: "运行时库",
    items: [
      {
        name: "@tanstack/preact-query",
        description: "服务端状态与请求缓存",
        license: "MIT",
      },
      {
        name: "zustand",
        description: "轻量状态容器, 承载本地状态",
        license: "MIT",
      },
      {
        name: "zod",
        description: "运行时校验与类型推导, 驱动表单与契约",
        license: "MIT",
      },
      {
        name: "@xtwis/ohday",
        description: "易千自研的链式日期时间处理库",
        license: "MIT",
      },
      {
        name: "@xtwis/ohnet",
        description: "易千自研的网络请求库, 提供适配器与中间件",
        license: "MIT",
      },
      {
        name: "@sapporta/rest-core",
        description: "接口契约的类型描述工具, 前后端共用",
        license: "MIT",
      },
      {
        name: "tunewind",
        description: "由设计令牌生成工具类, 支撑主题与色阶",
        license: "MIT",
      },
      {
        name: "tailwind-merge",
        description: "合并冲突的工具类名",
        license: "MIT",
      },
      {
        name: "lucide-react-taro",
        description: "图标集, 适配小程序组件",
        license: "ISC",
      },
    ],
  },
  {
    title: "工具链",
    items: [
      {
        name: "Hono",
        description: "轻量服务端框架, 用于本地 mock 服务",
        license: "MIT",
      },
      {
        name: "ESLint",
        description: "静态检查工具",
        license: "MIT",
      },
      {
        name: "@antfu/eslint-config",
        description: "开箱即用的 ESLint 预设, 统一代码风格",
        license: "MIT",
      },
      {
        name: "husky",
        description: "Git 钩子管理, 提交前执行检查",
        license: "MIT",
      },
      {
        name: "commitlint",
        description: "校验提交信息格式",
        license: "MIT",
      },
      {
        name: "tsx",
        description: "直接运行 TypeScript, 用于启动 mock 服务与构建脚本",
        license: "MIT",
      },
    ],
  },
]
