<template>
  <div class="edit-profile-page" :class="{ 'rtl-edit': isRtl }">
    <GlobalLoader :isLoading="loading" />

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('editProfile') }}</h1>
        <p class="page-subtitle">{{ t('updateYourInformation') }}</p>
      </div>
      <router-link to="/admin/profile" class="btn-back">
        <i class="bi bi-arrow-left back-icon"></i>
        {{ t('backToProfile') }}
      </router-link>
    </div>

    <div class="edit-container">
      <div class="form-section">

        <!-- Section Label -->
        <div class="form-section-label">
          <div class="section-icon">
            <i class="bi bi-person-gear"></i>
          </div>
          <div>
            <h2 class="section-title">{{ t('personalInformation') }}</h2>
            <p class="section-desc">{{ t('updateYourInformation') }}</p>
          </div>
        </div>

        <div class="section-divider"></div>

        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-grid">

            <div class="form-group">
              <label>{{ t('fullName') }} <span class="required">*</span></label>
              <div class="input-wrapper">
                <i class="bi bi-person input-icon"></i>
                <input
                  v-model="formData.name"
                  type="text"
                  required
                  class="form-input"
                  :placeholder="t('enterFullName')"
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('email') }} <span class="required">*</span></label>
              <div class="input-wrapper">
                <i class="bi bi-envelope input-icon"></i>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  class="form-input"
                  :placeholder="t('enterEmail')"
                />
              </div>
            </div>

            <div class="form-group">
              <label>{{ t('Password') }}</label>
              <div class="input-wrapper password-wrapper">
                <i class="bi bi-lock input-icon"></i>
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :placeholder="t('enterPassword')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                >
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
              <p class="field-hint">{{ t('leaveBlankToKeepPassword') || 'Leave blank to keep current password' }}</p>
            </div>

            <div class="form-group">
              <label>{{ t('phone') }}</label>
              <div class="input-wrapper">
                <i class="bi bi-phone input-icon"></i>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="form-input"
                  :placeholder="t('enterPhoneNumber')"
                />
              </div>
            </div>

          </div>

          <div class="form-actions">
            <router-link to="/admin/profile" class="btn-cancel">
              {{ t('cancel') || 'Cancel' }}
            </router-link>
            <button type="submit" :disabled="saving" class="btn-save">
              <i v-if="saving" class="bi bi-hourglass-split spinning"></i>
              <i v-else class="bi bi-check-lg"></i>
              {{ saving ? t('saving') : t('saveChanges') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast-message', toast.type]">
        <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'"></i>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import GlobalLoader from '@/components/GlobalLoader.vue'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSettings } from '@/composables/useSettings'
import axios from '@/api/axios'

const router = useRouter()
const authStore = useAuthStore()
const { t, isRtl } = useSettings()

const loading = ref(false)
const saving = ref(false)
const showPassword = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })

const formData = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
})

const user = computed(() => authStore.user)

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const loadUserData = () => {
  if (user.value) {
    formData.value = {
      name: user.value.name || '',
      email: user.value.email || '',
      password: '',
      phone: user.value.phone || '',
    }
  }
}

const updateProfile = async () => {
  if (!formData.value.name || !formData.value.email) {
    showToast(t('pleaseFillRequiredFields'), 'error')
    return
  }

  saving.value = true
  try {
    const payload = {
      name: formData.value.name,
      email: formData.value.email,
      phone: formData.value.phone,
    }
    if (formData.value.password) {
      payload.password = formData.value.password
    }

    const response = await axios.put('/admin/profile', payload)
    await authStore.fetchUser()
    showToast(response.data.message || t('profileUpdated'), 'success')
    setTimeout(() => { router.push('/admin/profile') }, 1500)
  } catch (error) {
    showToast(error.response?.data?.message || t('profileUpdateFailed'), 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => loadUserData())
</script>

<style scoped>
/* ─── Brand Tokens ─────────────────────────────────── */
:root {
  --brand-blue:   #162FBB;
  --brand-navy:   #0A1870;
  --brand-gold:   #E7AE18;
  --brand-light:  #F0F0F0;
  --brand-muted:  #D0D6E5;
}

/* ─── Page ─────────────────────────────────────────── */
.edit-profile-page {
  padding: 1.75rem;
  background: #F0F0F0;
  min-height: 100vh;
}

.edit-profile-page.rtl-edit { direction: rtl; }

/* ─── Header ───────────────────────────────────────── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0A1870, #162FBB);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: #64748b;
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  background: white;
  color: #162FBB;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.88rem;
  border: 2px solid #D0D6E5;
  transition: all 0.25s;
}

.btn-back:hover {
  background: #162FBB;
  color: white;
  border-color: #162FBB;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(22, 47, 187, 0.25);
}

.back-icon { transition: transform 0.2s; }
.rtl-edit .back-icon { transform: scaleX(-1); }

/* ─── Container ────────────────────────────────────── */
.edit-container {
  max-width: 820px;
  margin: 0 auto;
}

/* ─── Form Section ─────────────────────────────────── */
.form-section {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 24px rgba(10, 24, 112, 0.08);
  border: 1px solid rgba(208, 214, 229, 0.4);
}

.form-section-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #0A1870, #162FBB);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(22, 47, 187, 0.3);
}

.section-icon i {
  font-size: 1.3rem;
  color: #E7AE18;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0A1870;
  margin: 0 0 0.2rem;
}

.section-desc {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0;
}

.section-divider {
  height: 1px;
  background: linear-gradient(90deg, #162FBB 0%, #D0D6E5 60%, transparent 100%);
  margin-bottom: 1.75rem;
  opacity: 0.4;
}

/* ─── Form Grid ────────────────────────────────────── */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-group label {
  font-weight: 700;
  color: #0A1870;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.required { color: #ef4444; }

.field-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
}

/* ─── Input ────────────────────────────────────────── */
.input-wrapper { position: relative; }

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #162FBB;
  opacity: 0.5;
  font-size: 1rem;
  pointer-events: none;
}

.rtl-edit .input-icon {
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

.rtl-edit .form-input {
  padding: 0.75rem 2.6rem 0.75rem 1rem;
}

.password-wrapper .form-input {
  padding-right: 2.8rem;
}

.rtl-edit .password-wrapper .form-input {
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

.rtl-edit .password-toggle {
  right: auto;
  left: 0.85rem;
}

.password-toggle:hover { color: #162FBB; }

/* ─── Actions ──────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel {
  padding: 0.7rem 1.5rem;
  background: transparent;
  color: #64748b;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid #D0D6E5;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #94a3b8;
  color: #334155;
}

.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #0A1870, #162FBB);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 4px 14px rgba(22, 47, 187, 0.3);
  letter-spacing: 0.3px;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 47, 187, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Gold shimmer on save button */
.btn-save::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #E7AE18;
  border-radius: 0 0 12px 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.btn-save { position: relative; }
.btn-save:hover:not(:disabled)::after { opacity: 1; }

/* ─── Spinning ─────────────────────────────────────── */
.spinning {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ─── Toast ────────────────────────────────────────── */
.toast-message {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 0.85rem 1.4rem;
  border-radius: 14px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 9999;
  font-weight: 600;
  font-size: 0.88rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.rtl-edit .toast-message { right: auto; left: 24px; }

.toast-message.success { background: linear-gradient(135deg, #0A1870, #162FBB); border-left: 4px solid #E7AE18; }
.toast-message.error   { background: linear-gradient(135deg, #7f1d1d, #ef4444); }

/* Toast transition */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateY(20px); opacity: 0; }
.toast-leave-to   { transform: translateY(20px); opacity: 0; }

/* ─── Responsive ───────────────────────────────────── */
@media (max-width: 768px) {
  .edit-profile-page { padding: 1rem; }

  .form-grid { grid-template-columns: 1fr; }

  .form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .btn-save, .btn-cancel { justify-content: center; text-align: center; }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
