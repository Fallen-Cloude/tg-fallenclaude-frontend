<template>
  <div class="px-4 pt-6 pb-4 space-y-6 animate-fade-in">
    <div>
      <h1 class="font-display text-xl font-bold text-white">Главная</h1>
      <p class="text-slate-400 text-sm mt-0.5">{{ greeting }}</p>
    </div>

    <section v-if="loading">
      <SkeletonBox v-for="i in 3" :key="i" height="80px" width="100%" class="mb-3" />
    </section>

    <template v-else>
      <!-- Скидки -->
      <section v-if="discounts.length">
        <h2 class="section-title">Скидки</h2>
        <div class="space-y-2">
          <div v-for="d in discounts" :key="d.id" class="card p-4 flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <span class="font-display text-red-400 font-bold text-sm">-{{ d.percent }}%</span>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-sm text-slate-100 truncate">{{ d.title }}</p>
              <p class="text-xs text-slate-500 mt-0.5">До {{ formatDate(d.valid_until) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Поступления -->
      <section v-if="arrivals.length">
        <h2 class="section-title">Ближайшие поступления</h2>
        <div class="space-y-2">
          <div v-for="a in arrivals" :key="a.id" class="card p-4 flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-brand-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-semibold text-sm text-slate-100">{{ a.title }}</p>
              <p class="text-xs text-brand-400 mt-0.5">{{ formatDate(a.expected_date) }}</p>
              <p v-if="a.description" class="text-xs text-slate-500 mt-1">{{ a.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Новости -->
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
import { contentApi } from '@/api'
import { useTelegram } from '@/composables/useTelegram'
import SkeletonBox from '@/components/SkeletonBox.vue'
import type { NewsItem, Discount, Arrival } from '@/types'

const { user } = useTelegram()
const loading = ref(true)
const news = ref<NewsItem[]>([])
const discounts = ref<Discount[]>([])
const arrivals = ref<Arrival[]>([])

const greeting = computed(() => {
  const name = user.value?.first_name
  return name ? `Привет, ${name}!` : 'Добро пожаловать!'
})

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
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
.section-title { @apply font-display text-sm font-semibold text-slate-400 uppercase tracking-widest mb-2; }
</style>
