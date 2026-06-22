<template>
  <div class="d-flex justify-content-center align-items-center mt-2" style="min-height:70vh;">
    <div class="card p-4" :class="{ 'rtl-card': currentLocale === 'ar' }" style="width:420px;">
      <div class="d-flex justify-content-center">
        <img :src="imageUrl" alt="Logo" style="width:150px;">
      </div>

      <h4 class="mb-2 text-center mt-3">{{ t.resetPasswordTitle }}</h4>
      <p class="text-center text-muted small mb-4">{{ t.resetPasswordSubtitle }}</p>

      <div v-if="errorMessage" class="alert alert-danger py-2 text-center small mb-3">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">{{ t.password }}</label>
          <div class="password-wrapper">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              :placeholder="t.passwordPlaceholder"
              required
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">{{ t.confirmPassword }}</label>
          <div class="password-wrapper">
            <input
              v-model="password_confirmation"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              :placeholder="t.confirmPasswordPlaceholder"
              required
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" :disabled="loading">
            {{ loading ? t.saving : t.resetPassword }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from '../../api/axios'
import authTranslations from '../../locales/auth.js'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const password = ref('')
    const password_confirmation = ref('')
    const loading = ref(false)
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const errorMessage = ref('')
    const currentLocale = ref('en')

    const t = computed(() => authTranslations[currentLocale.value])

    const initLanguage = () => {
      currentLocale.value = localStorage.getItem('auth_locale') || 'en'
    }

    const submit = async () => {
      errorMessage.value = ''

      if (password.value !== password_confirmation.value) {
        errorMessage.value = t.value.passwordMismatch
        return
      }

      loading.value = true
      try {
        await axios.post('/reset-password', {
          token: route.query.token,
          email: route.query.email,
          password: password.value,
          password_confirmation: password_confirmation.value
        })
        router.push('/admin/auth/login')
      } catch (error) {
        errorMessage.value = t.value.resetPasswordFailed
      } finally {
        loading.value = false
      }
    }

    onMounted(() => initLanguage())

    return {
      password, password_confirmation, loading, submit, t,
      currentLocale, showPassword, showConfirmPassword, errorMessage
    }
  },
  data() {
    return { imageUrl: '/images/logo/allan_logo1.png' }
  }
}
</script>
