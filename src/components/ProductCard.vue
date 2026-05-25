<template>
  <RouterLink :to="`/catalog/${product.id}`"
    class="card flex flex-col overflow-hidden group active:scale-[0.98] transition-transform duration-150">
    <div class="relative aspect-square bg-surface-muted overflow-hidden">
      <img v-if="product.image_url" :src="product.image_url" :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
        <svg class="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        </svg>
      </div>
      <div v-if="!product.in_stock"
        class="absolute inset-0 bg-surface/70 flex items-center justify-center">
        <span class="badge bg-red-500/20 text-red-400 text-xs">Нет в наличии</span>
      </div>
    </div>
    <div class="p-3 flex flex-col gap-1.5">
      <p class="text-sm font-semibold leading-tight text-slate-100 line-clamp-2">{{ product.name }}</p>
      <div class="flex items-center justify-between mt-auto pt-1">
        <span class="font-display text-brand-400 font-semibold text-sm">{{ formatPrice(product.price) }}</span>
        <button v-if="product.in_stock"
          class="w-8 h-8 rounded-xl bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-white transition-all duration-150 flex items-center justify-center active:scale-90"
          @click.prevent="onAdd">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useTelegram } from '@/composables/useTelegram'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()
const { haptic } = useTelegram()

function formatPrice(p: number) {
  return p.toLocaleString('ru-RU') + ' ₸'
}
function onAdd() {
  haptic('medium')
  cart.add(props.product)
}
</script>
