# Badge Specification

This document defines the public badge contract for `@yuriyapostol/dyvo-vue-ui` and for integrations such as `dyvo-vitepress-theme`.

## Goals

- Provide one reusable badge component for statuses, labels, inline markers, links, and image-backed chips.
- Keep the core UI package independent from VitePress.
- Let VitePress and other renderers adapt paths, typography, colors, and heading alignment without forking badge logic.
- Support both Vue prop usage and class-token usage, so generated HTML and markdown wrappers can configure badges without requiring a custom transform.
- Keep badge theming based on CSS custom properties and Dyvo color tokens.
- Preserve compatibility with common VitePress badge semantics through `info`, `tip`, `warning`, and `danger`.

## Components

The package exposes two badge components:

```ts
import { DyvoBadge, DyvoUserBadge } from '@yuriyapostol/dyvo-vue-ui'
```

`DyvoBadge` is the primitive. It renders an inline badge as a `span` or an `a`, depending on state.

`DyvoUserBadge` is a user-oriented wrapper around `DyvoBadge`. It adds defaults for visible name, avatar, GitHub profile links, and GitHub avatar URLs.

## `DyvoBadge` API

Supported props:

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `text` | `string` | `''` | Text fallback when the default slot is empty. |
| `color` | `DyvoBadgeColor` | `'tip'` | Named color token or raw CSS color value. |
| `variant` | `DyvoBadgeVariant` | `'soft'` | Visual treatment. |
| `size` | `DyvoBadgeSize` | `'medium'` | Badge scale. |
| `verticalAlign` | `DyvoBadgeVerticalAlign` | `'unset'` | Inline vertical alignment token. |
| `image` | `string` | `''` | Alias for `imageSrc`. |
| `imageSrc` | `string` | `''` | Image URL. Takes precedence over `image`. |
| `imageAlt` | `string` | `''` | Alt text for the generated `img`. |
| `href` | `string` | `undefined` | Renders as `a` when present and not disabled. |
| `base` | `string` | `''` | Prefix for root-relative image paths. |
| `interactive` | `boolean` | `false` | Enables interactive styling without requiring `href`. |
| `disabled` | `boolean` | `false` | Disables link rendering and interactive styling. |

Supported types:

```ts
export type DyvoBadgeColor =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'tip'
  | 'warning'
  | 'danger'
  | 'success'
  | (string & {})

export type DyvoBadgeVariant = 'soft' | 'accent' | 'solid' | 'outline' | 'plain'
export type DyvoBadgeSize = 'small' | 'medium' | 'large'
export type DyvoBadgeVerticalAlign = 'unset' | 'baseline' | 'middle' | 'super' | 'sub'
```

## Class Token API

`DyvoBadge` must support configuration through prefixed class names:

```html
<DyvoBadge class="color-success variant-solid size-small vertical-align-middle interactive">
  Stable
</DyvoBadge>
```

Recognized class tokens:

```txt
color-{name}
variant-soft
variant-accent
variant-solid
variant-outline
variant-plain
size-small
size-medium
size-large
vertical-align-unset
vertical-align-baseline
vertical-align-middle
vertical-align-super
vertical-align-sub
interactive
disabled
```

Class tokens override equivalent props. For example, `class="color-success"` wins over `color="warning"`.

Class tokens consumed by the component are not forwarded as arbitrary passthrough classes. Non-consumed classes are preserved.

Color names from class tokens are normalized by trimming, lowercasing, replacing unsupported characters with `-`, and removing leading or trailing dashes.

## Color Contract

Named colors render as classes:

```html
<span class="dyvo-badge color-success variant-soft size-medium vertical-align-unset">
```

Built-in color bridge rules:

```css
.dyvo-badge.color-primary {
  --dyvo-badge-color: var(--dyvo-color-primary, var(--dyvo-color-blue, #3451b2));
}

.dyvo-badge.color-secondary {
  --dyvo-badge-color: var(--dyvo-color-secondary, var(--dyvo-color-gray-500, #808080));
}

.dyvo-badge.color-info {
  --dyvo-badge-color: var(--dyvo-color-info, var(--dyvo-color-gray-800, #333333));
}

.dyvo-badge.color-tip {
  --dyvo-badge-color: var(--dyvo-color-tip, var(--dyvo-color-purple, #6f42c1));
}

.dyvo-badge.color-warning {
  --dyvo-badge-color: var(--dyvo-color-warning, var(--dyvo-color-yellow, #d68000));
}

.dyvo-badge.color-danger {
  --dyvo-badge-color: var(--dyvo-color-danger, var(--dyvo-color-red, #b8272c));
}

.dyvo-badge.color-success {
  --dyvo-badge-color: var(--dyvo-color-success, var(--dyvo-color-green, #18794e));
}
```

Custom named colors may be used when an integration provides an equivalent bridge:

```css
.dyvo-badge.color-ocean {
  --dyvo-badge-color: var(--dyvo-color-ocean);
}
```

Raw CSS colors are allowed through the `color` prop:

```vue
<DyvoBadge color="#48a103">Custom green</DyvoBadge>
<DyvoBadge color="rgb(72 161 3)">Custom green</DyvoBadge>
```

When `color` is not a token name, the component must render `color-custom` and set `--dyvo-badge-color` inline.

## Variant Contract

All variants derive from this shared current-color layer:

```css
--dyvo-badge-current-text-color: var(--dyvo-badge-color);
--dyvo-badge-current-bg-color: color-mix(in srgb, var(--dyvo-badge-color) 14%, transparent);
```

Variant tokens:

| Variant | Text | Background | Border |
| --- | --- | --- | --- |
| `soft` | `--dyvo-badge-soft-text-color` | `--dyvo-badge-soft-bg-color` | `--dyvo-badge-soft-border-color` |
| `accent` | `--dyvo-badge-accent-text-color` | `--dyvo-badge-accent-bg-color` | `--dyvo-badge-accent-border-color` |
| `solid` | `--dyvo-badge-solid-text-color` | `--dyvo-badge-solid-bg-color` | `--dyvo-badge-solid-border-color` |
| `outline` | `--dyvo-badge-outline-text-color` | `--dyvo-badge-outline-bg-color` | `--dyvo-badge-outline-border-color` |
| `plain` | `--dyvo-badge-plain-text-color` | `--dyvo-badge-plain-bg-color` | `--dyvo-badge-plain-border-color` |

Default semantics:

- `soft`: colored text, soft background, no visible border.
- `accent`: colored text, soft background, colored border.
- `solid`: page-colored text, solid colored background and border.
- `outline`: colored text, transparent background, colored border.
- `plain`: colored text, transparent background, no border, no pill padding.

Theme integrations should customize the shared current-color variables or the variant variables directly. Per-color variables such as `--dyvo-badge-tip-text-color` are not part of the current core component contract unless the component is extended to consume them.

## Size Contract

The component supports three sizes:

| Size | Default box height | Default font size | Default horizontal padding | Default gap |
| --- | --- | --- | --- | --- |
| `small` | `--dyvo-text-small-line-height` or `20px` | `--dyvo-text-xsmall-font-size` or `12px` | `10px` | `5px` |
| `medium` | `--dyvo-text-medium-line-height` or `24px` | `--dyvo-text-small-font-size` or `14px` | `12px` | `6px` |
| `large` | `--dyvo-text-large-line-height` or `28px` | `--dyvo-text-medium-font-size` or `16px` | `14px` | `8px` |

The image size equals `--dyvo-badge-box-height`, so avatar and logo chips scale with the badge.

## DOM Contract

The rendered structure must stay stable enough for theme CSS:

```html
<span class="dyvo-badge color-tip variant-soft size-medium vertical-align-unset">
  <span class="dyvo-badge-label">
    <span class="dyvo-badge-body">
      <span class="dyvo-badge-image" aria-hidden="true">
        <img src="/image.svg" alt="Image alt">
      </span>
      <span class="dyvo-badge-text">Label</span>
    </span>
  </span>
</span>
```

`dyvo-badge-image` is rendered only when `imageSrc`, `image`, or the `image` slot is present. `dyvo-badge-label` receives `has-image` in that case.

The pill background and border are implemented on `.dyvo-badge-body::before`. Themes should prefer custom properties over structural overrides.

## Link And Interaction Contract

If `href` is present and the badge is not disabled, the root element must be `a` and receive the `href`.

If the badge is disabled:

- root element must be `span`;
- `href` must not be rendered;
- `aria-disabled="true"` must be rendered;
- interactive styling must be disabled.

Interactive styling is enabled when:

- `href` exists;
- or `interactive` prop is true;
- or class token `interactive` is present;
- and the badge is not disabled.

Disabled state is enabled when:

- `disabled` prop is true;
- or class token `disabled` is present.

## Image Path Contract

`imageSrc` takes precedence over `image`.

Empty image values are ignored after trimming.

Root-relative image paths are prefixed with `base`:

```txt
imageSrc="/images/logo.svg"
base="/docs/"
=> "/docs/images/logo.svg"
```

If `base` is empty or `/`, the image path is unchanged. Non-root-relative paths are unchanged.

VitePress wrappers must pass `import.meta.env.BASE_URL` as `base` unless the caller explicitly provides a string `base` attribute.

## `DyvoUserBadge` API

Supported props:

| Prop | Type | Default | Contract |
| --- | --- | --- | --- |
| `name` | `string` | required | User or author name. Used as fallback visible text and fallback image alt. |
| `github` | `string` | `undefined` | GitHub handle used for default link, avatar, and alt. |
| `href` | `string` | `undefined` | Link override. |
| `avatarSrc` | `string` | `undefined` | Avatar URL override. |
| `avatarAlt` | `string` | `undefined` | Avatar alt override. |
| `text` | `string` | `undefined` | Visible label override. |
| `color` | `DyvoBadgeColor` | `'info'` | Passed to `DyvoBadge`. |
| `variant` | `DyvoBadgeVariant` | `'soft'` | Passed to `DyvoBadge`. |
| `size` | `DyvoBadgeSize` | `'large'` | Passed to `DyvoBadge`. |
| `base` | `string` | `''` | Passed to `DyvoBadge`. |
| `interactive` | `boolean` | `false` | Passed to `DyvoBadge`. |
| `disabled` | `boolean` | `false` | Passed to `DyvoBadge`. |

Resolution rules:

- `href` wins over generated GitHub profile URL.
- `github="octocat"` generates `https://github.com/octocat`.
- `avatarSrc` wins over generated GitHub avatar URL.
- `github="octocat"` generates `https://github.com/octocat.png?size=80`.
- `avatarAlt` wins over generated alt text.
- GitHub alt text is `@octocat`.
- Without `github`, fallback alt text is `name`.
- `text` wins over `name` for the visible label.

`DyvoUserBadge` must render the same root badge classes as `DyvoBadge` and add the passthrough class `dyvo-user-badge`.

## VitePress Integration

`dyvo-vitepress-theme` should expose globally registered wrappers:

```txt
DyvoBadge
DyvoUserBadge
```

The wrappers should:

- pass all attrs and slots to the UI package component;
- inject `base: import.meta.env.BASE_URL` when no string `base` attr is provided;
- avoid duplicating badge logic.

The theme may optionally export a compatibility `Badge` wrapper for existing VitePress markdown:

```html
<Badge type="tip" text="stable" />
```

Compatibility mapping:

```txt
type -> color
variant -> soft
size -> small
```

This wrapper should not replace `DyvoBadge` as the primary API.

## Heading Alignment

Core `DyvoBadge` defaults to `verticalAlign="unset"`.

VitePress themes may set heading-specific alignment:

```css
.vp-doc h1 > .dyvo-badge.vertical-align-unset,
.vp-doc h2 > .dyvo-badge.vertical-align-unset,
.vp-doc h3 > .dyvo-badge.vertical-align-unset {
  --dyvo-badge-vertical-align: middle;
}
```

Inline paragraph usage should remain natural without a theme override.

## Accessibility

Badges are inline text by default and should not add ARIA roles.

Linked badges must use a real `a` element, not click handlers on `span`.

Disabled linked badges must not render as anchors.

Generated images use the provided `imageAlt`. The image wrapper has `aria-hidden="true"` because the badge label remains the accessible text. If a future use case needs the image to carry unique meaning, the DOM contract must be revisited instead of relying on the current hidden wrapper.

Focus styling must use `:focus-visible` and a themeable outline.

## Stable Public Surface

Stable:

- component names: `DyvoBadge`, `DyvoUserBadge`;
- prop names listed in this document;
- class token names listed in this document;
- root class `dyvo-badge`;
- root user badge passthrough class `dyvo-user-badge`;
- color, variant, size, vertical alignment token values;
- built-in semantic color names;
- VitePress wrapper responsibility for `base`;
- CSS custom property prefix `--dyvo-badge-`.

Internal but currently theme-observable:

- nested classes `dyvo-badge-label`, `dyvo-badge-body`, `dyvo-badge-image`, `dyvo-badge-text`;
- `dyvo-badge-body::before` implementation for the pill background and border.

Experimental:

- future theme APIs that generate badge bridge CSS;
- per-color badge variables, unless the core component starts consuming them;
- additional variants or sizes.

## Implementation Notes

The current UI package implementation already supports the prop API, class-token API, raw color fallback, root-relative image base handling, link/disabled state handling, and user badge GitHub defaults.

The current VitePress theme wrappers correctly inject `import.meta.env.BASE_URL`.

The current VitePress theme CSS defines per-color variables such as `--dyvo-badge-tip-text-color`. Those variables are not consumed by the current core badge component. To customize the current implementation, theme CSS should instead override `--dyvo-badge-current-text-color`, `--dyvo-badge-current-bg-color`, or the variant-specific variables listed above.
