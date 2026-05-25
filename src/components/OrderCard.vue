<template>
  <div class="card p-3 space-y-2">
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="text-xs text-slate-500 font-mono">#{{ order.id.slice(-6).toUpperCase() }}</p>
        <p class="text-sm font-semibold text-slate-100 mt-0.5">{{ formatTime(order.pickup_time) }} · {{ formatDate(order.created_at) }}</p>
      </div>
      <StatusBadge :status="order.status" />
    </div>
    <div class="text-xs text-slate-500">
      {{ order.items.length }} {{ pluralize(order.items.length, 'товар', 'товара', 'товаров') }}
    </div>
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-500">{{ order.tg_username }}</span>
      <span class="font-display font-bold text-brand-400 text-sm">{{ formatPrice(order.total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'
import type { Order } from '@/types'

defineProps<{ order: Order }>()

function formatPrice(p: number) { return p.toLocaleString('ru-RU') + ' ₸' }
function formatDate(s: string) { return new Date(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }
function formatTime(t: string) { return t }
function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}
</script>
