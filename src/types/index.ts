export interface Product {
  id: string
  name: string
  category_id: string
  price: number
  description: string
  image_url: string
  in_stock: boolean
  sort_order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  tg_username: string
  tg_user_id: number
  items: CartItem[]
  total: number
  pickup_time: string
  status: OrderStatus
  created_at: string
}

export type OrderStatus = 'new' | 'confirmed' | 'done' | 'cancelled'

export interface NewsItem {
  id: string
  title: string
  body: string
  published_at: string
  is_active: boolean
}

export interface Discount {
  id: string
  title: string
  percent: number
  valid_until: string
  is_active: boolean
}

export interface Arrival {
  id: string
  title: string
  expected_date: string
  description: string
  is_active: boolean
}

export interface ScheduleDay {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  open_time: string
  close_time: string
  is_open: boolean
}

export interface TgUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}
