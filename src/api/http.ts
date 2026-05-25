import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp
  if (tg?.initData) {
    config.headers['X-Telegram-Init-Data'] = tg.initData
  }
  return config
})

http.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('API error:', err.response?.data ?? err.message)
    return Promise.reject(err)
  }
)

export default http
