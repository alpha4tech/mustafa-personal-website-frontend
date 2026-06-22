<template>
  <div class="users-list-page" :class="{ 'rtl-users': isRtl }">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('usersManagement') }}</h1>
        <p class="page-subtitle">{{ t('manageUsers') }}</p>
      </div>
      <div class="header-actions">
        <button @click="fetchUsers" class="btn-refresh" :disabled="loading">
          <i class="bi bi-arrow-repeat" :class="{ spinning: loading }"></i>
          {{ t('refresh') }}
        </button>
        <button @click="openCreateModal" class="btn-add">
          <i class="bi bi-plus-lg"></i>
          {{ t('addUser') }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon ico-blue"><i class="bi bi-people"></i></div>
        <div class="stat-info"><h3>{{ stats.total }}</h3><p>{{ t('totalUsers') }}</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon ico-teal"><i class="bi bi-shield-check"></i></div>
        <div class="stat-info"><h3>{{ stats.admins }}</h3><p>{{ t('admins') }}</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon ico-green"><i class="bi bi-person"></i></div>
        <div class="stat-info"><h3>{{ stats.users }}</h3><p>{{ t('regularUsers') }}</p></div>
      </div>
    </div>

    <!-- Search -->
    <div class="search-wrapper">
      <i class="bi bi-search"></i>
      <input v-model="searchQuery" type="text" :placeholder="t('searchUsers')" class="search-input" />
      <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <div class="spinner-ring"></div>
      <p>{{ t('loadingUsers') }}</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box">
      <i class="bi bi-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="fetchUsers" class="retry-btn">{{ t('tryAgain') }}</button>
    </div>

    <!-- Table -->
    <div v-else-if="filteredUsers.length" class="tbl-wrap">
      <table class="users-table">
        <thead>
          <tr>
            <th>{{ t('name') }}</th>
            <th>{{ t('email') }}</th>
            <th>{{ t('role') }}</th>
            <th>{{ t('joinDate') }}</th>
            <th>{{ t('actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>
              <div class="user-info">
                <div class="user-avatar">{{ getInitials(user.name) }}</div>
                <div>
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email-mobile">{{ user.email }}</div>
                </div>
              </div>
            </td>
            <td><span class="user-email">{{ user.email }}</span></td>
            <td>
              <span :class="['role-badge', user.role]">
                <i :class="user.role === 'admin' ? 'bi bi-shield-check' : 'bi bi-person'"></i>
                {{ user.role === 'admin' ? t('admin') : t('user') }}
              </span>
            </td>
            <td><span class="date-text">{{ formatDate(user.created_at) }}</span></td>
            <td>
              <div class="action-buttons">
                <button @click="editUser(user)" class="ab ab-edit" :title="t('edit')">
                  <i class="bi bi-pencil"></i>
                </button>
                <button v-if="user.role === 'user' && user.id !== currentUserId" @click="promoteUser(user)" class="ab ab-promote" :title="t('promoteToAdmin')">
                  <i class="bi bi-arrow-up-circle"></i>
                </button>
                <button v-if="user.role === 'admin' && user.id !== currentUserId" @click="demoteUser(user)" class="ab ab-demote" :title="t('demoteToUser')">
                  <i class="bi bi-arrow-down-circle"></i>
                </button>
                <button v-if="user.id !== currentUserId" @click="confirmDeleteUser(user)" class="ab ab-del" :title="t('delete')">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pager" v-if="totalPages > 1">
        <span class="pager-info">
          {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}
          / {{ filteredUsers.length }}
        </span>
        <div class="pager-btns">
          <button @click="currentPage--" :disabled="currentPage === 1" class="pb">
            <i class="bi" :class="isRtl ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
          </button>
          <button v-for="page in displayedPages" :key="page" @click="currentPage = page" :class="['pb', { active: currentPage === page }]">
            {{ page }}
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="pb">
            <i class="bi" :class="isRtl ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="state-box">
      <i class="bi bi-inbox"></i>
      <h3>{{ t('noUsersYet') }}</h3>
      <p>{{ t('addFirstUser') }}</p>
      <button @click="openCreateModal" class="retry-btn">
        <i class="bi bi-plus-lg"></i> {{ t('addUser') }}
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-box" @click.stop>
          <div class="modal-hdr">
            <div class="modal-hdr-left">
              <div class="modal-ico">
                <i :class="isEditing ? 'bi bi-pencil' : 'bi bi-person-plus'"></i>
              </div>
              <h3>{{ isEditing ? t('editUser') : t('addNewUser') }}</h3>
            </div>
            <button @click="closeModal" class="close-btn">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="modal-body">
            <form @submit.prevent="saveUser">

              <!-- Name -->
              <div class="form-group">
                <label>{{ t('name') }} <span class="req">*</span></label>
                <div class="input-wrap">
                  <i class="bi bi-person input-ico"></i>
                  <input v-model="formData.name" type="text" class="form-control" required :placeholder="t('name')" />
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label>{{ t('email') }} <span class="req">*</span></label>
                <div class="input-wrap">
                  <i class="bi bi-envelope input-ico"></i>
                  <input v-model="formData.email" type="email" class="form-control" required :placeholder="t('email')" />
                </div>
              </div>

              <!-- Password -->
              <div class="form-group">
                <label>
                  {{ t('password') }}
                  <span v-if="!isEditing" class="req">*</span>
                  <span v-else class="optional">({{ t('leaveBlankToKeepPassword') }})</span>
                </label>
                <div class="input-wrap">
                  <i class="bi bi-lock input-ico"></i>
                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control pass-field"
                    :required="!isEditing"
                    :placeholder="isEditing ? '••••••••' : t('password')"
                  />
                  <button type="button" class="toggle-pass" @click="showPassword = !showPassword">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>

                <!-- Password Strength -->
                <div v-if="formData.password && !isEditing" class="pass-strength">
                  <div class="strength-bars">
                    <span :class="['bar', passwordStrength >= 1 ? strengthColor : '']"></span>
                    <span :class="['bar', passwordStrength >= 2 ? strengthColor : '']"></span>
                    <span :class="['bar', passwordStrength >= 3 ? strengthColor : '']"></span>
                    <span :class="['bar', passwordStrength >= 4 ? strengthColor : '']"></span>
                  </div>
                  <span :class="['strength-label', strengthColor]">{{ strengthLabel }}</span>
                </div>
              </div>

              <!-- Role -->
              <div class="form-group">
                <label>{{ t('role') }}</label>
                <div class="input-wrap">
                  <i class="bi bi-shield input-ico"></i>
                  <select v-model="formData.role" class="form-control">
                    <option value="user">{{ t('user') }}</option>
                    <option value="admin">{{ t('admin') }}</option>
                  </select>
                </div>
              </div>

              <div class="modal-ftr">
                <button type="button" @click="closeModal" class="btn-cancel">
                  <i class="bi bi-x-lg"></i> {{ t('cancel') }}
                </button>
                <button type="submit" class="btn-save" :disabled="submitting">
                  <i :class="submitting ? 'bi bi-arrow-repeat spinning' : isEditing ? 'bi bi-check-lg' : 'bi bi-person-plus'"></i>
                  {{ submitting ? t('saving') : isEditing ? t('update') : t('addUser') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirm -->
    <Transition name="modal">
      <div v-if="deleteConfirm" class="modal-overlay" @click="deleteConfirm = false">
        <div class="confirm-box" @click.stop>
          <div class="confirm-ico"><i class="bi bi-exclamation-triangle-fill"></i></div>
          <h3>{{ t('confirmDelete') }}</h3>
          <p>{{ t('confirmDeleteUser') }}</p>
          <div class="c-btns">
            <button @click="deleteConfirm = false" class="btn-cancel">{{ t('cancel') }}</button>
            <button @click="confirmDelete" class="btn-confirm">
              <i class="bi bi-trash"></i> {{ t('delete') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" :class="['toast-msg', toast.type]">
        <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import axios from '@/api/axios'
import { useSettings } from '@/composables/useSettings'

const { t, isRtl } = useSettings()

const users = ref([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const currentUserId = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const deleteConfirm = ref(false)
const userToDelete = ref(null)
const showPassword = ref(false)

const toast = ref({ show: false, message: '', type: 'success' })
const formData = ref({ id: null, name: '', email: '', password: '', role: 'user' })

// Password strength
const passwordStrength = computed(() => {
  const p = formData.value.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})
const strengthColor = computed(() => {
  const s = passwordStrength.value
  if (s <= 1) return 'weak'
  if (s === 2) return 'fair'
  if (s === 3) return 'good'
  return 'strong'
})
const strengthLabel = computed(() => {
  const map = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' }
  return map[strengthColor.value] || ''
})

const stats = computed(() => ({
  total: users.value.length,
  admins: users.value.filter(u => u.role === 'admin').length,
  users: users.value.filter(u => u.role === 'user').length
}))

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage.value)))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredUsers.value.slice(start, start + itemsPerPage.value)
})
const displayedPages = computed(() => {
  const pages = []
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + 4)
  if (end - start < 4) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

watch(searchQuery, () => { currentPage.value = 1 })

const resetForm = () => {
  formData.value = { id: null, name: '', email: '', password: '', role: 'user' }
  showPassword.value = false
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(isRtl.value ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await axios.get('/admin/users')
    const data = res.data?.data?.data || res.data?.data || res.data
    users.value = Array.isArray(data) ? data : []
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  } catch (err) {
    error.value = err.response?.data?.message || t('failedToLoadUsers')
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  submitting.value = true
  try {
    const payload = { ...formData.value }
    if (isEditing.value && !payload.password) delete payload.password
    let res
    if (isEditing.value) {
      res = await axios.put(`/admin/users/${payload.id}`, payload)
    } else {
      res = await axios.post('/admin/users', payload)
    }
    showToast(res.data?.message || t('savedSuccessfully'), 'success')
    closeModal()
    await fetchUsers()
  } catch (err) {
    showToast(err.response?.data?.message || t('failedToSave'), 'error')
  } finally {
    submitting.value = false
  }
}

const promoteUser = async (user) => {
  try {
    const res = await axios.put(`/admin/users/${user.id}/promote`)
    showToast(res.data?.message || t('updatedSuccessfully'), 'success')
    await fetchUsers()
  } catch (err) {
    showToast(err.response?.data?.message || t('failedToPromote'), 'error')
  }
}

const demoteUser = async (user) => {
  try {
    const res = await axios.put(`/admin/users/${user.id}/demote`)
    showToast(res.data?.message || t('updatedSuccessfully'), 'success')
    await fetchUsers()
  } catch (err) {
    showToast(err.response?.data?.message || t('failedToDemote'), 'error')
  }
}

const deleteUser = async () => {
  if (!userToDelete.value) return
  try {
    const res = await axios.delete(`/admin/users/${userToDelete.value.id}`)
    showToast(res.data?.message || t('deletedSuccessfully'), 'success')
    await fetchUsers()
  } catch (err) {
    showToast(err.response?.data?.message || t('failedToDelete'), 'error')
  } finally {
    deleteConfirm.value = false
    userToDelete.value = null
  }
}

const openCreateModal = () => { isEditing.value = false; resetForm(); showModal.value = true }
const editUser = (user) => {
  isEditing.value = true
  formData.value = { id: user.id, name: user.name, email: user.email, password: '', role: user.role }
  showPassword.value = false
  showModal.value = true
}
const closeModal = () => { showModal.value = false; isEditing.value = false; resetForm() }
const confirmDeleteUser = (user) => { userToDelete.value = user; deleteConfirm.value = true }
const confirmDelete = () => { deleteUser() }

const getCurrentUserId = () => {
  try { currentUserId.value = JSON.parse(localStorage.getItem('user'))?.id } catch (e) {}
}

const handleEscape = (e) => {
  if (e.key === 'Escape') { showModal.value = false; deleteConfirm.value = false }
}

onMounted(() => { getCurrentUserId(); fetchUsers(); window.addEventListener('keydown', handleEscape) })
onUnmounted(() => { window.removeEventListener('keydown', handleEscape) })
</script>

<style scoped>
.users-list-page {
  padding: 1.5rem;
  background: #f4f7fb;
  min-height: 100vh;
}

/* RTL */
.rtl-users { direction: rtl; }
.rtl-users .search-wrapper .bi-search { left: auto; right: 14px; }
.rtl-users .search-input { padding: 0.75rem 2.6rem 0.75rem 1rem; }
.rtl-users .clear-search { right: auto; left: 12px; }
.rtl-users .users-table th,
.rtl-users .users-table td { text-align: right; }
.rtl-users .input-ico { left: auto; right: 12px; }
.rtl-users .form-control { padding: 0.75rem 2.4rem 0.75rem 0.75rem; }
.rtl-users .pass-field { padding-left: 2.8rem; padding-right: 2.4rem; }
.rtl-users .toggle-pass { right: auto; left: 10px; }
.rtl-users .modal-ftr { flex-direction: row-reverse; }
.rtl-users .modal-hdr-left { flex-direction: row-reverse; }

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
  gap: 1rem;
}
.page-title {
  font-size: 1.6rem;
  font-weight: 500;
  background: linear-gradient(135deg, var(--color-navy, #17284a), var(--color-teal, #18b2bc));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}
.page-subtitle { color: #64748b; margin: 0.25rem 0 0; font-size: 0.85rem; }
.header-actions { display: flex; gap: 0.6rem; }

.btn-refresh, .btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1.1rem;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.btn-refresh {
  background: white;
  color: var(--color-teal, #18b2bc);
  border: 1px solid var(--color-teal, #18b2bc);
}
.btn-refresh:hover:not(:disabled) { background: var(--color-teal, #18b2bc); color: white; transform: translateY(-1px); }
.btn-add {
  background: linear-gradient(135deg, var(--color-navy, #17284a), var(--color-teal, #18b2bc));
  color: white;
}
.btn-add:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(24,178,188,.3); }
.spinning { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;
}
.stat-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.1rem 1.2rem;
  background: white;
  border-radius: 14px;
  border: 0.5px solid #e2e8f0;
  transition: box-shadow 0.2s, transform 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); transform: translateY(-2px); }
.stat-icon {
  width: 46px; height: 46px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.ico-teal { background: #e0f7f8; color: #18b2bc; }
.ico-green { background: #ecfdf5; color: #10b981; }
.ico-blue { background: #eef2ff; color: #667eea; }
.stat-info h3 { font-size: 1.6rem; font-weight: 500; margin: 0; color: #1e293b; line-height: 1; }
.stat-info p { margin: 0.2rem 0 0; font-size: 0.72rem; color: #64748b; }

/* Search */
.search-wrapper { position: relative; margin-bottom: 1.25rem; }
.search-wrapper .bi-search {
  position: absolute; left: 14px; top: 50%;
  transform: translateY(-50%); color: #94a3b8; font-size: 14px;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.6rem;
  border: 0.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.88rem;
  background: white;
  color: #1e293b;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.search-input:focus { border-color: #18b2bc; box-shadow: 0 0 0 3px rgba(24,178,188,.12); }
.clear-search {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8;
}

/* Table */
.tbl-wrap {
  background: white;
  border-radius: 16px;
  border: 0.5px solid #e2e8f0;
  overflow: auto;
}
.users-table { width: 100%; border-collapse: collapse; min-width: 700px; }
.users-table thead tr { background: #f8fafc; }
.users-table th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
  border-bottom: 0.5px solid #e2e8f0;
  white-space: nowrap;
}
.users-table td {
  padding: 0.85rem 1rem;
  border-bottom: 0.5px solid #f1f5f9;
  font-size: 0.85rem;
  vertical-align: middle;
}
.users-table tbody tr:last-child td { border-bottom: none; }
.users-table tbody tr { transition: background 0.15s, transform 0.2s; }
.users-table tbody tr:hover { background: #f8faff; transform: translateY(-1px); }

.user-info { display: flex; align-items: center; gap: 0.7rem; }
.user-avatar {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-navy, #17284a), var(--color-teal, #18b2bc));
  color: white; font-size: 0.78rem; font-weight: 500;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.user-name { font-weight: 500; font-size: 0.88rem; color: #1e293b; }
.user-email { color: #64748b; font-size: 0.83rem; }
.user-email-mobile { display: none; color: #94a3b8; font-size: 0.75rem; margin-top: 0.1rem; }
.date-text { font-size: 0.82rem; color: #64748b; }

.role-badge {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.73rem; font-weight: 500;
}
.role-badge.admin { background: #eef2ff; color: #667eea; }
.role-badge.user { background: #f1f5f9; color: #64748b; }

.action-buttons { display: flex; gap: 0.4rem; }
.ab {
  width: 30px; height: 30px;
  border: none; border-radius: 8px;
  cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.85rem;
  transition: transform 0.15s, background 0.2s, color 0.2s;
}
.ab:hover { transform: scale(1.1); }
.ab-edit { background: #e0f2fe; color: #0284c7; }
.ab-edit:hover { background: #0284c7; color: white; }
.ab-promote { background: #eef2ff; color: #667eea; }
.ab-promote:hover { background: #667eea; color: white; }
.ab-demote { background: #fff7ed; color: #f59e0b; }
.ab-demote:hover { background: #f59e0b; color: white; }
.ab-del { background: #fef2f2; color: #ef4444; }
.ab-del:hover { background: #ef4444; color: white; }

/* Pagination */
.pager {
  display: flex; justify-content: space-between; align-items: center;
  padding: 0.75rem 1rem;
  border-top: 0.5px solid #f1f5f9;
}
.pager-info { font-size: 0.78rem; color: #64748b; }
.pager-btns { display: flex; gap: 0.3rem; }
.pb {
  width: 32px; height: 32px;
  border: 0.5px solid #e2e8f0; background: white;
  border-radius: 8px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.78rem; color: #1e293b;
  transition: all 0.2s;
}
.pb:hover:not(:disabled) { background: #18b2bc; color: white; border-color: #18b2bc; }
.pb:disabled { opacity: 0.35; cursor: not-allowed; }
.pb.active { background: linear-gradient(135deg, #17284a, #18b2bc); color: white; border-color: transparent; }

/* State Boxes */
.state-box {
  text-align: center; padding: 3.5rem 1rem;
  background: white; border-radius: 16px; border: 0.5px solid #e2e8f0;
}
.state-box > i { font-size: 2.5rem; color: #94a3b8; display: block; margin-bottom: 0.75rem; }
.state-box h3 { font-size: 1rem; font-weight: 500; margin-bottom: 0.3rem; color: #1e293b; }
.state-box p { font-size: 0.85rem; color: #64748b; margin-bottom: 1rem; }
.spinner-ring {
  width: 38px; height: 38px;
  border: 3px solid #e2e8f0; border-top-color: #18b2bc;
  border-radius: 50%; animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
.retry-btn {
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #17284a, #18b2bc);
  color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.85rem;
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(4px);
}
.modal-box {
  background: white; border-radius: 20px;
  width: 92%; max-width: 460px;
  border: 0.5px solid #e2e8f0;
  overflow: hidden;
}
.modal-hdr {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.1rem 1.25rem;
  border-bottom: 0.5px solid #f1f5f9;
  background: linear-gradient(135deg, #17284a, #1a3560);
}
.modal-hdr-left { display: flex; align-items: center; gap: 0.75rem; }
.modal-ico {
  width: 36px; height: 36px;
  background: rgba(255,255,255,.15);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-size: 1rem;
}
.modal-hdr h3 { font-size: 1rem; font-weight: 500; margin: 0; color: white; }
.close-btn {
  background: rgba(255,255,255,.15); border: none;
  color: white; font-size: 1rem; cursor: pointer;
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.close-btn:hover { background: rgba(255,255,255,.25); }

.modal-body { padding: 1.25rem; }

.form-group { margin-bottom: 1rem; }
.form-group label {
  display: block; margin-bottom: 0.4rem;
  font-size: 0.82rem; font-weight: 500; color: #475569;
}
.req { color: #ef4444; margin-left: 2px; }
.optional { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin-left: 4px; }

/* Input wrap */
.input-wrap { position: relative; }
.input-ico {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%);
  color: #94a3b8; font-size: 14px; pointer-events: none;
}
.form-control {
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.4rem;
  border: 0.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.88rem;
  color: #1e293b;
  background: white;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  appearance: none;
}
.form-control:focus { border-color: #18b2bc; box-shadow: 0 0 0 3px rgba(24,178,188,.12); }

/* Password field - مساحة لأيقونة العين */
.pass-field {
  padding-right: 2.8rem !important;
}

/* Toggle password button */
.toggle-pass {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 1rem;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  z-index: 2;
}
.toggle-pass:hover { color: #18b2bc; }

/* Password strength */
.pass-strength {
  display: flex; align-items: center; gap: 0.5rem;
  margin-top: 0.5rem;
}
.strength-bars { display: flex; gap: 3px; }
.bar {
  width: 36px; height: 4px;
  border-radius: 4px;
  background: #e2e8f0;
  transition: background 0.3s;
}
.bar.weak { background: #ef4444; }
.bar.fair { background: #f59e0b; }
.bar.good { background: #3b82f6; }
.bar.strong { background: #10b981; }
.strength-label { font-size: 0.72rem; font-weight: 500; }
.strength-label.weak { color: #ef4444; }
.strength-label.fair { color: #f59e0b; }
.strength-label.good { color: #3b82f6; }
.strength-label.strong { color: #10b981; }

.modal-ftr {
  display: flex; justify-content: flex-end; gap: 0.6rem;
  margin-top: 1.25rem; padding-top: 1rem;
  border-top: 0.5px solid #f1f5f9;
}
.btn-cancel {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.55rem 1rem;
  background: #f1f5f9; color: #64748b;
  border: none; border-radius: 10px; cursor: pointer; font-size: 0.83rem;
  transition: background 0.2s;
}
.btn-cancel:hover { background: #e2e8f0; }
.btn-save {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.55rem 1.25rem;
  background: linear-gradient(135deg, #17284a, #18b2bc);
  color: white; border: none; border-radius: 10px; cursor: pointer;
  font-size: 0.83rem; font-weight: 500;
  transition: opacity 0.2s, transform 0.2s;
}
.btn-save:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* Delete Confirm */
.confirm-box {
  background: white; border-radius: 18px;
  width: 92%; max-width: 360px; padding: 1.75rem;
  text-align: center; border: 0.5px solid #e2e8f0;
}
.confirm-ico {
  width: 52px; height: 52px;
  background: #fef2f2; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; color: #ef4444; margin: 0 auto 1rem;
}
.confirm-box h3 { font-size: 0.95rem; font-weight: 500; margin-bottom: 0.4rem; color: #1e293b; }
.confirm-box p { font-size: 0.82rem; color: #64748b; margin-bottom: 1.25rem; }
.c-btns { display: flex; justify-content: center; gap: 0.5rem; }
.btn-confirm {
  display: inline-flex; align-items: center; gap: 0.35rem;
  background: #ef4444; color: white;
  border: none; border-radius: 10px;
  padding: 0.5rem 1.25rem; cursor: pointer; font-size: 0.83rem;
  transition: background 0.2s;
}
.btn-confirm:hover { background: #dc2626; }

/* Toast */
.toast-msg {
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  background: white; border-radius: 10px;
  padding: 0.7rem 1rem;
  display: flex; align-items: center; gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(0,0,0,.1);
  font-size: 0.83rem; min-width: 200px; z-index: 9999;
}
.toast-msg.success { border-left: 3px solid #10b981; }
.toast-msg.success i { color: #10b981; }
.toast-msg.error { border-left: 3px solid #ef4444; }
.toast-msg.error i { color: #ef4444; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(20px); }

/* Responsive */
@media (max-width: 768px) {
  .users-list-page { padding: 1rem; }
  .page-header { flex-direction: column; }
  .header-actions { width: 100%; }
  .btn-refresh, .btn-add { flex: 1; justify-content: center; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .user-email { display: none; }
  .user-email-mobile { display: block; }
  .modal-ftr { flex-direction: column-reverse; }
  .btn-save, .btn-cancel { width: 100%; justify-content: center; }
  .pager { flex-direction: column; gap: 0.75rem; }
  .toast-msg { right: 1rem; left: 1rem; bottom: 1rem; }
}
@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 1.35rem; }
}
</style>
