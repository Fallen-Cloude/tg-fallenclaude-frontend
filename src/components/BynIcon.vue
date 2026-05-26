<!-- Кастомный символ белорусского рубля -->
<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" :class="cls">
    <!-- Вертикальная левая линия -->
    <line x1="5" y1="3" x2="5" y2="21" stroke="currentColor" :stroke-width="sw" stroke-linecap="round"/>
    <!-- Верхняя горизонтальная черта -->
    <line x1="3" y1="7" x2="9" y2="7" stroke="currentColor" :stroke-width="sw" stroke-linecap="round"/>
    <!-- Нижняя горизонтальная черта -->
    <line x1="3" y1="11" x2="9" y2="11" stroke="currentColor" :stroke-width="sw" stroke-linecap="round"/>
    <!-- Закруглённая правая часть — большая дуга -->
    <path d="M5 7 H13 C18 7 20 9 20 14 C20 19 17 21 12 21 H5" stroke="currentColor" :stroke-width="sw" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{ size?: number; strokeWidth?: number; class?: string }>()
const sw = 2
const cls = ''
</script>
