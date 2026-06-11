<template>
  <div class="flex flex-col min-h-dvh">
    <main class="flex-1 overflow-y-auto overscroll-y-contain pb-[calc(var(--nav-h)+var(--tg-safe-bottom))]">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="$route.name" />
        </Transition>
      </RouterView>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-surface-border bg-surface/90 backdrop-blur-xl"
         :style="{ paddingBottom: 'var(--tg-safe-bottom)' }">
      <div class="flex h-16 items-stretch">
        <NavTab v-for="tab in tabs" :key="tab.to" v-bind="tab" />
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTelegram } from '@/composables/useTelegram'
import { useCartStore } from '@/stores/cart'
import NavTab from '@/components/NavTab.vue'

const { ready, isAdmin } = useTelegram()
const cart = useCartStore()

onMounted(async () => {
  ready()
  await cart.hydrate()
})

const tabs = computed(() => {
  const base = [
    { to: '/',         icon: 'home',    label: 'Главная' },
    { to: '/catalog',  icon: 'grid',    label: 'Каталог' },
    { to: '/cart',     icon: 'cart',    label: 'Корзина', badge: cart.count || undefined },
    { to: '/profile',  icon: 'user',    label: 'Профиль' },
    { to: '/contacts', icon: 'phone',   label: 'Контакты' },
  ]
  if (isAdmin.value) base.push({ to: '/admin', icon: 'shield', label: 'Админ' })
  return base
})
</script>

<style>
.page-enter-active { animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
.page-leave-active { animation: fadeOut 0.15s ease; }
@keyframes fadeOut { to { opacity: 0; transform: translateY(-8px); } }
</style>
