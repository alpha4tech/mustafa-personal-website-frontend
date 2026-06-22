<template>
  <div class="profile-page" :class="{ 'rtl-profile': isRtl }">
    <GlobalLoader :isLoading="loading" />

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('myProfile') }}</h1>
        <p class="page-subtitle">{{ t('viewYourProfileInfo') }}</p>
      </div>
      <router-link to="/admin/profile/edit" class="btn-edit">
        <i class="bi bi-pencil-square"></i>
        {{ t('editProfile') }}
      </router-link>
    </div>

    <!-- Profile Content -->
    <div v-if="!loading" class="profile-container">

      <!-- Profile Card -->
      <div class="profile-card">
        <div class="profile-cover">
          <!-- Decorative circles -->
          <div class="cover-circle cover-circle-1"></div>
          <div class="cover-circle cover-circle-2"></div>
          <div class="cover-circle cover-circle-3"></div>

          <div class="profile-avatar-wrapper">
            <div class="profile-avatar">
              <span class="avatar-initials">{{ userInitials }}</span>
            </div>
            <div class="avatar-status" :class="userRole"></div>
          </div>
        </div>

        <div class="profile-info">
          <h2 class="profile-name">{{ userData.name || '—' }}</h2>
          <p class="profile-role">
            <span :class="['role-badge', userData.role]">
              <i :class="userData.role === 'admin' ? 'bi bi-shield-check' : 'bi bi-person'"></i>
              {{ userData.role === 'admin' ? t('admin') : t('user') }}
            </span>
          </p>
          <p class="profile-email">
            <i class="bi bi-envelope"></i>
            {{ userData.email || '—' }}
          </p>
          <p class="profile-member-since">
            <i class="bi bi-calendar-check"></i>
            {{ t('memberSince') }} {{ formatDate(userData.created_at) }}
          </p>
        </div>
      </div>

      <!-- Information Cards -->
      <div class="info-grid">
        <!-- Personal Information Card -->
        <div class="info-card">
          <div class="card-header">
            <div class="card-header-icon">
              <i class="bi bi-person-badge"></i>
            </div>
            <h3>{{ t('personalInformation') }}</h3>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">
                <i class="bi bi-person-fill label-icon"></i>
                {{ t('fullName') }}
              </span>
              <span class="info-value">{{ userData.name || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="bi bi-envelope-fill label-icon"></i>
                {{ t('email') }}
              </span>
              <span class="info-value">{{ userData.email || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="bi bi-telephone-fill label-icon"></i>
                {{ t('phoneNumber') }}
              </span>
              <span class="info-value">{{ userData.phone || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Account Information Card -->
        <div class="info-card">
          <div class="card-header">
            <div class="card-header-icon">
              <i class="bi bi-gear-fill"></i>
            </div>
            <h3>{{ t('accountInformation') }}</h3>
          </div>
          <div class="card-body">
            <div class="info-row">
              <span class="info-label">
                <i class="bi bi-shield-fill label-icon"></i>
                {{ t('role') }}
              </span>
              <span class="info-value">
                <span :class="['role-badge-small', userData.role]">
                  {{ userData.role === 'admin' ? t('admin') : t('user') }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="bi bi-circle-fill label-icon status-icon"></i>
                {{ t('accountStatus') }}
              </span>
              <span class="info-value">
                <span class="status-badge active">
                  <i class="bi bi-check-circle-fill"></i>
                  {{ t('active') }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">
                <i class="bi bi-calendar-fill label-icon"></i>
                {{ t('registeredOn') }}
              </span>
              <span class="info-value">{{ formatDateFull(userData.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Back Button -->
      <div class="back-row">
        <router-link to="/admin/dashboard" class="btn-back">
          <i class="bi bi-grid-fill"></i>
          {{ t('BacktoList') }}
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import GlobalLoader from '@/components/GlobalLoader.vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettings } from '@/composables/useSettings'
import axios from '@/api/axios'

const authStore = useAuthStore()
const { t, isRtl } = useSettings()

const loading = ref(true)
const userData = ref({
  name: '',
  email: '',
  role: '',
  phone: '',
  created_at: ''
})

const userInitials = computed(() => {
  const name = userData.value.name
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
})

const userRole = computed(() => userData.value.role)

const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString(isRtl.value ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const formatDateFull = (dateString) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString(isRtl.value ? 'ar-EG' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

const fetchUserData = async () => {
  loading.value = true
  try {
    const response = await axios.get('/user')
    const user = response.data.data || response.data
    userData.value = {
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      phone: user.phone || '',
      created_at: user.created_at || ''
    }
    if (authStore.user) {
      authStore.user.name = user.name
      authStore.user.email = user.email
      authStore.user.phone = user.phone
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    if (authStore.user) {
      userData.value = {
        name: authStore.user.name || '',
        email: authStore.user.email || '',
        role: authStore.user.role || 'user',
        phone: authStore.user.phone || '',
        created_at: authStore.user.created_at || ''
      }
    }
  } finally {
    loading.value = false
  }
}

const handleProfileUpdate = () => fetchUserData()

onMounted(() => {
  fetchUserData()
  window.addEventListener('profile-updated', handleProfileUpdate)
})

onUnmounted(() => {
  window.removeEventListener('profile-updated', handleProfileUpdate)
})
</script>

<style scoped>
/* ─── Brand Tokens ─────────────────────────────────── */
:root {
  --brand-blue:     #162FBB;
  --brand-navy:     #0A1870;
  --brand-gold:     #E7AE18;
  --brand-light:    #F0F0F0;
  --brand-muted:    #D0D6E5;
}

/* ─── Page ─────────────────────────────────────────── */
.profile-page {
  padding: 1.75rem;
  background: #F0F0F0;
  min-height: 100vh;
}

.profile-page.rtl-profile { direction: rtl; }

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

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  background: linear-gradient(135deg, #162FBB, #0A1870);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.25s;
  box-shadow: 0 4px 14px rgba(22, 47, 187, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22, 47, 187, 0.4);
  color: white;
}

/* ─── Profile Container ────────────────────────────── */
.profile-container {
  max-width: 1100px;
  margin: 0 auto;
}

/* ─── Profile Card ─────────────────────────────────── */
.profile-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 24px rgba(10, 24, 112, 0.08);
}

.profile-cover {
  background: linear-gradient(135deg, #0A1870 0%, #162FBB 60%, #2040D0 100%);
  height: 130px;
  position: relative;
  overflow: hidden;
}

/* Decorative circles on cover */
.cover-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.12;
  background: white;
}
.cover-circle-1 { width: 180px; height: 180px; top: -60px; right: -40px; }
.cover-circle-2 { width: 100px; height: 100px; top: 20px; right: 160px; }
.cover-circle-3 { width: 60px;  height: 60px;  bottom: -20px; left: 40%; }

/* Gold accent line at bottom of cover */
.profile-cover::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #E7AE18, #F5C842, #E7AE18);
}

.profile-avatar-wrapper {
  position: absolute;
  bottom: -50px;
  left: 2rem;
}

.rtl-profile .profile-avatar-wrapper {
  left: auto;
  right: 2rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 6px 20px rgba(10, 24, 112, 0.25);
}

.avatar-initials {
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0A1870, #162FBB);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.avatar-status {
  position: absolute;
  bottom: 6px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
}

.rtl-profile .avatar-status { right: auto; left: 4px; }

.avatar-status.admin { background: #E7AE18; }
.avatar-status.user  { background: #10b981; }

.profile-info {
  padding: 65px 2rem 2rem 2rem;
}

.rtl-profile .profile-info { padding: 65px 2rem 2rem 2rem; }

.profile-name {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0A1870;
  margin: 0 0 0.5rem 0;
}

.profile-role { margin-bottom: 1rem; }

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
}

.role-badge.admin {
  background: rgba(231, 174, 24, 0.12);
  color: #B88A00;
  border: 1px solid rgba(231, 174, 24, 0.3);
}

.role-badge.user {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.profile-email,
.profile-member-since {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  margin: 0.4rem 0;
}

.profile-email i,
.profile-member-since i {
  color: #162FBB;
  opacity: 0.7;
}

/* ─── Info Grid ────────────────────────────────────── */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(10, 24, 112, 0.07);
  border: 1px solid rgba(208, 214, 229, 0.5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1.1rem 1.5rem;
  background: linear-gradient(135deg, #0A1870 0%, #162FBB 100%);
  border-bottom: 3px solid #E7AE18;
}

.card-header-icon {
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-header-icon i {
  font-size: 1rem;
  color: #E7AE18;
}

.card-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
  color: white;
  letter-spacing: 0.2px;
}

.card-body { padding: 1.25rem 1.5rem; }

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-row:last-child { border-bottom: none; }

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.82rem;
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.label-icon {
  font-size: 0.75rem;
  color: #162FBB;
  opacity: 0.6;
}

.status-icon { color: #10b981 !important; }

.info-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: right;
  flex: 1;
}

.rtl-profile .info-value { text-align: left; }

/* ─── Badges ───────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.75rem;
  background: #d1fae5;
  color: #065f46;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge-small {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.role-badge-small.admin {
  background: rgba(231, 174, 24, 0.15);
  color: #92680A;
}

.role-badge-small.user {
  background: #f1f5f9;
  color: #475569;
}

/* ─── Back Row ─────────────────────────────────────── */
.back-row {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.rtl-profile .back-row { justify-content: flex-end; }

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

/* ─── Responsive ───────────────────────────────────── */
@media (max-width: 768px) {
  .profile-page { padding: 1rem; }

  .info-grid { grid-template-columns: 1fr; }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .profile-avatar-wrapper {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%);
  }

  .profile-info { text-align: center; }

  .profile-email,
  .profile-member-since { justify-content: center; }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }

  .info-value { text-align: left; }

  .rtl-profile .info-row { align-items: flex-end; }
  .rtl-profile .info-value { text-align: right; }
}
</style>
