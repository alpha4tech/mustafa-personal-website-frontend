<template>
  <div class="service-requests-page" :class="{ 'rtl-requests': isRtl }">

    <!-- ── Header ── -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="bi bi-inbox-fill"></i>
        </div>
        <div>
          <h1 class="page-title">{{ t('serviceRequests') || 'طلبات الخدمات' }}</h1>
          <p class="page-subtitle">{{ t('manageServiceRequests') || 'إدارة طلبات الخدمات من العملاء' }}</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="fetchRequests" :disabled="loading">
          <i class="bi bi-arrow-repeat" :class="{ spinning: loading }"></i>
          {{ t('refresh') || 'تحديث' }}
        </button>
        <router-link to="/admin/services" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          {{ t('backToServices') || 'العودة للخدمات' }}
        </router-link>
      </div>
    </div>

    <!-- ── Stats Cards ── -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <i class="bi bi-inbox"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">{{ t('totalRequests') || 'إجمالي الطلبات' }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon unread">
          <i class="bi bi-envelope"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.unread }}</div>
          <div class="stat-label">{{ t('unreadRequests') || 'غير مقروء' }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon read">
          <i class="bi bi-envelope-open"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.read }}</div>
          <div class="stat-label">{{ t('readRequests') || 'مقروء' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Filters & Search ── -->
    <div class="filters-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-5">
          <div class="search-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="filters.search"
              type="text"
              class="search-input"
              :placeholder="t('searchPlaceholder') || 'بحث باسم الخدمة أو العميل أو الهاتف'"
              @input="debouncedFetch"
            />
          </div>
        </div>
        <div class="col-md-3">
          <label class="filter-label">{{ t('status') || 'الحالة' }}</label>
          <select v-model="filters.is_read" class="filter-select" @change="fetchRequests">
            <option value="">{{ t('all') || 'الكل' }}</option>
            <option value="false">{{ t('unread') || 'غير مقروء' }}</option>
            <option value="true">{{ t('read') || 'مقروء' }}</option>
          </select>
        </div>
        <div class="col-md-4 d-flex gap-2">
          <button class="btn-reset flex-fill" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i>{{ t('reset') || 'إعادة تعيين' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-wrap">
        <div class="spinner-border" role="status"></div>
        <span>{{ t('loading') || 'جاري التحميل' }}</span>
      </div>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="!requests.length" class="empty-state">
      <div class="empty-icon"><i class="bi bi-inbox"></i></div>
      <h5>{{ t('noRequests') || 'لا توجد طلبات' }}</h5>
      <p>{{ t('noRequestsDesc') || 'لا توجد طلبات خدمات حتى الآن' }}</p>
    </div>

    <!-- ── Grid ── -->
    <div v-else class="requests-grid">
      <div v-for="request in requests" :key="request.id" class="request-card">
        <!-- Read Status Badge -->
        <span class="read-badge" :class="request.is_read ? 'read' : 'unread'">
          <i :class="request.is_read ? 'bi bi-envelope-open' : 'bi bi-envelope'"></i>
          {{ request.is_read ? (t('read') || 'مقروء') : (t('unread') || 'غير مقروء') }}
        </span>

        <!-- Service Info -->
        <div class="service-info">
          <div class="service-icon-wrap">
            <i class="bi bi-briefcase"></i>
          </div>
          <div>
            <h5 class="service-title">{{ request.service_title }}</h5>
            <span class="service-date">{{ formatDate(request.created_at) }}</span>
          </div>
        </div>

        <!-- Client Info -->
        <div class="client-info">
          <div class="client-avatar">
            <span>{{ getInitials(request.name) }}</span>
          </div>
          <div class="client-details">
            <div class="client-name">{{ request.name }}</div>
            <div class="client-phone">
              <i class="bi bi-telephone"></i>
              <a :href="'tel:' + request.phone">{{ request.phone }}</a>
            </div>
          </div>
        </div>

        <!-- Message Preview -->
        <div class="message-preview" v-if="request.message">
          <i class="bi bi-chat-quote"></i>
          <p>{{ truncateText(request.message, 80) }}</p>
        </div>

        <!-- Actions -->
        <div class="card-actions">
          <button class="action-btn btn-view" @click="viewRequest(request.id)" :title="t('view') || 'عرض'">
            <i class="bi bi-eye"></i>
            <span>{{ t('view') || 'عرض' }}</span>
          </button>
          <button class="action-btn btn-toggle" @click="toggleReadStatus(request)" :title="request.is_read ? (t('markUnread') || 'تحديد غير مقروء') : (t('markRead') || 'تحديد مقروء')">
            <i :class="request.is_read ? 'bi bi-envelope-open' : 'bi bi-envelope'"></i>
            <span>{{ request.is_read ? (t('unread') || 'غير مقروء') : (t('read') || 'مقروء') }}</span>
          </button>
          <button class="action-btn btn-delete" @click="deleteRequest(request.id)" :title="t('delete') || 'حذف'">
            <i class="bi bi-trash"></i>
            <span>{{ t('delete') || 'حذف' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Pagination ── -->
    <div v-if="pagination.last_page > 1" class="pagination-wrap">
      <button class="page-btn" :disabled="pagination.current_page === 1" @click="goToPage(pagination.current_page - 1)">
        <i class="bi bi-chevron-right"></i>
      </button>
      <span class="page-info">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
      <button class="page-btn" :disabled="pagination.current_page === pagination.last_page" @click="goToPage(pagination.current_page + 1)">
        <i class="bi bi-chevron-left"></i>
      </button>
    </div>

    <!-- ── Detail Modal ── -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="showDetailModal = false">
      <div class="modal-card">
        <div class="modal-header-custom">
          <div>
            <span class="modal-badge" :class="selectedRequest?.is_read ? 'badge-read' : 'badge-unread'">
              {{ selectedRequest?.is_read ? (t('read') || 'مقروء') : (t('unread') || 'غير مقروء') }}
            </span>
            <h5 class="modal-title">{{ selectedRequest?.service_title }}</h5>
          </div>
          <button class="modal-close" @click="showDetailModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="modal-body-custom">
          <div class="detail-row">
            <div class="detail-label">
              <i class="bi bi-person"></i> {{ t('name') || 'الاسم' }}
            </div>
            <div class="detail-value">{{ selectedRequest?.name }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="bi bi-telephone"></i> {{ t('PhoneNumber') || 'الهاتف' }}
            </div>
            <div class="detail-value">
              <a :href="'tel:' + selectedRequest?.phone">{{ selectedRequest?.phone }}</a>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="bi bi-envelope"></i> {{ t('email') || 'البريد الإلكتروني' }}
            </div>
            <div class="detail-value">{{ selectedRequest?.email || '—' }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">
              <i class="bi bi-calendar"></i> {{ t('date') || 'التاريخ' }}
            </div>
            <div class="detail-value">{{ formatFullDate(selectedRequest?.created_at) }}</div>
          </div>

          <div class="detail-row full-width" v-if="selectedRequest?.message">
            <div class="detail-label">
              <i class="bi bi-chat-quote"></i> {{ t('message') || 'الرسالة' }}
            </div>
            <div class="detail-value message-value">{{ selectedRequest?.message }}</div>
          </div>

          <div class="detail-row full-width" v-if="selectedRequest?.notes">
            <div class="detail-label">
              <i class="bi bi-sticky"></i> {{ t('notes') || 'ملاحظات' }}
            </div>
            <div class="detail-value notes-value">{{ selectedRequest?.notes }}</div>
          </div>
        </div>

        <div class="modal-footer-custom">
          <button class="btn-cancel" @click="showDetailModal = false">
            {{ t('close') || 'إغلاق' }}
          </button>
          <button class="btn-toggle-read" @click="toggleReadStatus(selectedRequest)">
            <i :class="selectedRequest?.is_read ? 'bi bi-envelope-open' : 'bi bi-envelope'"></i>
            {{ selectedRequest?.is_read ? (t('markUnread') || 'تحديد غير مقروء') : (t('markRead') || 'تحديد مقروء') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── Toast ── -->
    <transition name="toast">
      <div v-if="toast.show" :class="`toast-msg toast-${toast.type}`">
        <i :class="`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-x-circle'} me-2`"></i>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from '@/api/axios'
import { useSettings } from '@/composables/useSettings'

const { t, isRtl } = useSettings()

// State
const requests = ref([])
const loading = ref(false)
const showDetailModal = ref(false)
const selectedRequest = ref(null)
const toast = ref({ show: false, type: 'success', message: '' })

const stats = ref({ total: 0, unread: 0, read: 0 })

const pagination = ref({ current_page: 1, last_page: 1, per_page: 12, total: 0 })
const filters = ref({ search: '', is_read: '' })

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchRequests, 400)
}

// ── Helper Functions ──
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleDateString(isRtl.value ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const formatFullDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString(isRtl.value ? 'ar-EG' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3500)
}

// ── API Calls ──
const fetchRequests = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, ...filters.value }
    const res = await axios.get('/admin/service-requests', { params })
    requests.value = res.data.data || []
    pagination.value = res.data.pagination || { current_page: 1, last_page: 1, total: 0 }

    // Update stats
    stats.value.total = requests.value.length
    stats.value.unread = requests.value.filter(r => !r.is_read).length
    stats.value.read = requests.value.filter(r => r.is_read).length
  } catch (error) {
    console.error(error)
    showToast('error', t('failedToLoad') || 'فشل في جلب البيانات')
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => fetchRequests(page)

const resetFilters = () => {
  filters.value = { search: '', is_read: '' }
  fetchRequests()
}

const viewRequest = async (id) => {
  try {
    const res = await axios.get(`/admin/service-requests/${id}`)
    selectedRequest.value = res.data
    showDetailModal.value = true

    // Refresh list to update read status
    fetchRequests(pagination.value.current_page)
  } catch (error) {
    console.error(error)
    showToast('error', t('failedToLoad') || 'فشل في جلب البيانات')
  }
}

const toggleReadStatus = async (request) => {
  if (!request) return

  try {
    const newStatus = !request.is_read
    await axios.patch(`/admin/service-requests/${request.id}/toggle-read`, {
      is_read: newStatus
    })

    request.is_read = newStatus

    // Update stats
    if (newStatus) {
      stats.value.unread--
      stats.value.read++
    } else {
      stats.value.unread++
      stats.value.read--
    }

    showToast('success', newStatus ? (t('markedAsRead') || 'تم التحديد كمقروء') : (t('markedAsUnread') || 'تم التحديد كغير مقروء'))
  } catch (error) {
    console.error(error)
    showToast('error', t('failedToUpdate') || 'فشل في تحديث الحالة')
  }
}

const deleteRequest = async (id) => {
  if (!confirm(t('confirmDelete') || 'هل أنت متأكد من حذف هذا الطلب؟')) return

  try {
    await axios.delete(`/admin/service-requests/${id}`)
    showToast('success', t('deletedSuccess') || 'تم حذف الطلب بنجاح')
    fetchRequests(pagination.value.current_page)
  } catch (error) {
    console.error(error)
    showToast('error', t('failedToDelete') || 'فشل في حذف الطلب')
  }
}

// ── Lifecycle ──
onMounted(() => {
  fetchRequests()
})
</script>

<style scoped>
.service-requests-page {
  padding: 1.5rem;
  background: #F0F0F0;
  min-height: 100vh;
}

/* RTL Support */
.service-requests-page.rtl-requests {
  direction: rtl;
}

.service-requests-page.rtl-requests .search-icon {
  left: auto;
  right: 0.85rem;
}

.service-requests-page.rtl-requests .search-input {
  padding: 0.6rem 2.5rem 0.6rem 0.85rem;
}

.service-requests-page.rtl-requests .page-btn i {
  transform: rotate(180deg);
}

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.8rem;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-navy, #17284A), var(--color-blue, #324A6F));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-refresh, .btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.btn-refresh {
  background: white;
  color: var(--color-teal, #18B2BC);
  border: 1px solid var(--color-teal, #18B2BC);
}

.btn-refresh:hover:not(:disabled) {
  background: var(--color-teal, #18B2BC);
  color: white;
}

.spinning {
  animation: spin 1s linear infinite;
}

.btn-back {
  background: #f1f5f9;
  color: #475569;
}

.btn-back:hover {
  background: #e2e8f0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Stats ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.stat-icon.total { background: #eef2ff; color: var(--color-teal, #18B2BC); }
.stat-icon.unread { background: #fef3c7; color: #f59e0b; }
.stat-icon.read { background: #ecfdf5; color: #10b981; }

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 0.2rem;
}

/* ── Filters ── */
.filters-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.filter-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0.85rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.85rem 0.6rem 2.5rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.875rem;
  outline: none;
  transition: border 0.2s;
}

.search-input:focus {
  border-color: var(--color-teal, #18B2BC);
}

.filter-select {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.875rem;
  outline: none;
  background: white;
  cursor: pointer;
}

.btn-reset {
  padding: 0.6rem;
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #475569;
}

.btn-reset:hover {
  background: #e2e8f0;
}

/* ── Loading ── */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem;
}

.spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-teal, #18B2BC);
}

/* ── Empty ── */
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state h5 {
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.empty-state p {
  color: #94a3b8;
  margin-bottom: 0;
}

/* ── Grid ── */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.request-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  position: relative;
  transition: all 0.3s;
}

.request-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* Read Badge */
.read-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.7rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.rtl-requests .read-badge {
  right: auto;
  left: 1rem;
}

.read-badge.read {
  background: #ecfdf5;
  color: #10b981;
}

.read-badge.unread {
  background: #fef3c7;
  color: #f59e0b;
}

/* Service Info */
.service-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.service-icon-wrap {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(24, 178, 188, 0.1), rgba(24, 178, 188, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--color-teal, #18B2BC);
}

.service-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.2rem;
}

.service-date {
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Client Info */
.client-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 0.8rem;
}

.client-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.client-details {
  flex: 1;
}

.client-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.client-phone {
  font-size: 0.75rem;
  color: #64748b;
}

.client-phone a {
  color: #64748b;
  text-decoration: none;
}

.client-phone a:hover {
  color: var(--color-teal, #18B2BC);
}

.client-phone i {
  margin-right: 0.3rem;
}

.rtl-requests .client-phone i {
  margin-right: 0;
  margin-left: 0.3rem;
}

/* Message Preview */
.message-preview {
  display: flex;
  gap: 0.5rem;
  padding: 0.6rem;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.message-preview i {
  color: var(--color-teal, #18B2BC);
  font-size: 0.9rem;
  margin-top: 0.1rem;
}

.message-preview p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.4;
}

/* Actions */
.card-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.action-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s;
  text-decoration: none;
}

.action-btn.btn-view {
  background: #eef2ff;
  color: var(--color-teal, #18B2BC);
}

.action-btn.btn-view:hover {
  background: var(--color-teal, #18B2BC);
  color: white;
}

.action-btn.btn-toggle {
  background: #fffbeb;
  color: #f59e0b;
}

.action-btn.btn-toggle:hover {
  background: #f59e0b;
  color: white;
}

.action-btn.btn-delete {
  background: #fef2f2;
  color: #ef4444;
}

.action-btn.btn-delete:hover {
  background: #ef4444;
  color: white;
}

/* ── Pagination ── */
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.page-btn {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--color-teal, #18B2BC);
  color: var(--color-teal, #18B2BC);
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 600;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalIn 0.3s ease;
}

.modal-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  z-index: 1;
}

.modal-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modal-badge.badge-read {
  background: #ecfdf5;
  color: #10b981;
}

.modal-badge.badge-unread {
  background: #fef3c7;
  color: #f59e0b;
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #ef4444;
}

.modal-body-custom {
  padding: 1.25rem;
}

.detail-row {
  display: flex;
  margin-bottom: 1rem;
}

.detail-row.full-width {
  flex-direction: column;
}

.detail-label {
  width: 120px;
  font-weight: 600;
  color: #64748b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-value {
  flex: 1;
  color: #1e293b;
  font-size: 0.9rem;
}

.detail-value a {
  color: var(--color-teal, #18B2BC);
  text-decoration: none;
}

.detail-value a:hover {
  text-decoration: underline;
}

.message-value {
  background: #f8fafc;
  padding: 0.8rem;
  border-radius: 10px;
  line-height: 1.6;
  margin-top: 0.3rem;
}

.notes-value {
  background: #fefce8;
  padding: 0.8rem;
  border-radius: 10px;
  line-height: 1.6;
  margin-top: 0.3rem;
  color: #92400e;
}

.modal-footer-custom {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 0.5rem 1.2rem;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-toggle-read {
  padding: 0.5rem 1.2rem;
  background: #fffbeb;
  color: #f59e0b;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s;
}

.btn-toggle-read:hover {
  background: #f59e0b;
  color: white;
}

/* ── Toast ── */
.toast-msg {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 99999;
  padding: 0.85rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.rtl-requests .toast-msg {
  right: auto;
  left: 2rem;
}

.toast-success {
  background: #dcfce7;
  color: #15803d;
}

.toast-error {
  background: #fee2e2;
  color: #dc2626;
}

/* ── Animations ── */
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.35s;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .service-requests-page {
    padding: 1rem;
  }

  .header-content {
    flex: 1;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-wrap: wrap;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .requests-grid {
    grid-template-columns: 1fr;
  }

  .modal-card {
    width: 95%;
  }

  .detail-row {
    flex-direction: column;
  }

  .detail-label {
    width: 100%;
    margin-bottom: 0.3rem;
  }

  .toast-msg {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
}
</style>
