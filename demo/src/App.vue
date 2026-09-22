<script setup lang="ts">
import { createDyvoPalette, DyvoBadge, DyvoUserBadge } from '../../src'

createDyvoPalette({
  brand: 'var(--dyvo-color-purple)'
}).mount()

const colors = ['info', 'tip', 'warning', 'danger', 'success', 'brand'] as const
const variants = ['soft', 'accent', 'solid', 'outline', 'plain'] as const
const sizes = ['small', 'medium', 'large'] as const
const paletteColors = ['gray', 'blue', 'green', 'yellow', 'red', 'purple'] as const
const paletteSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const
const semanticColors = ['info', 'tip', 'success', 'warning', 'danger'] as const
</script>

<template>
  <main class="demo-page">
    <section class="demo-hero">
      <div class="demo-hero-copy">
        <DyvoBadge text="Vue 3 package" color="tip" variant="accent" size="small" />
        <h1>dyvo-vue-ui</h1>
        <p>
          Small reusable Vue components for badges, author chips, statuses, and inline UI accents.
        </p>
      </div>

      <div class="demo-showcase" aria-label="Featured component examples">
        <DyvoUserBadge name="Yuriy Apostol" github="yuriyapostol" />
        <DyvoBadge text="Stable" color="success" variant="solid" />
        <DyvoBadge text="Experimental" color="warning" variant="outline" />
        <DyvoBadge text="Disabled" color="danger" variant="soft" disabled />
      </div>
    </section>

    <section class="demo-section" aria-labelledby="colors-title">
      <div class="demo-section-heading">
        <h2 id="colors-title">Colors</h2>
        <p>Global Dyvo color tokens.</p>
      </div>

      <div class="demo-color-stack">
        <div class="demo-color-grid" aria-label="Base color scales">
          <div class="demo-color-row demo-color-header" aria-hidden="true">
            <span class="demo-row-label"></span>
            <div class="demo-color-steps">
              <span v-for="step in paletteSteps" :key="step">{{ step }}</span>
            </div>
          </div>

          <div v-for="paletteColor in paletteColors" :key="paletteColor" class="demo-color-row">
            <span class="demo-row-label">{{ paletteColor }}</span>
            <div class="demo-swatches">
              <div
                v-for="step in paletteSteps"
                :key="step"
                class="demo-swatch"
                :style="{ '--demo-swatch-color': `var(--dyvo-color-${paletteColor}-${step})` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="demo-semantic-grid" aria-label="Semantic colors">
          <div class="demo-semantic-labels" aria-hidden="true">
            <span v-for="semanticColor in semanticColors" :key="semanticColor">
              {{ semanticColor }}
            </span>
          </div>

          <div class="demo-semantic-colors">
            <div
              v-for="semanticColor in semanticColors"
              :key="semanticColor"
              class="demo-semantic-swatch"
              :style="{ '--demo-swatch-color': `var(--dyvo-color-${semanticColor})` }"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section" aria-labelledby="badge-variants-title">
      <div class="demo-section-heading">
        <h2 id="badge-variants-title">DyvoBadge</h2>
        <p>Colors and variants.</p>
      </div>

      <div class="demo-grid">
        <div v-for="color in colors" :key="color" class="demo-row">
          <span class="demo-row-label">{{ color }}</span>
          <div class="demo-badges">
            <DyvoBadge
              v-for="variant in variants"
              :key="variant"
              :text="variant"
              :color="color"
              :variant="variant"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section" aria-labelledby="sizes-title">
      <div class="demo-section-heading">
        <p>Compact, default, and prominent badge sizes.</p>
      </div>

      <div class="demo-badges demo-badges-large">
        <DyvoBadge
          v-for="size in sizes"
          :key="size"
          :text="size"
          color="info"
          variant="accent"
          :size="size"
        />
      </div>
    </section>

    <section class="demo-section" aria-labelledby="users-title">
      <div class="demo-section-heading">
        <h2 id="users-title">DyvoUserBadge</h2>
        <p>GitHub avatars and user-oriented defaults.</p>
      </div>

      <div class="demo-badges demo-badges-large">
        <DyvoUserBadge name="Yuriy Apostol" github="yuriyapostol" />
        <DyvoUserBadge
          name="Project maintainer"
          text="Maintainer"
          avatar-src="https://github.com/yuriyapostol.png?size=80"
          href="https://github.com/yuriyapostol/dyvo-vue-ui"
          color="tip"
          variant="solid"
        />
      </div>
    </section>
  </main>
</template>

<style>
:root {
  color: #1f2328;
  background: #f7f8fb;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

a {
  text-decoration: none;
}

.demo-page {
  width: min(1040px, calc(100% - 32px));
  margin: 0 auto;
  padding: 48px 0;
}

.demo-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
  gap: 40px;
  align-items: center;
  min-height: 420px;
  padding: 56px 0 44px;
  border-bottom: 1px solid #d7dce5;
}

.demo-hero-copy {
  display: grid;
  gap: 18px;
  align-content: start;
}

.demo-hero h1 {
  margin: 0;
  font-size: clamp(44px, 8vw, 80px);
  line-height: 0.95;
  letter-spacing: 0;
}

.demo-hero p,
.demo-section-heading p {
  margin: 0;
  color: #57606a;
  font-size: 17px;
  line-height: 1.6;
}

.demo-showcase {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-content: center;
  justify-content: flex-start;
  padding: 28px;
  min-height: 220px;
  border: 1px solid #d7dce5;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 60px rgba(31, 35, 40, 0.08);
}

.demo-section {
  display: grid;
  gap: 24px;
  padding: 42px 0;
  border-bottom: 1px solid #d7dce5;
}

.demo-section-heading {
  display: grid;
  gap: 8px;
}

.demo-section h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: 0;
}

.demo-grid {
  display: grid;
  gap: 12px;
}

.demo-color-stack {
  display: grid;
  gap: 14px;
}

.demo-color-grid {
  display: grid;
  gap: 6px;
}

.demo-color-row {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.demo-color-header {
  align-items: end;
}

.demo-color-steps {
  display: grid;
  grid-template-columns: repeat(10, minmax(24px, 1fr));
  gap: 4px;
}

.demo-color-steps span {
  color: #57606a;
  font-size: 14px;
  line-height: 24px;
  font-weight: 700;
  text-align: center;
}

.demo-swatches {
  display: grid;
  grid-template-columns: repeat(10, minmax(24px, 1fr));
  gap: 4px;
}

.demo-swatch,
.demo-semantic-swatch {
  min-height: 22px;
  border: 1px solid rgba(31, 35, 40, 0.12);
  border-radius: 4px;
  background: var(--demo-swatch-color);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.demo-semantic-grid {
  display: grid;
  gap: 6px;
}

.demo-semantic-labels,
.demo-semantic-colors {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}

.demo-semantic-labels span {
  color: #57606a;
  font-size: 14px;
  line-height: 24px;
  font-weight: 700;
  text-align: center;
}

.demo-semantic-swatch {
  min-height: 42px;
}

.demo-row {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  padding: 16px 0;
}

.demo-row + .demo-row {
  border-top: 1px solid #e7ebf0;
}

.demo-row-label {
  color: #57606a;
  font-size: 14px;
  line-height: 24px;
  font-weight: 600;
}

.demo-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.demo-badges-large {
  gap: 14px;
}

@media (max-width: 760px) {
  .demo-page {
    width: min(100% - 24px, 1040px);
    padding: 24px 0;
  }

  .demo-hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding: 32px 0;
  }

  .demo-showcase {
    padding: 20px;
  }

  .demo-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .demo-color-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .demo-swatches {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .demo-color-steps {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .demo-semantic-labels,
  .demo-semantic-colors {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
