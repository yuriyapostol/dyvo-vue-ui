<script setup lang="ts">
import { computed, normalizeClass, useAttrs } from 'vue'
import type {
  DyvoBadgeColor,
  DyvoBadgeSize,
  DyvoBadgeVariant,
  DyvoBadgeVerticalAlign
} from '../types'

defineOptions({
  inheritAttrs: false
})

const badgeColors = ['info', 'tip', 'warning', 'danger', 'success'] as const
const badgeVariants = ['soft', 'accent', 'solid', 'outline', 'plain'] as const
const badgeSizes = ['small', 'medium', 'large'] as const
const badgeVerticalAlignments = ['unset', 'baseline', 'middle', 'super', 'sub'] as const

const badgeColorClasses = badgeColors.map((value) => `color-${value}`) as readonly string[]
const badgeVariantClasses = badgeVariants.map((value) => `variant-${value}`) as readonly string[]
const badgeSizeClasses = badgeSizes.map((value) => `size-${value}`) as readonly string[]
const badgeVerticalAlignClasses = badgeVerticalAlignments.map((value) => `vertical-align-${value}`) as readonly string[]

const attrs = useAttrs()

const props = withDefaults(defineProps<{
  text?: string
  color?: DyvoBadgeColor
  variant?: DyvoBadgeVariant
  size?: DyvoBadgeSize
  verticalAlign?: DyvoBadgeVerticalAlign
  image?: string
  imageSrc?: string
  imageAlt?: string
  href?: string
  base?: string
  interactive?: boolean
  disabled?: boolean
}>(), {
  text: '',
  color: 'tip',
  variant: 'soft',
  size: 'medium',
  verticalAlign: 'unset',
  image: '',
  imageSrc: '',
  imageAlt: '',
  href: undefined,
  base: '',
  interactive: false,
  disabled: false
})

const classTokens = computed(() => {
  const raw = normalizeClass(attrs.class)
  return raw
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
})

const classConfig = computed(() => {
  let color: DyvoBadgeColor | undefined
  let variant: DyvoBadgeVariant | undefined
  let size: DyvoBadgeSize | undefined
  let verticalAlign: DyvoBadgeVerticalAlign | undefined
  let interactive = false
  let disabled = false

  for (const token of classTokens.value) {
    if (!color && badgeColorClasses.includes(token)) {
      color = token.replace(/^color-/, '') as DyvoBadgeColor
      continue
    }

    if (!variant && badgeVariantClasses.includes(token)) {
      variant = token.replace(/^variant-/, '') as DyvoBadgeVariant
      continue
    }

    if (!size && badgeSizeClasses.includes(token)) {
      size = token.replace(/^size-/, '') as DyvoBadgeSize
      continue
    }

    if (!verticalAlign && badgeVerticalAlignClasses.includes(token)) {
      verticalAlign = token.replace(/^vertical-align-/, '') as DyvoBadgeVerticalAlign
      continue
    }

    if (token === 'interactive') {
      interactive = true
      continue
    }

    if (token === 'disabled') {
      disabled = true
    }
  }

  return {
    color,
    variant,
    size,
    verticalAlign,
    interactive,
    disabled
  }
})

const passthroughClassTokens = computed(() => (
  classTokens.value.filter((token) => (
    !badgeColorClasses.includes(token)
    && !badgeVariantClasses.includes(token)
    && !badgeSizeClasses.includes(token)
    && !badgeVerticalAlignClasses.includes(token)
    && token !== 'interactive'
    && token !== 'disabled'
  ))
))

const resolvedColor = computed(() => classConfig.value.color ?? props.color)
const resolvedVariant = computed(() => classConfig.value.variant ?? props.variant)
const resolvedSize = computed(() => classConfig.value.size ?? props.size)
const resolvedVerticalAlign = computed(() => classConfig.value.verticalAlign ?? props.verticalAlign)
const resolvedDisabled = computed(() => classConfig.value.disabled || props.disabled)
const forcedInteractive = computed(() => classConfig.value.interactive)

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const tagName = computed(() => {
  if (props.href && !resolvedDisabled.value) {
    return 'a'
  }

  return 'span'
})

const isInteractive = computed(() => (
  (Boolean(props.href) || props.interactive || forcedInteractive.value) && !resolvedDisabled.value
))

function withResolvedBase(path: string, base: string) {
  const normalizedBase = base.trim()

  if (!normalizedBase || normalizedBase === '/') {
    return path
  }

  return `${normalizedBase.replace(/\/$/, '')}${path}`
}

const resolvedImageSrc = computed(() => {
  const normalizeImageSrc = (value: string) => {
    const trimmed = value.trim()

    if (!trimmed) {
      return ''
    }

    if (trimmed.startsWith('/')) {
      return withResolvedBase(trimmed, props.base)
    }

    return trimmed
  }

  if (typeof props.imageSrc === 'string' && props.imageSrc.trim()) {
    return normalizeImageSrc(props.imageSrc)
  }

  if (typeof props.image === 'string' && props.image.trim()) {
    return normalizeImageSrc(props.image)
  }

  return ''
})
</script>

<template>
  <component
    :is="tagName"
    v-bind="forwardedAttrs"
    class="dyvo-badge"
    :class="[
      passthroughClassTokens,
      `color-${resolvedColor}`,
      `variant-${resolvedVariant}`,
      `size-${resolvedSize}`,
      `vertical-align-${resolvedVerticalAlign}`,
      {
        interactive: isInteractive,
        disabled: resolvedDisabled
      }
    ]"
    :href="tagName === 'a' ? href : undefined"
    :aria-disabled="resolvedDisabled || undefined"
  >
    <span
      class="dyvo-badge-label"
      :class="{
        'has-image': resolvedImageSrc || $slots.image
      }"
    >
      <span class="dyvo-badge-body">
        <span v-if="resolvedImageSrc || $slots.image" class="dyvo-badge-image" aria-hidden="true">
          <slot name="image">
            <img :src="resolvedImageSrc" :alt="imageAlt" />
          </slot>
        </span>
        <span class="dyvo-badge-text">
          <slot>{{ text }}</slot>
        </span>
      </span>
    </span>
  </component>
</template>

<style>
.dyvo-badge {
  --dyvo-badge-padding-x: var(--dyvo-badge-medium-padding-x, 12px);
  --dyvo-badge-padding-y: var(--dyvo-badge-medium-padding-y, 0);
  --dyvo-badge-gap: var(--dyvo-badge-medium-gap, 6px);
  --dyvo-badge-line-height: var(--dyvo-badge-medium-line-height, inherit);
  --dyvo-badge-box-height: var(--dyvo-badge-medium-box-height, var(--dyvo-text-medium-line-height, 24px));
  --dyvo-badge-image-size: var(--dyvo-badge-box-height);
  --dyvo-badge-link-color: var(--dyvo-badge-link-default-color, var(--dyvo-badge-text-color, #1f2328));
  --dyvo-badge-border-width: 1px;
  --dyvo-badge-vertical-align: unset;
  --dyvo-badge-image-space: calc(var(--dyvo-badge-image-size) + var(--dyvo-badge-gap));
  display: inline;
  white-space: nowrap;
  color: var(--dyvo-badge-text-color, #1f2328);
}

a.dyvo-badge {
  color: var(--dyvo-badge-link-color);
}

a.dyvo-badge:hover {
  color: var(
    --dyvo-badge-link-hover-color,
    color-mix(in srgb, var(--dyvo-badge-link-color) 75%, var(--dyvo-badge-page-bg, #ffffff) 25%)
  );
}

.dyvo-badge.size-small {
  --dyvo-badge-padding-x: var(--dyvo-badge-small-padding-x, 10px);
  --dyvo-badge-padding-y: var(--dyvo-badge-small-padding-y, 0);
  --dyvo-badge-gap: var(--dyvo-badge-small-gap, 5px);
  --dyvo-badge-line-height: var(--dyvo-badge-small-line-height, inherit);
  --dyvo-badge-box-height: var(--dyvo-badge-small-box-height, var(--dyvo-text-small-line-height, calc(var(--dyvo-text-medium-line-height, 24px) - 4px)));
  --dyvo-badge-font-size: var(--dyvo-badge-small-font-size, var(--dyvo-text-xsmall-font-size, calc(var(--dyvo-text-medium-font-size, 16px) - 4px)));
  --dyvo-badge-font-weight: var(--dyvo-badge-small-font-weight, 500);
}

.dyvo-badge.size-medium {
  --dyvo-badge-padding-x: var(--dyvo-badge-medium-padding-x, 12px);
  --dyvo-badge-padding-y: var(--dyvo-badge-medium-padding-y, 0);
  --dyvo-badge-gap: var(--dyvo-badge-medium-gap, 6px);
  --dyvo-badge-line-height: var(--dyvo-badge-medium-line-height, inherit);
  --dyvo-badge-box-height: var(--dyvo-badge-medium-box-height, var(--dyvo-text-medium-line-height, 24px));
  --dyvo-badge-font-size: var(--dyvo-badge-medium-font-size, var(--dyvo-text-small-font-size, calc(var(--dyvo-text-medium-font-size, 16px) - 2px)));
  --dyvo-badge-font-weight: var(--dyvo-badge-medium-font-weight, 400);
}

.dyvo-badge.size-large {
  --dyvo-badge-padding-x: var(--dyvo-badge-large-padding-x, 14px);
  --dyvo-badge-padding-y: var(--dyvo-badge-large-padding-y, 0);
  --dyvo-badge-gap: var(--dyvo-badge-large-gap, 8px);
  --dyvo-badge-line-height: var(--dyvo-badge-large-line-height, inherit);
  --dyvo-badge-box-height: var(--dyvo-badge-large-box-height, var(--dyvo-text-large-line-height, calc(var(--dyvo-text-medium-line-height, 24px) + 4px)));
  --dyvo-badge-font-size: var(--dyvo-badge-large-font-size, var(--dyvo-text-medium-font-size, 16px));
  --dyvo-badge-font-weight: var(--dyvo-badge-large-font-weight, 400);
}

.dyvo-badge.vertical-align-unset {
  --dyvo-badge-vertical-align: unset;
}

.dyvo-badge.vertical-align-baseline {
  --dyvo-badge-vertical-align: baseline;
}

.dyvo-badge.vertical-align-middle {
  --dyvo-badge-vertical-align: middle;
}

.dyvo-badge.vertical-align-super {
  --dyvo-badge-vertical-align: super;
}

.dyvo-badge.vertical-align-sub {
  --dyvo-badge-vertical-align: sub;
}

.dyvo-badge.interactive {
  cursor: pointer;
  transition:
    opacity var(--dyvo-badge-transition-duration, 0.15s) ease,
    color var(--dyvo-badge-transition-duration, 0.15s) ease;
}

.dyvo-badge.interactive:hover .dyvo-badge-label {
  opacity: var(--dyvo-badge-hover-opacity, 0.92);
}

.dyvo-badge.interactive:focus-visible {
  outline: var(--dyvo-badge-focus-outline-width, 2px) solid var(--dyvo-badge-focus-outline-color, #3451b2);
  outline-offset: var(--dyvo-badge-focus-outline-offset, 2px);
}

.dyvo-badge.disabled {
  cursor: not-allowed;
  opacity: var(--dyvo-badge-disabled-opacity, 0.55);
}

.dyvo-badge-label {
  display: inline-block;
  line-height: var(--dyvo-badge-line-height, inherit);
  font-size: var(--dyvo-badge-font-size, var(--dyvo-text-small-font-size, calc(var(--dyvo-text-medium-font-size, 16px) - 2px)));
  font-weight: var(--dyvo-badge-font-weight, 400);
  color: inherit;
  text-decoration: inherit;
  text-underline-offset: inherit;
  vertical-align: var(--dyvo-badge-vertical-align);
}

.dyvo-badge-body {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: var(--dyvo-badge-box-height);
  padding: var(--dyvo-badge-padding-y) var(--dyvo-badge-padding-x);
  isolation: isolate;
  text-decoration: inherit;
  text-underline-offset: inherit;
}

.dyvo-badge-body::before {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--dyvo-badge-border-width));
  border: var(--dyvo-badge-border-width) solid var(--dyvo-badge-border-color, transparent);
  border-radius: var(--dyvo-badge-radius, 9999px);
  background-color: var(--dyvo-badge-bg-color, transparent);
  box-sizing: border-box;
  pointer-events: none;
  z-index: -1;
}

.dyvo-badge-label.has-image {
  padding-inline-start: 0;
}

.dyvo-badge-image {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 0;
  display: flex;
  height: var(--dyvo-badge-image-size);
  width: var(--dyvo-badge-image-size);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  transform: translateY(-50%);
}

.dyvo-badge-image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.dyvo-badge-text {
  display: inline;
  line-height: var(--dyvo-badge-line-height, inherit);
  text-decoration: inherit;
  text-underline-offset: inherit;
}

.dyvo-badge.variant-soft {
  --dyvo-badge-text-color: var(--dyvo-badge-soft-text-color, #1f2328);
  --dyvo-badge-bg-color: var(--dyvo-badge-soft-bg-color, transparent);
  --dyvo-badge-border-color: var(--dyvo-badge-soft-border-color, transparent);
}

.dyvo-badge.variant-accent {
  --dyvo-badge-text-color: var(--dyvo-badge-accent-text-color, var(--dyvo-badge-soft-text-color, #1f2328));
  --dyvo-badge-bg-color: var(--dyvo-badge-accent-bg-color, var(--dyvo-badge-soft-bg-color, transparent));
  --dyvo-badge-border-color: var(--dyvo-badge-accent-border-color, var(--dyvo-badge-outline-border-color, var(--dyvo-badge-accent-text-color, transparent)));
}

.dyvo-badge.variant-solid {
  --dyvo-badge-text-color: var(--dyvo-badge-solid-text-color, var(--dyvo-badge-page-bg, #ffffff));
  --dyvo-badge-bg-color: var(--dyvo-badge-solid-bg-color, #1f2328);
  --dyvo-badge-border-color: var(--dyvo-badge-solid-border-color, var(--dyvo-badge-solid-bg-color, transparent));
}

.dyvo-badge.variant-outline {
  --dyvo-badge-text-color: var(--dyvo-badge-outline-text-color, #1f2328);
  --dyvo-badge-bg-color: var(--dyvo-badge-outline-bg-color, transparent);
  --dyvo-badge-border-color: var(--dyvo-badge-outline-border-color, var(--dyvo-badge-outline-text-color, transparent));
}

.dyvo-badge.variant-plain {
  --dyvo-badge-border-width: 0px;
  --dyvo-badge-radius: 0px;
  --dyvo-badge-padding-x: 0px;
  --dyvo-badge-padding-y: 0px;
  --dyvo-badge-text-color: var(--dyvo-badge-plain-text-color, #1f2328);
  --dyvo-badge-bg-color: var(--dyvo-badge-plain-bg-color, transparent);
  --dyvo-badge-border-color: var(--dyvo-badge-plain-border-color, transparent);
}

.dyvo-badge.variant-plain .dyvo-badge-label.has-image {
  padding-inline-start: 0;
}

.dyvo-badge.variant-plain .dyvo-badge-label.has-image .dyvo-badge-body {
  padding-inline-start: var(--dyvo-badge-image-space);
}

.dyvo-badge-label.has-image .dyvo-badge-body {
  padding-inline-start: var(--dyvo-badge-image-space);
}

.dyvo-badge.color-info {
  --dyvo-badge-current-text-color: var(--dyvo-badge-info-text-color, #1f2328);
  --dyvo-badge-current-bg-color: var(--dyvo-badge-info-bg-color, color-mix(in srgb, #1f2328 12%, transparent));
  --dyvo-badge-soft-text-color: var(--dyvo-badge-info-soft-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-soft-bg-color: var(--dyvo-badge-info-soft-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-soft-border-color: var(--dyvo-badge-info-soft-border-color, transparent);
  --dyvo-badge-accent-text-color: var(--dyvo-badge-info-accent-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-accent-bg-color: var(--dyvo-badge-info-accent-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-accent-border-color: var(--dyvo-badge-info-accent-border-color, var(--dyvo-badge-info-border-color, var(--dyvo-badge-accent-text-color)));
  --dyvo-badge-solid-text-color: var(--dyvo-badge-info-solid-text-color, var(--dyvo-badge-page-bg, #ffffff));
  --dyvo-badge-solid-bg-color: var(--dyvo-badge-info-solid-bg-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-solid-border-color: var(--dyvo-badge-info-solid-border-color, var(--dyvo-badge-solid-bg-color));
  --dyvo-badge-outline-text-color: var(--dyvo-badge-info-outline-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-outline-bg-color: var(--dyvo-badge-info-outline-bg-color, transparent);
  --dyvo-badge-outline-border-color: var(--dyvo-badge-info-outline-border-color, var(--dyvo-badge-info-border-color, var(--dyvo-badge-outline-text-color)));
  --dyvo-badge-plain-text-color: var(--dyvo-badge-info-plain-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-plain-bg-color: var(--dyvo-badge-info-plain-bg-color, transparent);
  --dyvo-badge-plain-border-color: var(--dyvo-badge-info-plain-border-color, transparent);
}

.dyvo-badge.color-tip {
  --dyvo-badge-current-text-color: var(--dyvo-badge-tip-text-color, #18794e);
  --dyvo-badge-current-bg-color: var(--dyvo-badge-tip-bg-color, color-mix(in srgb, #18794e 14%, transparent));
  --dyvo-badge-soft-text-color: var(--dyvo-badge-tip-soft-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-soft-bg-color: var(--dyvo-badge-tip-soft-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-soft-border-color: var(--dyvo-badge-tip-soft-border-color, transparent);
  --dyvo-badge-accent-text-color: var(--dyvo-badge-tip-accent-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-accent-bg-color: var(--dyvo-badge-tip-accent-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-accent-border-color: var(--dyvo-badge-tip-accent-border-color, var(--dyvo-badge-tip-border-color, var(--dyvo-badge-accent-text-color)));
  --dyvo-badge-solid-text-color: var(--dyvo-badge-tip-solid-text-color, var(--dyvo-badge-page-bg, #ffffff));
  --dyvo-badge-solid-bg-color: var(--dyvo-badge-tip-solid-bg-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-solid-border-color: var(--dyvo-badge-tip-solid-border-color, var(--dyvo-badge-solid-bg-color));
  --dyvo-badge-outline-text-color: var(--dyvo-badge-tip-outline-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-outline-bg-color: var(--dyvo-badge-tip-outline-bg-color, transparent);
  --dyvo-badge-outline-border-color: var(--dyvo-badge-tip-outline-border-color, var(--dyvo-badge-tip-border-color, var(--dyvo-badge-outline-text-color)));
  --dyvo-badge-plain-text-color: var(--dyvo-badge-tip-plain-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-plain-bg-color: var(--dyvo-badge-tip-plain-bg-color, transparent);
  --dyvo-badge-plain-border-color: var(--dyvo-badge-tip-plain-border-color, transparent);
}

.dyvo-badge.color-warning {
  --dyvo-badge-current-text-color: var(--dyvo-badge-warning-text-color, #d68000);
  --dyvo-badge-current-bg-color: var(--dyvo-badge-warning-bg-color, color-mix(in srgb, #d68000 16%, transparent));
  --dyvo-badge-soft-text-color: var(--dyvo-badge-warning-soft-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-soft-bg-color: var(--dyvo-badge-warning-soft-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-soft-border-color: var(--dyvo-badge-warning-soft-border-color, transparent);
  --dyvo-badge-accent-text-color: var(--dyvo-badge-warning-accent-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-accent-bg-color: var(--dyvo-badge-warning-accent-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-accent-border-color: var(--dyvo-badge-warning-accent-border-color, var(--dyvo-badge-warning-border-color, var(--dyvo-badge-accent-text-color)));
  --dyvo-badge-solid-text-color: var(--dyvo-badge-warning-solid-text-color, var(--dyvo-badge-page-bg, #ffffff));
  --dyvo-badge-solid-bg-color: var(--dyvo-badge-warning-solid-bg-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-solid-border-color: var(--dyvo-badge-warning-solid-border-color, var(--dyvo-badge-solid-bg-color));
  --dyvo-badge-outline-text-color: var(--dyvo-badge-warning-outline-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-outline-bg-color: var(--dyvo-badge-warning-outline-bg-color, transparent);
  --dyvo-badge-outline-border-color: var(--dyvo-badge-warning-outline-border-color, var(--dyvo-badge-warning-border-color, var(--dyvo-badge-outline-text-color)));
  --dyvo-badge-plain-text-color: var(--dyvo-badge-warning-plain-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-plain-bg-color: var(--dyvo-badge-warning-plain-bg-color, transparent);
  --dyvo-badge-plain-border-color: var(--dyvo-badge-warning-plain-border-color, transparent);
}

.dyvo-badge.color-danger {
  --dyvo-badge-current-text-color: var(--dyvo-badge-danger-text-color, #b8272c);
  --dyvo-badge-current-bg-color: var(--dyvo-badge-danger-bg-color, color-mix(in srgb, #b8272c 14%, transparent));
  --dyvo-badge-soft-text-color: var(--dyvo-badge-danger-soft-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-soft-bg-color: var(--dyvo-badge-danger-soft-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-soft-border-color: var(--dyvo-badge-danger-soft-border-color, transparent);
  --dyvo-badge-accent-text-color: var(--dyvo-badge-danger-accent-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-accent-bg-color: var(--dyvo-badge-danger-accent-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-accent-border-color: var(--dyvo-badge-danger-accent-border-color, var(--dyvo-badge-danger-border-color, var(--dyvo-badge-accent-text-color)));
  --dyvo-badge-solid-text-color: var(--dyvo-badge-danger-solid-text-color, var(--dyvo-badge-page-bg, #ffffff));
  --dyvo-badge-solid-bg-color: var(--dyvo-badge-danger-solid-bg-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-solid-border-color: var(--dyvo-badge-danger-solid-border-color, var(--dyvo-badge-solid-bg-color));
  --dyvo-badge-outline-text-color: var(--dyvo-badge-danger-outline-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-outline-bg-color: var(--dyvo-badge-danger-outline-bg-color, transparent);
  --dyvo-badge-outline-border-color: var(--dyvo-badge-danger-outline-border-color, var(--dyvo-badge-danger-border-color, var(--dyvo-badge-outline-text-color)));
  --dyvo-badge-plain-text-color: var(--dyvo-badge-danger-plain-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-plain-bg-color: var(--dyvo-badge-danger-plain-bg-color, transparent);
  --dyvo-badge-plain-border-color: var(--dyvo-badge-danger-plain-border-color, transparent);
}

.dyvo-badge.color-success {
  --dyvo-badge-current-text-color: var(--dyvo-badge-success-text-color, #18794e);
  --dyvo-badge-current-bg-color: var(--dyvo-badge-success-bg-color, color-mix(in srgb, #18794e 14%, transparent));
  --dyvo-badge-soft-text-color: var(--dyvo-badge-success-soft-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-soft-bg-color: var(--dyvo-badge-success-soft-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-soft-border-color: var(--dyvo-badge-success-soft-border-color, transparent);
  --dyvo-badge-accent-text-color: var(--dyvo-badge-success-accent-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-accent-bg-color: var(--dyvo-badge-success-accent-bg-color, var(--dyvo-badge-current-bg-color));
  --dyvo-badge-accent-border-color: var(--dyvo-badge-success-accent-border-color, var(--dyvo-badge-success-border-color, var(--dyvo-badge-accent-text-color)));
  --dyvo-badge-solid-text-color: var(--dyvo-badge-success-solid-text-color, var(--dyvo-badge-page-bg, #ffffff));
  --dyvo-badge-solid-bg-color: var(--dyvo-badge-success-solid-bg-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-solid-border-color: var(--dyvo-badge-success-solid-border-color, var(--dyvo-badge-solid-bg-color));
  --dyvo-badge-outline-text-color: var(--dyvo-badge-success-outline-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-outline-bg-color: var(--dyvo-badge-success-outline-bg-color, transparent);
  --dyvo-badge-outline-border-color: var(--dyvo-badge-success-outline-border-color, var(--dyvo-badge-success-border-color, var(--dyvo-badge-outline-text-color)));
  --dyvo-badge-plain-text-color: var(--dyvo-badge-success-plain-text-color, var(--dyvo-badge-current-text-color));
  --dyvo-badge-plain-bg-color: var(--dyvo-badge-success-plain-bg-color, transparent);
  --dyvo-badge-plain-border-color: var(--dyvo-badge-success-plain-border-color, transparent);
}
</style>
