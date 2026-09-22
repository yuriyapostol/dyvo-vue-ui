# Color Specification

This document defines how Dyvo color tokens are named, generated, and consumed by components.

## Goals

- A color can be added from one base value and expanded into a shared `50` to `900` palette.
- The generated palette can be created automatically with JavaScript or authored manually in CSS.
- Component color APIs remain class-based: `color="primary"` and `class="color-primary"` resolve to the same component class.
- Inline color styles are reserved for ad hoc raw CSS color values, not for normal palette usage.
- The low-level palette generator must stay small enough to become the foundation for a future theme config API.

## Token Levels

Dyvo uses three color token levels.

Base color tokens are concrete color families:

```css
--dyvo-color-gray
--dyvo-color-blue
--dyvo-color-green
--dyvo-color-yellow
--dyvo-color-red
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

`tip` is kept for compatibility with VitePress-style naming. New UI examples should prefer `primary`, `secondary`, `info`, `success`, `warning`, and `danger`.

## Palette Formula

Every generated palette uses the same scale formula:

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

## Automatic Palettes

Use `createDyvoPalette()` to generate and mount palette CSS at runtime:

```ts
import { createDyvoPalette } from '@yuriyapostol/dyvo-vue-ui'

createDyvoPalette({
  ocean: '#0ea5e9'
}).mount()
```

This creates:

```css
:root {
  --dyvo-color-ocean: #0ea5e9;
  --dyvo-color-ocean-50: ...;
  --dyvo-color-ocean-900: ...;
}

.dyvo-badge.color-ocean {
  --dyvo-badge-color: var(--dyvo-color-ocean);
}
```

The component bridge class is part of the generated CSS so component markup can remain class-based:

```vue
<DyvoBadge color="ocean" />
<DyvoBadge class="color-ocean" />
```

Both forms must produce a `color-ocean` class and should not require inline style attributes.

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

For generated custom palettes, `generateDyvoPaletteCss()` creates bridge rules automatically:

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

## Generator API

`generateDyvoPaletteCss(colors, options)` returns a CSS string.

Supported options:

```ts
interface DyvoPaletteOptions {
  selector?: string
  componentSelector?: string
  includeComponentClasses?: boolean
  prefix?: string
  white?: string
  black?: string
  styleId?: string
}
```

- `selector` controls where CSS custom properties are emitted. Default: `:root`.
- `componentSelector` controls generated component bridge selector. Default: `.dyvo-badge`.
- `includeComponentClasses` disables bridge class generation when set to `false`.
- `prefix` controls the token prefix. Default: `dyvo-color`.
- `white` and `black` override the mix endpoints.
- `styleId` is used by `createDyvoPalette()` when mounting runtime styles.

## Future Theme API

A future `defineDyvoTheme()` API should build on this color layer instead of replacing it.

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

The theme layer should produce the same CSS token shape and component bridge classes defined in this specification.
