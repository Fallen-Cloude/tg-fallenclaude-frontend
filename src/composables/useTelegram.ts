import { ref, computed } from 'vue'
import type { TgUser } from '@/types'

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        initDataUnsafe: { user?: TgUser }
        ready(): void
        close(): void
        expand(): void
        disableVerticalSwipes(): void
        enableClosingConfirmation(): void
        disableClosingConfirmation(): void
        MainButton: {
          text: string
          show(): void
          hide(): void
          onClick(fn: () => void): void
          offClick(fn: () => void): void
          showProgress(leaveActive: boolean): void
          hideProgress(): void
          enable(): void
          disable(): void
        }
        BackButton: {
          show(): void
          hide(): void
          onClick(fn: () => void): void
          offClick(fn: () => void): void
        }
        HapticFeedback: {
          impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
          notificationOccurred(type: 'error' | 'success' | 'warning'): void
          selectionChanged(): void
        }
        themeParams: { bg_color?: string; text_color?: string }
        colorScheme: 'light' | 'dark'
        isExpanded: boolean
      }
    }
  }
}

const tg = window.Telegram?.WebApp

export function useTelegram() {
  const user = ref<TgUser | null>(tg?.initDataUnsafe?.user ?? null)
  const initData = tg?.initData ?? ''

  const isAdmin = computed(() => {
    const adminUsername = import.meta.env.VITE_ADMIN_USERNAME
    return !!adminUsername && user.value?.username === adminUsername
  })

  function ready() {
    tg?.ready()
    tg?.expand()
    tg?.disableVerticalSwipes?.()
    tg?.enableClosingConfirmation?.()
  }
  function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
    tg?.HapticFeedback?.impactOccurred(style)
  }
  function notify(type: 'success' | 'error' | 'warning') {
    tg?.HapticFeedback?.notificationOccurred(type)
  }

  return { user, initData, isAdmin, ready, haptic, notify, tg }
}
