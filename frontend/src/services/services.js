import api from './api'

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/user/profile'),
}

export const chatService = {
  sendMessage: (message, category = 'CHAT') =>
    api.post('/chat/message', { message, category }),
  getHistory: () => api.get('/chat/history'),
}

export const symptomService = {
  checkSymptoms: (symptoms, additionalInfo = '') =>
    api.post('/symptoms/check', { symptoms, additionalInfo }),
}

export const medicineService = {
  getMedicineInfo: (name) =>
    api.get(`/medicine/info?name=${encodeURIComponent(name)}`),
}

export const imageService = {
  analyzeImage: (file, type = 'OTHER') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    return api.post('/image/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export const reportService = {
  generateReport: (symptoms, aiAnalysis, doctorAdvice = '') =>
    api.post('/report/generate',
      { symptoms, aiAnalysis, doctorAdvice },
      { responseType: 'blob' }
    ),
}

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getChatHistory: () => api.get('/admin/chat-history'),
  getAppointments: () => api.get('/admin/appointments'),
}

export const appointmentService = {
  getMyAppointments: () => api.get('/appointments/my-appointments'),
  bookAppointment: (data) => api.post('/appointments/book', data),
  recommendDoctors: (symptoms) => api.post('/appointments/recommend', { symptoms }),
}
