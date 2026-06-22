import { defineStore } from 'pinia'
import instance from '@/api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    permissions: [],
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    userRole: (state) => state.user?.role,
  },

  actions: {
    async register(userData) {
      try {
        const res = await instance.post('/register', userData)
        console.log('Register response:', res.data)

        this.token = res.data.token
        localStorage.setItem('auth_token', this.token)
        await this.fetchUser()
        return res
      } catch (error) {
        throw error
      }
    },

    async login(credentials) {
      try {
        const res = await instance.post('/login', credentials)
        console.log('Login response:', res.data)

        this.token = res.data.token || res.data.access_token
        this.user = res.data.user || res.data.data
        this.permissions = res.data.permissions || []

        localStorage.setItem('auth_token', this.token)
        localStorage.setItem('user_permissions', JSON.stringify(this.permissions))
        localStorage.setItem('user_role', this.user?.role || 'user')

        await this.fetchUser()
        return res
      } catch (error) {
        console.error('login error:', error.response?.data)
        throw error
      }
    },

    async fetchUser() {
      if (!this.token) return
      try {
        const res = await instance.get('/user')
        this.user = res.data.data || res.data
        // تحديث الصلاحيات إذا جاءت من الـ API
        if (res.data.permissions) {
          this.permissions = res.data.permissions
          localStorage.setItem('user_permissions', JSON.stringify(this.permissions))
        }
        localStorage.setItem('user_role', this.user?.role || 'user')
      } catch (error) {
        console.error('fetchUser error:', error)
        this.logout()
      }
    },

    // تسجيل الخروج
    async logout() {
      try {
        await instance.post('/logout')
      } catch (error) {
        // تجاهل الخطأ
      } finally {
        this.user = null
        this.token = null
        this.permissions = []
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_permissions')
        localStorage.removeItem('user_role')
      }
    },

    updatePermissions(permissions) {
      this.permissions = permissions
      localStorage.setItem('user_permissions', JSON.stringify(permissions))
    },

    hasPermission(permission) {
      if (this.isAdmin) return true
      return this.permissions.includes(permission)
    },

    hasAnyPermission(permissions) {
      if (this.isAdmin) return true
      return permissions.some(p => this.permissions.includes(p))
    },

    // التحقق من وجود كل الصلاحيات
    hasAllPermissions(permissions) {
      if (this.isAdmin) return true
      return permissions.every(p => this.permissions.includes(p))
    }
  }
})



