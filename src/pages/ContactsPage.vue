<template>
  <div class="px-4 pt-6 pb-4 space-y-4 animate-fade-in">
    <h1 class="font-display text-xl font-bold text-white">Контакты</h1>

    <div class="space-y-3">
      <a v-for="c in contacts" :key="c.label" :href="c.href" target="_blank"
        class="card p-4 flex items-center gap-4 active:scale-[0.98] transition-transform duration-150">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" :class="c.bg">
          <svg class="w-5 h-5" :class="c.color" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" v-html="c.icon" />
        </div>
        <div class="min-w-0">
          <p class="text-xs text-slate-500">{{ c.label }}</p>
          <p class="text-sm font-semibold text-slate-100 truncate">{{ c.value }}</p>
        </div>
        <svg class="ml-auto w-4 h-4 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </a>
    </div>

    <!-- Расписание -->
    <div class="card p-4">
      <h2 class="font-display text-sm font-semibold text-white mb-3">Режим работы</h2>
      <div v-if="loadingSchedule" class="space-y-2">
        <SkeletonBox v-for="i in 7" :key="i" height="28px" width="100%" />
      </div>
      <div v-else class="space-y-1.5">
        <div v-for="day in schedule" :key="day.day" class="flex items-center justify-between">
          <span class="text-sm text-slate-400 w-28">{{ dayNames[day.day] }}</span>
          <span v-if="day.is_open" class="text-sm text-slate-200">{{ day.open_time }} – {{ day.close_time }}</span>
          <span v-else class="text-sm text-slate-600">Выходной</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { scheduleApi } from '@/api'
import SkeletonBox from '@/components/SkeletonBox.vue'
import type { ScheduleDay } from '@/types'

const schedule = ref<ScheduleDay[]>([])
const loadingSchedule = ref(true)

const dayNames: Record<string, string> = {
  mon: 'Понедельник', tue: 'Вторник', wed: 'Среда',
  thu: 'Четверг', fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье'
}

const contacts = [
  {
    label: 'Telegram',
    value: '@yourshop',
    href: 'https://t.me/yourshop',
    bg: 'bg-blue-500/15',
    color: 'text-blue-400',
    icon: '<path d="M21.5 2.5l-19 7.5 7 2.5 2.5 7 3-5 5 4 1.5-16z"/><path d="M9.5 12.5l5-3"/>',
  },
  {
    label: 'WhatsApp / Телефон',
    value: '+7 (777) 000-00-00',
    href: 'tel:+77770000000',
    bg: 'bg-indigo-500/15',
    color: 'text-indigo-400',
    icon: '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.07 9.81 19.79 19.79 0 011 1.18 2 2 0 013 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>',
  },
  {
    label: 'Адрес',
    value: 'г. Минск, ул. Примерная, 1',
    href: 'https://maps.google.com',
    bg: 'bg-amber-500/15',
    color: 'text-amber-400',
    icon: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
  },
]

onMounted(async () => {
  try {
    const data = await scheduleApi.get()
    schedule.value = data.days
  } finally {
    loadingSchedule.value = false
  }
})
</script>
