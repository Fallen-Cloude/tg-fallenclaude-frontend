import http from './http';
export const productsApi = {
    getAll: () => http.get('/products').then(r => r.data),
    getOne: (id) => http.get(`/products/${id}`).then(r => r.data),
    getCategories: () => http.get('/categories').then(r => r.data),
    getSubCategories: () => http.get('/subcategories').then(r => r.data),
    getSubSubCategories: () => http.get('/subsubcategories').then(r => r.data),
};
export const ordersApi = {
    create: (data) => http.post('/orders', data, { timeout: 30000 }).then(r => r.data),
    getMine: () => http.get('/orders/mine').then(r => r.data),
    getAll: () => http.get('/admin/orders').then(r => r.data),
    updateStatus: (id, status) => http.patch(`/admin/orders/${id}/status`, { status }).then(r => r.data),
};
export const contentApi = {
    getNews: () => http.get('/news').then(r => r.data),
    getDiscounts: () => http.get('/discounts').then(r => r.data),
    checkDiscount: (data) => http.post('/discounts/check', data).then(r => r.data),
    getArrivals: () => http.get('/arrivals').then(r => r.data),
    createNews: (d) => http.post('/admin/news', d).then(r => r.data),
    updateNews: (id, d) => http.put(`/admin/news/${id}`, d).then(r => r.data),
    deleteNews: (id) => http.delete(`/admin/news/${id}`),
    createDiscount: (d) => http.post('/admin/discounts', d).then(r => r.data),
    updateDiscount: (id, d) => http.put(`/admin/discounts/${id}`, d).then(r => r.data),
    deleteDiscount: (id) => http.delete(`/admin/discounts/${id}`),
    createArrival: (d) => http.post('/admin/arrivals', d).then(r => r.data),
    updateArrival: (id, d) => http.put(`/admin/arrivals/${id}`, d).then(r => r.data),
    deleteArrival: (id) => http.delete(`/admin/arrivals/${id}`),
};
export const scheduleApi = {
    get: () => http.get('/schedule').then(r => r.data),
    getAvailableDays: () => http.get('/schedule/available-days').then(r => r.data),
    getSlots: (date) => http.get('/schedule/slots', { params: date ? { date } : {} }).then(r => r.data),
    update: (days, interval) => http.put('/admin/schedule', { days, interval }).then(r => r.data),
};
