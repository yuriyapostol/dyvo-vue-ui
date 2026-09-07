# dyvo-vue-ui

Reusable Dyvo Vue UI components.

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
| `color` | `'info' \| 'tip' \| 'warning' \| 'danger' \| 'success'` | `'tip'` | Badge color. |
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
| `color` | `'info' \| 'tip' \| 'warning' \| 'danger' \| 'success'` | `'info'` | Badge color. |
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
