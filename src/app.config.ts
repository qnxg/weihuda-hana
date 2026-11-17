export default defineAppConfig({
  pages: [
    "pages/home/index",
    "pages/kit/index",
    "pages/table/index",
    "pages/profile/index",
  ],
  subPackages: [
    {
      // 调试子包
      root: "packages/debug",
      pages: [
        "pages/index/index",
        "pages/theme/index",
        "pages/comp/index",
      ],
    },
  ],
  tabBar: {
    custom: true,
    color: "#94a3b8",
    selectedColor: "#d97706",
    backgroundColor: "#ffffff",
    list: [
      { pagePath: "pages/home/index", text: "首页" },
      { pagePath: "pages/kit/index", text: "工具箱" },
      { pagePath: "pages/table/index", text: "课表" },
      { pagePath: "pages/profile/index", text: "我的" },
    ],
  },
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
})
