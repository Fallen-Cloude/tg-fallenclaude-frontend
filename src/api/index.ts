import http from './http'
import type { Product, Category, Order, NewsItem, Discount, Arrival, ScheduleDay, OrderStatus } from '@/types'

export const productsApi = {
  getAll: () => http.get<Product[]>('/products').then(r => r.data),
  getOne: (id: string) => http.get<Product>(`/products/${id}`).then(r => r.data),
  getCategories: () => http.get<Category[]>('/categories').then(r => r.data),
}

export const ordersApi = {
  create: (data: {
    tg_username: string
    items: { product_id: string; quantity: number }[]
    pickup_time: string
  }) => http.post<Order>('/orders', data).then(r => r.data),

  getMine: () => http.get<Order[]>('/orders/mine').then(r => r.data),

  getAll: () => http.get<Order[]>('/admin/orders').then(r => r.data),

  updateStatus: (id: string, status: OrderStatus) =>
    http.patch<Order>(`/admin/orders/${id}/status`, { status }).then(r => r.data),
}

export const contentApi = {
  getNews:     () => http.get<NewsItem[]>('/news').then(r => r.data),
  getDiscounts:() => http.get<Discount[]>('/discounts').then(r => r.data),
  getArrivals: () => http.get<Arrival[]>('/arrivals').then(r => r.data),

  createNews:   (d: Omit<NewsItem, 'id'>) => http.post<NewsItem>('/admin/news', d).then(r => r.data),
  updateNews:   (id: string, d: Partial<NewsItem>) => http.put<NewsItem>(`/admin/news/${id}`, d).then(r => r.data),
  deleteNews:   (id: string) => http.delete(`/admin/news/${id}`),

  createDiscount:  (d: Omit<Discount, 'id'>) => http.post<Discount>('/admin/discounts', d).then(r => r.data),
  updateDiscount:  (id: string, d: Partial<Discount>) => http.put<Discount>(`/admin/discounts/${id}`, d).then(r => r.data),
  deleteDiscount:  (id: string) => http.delete(`/admin/discounts/${id}`),

  createArrival:  (d: Omit<Arrival, 'id'>) => http.post<Arrival>('/admin/arrivals', d).then(r => r.data),
  updateArrival:  (id: string, d: Partial<Arrival>) => http.put<Arrival>(`/admin/arrivals/${id}`, d).then(r => r.data),
  deleteArrival:  (id: string) => http.delete(`/admin/arrivals/${id}`),
}

export const scheduleApi = {
  get: () => http.get<ScheduleDay[]>('/schedule').then(r => r.data),
  getSlots: () => http.get<string[]>('/schedule/slots').then(r => r.data),
  update: (days: ScheduleDay[]) => http.put('/admin/schedule', { days }).then(r => r.data),
}
