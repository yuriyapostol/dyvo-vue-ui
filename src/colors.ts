export type DyvoPaletteColorMap = Record<string, string>

export interface DyvoPaletteOptions {
  selector?: string
  prefix?: string
  white?: string
  black?: string
  styleId?: string
}

export interface DyvoMountedPalette {
  css: string
  element: HTMLStyleElement | null
  mount: (target?: ParentNode) => DyvoMountedPalette
  unmount: () => void
}

const paletteSteps = [
  ['50', '10%', 'white'],
  ['100', '20%', 'white'],
  ['200', '40%', 'white'],
  ['300', '60%', 'white'],
  ['400', '80%', 'white'],
  ['500', '100%', 'base'],
  ['600', '80%', 'black'],
  ['700', '60%', 'black'],
  ['800', '40%', 'black'],
  ['900', '20%', 'black']
] as const

function normalizeTokenName(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
}

function normalizePrefix(prefix: string) {
  return prefix.trim().replace(/^-+|-+$/g, '') || 'dyvo-color'
}

function getPaletteCssRules(colors: DyvoPaletteColorMap, options: DyvoPaletteOptions = {}) {
  const prefix = normalizePrefix(options.prefix ?? 'dyvo-color')
  const white = options.white ?? `var(--${prefix}-white, #ffffff)`
  const black = options.black ?? `var(--${prefix}-black, #000000)`
  const rules: string[] = []

  for (const [rawName, rawValue] of Object.entries(colors)) {
    const name = normalizeTokenName(rawName)
    const value = rawValue.trim()

    if (!name || !value) {
      continue
    }

    rules.push(`  --${prefix}-${name}: ${value};`)

    for (const [step, amount, target] of paletteSteps) {
      const token = `--${prefix}-${name}-${step}`

      if (target === 'base') {
        rules.push(`  ${token}: var(--${prefix}-${name});`)
        continue
      }

      const mixTarget = target === 'white' ? white : black
      rules.push(`  ${token}: color-mix(in srgb, var(--${prefix}-${name}) ${amount}, ${mixTarget});`)
    }
  }

  return rules
}

export function generateDyvoPaletteCss(colors: DyvoPaletteColorMap, options: DyvoPaletteOptions = {}) {
  const selector = options.selector ?? ':root'
  const rules = getPaletteCssRules(colors, options)

  if (!rules.length) {
    return ''
  }

  return `${selector} {\n${rules.join('\n')}\n}`
}

export function createDyvoPalette(colors: DyvoPaletteColorMap, options: DyvoPaletteOptions = {}) {
  const css = generateDyvoPaletteCss(colors, options)
  const styleId = options.styleId ?? 'dyvo-custom-palette'

  const palette: DyvoMountedPalette = {
    css,
    element: null,
    mount(target?: ParentNode) {
      if (typeof document === 'undefined' || !css) {
        return palette
      }

      const mountTarget = target ?? document.head
      const existing = styleId ? document.getElementById(styleId) as HTMLStyleElement | null : null
      const style = existing ?? document.createElement('style')

      if (styleId) {
        style.id = styleId
      }

      style.textContent = css

      if (!existing) {
        mountTarget.appendChild(style)
      }

      palette.element = style
      return palette
    },
    unmount() {
      palette.element?.remove()
      palette.element = null
    }
  }

  return palette
}
