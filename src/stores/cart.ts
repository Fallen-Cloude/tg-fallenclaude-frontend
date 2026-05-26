import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(
    JSON.parse(localStorage.getItem('cart') ?? '[]')
  )

  function save() { localStorage.setItem('cart', JSON.stringify(items.value)) }

  const count = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const total = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))

  function add(product: Product, price: number, qty = 1) {
    const ex = items.value.find(i => i.product.id === product.id)
    if (ex) ex.quantity += qty
    else items.value.push({ product, quantity: qty, price })
    save()
  }

  function remove(productId: string) {
    items.value = items.value.filter(i => i.product.id !== productId)
    save()
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) { remove(productId); return }
    const item = items.value.find(i => i.product.id === productId)
    if (item) { item.quantity = qty; save() }
  }

  function clear() { items.value = []; save() }

  return { items, count, total, add, remove, setQty, clear }
})
