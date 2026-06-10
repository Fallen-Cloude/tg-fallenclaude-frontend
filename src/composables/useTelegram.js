import { ref, computed } from 'vue';
const tg = window.Telegram?.WebApp;
export function useTelegram() {
    const user = ref(tg?.initDataUnsafe?.user ?? null);
    const initData = tg?.initData ?? '';
    const isAdmin = computed(() => {
        const adminUsername = import.meta.env.VITE_ADMIN_USERNAME;
        return !!adminUsername && user.value?.username === adminUsername;
    });
    function ready() {
        tg?.ready();
        tg?.expand();
        tg?.disableVerticalSwipes?.();
        tg?.enableClosingConfirmation?.();
    }
    function haptic(style = 'light') {
        tg?.HapticFeedback?.impactOccurred(style);
    }
    function notify(type) {
        tg?.HapticFeedback?.notificationOccurred(type);
    }
    return { user, initData, isAdmin, ready, haptic, notify, tg };
}
