<template>
  <div class="space-y-3">
    <button class="btn-primary w-full" @click="openForm()">+ Добавить</button>

    <div v-if="loading" class="space-y-2">
      <SkeletonBox v-for="i in 3" :key="i" height="80px" width="100%" />
    </div>

    <div v-else class="space-y-2">
      <div v-for="item in items" :key="item.id" class="card p-3">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-slate-100 truncate">{{ item.title }}</p>
            <p class="text-xs text-slate-500 mt-0.5">{{ subtext(item) }}</p>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full" :class="item.is_active ? 'bg-brand-400' : 'bg-slate-600'" />
            <button class="p-1.5 rounded-lg hover:bg-surface-muted transition-colors text-slate-400 hover:text-slate-200"
              @click="openForm(item)">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="p-1.5 rounded-lg hover:bg-red-500/15 transition-colors text-slate-600 hover:text-red-400"
              @click="del(item.id)">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal form -->
    <div v-if="showForm" style="min-height:420px;background:rgba(0,0,0,0.6);display:flex;align-items:flex-end;justify-content:center;"
      class="fixed inset-0 z-50" @click.self="showForm = false">
      <div class="w-full bg-surface-card border border-surface-border rounded-t-3xl p-5 space-y-3 animate-slide-up">
        <div class="flex items-center justify-between mb-1">
          <h3 class="font-display font-semibold text-white text-sm">{{ editing ? 'Редактировать' : 'Добавить' }}</h3>
          <button class="text-slate-500 hover:text-white" @click="showForm = false">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div>
          <label class="form-label">Заголовок</label>
          <input v-model="formData.title" type="text" class="form-input" placeholder="Заголовок" />
        </div>

        <div v-if="type === 'news'">
          <label class="form-label">Текст</label>
          <textarea v-model="(formData as any).body" class="form-input" rows="3" placeholder="Текст новости" />
        </div>

        <div v-if="type === 'discounts'">
          <label class="form-label">Скидка (%)</label>
          <input v-model.number="(formData as any).percent" type="number" class="form-input" placeholder="20" />
        </div>

        <div v-if="type === 'discounts' || type === 'arrivals'">
          <label class="form-label">{{ type === 'discounts' ? 'Действует до' : 'Ожидаемая дата' }}</label>
          <input v-model="(formData as any)[dateField]" type="date" class="form-input" />
        </div>

        <div v-if="type === 'arrivals'">
          <label class="form-label">Описание</label>
          <textarea v-model="(formData as any).description" class="form-input" rows="2" placeholder="Что поступит" />
        </div>

        <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input v-model="formData.is_active" type="checkbox" class="accent-brand-500 w-4 h-4 rounded" />
          Активно
        </label>

        <button class="btn-primary w-full" :disabled="saving" @click="save">
          {{ saving ? 'Сохраняем...' : 'Сохранить' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { contentApi } from '@/api'
import SkeletonBox from '@/components/SkeletonBox.vue'

const props = defineProps<{ type: 'news' | 'discounts' | 'arrivals'; title: string }>()

const loading = ref(true)
const saving = ref(false)
const showForm = ref(false)
const editing = ref<string | null>(null)
const items = ref<any[]>([])

const dateField = computed(() => props.type === 'discounts' ? 'valid_until' : 'expected_date')

const formData = ref<any>({ title: '', is_active: true })

function subtext(item: any) {
  if (props.type === 'news') return item.published_at ? new Date(item.published_at).toLocaleDateString('ru-RU') : ''
  if (props.type === 'discounts') return `-${item.percent}% · до ${new Date(item.valid_until).toLocaleDateString('ru-RU')}`
  if (props.type === 'arrivals') return new Date(item.expected_date).toLocaleDateString('ru-RU')
  return ''
}

function openForm(item?: any) {
  if (item) { editing.value = item.id; formData.value = { ...item } }
  else { editing.value = null; formData.value = { title: '', is_active: true } }
  showForm.value = true
}

async function save() {
  saving.value = true
  try {
    const api = contentApi
    if (editing.value) {
      const fn = props.type === 'news' ? api.updateNews : props.type === 'discounts' ? api.updateDiscount : api.updateArrival
      const updated = await fn(editing.value, formData.value)
      const idx = items.value.findIndex(i => i.id === editing.value)
      if (idx !== -1) items.value[idx] = updated
    } else {
      const fn = props.type === 'news' ? api.createNews : props.type === 'discounts' ? api.createDiscount : api.createArrival
      items.value.unshift(await fn(formData.value))
    }
    showForm.value = false
  } finally { saving.value = false }
}

async function del(id: string) {
  const fn = props.type === 'news' ? contentApi.deleteNews : props.type === 'discounts' ? contentApi.deleteDiscount : contentApi.deleteArrival
  await fn(id)
  items.value = items.value.filter(i => i.id !== id)
}

async function load() {
  loading.value = true
  try {
    items.value = props.type === 'news' ? await contentApi.getNews()
      : props.type === 'discounts' ? await contentApi.getDiscounts()
      : await contentApi.getArrivals()
  } finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.form-label { @apply block text-xs font-semibold text-slate-400 mb-1.5; }
.form-input { @apply w-full bg-surface-muted border border-surface-border rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-brand-500 transition-colors resize-none; }
</style>
