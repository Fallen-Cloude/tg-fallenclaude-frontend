<template>
  <div class="px-4 pt-6 pb-4 space-y-5 animate-fade-in">
    <!-- User card -->
    <div class="card p-4 flex items-center gap-4">
      <div class="w-14 h-14 rounded-2xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
        <span class="font-display font-bold text-brand-400 text-xl">
          {{ initials }}
        </span>
      </div>
      <div class="min-w-0">
        <p class="font-display font-bold text-white text-base">{{ fullName }}</p>
        <p v-if="user?.username" class="text-slate-500 text-sm mt-0.5">@{{ user.username }}</p>
        <p class="text-slate-600 text-xs mt-1">Зарегистрирован {{ regDate }}</p>
      </div>
    </div>

    <!-- Active orders -->
    <section>
      <h2 class="section-title">Текущие заказы</h2>
      <div v-if="loadingOrders" class="space-y-2">
        <SkeletonBox v-for="i in 2" :key="i" height="80px" width="100%" />
      </div>
      <div v-else-if="activeOrders.length" class="space-y-2">
        <OrderCard v-for="o in activeOrders" :key="o.id" :order="o" />
      </div>
      <p v-else class="text-slate-600 text-sm">Активных заказов нет</p>
    </section>

    <!-- Order history -->
    <section v-if="doneOrders.length">
      <h2 class="section-title">История заказов</h2>
      <div class="space-y-2">
        <OrderCard v-for="o in doneOrders" :key="o.id" :order="o" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTelegram } from '@/composables/useTelegram'
import { ordersApi } from '@/api'
import SkeletonBox from '@/components/SkeletonBox.vue'
import OrderCard from '@/components/OrderCard.vue'
import type { Order } from '@/types'

const { user } = useTelegram()
const loadingOrders = ref(true)
const orders = ref<Order[]>([])

const fullName = computed(() => [user.value?.first_name, user.value?.last_name].filter(Boolean).join(' ') || 'Пользователь')
const initials = computed(() => fullName.value.slice(0, 2).toUpperCase())
const regDate = computed(() => new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }))

const activeOrders = computed(() => orders.value.filter(o => ['new', 'confirmed'].includes(o.status)))
const doneOrders = computed(() => orders.value.filter(o => ['done', 'cancelled'].includes(o.status)))

onMounted(async () => {
  try { orders.value = await ordersApi.getMine() }
  finally { loadingOrders.value = false }
})
</script>

<style scoped>
.section-title { @apply font-display text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2; }
</style>
