import type { TuneConfig } from "tunewind"
import { defineConfig } from "tunewind"

type Scheme = NonNullable<NonNullable<TuneConfig["theme"]>["schemes"]>[string]
type Primary = NonNullable<Scheme["palette"]>[string]
type Shade = NonNullable<Scheme["shade"]>

/** 浅色方案的语义色阶 */
const light: Shade = {
  fg: 600,
  fgsoft: 400,
  fgstrong: 800,
  fginvert: 50,
  bg: 50,
  bgstrong: 100,
  bginvert: 900,
  line: 200,
  lineinvert: 900,
}

/** 深色方案的语义色阶 */
const dark: Shade = {
  fg: 300,
  fgsoft: 400,
  fgstrong: 200,
  fginvert: 950,
  bg: 950,
  bgstrong: 900,
  bginvert: 50,
  line: 800,
  lineinvert: 100,
}

/** 按主题名生成浅色或深色的一个方案 */
function createTheme(name: string, primary: Primary, isDark = false): Record<string, Scheme> {
  const scheme: Scheme = {
    palette: { primary },
  }

  if (isDark) {
    scheme.prefix = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    scheme.shade = dark
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
    shade: light,
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
