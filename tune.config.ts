import type { TuneConfig } from "tunewind"
import { defineConfig } from "tunewind"

type Scheme = NonNullable<NonNullable<TuneConfig["theme"]>["schemes"]>[string]
type Primary = NonNullable<Scheme["palette"]>[string]

/** 按主题名生成浅色或深色的一个方案 */
function createTheme(name: string, primary: Primary, isDark = false): Record<string, Scheme> {
  const scheme: Scheme = {
    palette: { primary },
  }

  if (isDark) {
    scheme.prefix = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    scheme.shade = {
      default: 300,
      strong: 200,
      surface: 700,
    }
  }

  return { [name]: scheme }
}

export default defineConfig({
  theme: {
    palette: {
      primary: "amber",
      error: "rose",
      ink: "slate",
    },
    shade: {
      default: 600,
      strong: 800,
      surface: 200,
    },
    opacity: {
      default: 100,
      weak: 90,
      soft: 50,
      ghost: 20,
    },
    schemes: {
      ...createTheme("spring", "emerald"),
      ...createTheme("springDark", "emerald", true),
      ...createTheme("summer", "sky"),
      ...createTheme("summerDark", "sky", true),
      ...createTheme("autumn", "amber"),
      ...createTheme("autumnDark", "amber", true),
    },
  },
  size: {
    max: 8,
    step: 0.5,
    units: {
      default: "4px",
      x: "1px",
      r: "1rem",
    },
  },
  strict: "bypass",
  diagnostics: "warn",
})
