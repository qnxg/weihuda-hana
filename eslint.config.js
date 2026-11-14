import antfu from "@antfu/eslint-config"

export default antfu({
  type: "app",
  typescript: true,
  stylistic: {
    quotes: "double",
  },
  markdown: false,
  formatters: true,
})
