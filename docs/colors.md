# Color Specification

This document defines how Dyvo color tokens are named, generated, and consumed by components.

## Goals

- A color can be added from one base value and expanded into a shared `50` to `900` palette.
- The generated palette can be created automatically with JavaScript or authored manually in CSS.
- Component color APIs remain class-based: `color="primary"` and `class="color-primary"` resolve to the same component class.
- Inline color styles are reserved for ad hoc raw CSS color values, not for normal palette usage.
- The color layer must work in VitePress themes and in independent rendering engines, including mobile-oriented renderers without VitePress.
- The low-level palette generator must stay small enough to be reused by a wider theme API.

## Token Levels

Dyvo uses three color token levels.

Base color tokens are concrete color families:

```css
--dyvo-color-gray
--dyvo-color-slate
--dyvo-color-blue
--dyvo-color-indigo
--dyvo-color-green
--dyvo-color-teal
--dyvo-color-cyan
--dyvo-color-lime
--dyvo-color-yellow
--dyvo-color-orange
--dyvo-color-red
--dyvo-color-rose
--dyvo-color-pink
--dyvo-color-purple
```

Palette scale tokens are generated from a base token:

```css
--dyvo-color-blue-50
--dyvo-color-blue-100
--dyvo-color-blue-200
--dyvo-color-blue-300
--dyvo-color-blue-400
--dyvo-color-blue-500
--dyvo-color-blue-600
--dyvo-color-blue-700
--dyvo-color-blue-800
--dyvo-color-blue-900
```

Semantic color tokens describe UI intent:

```css
--dyvo-color-primary
--dyvo-color-secondary
--dyvo-color-info
--dyvo-color-tip
--dyvo-color-success
--dyvo-color-warning
--dyvo-color-danger
--dyvo-color-error
```

Current default mappings:

```css
--dyvo-color-primary: var(--dyvo-color-blue);
--dyvo-color-secondary: var(--dyvo-color-gray-500);
--dyvo-color-info: var(--dyvo-color-gray-800);
--dyvo-color-tip: var(--dyvo-color-purple);
--dyvo-color-success: var(--dyvo-color-green);
--dyvo-color-warning: var(--dyvo-color-yellow);
--dyvo-color-danger: var(--dyvo-color-red);
--dyvo-color-error: var(--dyvo-color-danger);
```

`info`, `tip`, `warning`, and `danger` align with VitePress-style status naming. They are part of the public color vocabulary so the package can be used inside a VitePress theme without adapter-only renaming.

`primary`, `secondary`, and `success` are broader UI semantic colors. New non-documentation UI examples should prefer `primary`, `secondary`, `info`, `success`, `warning`, and `danger`. `tip` remains available where VitePress-style semantics are useful or compatibility matters.

## Palette Formula

The current generated palette uses this default scale formula:

```css
50:  color 10% + white
100: color 20% + white
200: color 40% + white
300: color 60% + white
400: color 80% + white
500: color
600: color 80% + black
700: color 60% + black
800: color 40% + black
900: color 20% + black
```

The CSS representation uses `color-mix(in srgb, ...)`:

```css
--dyvo-color-ocean: #0ea5e9;
--dyvo-color-ocean-50: color-mix(in srgb, var(--dyvo-color-ocean) 10%, var(--dyvo-color-white, #ffffff));
--dyvo-color-ocean-500: var(--dyvo-color-ocean);
--dyvo-color-ocean-900: color-mix(in srgb, var(--dyvo-color-ocean) 20%, var(--dyvo-color-black, #000000));
```

Future palette generation may support additional strategies when they are useful enough to justify the API surface. Examples include perceptual color spaces such as OKLCH, fixed-step designer palettes, or contrast-aware palettes. Any new strategy must still emit the same public token shape unless a breaking change is explicitly accepted.

## Automatic Palettes

Use `createDyvoPalette()` to generate and mount palette CSS at runtime:

```ts
import { createDyvoPalette } from '@yuriyapostol/dyvo-vue-ui'

createDyvoPalette({
  ocean: '#0ea5e9'
}).mount()
```

This creates color tokens:

```css
:root {
  --dyvo-color-ocean: #0ea5e9;
  --dyvo-color-ocean-50: ...;
  --dyvo-color-ocean-900: ...;
}
```

Palette generation does not include component bridge rules. If a custom palette should be available through a component color class today, author the bridge as CSS next to the palette. A future theme layer may automate that from component metadata.

## Manual Palettes

A palette may be authored manually by defining the same token shape:

```css
:root {
  --dyvo-color-ocean: #0ea5e9;
  --dyvo-color-ocean-50: color-mix(in srgb, var(--dyvo-color-ocean) 10%, var(--dyvo-color-white, #ffffff));
  --dyvo-color-ocean-100: color-mix(in srgb, var(--dyvo-color-ocean) 20%, var(--dyvo-color-white, #ffffff));
  --dyvo-color-ocean-200: color-mix(in srgb, var(--dyvo-color-ocean) 40%, var(--dyvo-color-white, #ffffff));
  --dyvo-color-ocean-300: color-mix(in srgb, var(--dyvo-color-ocean) 60%, var(--dyvo-color-white, #ffffff));
  --dyvo-color-ocean-400: color-mix(in srgb, var(--dyvo-color-ocean) 80%, var(--dyvo-color-white, #ffffff));
  --dyvo-color-ocean-500: var(--dyvo-color-ocean);
  --dyvo-color-ocean-600: color-mix(in srgb, var(--dyvo-color-ocean) 80%, var(--dyvo-color-black, #000000));
  --dyvo-color-ocean-700: color-mix(in srgb, var(--dyvo-color-ocean) 60%, var(--dyvo-color-black, #000000));
  --dyvo-color-ocean-800: color-mix(in srgb, var(--dyvo-color-ocean) 40%, var(--dyvo-color-black, #000000));
  --dyvo-color-ocean-900: color-mix(in srgb, var(--dyvo-color-ocean) 20%, var(--dyvo-color-black, #000000));
}
```

A component bridge may be authored manually next to the palette:

```css
.dyvo-badge.color-ocean {
  --dyvo-badge-color: var(--dyvo-color-ocean);
}
```

Manual and automatic palettes must stay compatible.

## Component Consumption

Components should accept color by prop and by prefixed class:

```vue
<DyvoBadge color="primary" />
<DyvoBadge class="color-primary" />
```

For named colors, components should render and consume classes:

```html
<span class="dyvo-badge color-primary variant-soft">
```

Components should not emit inline `--dyvo-badge-color` for named colors. Inline color assignment is allowed only when a raw CSS color value is passed directly:

```vue
<DyvoBadge color="#3451b2" />
<DyvoBadge color="rgb(52 81 178)" />
```

In those cases, the component may render a neutral class such as `color-custom` and set the component color variable inline.

## Component Bridge Rules

Each component that consumes a named color needs a bridge from its public color class to its internal color variable.

For built-in badge colors:

```css
.dyvo-badge.color-primary {
  --dyvo-badge-color: var(--dyvo-color-primary, var(--dyvo-color-blue, #3451b2));
}
```

For custom palettes, author equivalent bridge rules manually:

```css
.dyvo-badge.color-ocean {
  --dyvo-badge-color: var(--dyvo-color-ocean);
}
```

Future components should follow the same pattern with their own component variable:

```css
.dyvo-component.color-ocean {
  --dyvo-component-color: var(--dyvo-color-ocean);
}
```

## Palette Generator API

`generateDyvoPaletteCss(colors, options)` returns a CSS string.

Supported options:

```ts
interface DyvoPaletteOptions {
  selector?: string
  prefix?: string
  white?: string
  black?: string
  styleId?: string
}
```

- `selector` controls where CSS custom properties are emitted. Default: `:root`.
- `prefix` controls the token prefix. Default: `dyvo-color`.
- `white` and `black` override the mix endpoints.
- `styleId` is used by `createDyvoPalette()` when mounting runtime styles.

## Future Component Bridge Metadata

CSS cannot derive `var(--dyvo-color-ocean)` from a class name like `color-ocean` by itself. A future theme layer may use component metadata to generate bridge rules automatically.

That metadata should remain internal or theme-facing until the Theme API is designed. The current public API should not expose bridge helper functions or bridge types prematurely.

## Future Theme API

A future theme API should include this color layer as one part of a broader system instead of replacing it.

Expected direction:

```ts
defineDyvoTheme({
  colors: {
    ocean: '#0ea5e9'
  },
  semantic: {
    primary: 'ocean'
  }
})
```

The theme layer should produce the same CSS token shape and component bridge classes defined in this specification. See `docs/themes.md` for the draft theme specification.
