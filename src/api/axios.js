import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_permissions')
      localStorage.removeItem('user_role')
      window.location.href = '/admin/auth/login'
    }
    return Promise.reject(error)
  },
)

export default instance

export const publicAxios = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
