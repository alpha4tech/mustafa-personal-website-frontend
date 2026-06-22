<template>
  <div class="d-flex justify-content-center align-items-center mt-2" style="min-height:70vh;">
    <div class="card p-4" :class="{ 'rtl-card': currentLocale === 'ar' }" style="width:420px;">
      <div class="d-flex justify-content-center">
        <img :src="imageUrl" alt="Logo" style="width:150px;">
      </div>

      <h4 class="mb-2 text-center mt-3">{{ t.forgotPasswordTitle }}</h4>
      <p class="text-center text-muted small mb-4">{{ t.forgotPasswordSubtitle }}</p>

      <!-- نجاح -->
      <div v-if="successMessage" class="alert alert-success py-2 text-center small mb-3">
        {{ successMessage }}
      </div>

      <!-- خطأ -->
      <div v-if="errorMessage" class="alert alert-danger py-2 text-center small mb-3">
        {{ errorMessage }}
      </div>

      <form v-if="!successMessage" @submit.prevent="submit">
        <div class="mb-3">
          <label class="form-label">{{ t.email }}</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            :placeholder="t.emailPlaceholder"
            required
          />
        </div>

        <div class="d-grid">
          <button class="btn btn-primary" :disabled="loading">
            {{ loading ? t.sending : t.sendResetLink }}
          </button>
        </div>

        <div class="mt-3 text-center">
          <router-link to="/admin/auth/login">{{ t.backToLogin }}</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from '../../api/axios'
import authTranslations from '../../locales/auth.js'

export default {
  setup() {
    const email = ref('')
    const loading = ref(false)
    const currentLocale = ref('en')
    const successMessage = ref('')
    const errorMessage = ref('')

    const t = computed(() => authTranslations[currentLocale.value])

    const initLanguage = () => {
      const savedLocale = localStorage.getItem('auth_locale') || 'en'
      currentLocale.value = savedLocale
    }

    const submit = async () => {
      loading.value = true
      successMessage.value = ''
      errorMessage.value = ''
      try {
        await axios.post('/forgot-password', { email: email.value })
        successMessage.value = t.value.resetLinkSent
      } catch (error) {
        errorMessage.value = t.value.emailNotFound
      } finally {
        loading.value = false
      }
    }

    onMounted(() => initLanguage())

    return { email, loading, submit, t, currentLocale, successMessage, errorMessage }
  },
  data() {
    return { imageUrl: '/images/logo/allan_logo1.png' }
  }
}
</script>
