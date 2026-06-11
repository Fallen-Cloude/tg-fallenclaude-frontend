import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsApi } from '@/api'
import type { CartItem, Product } from '@/types'

type StoredItem = { product_id: string; quantity: number }

function readStored(): StoredItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem('cart') ?? '[]')
    if (!Array.isArray(raw)) return []
    return raw
      .map((item: { product_id?: string; product?: Product; quantity?: number }) => {
        const product_id = item.product_id ?? item.product?.id
        const quantity = item.quantity ?? 0
        if (!product_id || quantity <= 0) return null
        return { product_id, quantity }
      })
      .filter(Boolean) as StoredItem[]
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const hydrated = ref(false)

  function save() {
    const stored: StoredItem[] = items.value.map(i => ({
      product_id: i.product.id,
      quantity: i.quantity,
    }))
    localStorage.setItem('cart', JSON.stringify(stored))
  }

  async function hydrate() {
    const stored = readStored()
    if (!stored.length) {
      items.value = []
      hydrated.value = true
      return
    }
    const [products, subsubs] = await Promise.all([
      productsApi.getAll(),
      productsApi.getSubSubCategories(),
    ])
    const next: CartItem[] = []
    for (const entry of stored) {
      const product = products.find(p => p.id === entry.product_id)
      if (!product) continue
      const ssub = subsubs.find(s => s.id === product.subsubcategory_id)
      if (!ssub) continue
      next.push({
        product,
        quantity: Math.min(entry.quantity, product.stock > 0 ? product.stock : entry.quantity),
        price: ssub.price,
      })
    }
    items.value = next
    save()
    hydrated.value = true
  }

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

  return { items, count, total, hydrated, hydrate, add, remove, setQty, clear }
})
