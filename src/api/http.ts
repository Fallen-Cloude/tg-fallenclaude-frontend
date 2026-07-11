import axios from 'axios'

// Конфигурация по умолчанию для всех запросов
const defaultConfig = {
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000, // Увеличенный таймаут (15 сек)
  maxRetries: 2, // Количество повторных попыток
  retryDelay: 1000, // Задержка между попытками в мс
}

// Создание экземпляра с базовой конфигурацией
const http = axios.create(defaultConfig)

// Интерцептор запросов - добавление Telegram данных
http.interceptors.request.use((config) => {
  const tg = window.Telegram?.WebApp
  if (tg?.initData) {
    config.headers['X-Telegram-Init-Data'] = tg.initData
  }
  return config
})

// Интерцептор ответов - обработка ошибок с retry logic
let retryCount = 0

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Не пытаться повторить запросы, которые уже были повторены или содержат body
    if (config?._retry || error.response?.status === 400 || error.response?.status === 409) {
      return Promise.reject(error)
    }

    const status = error.response?.status

    // Повторная попытка только для сетевых ошибок и временных сбоев (5xx, timeout)
    if (status === 500 || status === 502 || status === 503 || status === 504 || !status) {
      retryCount++

      if (retryCount <= defaultConfig.maxRetries) {
        // Добавляем флаг, чтобы не повторять снова
        config._retry = true

        // Экспоненциальная задержка: 1с, 2с, 4с...
        const delay = defaultConfig.retryDelay * Math.pow(2, retryCount - 1)

        console.warn(`API запрос ${error.config?.method} ${error.config?.url}: повторная попытка ${retryCount}/${defaultConfig.maxRetries} через ${delay}мс`)

        try {
          await new Promise(resolve => setTimeout(resolve, delay))
          return http.request(config)
        } catch (retryError) {
          console.error('Повторная попытка не удалась:', retryError)
          return Promise.reject(retryError)
        }
      } else {
        console.error(`API запрос ${error.config?.method} ${error.config?.url}: все повторные попытки (${defaultConfig.maxRetries}) исчерпаны`)
      }
    }

    // Обычная ошибка - выводим сообщение и передаем дальше
    const errorMessage = error.response?.data?.message || 
                        error.response?.data || 
                        error.message || 
                        'Неизвестная ошибка API'

    console.error('API error:', errorMessage)

    return Promise.reject(error)
  }
)

export default http
