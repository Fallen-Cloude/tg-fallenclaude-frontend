<template>
  <div class="flex flex-col min-h-full animate-fade-in">
    <!-- Header -->
    <div class="px-4 pt-6 pb-3 space-y-3 sticky top-0 z-10 bg-surface/90 backdrop-blur-xl border-b border-surface-border">
      <h1 class="font-display text-xl font-bold text-white">Каталог</h1>
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="search" type="search" placeholder="Поиск товаров..."
          class="w-full bg-surface-card border border-surface-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-brand-500 transition-colors" />
      </div>
      <!-- Categories -->
      <div class="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <button v-for="cat in [{ id: '', name: 'Все' }, ...categories]" :key="cat.id"
          class="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-95"
          :class="activeCategory === cat.id
            ? 'bg-brand-500 text-white'
            : 'bg-surface-card border border-surface-border text-slate-400'"
          @click="activeCategory = cat.id">
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Products grid -->
    <div class="flex-1 p-4">
      <div v-if="loading" class="grid grid-cols-2 gap-3">
        <SkeletonBox v-for="i in 6" :key="i" height="220px" width="100%" />
      </div>

      <div v-else-if="filtered.length" class="grid grid-cols-2 gap-3">
        <ProductCard v-for="p in filtered" :key="p.id" :product="p" class="animate-slide-up" />
      </div>

      <div v-else class="text-center py-20 text-slate-600">
        <p class="text-4xl mb-3">🔍</p>
        <p class="text-sm">Ничего не найдено</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productsApi } from '@/api'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonBox from '@/components/SkeletonBox.vue'
import type { Product, Category } from '@/types'

const loading = ref(true)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const activeCategory = ref('')
const search = ref('')

const filtered = computed(() => {
  return products.value
    .filter(p => !activeCategory.value || p.category_id === activeCategory.value)
    .filter(p => !search.value || p.name.toLowerCase().includes(search.value.toLowerCase()))
})

onMounted(async () => {
  try {
    const [prods, cats] = await Promise.all([productsApi.getAll(), productsApi.getCategories()])
    products.value = prods
    categories.value = cats.sort((a, b) => a.sort_order - b.sort_order)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { scrollbar-width: none; }
</style>
