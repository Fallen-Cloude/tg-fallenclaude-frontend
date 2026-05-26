<template>
  <div class="px-4 pt-6 pb-4 animate-fade-in">
    <h1 class="font-display text-xl font-bold text-white mb-4">Корзина</h1>

    <div v-if="!cart.items.length" class="text-center py-20">
      <p class="text-5xl mb-4">🛒</p>
      <p class="text-slate-500 text-sm mb-6">Корзина пуста</p>
      <RouterLink to="/catalog" class="btn-primary">Перейти в каталог</RouterLink>
    </div>

    <template v-else>
      <div class="space-y-2 mb-4">
        <div v-for="item in cart.items" :key="item.product.id" class="card p-3 flex items-center gap-3">
          <div class="w-16 h-16 rounded-xl bg-surface-muted overflow-hidden flex-shrink-0">
            <img v-if="item.product.image_url" :src="item.product.image_url" :alt="item.product.name"
              class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-100 line-clamp-1">{{ item.product.name }}</p>
            <div class="flex items-center gap-1 mt-0.5">
              <BynIcon :size="11" class="text-indigo-400" />
              <span class="text-indigo-400 font-display font-bold text-sm">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <button class="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center active:scale-90 transition-transform text-slate-400"
              @click="dec(item)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/></svg>
            </button>
            <span class="w-5 text-center font-bold text-sm text-white">{{ item.quantity }}</span>
            <button class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center active:scale-90 transition-transform"
              @click="cart.setQty(item.product.id, item.quantity + 1)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="card p-4 mb-4 flex justify-between items-center">
        <span class="text-slate-400 text-sm">Итого</span>
        <div class="flex items-center gap-1">
          <BynIcon :size="16" class="text-white" />
          <span class="font-display font-bold text-white text-xl">{{ formatPrice(cart.total) }}</span>
        </div>
      </div>

      <div class="card p-4 space-y-3">
        <h2 class="font-display font-semibold text-white text-sm">Оформление заказа</h2>

        <div>
          <label class="form-label">Telegram username</label>
          <input v-model="form.username" type="text" placeholder="@username"
            class="form-input" :class="{ 'border-red-500': errors.username }" />
          <p v-if="errors.username" class="text-red-400 text-xs mt-1">{{ errors.username }}</p>
        </div>

        <div>
          <label class="form-label">Время самовывоза</label>
          <div v-if="loadingSlots" class="form-input text-slate-600 text-sm">Загрузка расписания...</div>
          <div v-else-if="!slots.length" class="form-input text-red-400 text-sm">
            Сегодня выходной — свяжитесь с нами
          </div>
          <select v-else v-model="form.pickup_time" class="form-input"
            :class="{ 'border-red-500': errors.pickup_time }">
            <option value="" disabled>Выберите время</option>
            <option v-for="slot in slots" :key="slot" :value="slot">{{ slot }}</option>
          </select>
          <p v-if="errors.pickup_time" class="text-red-400 text-xs mt-1">{{ errors.pickup_time }}</p>
        </div>

        <button class="btn-primary w-full mt-2" :disabled="submitting" @click="submit">
          {{ submitting ? 'Оформляем...' : 'Оформить заказ' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useTelegram } from '@/composables/useTelegram'
import { ordersApi, scheduleApi } from '@/api'
import BynIcon from '@/components/BynIcon.vue'

const cart = useCartStore()
const router = useRouter()
const { user, haptic, notify } = useTelegram()

const slots = ref<string[]>([])
const loadingSlots = ref(true)
const submitting = ref(false)

const form = ref({
  username: user.value?.username ? '@' + user.value.username : '',
  pickup_time: '',
})
const errors = ref<{ username?: string; pickup_time?: string }>({})

function formatPrice(p: number) { return p.toLocaleString('ru-RU') }

function dec(item: { product: { id: string }; quantity: number }) {
  if (item.quantity <= 1) cart.remove(item.product.id)
  else cart.setQty(item.product.id, item.quantity - 1)
}

function validate() {
  errors.value = {}
  if (!form.value.username.trim()) errors.value.username = 'Введите username'
  else if (!form.value.username.startsWith('@')) errors.value.username = 'Username должен начинаться с @'
  if (!form.value.pickup_time) errors.value.pickup_time = 'Выберите время'
  return !Object.keys(errors.value).length
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  haptic('medium')
  try {
    await ordersApi.create({
      tg_username: form.value.username,
      items: cart.items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      pickup_time: form.value.pickup_time,
    })
    notify('success')
    cart.clear()
    router.push('/profile')
  } catch {
    notify('error')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try { slots.value = await scheduleApi.getSlots() }
  finally { loadingSlots.value = false }
})
</script>

<style scoped>
.form-label { @apply block text-xs font-semibold text-slate-400 mb-1.5; }
.form-input { @apply w-full bg-surface-muted border border-surface-border rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors; }
</style>
