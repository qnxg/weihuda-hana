import antfu from "@antfu/eslint-config"

export default antfu({
  type: "app",
  typescript: true,
  react: true,
  stylistic: {
    quotes: "double",
  },
  markdown: false,
  formatters: true,
}).removeRules(
  "react-refresh/only-export-components",
)
