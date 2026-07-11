<template>
  <div class="preloader-overlay" :class="{ 'is-visible': isVisible }">
    <div class="preloader-content">
      <div class="preloader-spinner"></div>
      <h2 class="preloader-title">Загрузка...</h2>
      <p class="preloader-subtitle">Пожалуйста, подождите</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(true)

// Скрываем preloader после полной загрузки приложения
onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
  }, 1500)
})
</script>

<style scoped>
.preloader-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.preloader-overlay.is-visible {
  opacity: 1;
  visibility: visible;
}

.preloader-overlay:not(.is-visible) {
  opacity: 0;
  visibility: hidden;
}

.preloader-content {
  text-align: center;
  color: var(--text-primary);
}

.preloader-spinner {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  position: relative;
}

.preloader-spinner::before,
.preloader-spinner::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  animation: preloader-spin 1.2s cubic-bezier(0.5, 0, 0.35, 1) infinite;
}

.preloader-spinner::before {
  top: -6px;
  left: -6px;
  width: 100%;
  height: 100%;
  border: 4px solid var(--surface-border);
  border-color: var(--surface-border) transparent var(--surface-border) transparent;
}

.preloader-spinner::after {
  top: -6px;
  left: -6px;
  width: 100%;
  height: 100%;
  border: 4px solid var(--surface-border);
  border-color: transparent var(--surface-border) transparent var(--surface-border);
  animation: preloader-spin-reverse 1.2s cubic-bezier(0.5, 0, 0.35, 1) infinite;
}

@keyframes preloader-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes preloader-spin-reverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

.preloader-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--text-primary);
}

.preloader-subtitle {
  font-size: 14px;
  margin: 0;
  color: var(--text-secondary);
  opacity: 0.8;
}
</style>
