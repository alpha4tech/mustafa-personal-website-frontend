<template>
  <div class="auth-page" :class="{ 'rtl-page': currentLocale === 'ar' }">
    <!-- Background decoration -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>

    <div class="auth-card-wrapper">
      <div class="auth-card">

        <!-- Brand Header -->
        <div class="brand-header">
          <div class="logo-wrapper">
            <img :src="imageUrl" alt="Logo" class="brand-logo" />
          </div>
          <div class="gold-line"></div>
        </div>

        <!-- Language Switcher -->
        <div class="language-switcher">
          <button
            :class="['lang-btn', { active: currentLocale === 'en' }]"
            @click="setLanguage('en')"
          >English</button>
          <span class="lang-sep"></span>
          <button
            :class="['lang-btn', { active: currentLocale === 'ar' }]"
            @click="setLanguage('ar')"
          >العربية</button>
        </div>

        <!-- Title -->
        <div class="auth-title-block">
          <h4 class="auth-title">{{ t.registerTitle }}</h4>
          <p class="auth-subtitle">{{ t.registerSubtitle }}</p>
        </div>

        <form @submit.prevent="submit" class="auth-form">

          <!-- Name -->
          <div class="form-group">
            <label class="form-label">{{ t.name }}</label>
            <div class="input-wrapper">
              <i class="bi bi-person input-icon"></i>
              <input
                v-model="name"
                type="text"
                class="form-input"
                :placeholder="t.namePlaceholder"
                required
              />
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="form-label">{{ t.email }}</label>
            <div class="input-wrapper">
              <i class="bi bi-envelope input-icon"></i>
              <input
                v-model="email"
                type="email"
                class="form-input"
                :placeholder="t.emailPlaceholder"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="form-label">{{ t.password }}</label>
            <div class="input-wrapper">
              <i class="bi bi-lock input-icon"></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input password-input"
                :placeholder="t.passwordPlaceholder"
                required
              />
              <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <label class="form-label">{{ t.confirmPassword }}</label>
            <div class="input-wrapper">
              <i class="bi bi-lock-fill input-icon"></i>
              <input
                v-model="password_confirmation"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-input password-input"
                :placeholder="t.confirmPasswordPlaceholder"
                required
              />
              <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="errorMessage" class="error-alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            {{ errorMessage }}
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading" class="btn-submit">
            <i v-if="loading" class="bi bi-hourglass-split spinning"></i>
            <i v-else class="bi bi-person-plus-fill"></i>
            {{ loading ? t.registering : t.register }}
          </button>

          <!-- Login Link -->
          <p class="auth-alt-link">
            {{ t.haveAccount }}
            <router-link to="/admin/auth/login" class="alt-link">{{ t.loginHere }}</router-link>
          </p>

        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/Auth'
import authTranslations from '../../locales/auth.js'

export default {
  setup() {
    const auth = useAuthStore()
    const router = useRouter()
    const name = ref('')
    const email = ref('')
    const password = ref('')
    const password_confirmation = ref('')
    const loading = ref(false)
    const currentLocale = ref('en')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const errorMessage = ref('')

    const t = computed(() => authTranslations[currentLocale.value])

    const setLanguage = (locale) => {
      currentLocale.value = locale
      localStorage.setItem('auth_locale', locale)
      updateDocumentDirection(locale)
    }

    const updateDocumentDirection = (locale) => {
      if (locale === 'ar') {
        document.documentElement.dir = 'rtl'
        document.documentElement.lang = 'ar'
        document.body.classList.add('rtl-mode')
      } else {
        document.documentElement.dir = 'ltr'
        document.documentElement.lang = 'en'
        document.body.classList.remove('rtl-mode')
      }
    }

    const initLanguage = () => {
      const savedLocale = localStorage.getItem('auth_locale')
      const browserLang = navigator.language.split('-')[0]
      const defaultLocale = (savedLocale === 'en' || savedLocale === 'ar')
        ? savedLocale
        : (browserLang === 'ar' ? 'ar' : 'en')
      currentLocale.value = defaultLocale
      updateDocumentDirection(defaultLocale)
    }

    const submit = async () => {
      errorMessage.value = ''

      if (password.value !== password_confirmation.value) {
        errorMessage.value = t.value.passwordMismatch
        return
      }

      loading.value = true
      try {
        await auth.register({
          name: name.value,
          email: email.value,
          password: password.value,
          password_confirmation: password_confirmation.value
        })
        router.push('/admin/dashboard')
      } catch (err) {
        errorMessage.value = err.response?.data?.message || t.value.registerError
      } finally {
        loading.value = false
      }
    }

    onMounted(() => initLanguage())

    return {
      name, email, password, password_confirmation,
      loading, submit, t, currentLocale, setLanguage,
      showPassword, showConfirmPassword, errorMessage
    }
  },
  data() {
    return { imageUrl: '/images/logo/logo-1.png' }
  }
}
</script>

<style scoped>
/* ─── Page ─────────────────────────────────────────── */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0A1870 0%, #162FBB 50%, #1A35CC 100%);
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
}

.auth-page.rtl-page { direction: rtl; }

/* ─── Background Decoration ────────────────────────── */
.bg-decoration { position: absolute; inset: 0; pointer-events: none; }

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
}

.bg-circle-1 { width: 500px; height: 500px; top: -200px; right: -150px; }
.bg-circle-2 { width: 300px; height: 300px; bottom: -100px; left: -80px; }
.bg-circle-3 { width: 150px; height: 150px; top: 40%; left: 10%; background: rgba(231, 174, 24, 0.08); }

/* ─── Card ─────────────────────────────────────────── */
.auth-card-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
}

.auth-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 24px 60px rgba(10, 24, 112, 0.4);
}

/* ─── Brand Header ─────────────────────────────────── */
.brand-header {
  text-align: center;
  margin-bottom: 1.25rem;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.brand-logo { width: 140px; }

.gold-line {
  height: 3px;
  width: 60px;
  background: linear-gradient(90deg, transparent, #E7AE18, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

/* ─── Language Switcher ────────────────────────────── */
.language-switcher {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0;
}

.lang-btn {
  padding: 0.3rem 1rem;
  border: 2px solid #D0D6E5;
  border-radius: 20px;
  cursor: pointer;
  background: transparent;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s;
  color: #64748b;
}

.lang-btn.active {
  background: linear-gradient(135deg, #0A1870, #162FBB);
  color: white;
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(22, 47, 187, 0.3);
}

.lang-btn:hover:not(.active) {
  border-color: #162FBB;
  color: #162FBB;
}

.lang-sep {
  width: 1px;
  height: 16px;
  background: #D0D6E5;
}

/* ─── Title ────────────────────────────────────────── */
.auth-title-block {
  text-align: center;
  margin-bottom: 1.75rem;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0A1870;
  margin: 0 0 0.4rem;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

/* ─── Form ─────────────────────────────────────────── */
.auth-form { display: flex; flex-direction: column; gap: 1.1rem; }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }

.form-label {
  font-weight: 700;
  color: #0A1870;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper { position: relative; }

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #162FBB;
  opacity: 0.5;
  font-size: 0.95rem;
  pointer-events: none;
}

.rtl-page .input-icon {
  left: auto;
  right: 1rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.6rem;
  border: 2px solid #D0D6E5;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #1e293b;
  background: #FAFBFF;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
}

.rtl-page .form-input {
  padding: 0.75rem 2.6rem 0.75rem 1rem;
}

.password-input { padding-right: 2.8rem; }

.rtl-page .password-input {
  padding-right: 2.6rem;
  padding-left: 2.8rem;
}

.form-input:focus {
  outline: none;
  border-color: #162FBB;
  background: white;
  box-shadow: 0 0 0 4px rgba(22, 47, 187, 0.08);
}

.form-input::placeholder { color: #b0bec5; }

/* ─── Password Toggle ──────────────────────────────── */
.password-toggle {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.rtl-page .password-toggle { right: auto; left: 0.85rem; }
.password-toggle:hover { color: #162FBB; }

/* ─── Error ────────────────────────────────────────── */
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.83rem;
  font-weight: 500;
}

/* ─── Submit ───────────────────────────────────────── */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #0A1870, #162FBB);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 14px rgba(22, 47, 187, 0.35);
  letter-spacing: 0.3px;
  margin-top: 0.25rem;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 47, 187, 0.45);
}

.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

/* Gold accent under submit button */
.btn-submit::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background: #E7AE18;
  border-radius: 2px;
  margin: 0.6rem auto 0;
}

/* ─── Alt Link ─────────────────────────────────────── */
.auth-alt-link {
  text-align: center;
  font-size: 0.83rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.alt-link {
  color: #162FBB;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.alt-link:hover { color: #0A1870; text-decoration: underline; }

/* ─── Spinning ─────────────────────────────────────── */
.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ─── Responsive ───────────────────────────────────── */
@media (max-width: 480px) {
  .auth-card { padding: 1.75rem 1.25rem; border-radius: 20px; }
  .auth-title { font-size: 1.3rem; }
}
</style>
