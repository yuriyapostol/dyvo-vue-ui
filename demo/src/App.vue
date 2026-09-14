<script setup lang="ts">
import { DyvoBadge, DyvoUserBadge } from '../../src'

const colors = ['info', 'tip', 'warning', 'danger', 'success'] as const
const variants = ['soft', 'accent', 'solid', 'outline', 'plain'] as const
const sizes = ['small', 'medium', 'large'] as const
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
        <h2 id="sizes-title">Sizes</h2>
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
}
</style>
