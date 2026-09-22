# dyvo-vue-ui

Reusable Vue UI components.

## Installation

```sh
npm install @yuriyapostol/dyvo-vue-ui
```

## Components

- `DyvoBadge`
- `DyvoUserBadge`

## Usage

```ts
import { DyvoBadge, DyvoUserBadge } from '@yuriyapostol/dyvo-vue-ui'
```

Component styles are bundled with the package and are applied automatically.

```vue
<template>
  <DyvoBadge text="Stable" color="success" variant="soft" />
  <DyvoBadge color="tip" variant="solid">Featured</DyvoBadge>
  <DyvoUserBadge name="Yuriy Apostol" github="yuriyapostol" />
</template>
```

## `DyvoBadge`

`DyvoBadge` is a flexible inline badge component.

```vue
<template>
  <DyvoBadge text="Experimental" color="warning" variant="outline" />
  <DyvoBadge
    text="GitHub"
    color="info"
    variant="accent"
    href="https://github.com/yuriyapostol/dyvo-vue-ui"
  />
  <DyvoBadge text="With image" image-src="/images/logo.svg" image-alt="Project logo" />
</template>
```

The label can also be passed through the default slot:

```vue
<template>
  <DyvoBadge color="tip" variant="solid">Featured</DyvoBadge>
</template>
```

Custom image content can be passed through the `image` slot:

```vue
<template>
  <DyvoBadge text="Image slot" image-alt="Project logo">
    <template #image>
      <img src="/images/simple-logo.svg" alt="Project logo" />
    </template>
  </DyvoBadge>
</template>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Text fallback when the default slot is empty. |
| `color` | `string` | `'tip'` | Badge color. Built-in values are `primary`, `secondary`, `info`, `tip`, `warning`, `danger`, and `success`; custom values resolve to `--dyvo-color-{name}`. |
| `variant` | `'soft' \| 'accent' \| 'solid' \| 'outline' \| 'plain'` | `'soft'` | Visual style. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Badge size. |
| `verticalAlign` | `'unset' \| 'baseline' \| 'middle' \| 'super' \| 'sub'` | `'unset'` | CSS vertical alignment. |
| `image` | `string` | `''` | Image URL alias for `imageSrc`. |
| `imageSrc` | `string` | `''` | Image URL. |
| `imageAlt` | `string` | `''` | Image alt text. |
| `href` | `string` | `undefined` | Renders the badge as a link when enabled. |
| `base` | `string` | `''` | Prefix for root-relative image paths. |
| `interactive` | `boolean` | `false` | Enables interactive styling without requiring `href`. |
| `disabled` | `boolean` | `false` | Disables link rendering and interactive styling. |

`color`, `variant`, `size`, and `verticalAlign` can also be provided through prefixed class names:

```vue
<template>
  <DyvoBadge class="color-success variant-solid size-medium vertical-align-middle">
    Aligned badge
  </DyvoBadge>
</template>
```

## `DyvoUserBadge`

`DyvoUserBadge` wraps `DyvoBadge` and adds user-oriented defaults.

```vue
<template>
  <DyvoUserBadge name="Yuriy Apostol" github="yuriyapostol" />
  <DyvoUserBadge
    name="Project maintainer"
    text="Maintainer"
    avatar-src="https://github.com/yuriyapostol.png?size=80"
    href="https://example.com/team/yuriy"
    color="tip"
    variant="solid"
  />
</template>
```

If `github` is provided, the profile link defaults to `https://github.com/<handle>` and the avatar defaults to `https://github.com/<handle>.png?size=80`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | User or author name. |
| `github` | `string` | `undefined` | GitHub handle used for default link and avatar. |
| `href` | `string` | `undefined` | Link override. |
| `avatarSrc` | `string` | `undefined` | Avatar image override. |
| `avatarAlt` | `string` | `undefined` | Avatar alt text override. |
| `text` | `string` | `undefined` | Visible label override. |
| `color` | `string` | `'info'` | Badge color. Built-in values are `primary`, `secondary`, `info`, `tip`, `warning`, `danger`, and `success`; custom values resolve to `--dyvo-color-{name}`. |
| `variant` | `'soft' \| 'accent' \| 'solid' \| 'outline' \| 'plain'` | `'soft'` | Visual style. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | Badge size. |
| `base` | `string` | `''` | Prefix for root-relative avatar image paths. |
| `interactive` | `boolean` | `false` | Enables interactive styling without requiring `href`. |
| `disabled` | `boolean` | `false` | Disables link rendering and interactive styling. |

## Styling

The components are styled with CSS custom properties. You can override them globally, in a wrapper, or inline:

```vue
<template>
  <DyvoBadge
    variant="accent"
    style="--dyvo-badge-current-text-color: #48a103; --dyvo-badge-current-bg-color: #48a10330;"
  >
    Custom green
  </DyvoBadge>
</template>
```

The package does not depend on VitePress. Framework-specific integrations can pass `base` and theme tokens from their own environment.

### Color Tokens

The package includes global color tokens with the `--dyvo-color-` prefix. Components read these tokens directly, so custom palette names can be used anywhere a component accepts `color`.

Each base color has a central token, such as `--dyvo-color-green`, and a shared `50` to `900` scale generated from that central color. Steps lighter than `500` are mixed toward `--dyvo-color-white`, `500` is the central color, and steps darker than `500` are mixed toward `--dyvo-color-black`.

Scale formula:

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

Base colors:

```css
--dyvo-color-white
--dyvo-color-black
--dyvo-color-gray
--dyvo-color-blue
--dyvo-color-green
--dyvo-color-yellow
--dyvo-color-red
--dyvo-color-purple
```

Generated scale tokens use the `--dyvo-color-{name}-{step}` pattern:

```css
--dyvo-color-green-50
--dyvo-color-green-100
--dyvo-color-green-200
--dyvo-color-green-300
--dyvo-color-green-400
--dyvo-color-green-500
--dyvo-color-green-600
--dyvo-color-green-700
--dyvo-color-green-800
--dyvo-color-green-900
```

Semantic tokens:

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

### Custom Palettes

Use `createDyvoPalette()` when an app should create a full color scale from one value at runtime:

```ts
import { createDyvoPalette } from '@yuriyapostol/dyvo-vue-ui'

createDyvoPalette({
  ocean: '#0ea5e9'
}).mount()
```

This injects tokens such as:

```css
--dyvo-color-ocean
--dyvo-color-ocean-50
--dyvo-color-ocean-100
--dyvo-color-ocean-900
.dyvo-badge.color-ocean
```

The same color name can then be used like a built-in badge color:

```vue
<template>
  <DyvoBadge class="color-ocean variant-solid">Ocean</DyvoBadge>
</template>
```

For build-time or file-based workflows, use `generateDyvoPaletteCss()` and write the returned CSS into your app stylesheet:

```ts
import { generateDyvoPaletteCss } from '@yuriyapostol/dyvo-vue-ui'

const css = generateDyvoPaletteCss({
  ocean: '#0ea5e9'
})
```

Generated output follows the same CSS-only recipe used by the built-in colors:

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

You can also author that block manually. The automatic and manual paths intentionally share the same token shape so a future theme config can generate the same CSS from a larger `defineDyvoTheme()`-style API.
