<template>
  <div class="px-4 pt-6 pb-4 space-y-6 animate-fade-in">
    <div>
      <h1 class="font-display text-xl font-bold text-white">Главная</h1>
      <p class="text-slate-400 text-sm mt-0.5">{{ greeting }}</p>
    </div>

    <section v-if="loading">
      <SkeletonBox v-for="i in 4" :key="i" height="80px" width="100%" class="mb-3" />
    </section>

    <template v-else>
      <!-- 1. Новости -->
      <section v-if="news.length">
        <h2 class="section-title">Новости</h2>
        <div class="space-y-3">
          <div v-for="n in news" :key="n.id" class="card p-4">
            <p class="font-semibold text-sm text-slate-100">{{ n.title }}</p>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">{{ n.body }}</p>
            <p class="text-xs text-slate-600 mt-2">{{ formatDate(n.published_at) }}</p>
          </div>
        </div>
      </section>

      <!-- 2. Скидки -->
      <section v-if="discounts.length">
        <h2 class="section-title">Скидки</h2>
        <div class="space-y-2">
          <div v-for="d in discounts" :key="d.id"
            class="card p-4 flex items-center gap-3 active:scale-[0.98] transition-transform duration-150 cursor-pointer"
            @click="goToCart(d)">
            <div class="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <span class="font-display text-red-400 font-bold text-sm">-{{ d.percent }}%</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-sm text-slate-100 truncate">{{ d.title }}</p>
              <p class="text-xs text-slate-500 mt-0.5">До {{ formatDate(d.valid_until) }}</p>
              <!-- Условия -->
              <div class="flex flex-wrap gap-1 mt-1.5">
                <span v-if="d.min_items > 1" class="text-[10px] bg-surface-muted px-1.5 py-0.5 rounded text-slate-400">
                  от {{ d.min_items }} ед.
                </span>
                <span v-if="d.requires_group" class="text-[10px] bg-surface-muted px-1.5 py-0.5 rounded text-slate-400">
                  участник группы
                </span>
                <span v-if="d.max_reg_days > 0" class="text-[10px] bg-surface-muted px-1.5 py-0.5 rounded text-slate-400">
                  новым за {{ d.max_reg_days }} дн.
                </span>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </section>

      <!-- 3. Поступления -->
      <section v-if="arrivals.length">
        <h2 class="section-title">Ближайшие поступления</h2>
        <div class="space-y-2">
          <div v-for="a in arrivals" :key="a.id" class="card p-4 flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-sm text-slate-100">{{ a.title }}</p>
              <p class="text-xs text-indigo-400 mt-0.5">{{ formatDate(a.expected_date) }}</p>
              <p v-if="a.description" class="text-xs text-slate-500 mt-1">{{ a.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <div v-if="!news.length && !discounts.length && !arrivals.length"
        class="text-center py-16 text-slate-600">
        <p class="text-4xl mb-3">📭</p>
        <p class="text-sm">Новостей пока нет</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { contentApi } from '@/api'
import { useTelegram } from '@/composables/useTelegram'
import { useCartStore } from '@/stores/cart'
import SkeletonBox from '@/components/SkeletonBox.vue'
import type { NewsItem, Discount, Arrival } from '@/types'

const { user } = useTelegram()
const router = useRouter()
const cart = useCartStore()
const loading = ref(true)
const news = ref<NewsItem[]>([])
const discounts = ref<Discount[]>([])
const arrivals = ref<Arrival[]>([])

const greeting = computed(() => {
  const name = user.value?.first_name
  return name ? `Привет, ${name}!` : 'Добро пожаловать!'
})

function formatDate(s: string) {
  if (!s) return ''
  return new Date(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

function goToCart(discount: Discount) {
  router.push({ path: '/cart', query: { discount_id: discount.id } })
}

onMounted(async () => {
  try {
    const [n, d, a] = await Promise.all([
      contentApi.getNews(),
      contentApi.getDiscounts(),
      contentApi.getArrivals(),
    ])
    news.value = n.filter(x => x.is_active)
    discounts.value = d.filter(x => x.is_active)
    arrivals.value = a.filter(x => x.is_active)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.section-title { @apply font-display text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2; }
</style>
