<template>
  <div class="contact-list-page" :class="{ 'rtl-contact': isRtl }">
    <GlobalLoader :isLoading="loading" />
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ t('ContactTitle') }}</h1>
        <p class="page-subtitle">{{ t('ContactSubtitle') }}</p>
      </div>
      <div class="header-actions">
        <button @click="fetchMessages" class="btn-refresh" :disabled="loading">
          <i class="bi bi-arrow-repeat" :class="{ spinning: loading }"></i>
          {{ t('Refresh') }}
        </button>
        <button @click="exportData" class="btn-export">
          <i class="bi bi-download"></i>
          {{ t('Export') }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon primary">
          <i class="bi bi-envelope"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.total }}</h3>
          <p>{{ t('Total Messages') }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon success">
          <i class="bi bi-people"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.uniqueSenders }}</h3>
          <p>{{ t('UniqueSenders') }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon warning">
          <i class="bi bi-calendar-today"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.today }}</h3>
          <p>{{ t('Today\'s Messages') }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon info">
          <i class="bi bi-calendar-week"></i>
        </div>
        <div class="stat-info">
          <h3>{{ stats.thisWeek }}</h3>
          <p>{{ t('Last 7 Days') }}</p>
        </div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="filter-bar">
      <div class="search-wrapper">
        <i class="bi bi-search"></i>
        <input
          type="text"
          v-model="searchQuery"
          :placeholder="t('SearchBy')"
          class="search-input"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="clear-btn">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="filter-wrapper">
        <select v-model="filterDate" class="filter-select">
          <option value="all">{{ t('All Time') }}</option>
          <option value="today">{{ t('Today') }}</option>
          <option value="week">{{ t('Last 7 Days') }}</option>
          <option value="month">{{ t('Last 30 Days') }}</option>
        </select>
        <select v-model="sortOrder" class="filter-select">
          <option value="desc">{{ t('Newest First') }}</option>
          <option value="asc">{{ t('Oldest First') }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ t('LoadingMessages') }}</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-container">
      <i class="bi bi-exclamation-triangle-fill"></i>
      <p>{{ error }}</p>
      <button @click="fetchMessages" class="retry-btn">{{ t('TryAgain') }}</button>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredMessages.length === 0" class="empty-container">
      <i class="bi bi-inbox"></i>
      <h3>{{ t('NoMessages') }}</h3>
      <p>{{ t('ThereMessages') }}</p>
    </div>

    <!-- Messages Grid -->
    <div v-else>
      <!-- Desktop Table View -->
      <div class="table-container desktop-view">
        <table class="messages-table">
          <thead>
            <tr>
              <th @click="sortBy('name')" class="sortable">
                {{ t('Name') }}
                <i v-if="sortField === 'name'" :class="sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              </th>
              <th @click="sortBy('email')" class="sortable">
                {{ t('Email') }}
                <i v-if="sortField === 'email'" :class="sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              </th>
              <th>{{ t('Subject') }}</th>
              <th>{{ t('Message') }}</th>
              <th @click="sortBy('created_at')" class="sortable">
                {{ t('Date') }}
                <i v-if="sortField === 'created_at'" :class="sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
              </th>
              <th>{{ t('Actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in paginatedMessages" :key="message.id">
              <td>
                <div class="sender-cell">
                  <div class="avatar">{{ getInitials(message.name) }}</div>
                  <span>{{ message.name }}</span>
                </div>
              </td>
              <td>
                <a :href="'mailto:' + message.email" class="email-link">
                  {{ message.email }}
                </a>
              </td>
              <td>
                <span class="subject-badge">{{ message.subject || t('Nosubject') }}</span>
              </td>
              <td>
                <div class="message-preview">
                  <span>{{ truncateText(message.message, 50) }}</span>
                  <button @click="viewMessage(message)" class="view-btn">{{ t('View') }}</button>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <span class="date">{{ formatDate(message.created_at) }}</span>
                  <span class="time">{{ formatTime(message.created_at) }}</span>
                </div>
              </td>
              <td>
                <div class="actions">
                  <button @click="viewMessage(message)" class="action-btn view" :title="t('ViewDetails')">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button @click="replyToMessage(message)" class="action-btn reply" :title="t('Reply')">
                    <i class="bi bi-reply" :class="{ 'reply-flip': isRtl }"></i>
                  </button>
                  <button @click="deleteContact(message)" class="action-btn delete" :title="t('Delete')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-cards mobile-view">
        <div v-for="message in paginatedMessages" :key="message.id" class="message-card">
          <div class="card-header">
            <div class="sender-info">
              <div class="avatar">{{ getInitials(message.name) }}</div>
              <div>
                <h4>{{ message.name }}</h4>
                <a :href="'mailto:' + message.email" class="email-link">{{ message.email }}</a>
              </div>
            </div>
            <span class="date-badge">{{ formatDate(message.created_at) }}</span>
          </div>
          <div class="card-body">
            <div class="card-subject">
              <strong>{{ t('Subject') }}:</strong> {{ message.subject || t('No subject') }}
            </div>
            <div class="card-message">
              <p>{{ truncateText(message.message, 100) }}</p>
            </div>
          </div>
          <div class="card-footer">
            <span class="time"><i class="bi bi-clock"></i> {{ formatTime(message.created_at) }}</span>
            <div class="card-actions">
              <button @click="viewMessage(message)" class="action-btn view" :title="t('View')">
                <i class="bi bi-eye"></i>
              </button>
              <button @click="replyToMessage(message)" class="action-btn reply" :title="t('Reply')">
                <i class="bi bi-reply" :class="{ 'reply-flip': isRtl }"></i>
              </button>
              <button @click="deleteContact(message)" class="action-btn delete" :title="t('Delete')">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
          <i class="bi" :class="isRtl ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
        <div class="page-numbers">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="currentPage = page"
            :class="['page-num', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
        </div>
        <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
          <i class="bi" :class="isRtl ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
        </button>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <div v-if="selectedMessage" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t('MessageDetails') }}</h3>
          <button @click="closeModal" class="close-modal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="info-row">
            <label>{{ t('Name') }}:</label>
            <span>{{ selectedMessage.name }}</span>
          </div>
          <div class="info-row">
            <label>{{ t('Email') }}:</label>
            <a :href="'mailto:' + selectedMessage.email">{{ selectedMessage.email }}</a>
          </div>
          <div class="info-row">
            <label>{{ t('Subject') }}:</label>
            <span>{{ selectedMessage.subject || t('NoSubject') }}</span>
          </div>
          <div class="info-row">
            <label>{{ t('Date') }}:</label>
            <span>{{ formatFullDate(selectedMessage.created_at) }}</span>
          </div>
          <div class="info-row message-row">
            <label>{{ t('Message') }}:</label>
            <div class="message-content">{{ selectedMessage.message }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="replyToMessage(selectedMessage)" class="reply-btn-modal">
            <i class="bi bi-reply" :class="{ 'reply-flip': isRtl }"></i> {{ t('Reply') }}
          </button>
          <button @click="deleteContact(message)" class="delete-btn-modal">
            <i class="bi bi-trash"></i> {{ t('Delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useSettings } from '@/composables/useSettings'
import GlobalLoader from '@/components/GlobalLoader.vue'
import { useConfirm } from '@/composables/useConfirm'
const { confirm } = useConfirm()

const { t, isRtl } = useSettings()

// State
const contactMessages = ref([])
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const filterDate = ref('all')
const sortOrder = ref('desc')
const sortField = ref('created_at')
const sortDirection = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedMessage = ref(null)

const toast = ref({ show: false, message: '', type: 'success' })

// Stats
const stats = computed(() => {
  const messages = contactMessages.value
  const uniqueEmails = [...new Set(messages.map(m => m.email))].length
  const today = new Date().toDateString()
  const todayCount = messages.filter(m => new Date(m.created_at).toDateString() === today).length
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekCount = messages.filter(m => new Date(m.created_at) >= weekAgo).length
  return {
    total: messages.length,
    uniqueSenders: uniqueEmails,
    today: todayCount,
    thisWeek: weekCount
  }
})

// Filtered messages
const filteredMessages = computed(() => {
  let filtered = [...contactMessages.value]

  if (filterDate.value !== 'all') {
    const now = new Date()
    const weekAgo = new Date()
    weekAgo.setDate(now.getDate() - 7)
    const monthAgo = new Date()
    monthAgo.setDate(now.getDate() - 30)

    filtered = filtered.filter(msg => {
      const msgDate = new Date(msg.created_at)
      if (filterDate.value === 'today') {
        return msgDate.toDateString() === new Date().toDateString()
      }
      if (filterDate.value === 'week') {
        return msgDate >= weekAgo
      }
      if (filterDate.value === 'month') {
        return msgDate >= monthAgo
      }
      return true
    })
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(msg =>
      (msg.name && msg.name.toLowerCase().includes(query)) ||
      (msg.email && msg.email.toLowerCase().includes(query)) ||
      (msg.subject && msg.subject.toLowerCase().includes(query)) ||
      (msg.message && msg.message.toLowerCase().includes(query))
    )
  }

  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    if (sortField.value === 'created_at') {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }
    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredMessages.value.length / itemsPerPage.value))
const paginatedMessages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMessages.value.slice(start, end)
})

const displayedPages = computed(() => {
  const pages = []
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + 4)
  if (end - start + 1 < 5) start = Math.max(1, end - 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t('Today')
  if (diffDays === 1) return t('Yesterday')
  if (diffDays < 7) return t('{days} days ago', { days: diffDays })
  return date.toLocaleDateString(isRtl.value ? 'ar-SA' : 'en-US')
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString(isRtl.value ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })
}

const formatFullDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString(isRtl.value ? 'ar-SA' : 'en-US')
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'desc'
  }
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const fetchMessages = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get('/contacts')

    if (response.data && response.data.data) {
      contactMessages.value = response.data.data
    } else if (Array.isArray(response.data)) {
      contactMessages.value = response.data
    } else {
      contactMessages.value = []
    }
  } catch (err) {
    console.error('Error fetching messages:', err)
    error.value = t('Failed to load messages. Please try again.')
    showToast(error.value, 'error')
  } finally {
    loading.value = false
  }
}

const deleteMessageApi = async (id) => {
  try {
    await axios.delete(`/contacts/${id}`)
    showToast(t('Message deleted successfully'), 'success')
    await fetchMessages()
  } catch (err) {
    console.error('Error deleting message:', err)
    showToast(t('Failed to delete message'), 'error')
  }
}

const viewMessage = (message) => {
  selectedMessage.value = message
}

const closeModal = () => {
  selectedMessage.value = null
}

const replyToMessage = (message) => {
  const subject = `Re: ${message.subject || 'Inquiry'}`
  window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(subject)}`
}

const deleteContact = async (contact) => {

  const ok = await confirm({
    title: t('ConfirmDelete'),
    message: t('DeleteConfirmMessage'),
    confirmText: t('Delete'),
    cancelText: t('Cancel')
  })

  if (!ok) return

  await axios.delete(`/contacts/${contact.id}`)

  fetchMessages()
}

const exportData = () => {
  const data = filteredMessages.value.map(m => ({
    [t('Name')]: m.name,
    [t('Email')]: m.email,
    [t('Subject')]: m.subject,
    [t('Message')]: m.message,
    [t('Date')]: formatFullDate(m.created_at)
  }))
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `messages_${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  showToast(t('Data exported successfully'), 'success')
}

watch([searchQuery, filterDate, sortOrder], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchMessages()
})
</script>

<style scoped>
.contact-list-page {
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
}

/* RTL Support */
.contact-list-page.rtl-contact {
  direction: rtl;
}

.contact-list-page.rtl-contact .search-wrapper i {
  left: auto;
  right: 12px;
}

.contact-list-page.rtl-contact .search-input {
  padding: 0.7rem 2.2rem 0.7rem 2rem;
}

.contact-list-page.rtl-contact .clear-btn {
  right: auto;
  left: 10px;
}

.contact-list-page.rtl-contact .messages-table th,
.contact-list-page.rtl-contact .messages-table td {
  text-align: right;
}

.contact-list-page.rtl-contact .sender-cell {
  flex-direction: row-reverse;
}

.contact-list-page.rtl-contact .action-btn.reply i.reply-flip {
  transform: scaleX(-1);
}

.contact-list-page.rtl-contact .info-row {
  flex-direction: row-reverse;
}

.contact-list-page.rtl-contact .info-row label {
  text-align: right;
}

.contact-list-page.rtl-contact .modal-footer {
  flex-direction: row-reverse;
}

.contact-list-page.rtl-contact .reply-btn-modal i.reply-flip {
  transform: scaleX(-1);
}

.toast.rtl-toast {
  right: auto;
  left: 2rem;
}

/* Header */
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
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-navy, #17284a), var(--color-blue, #324a6f));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

.btn-refresh, .btn-export {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-refresh {
  background: white;
  color: var(--color-teal, #18b2bc);
  border: 1px solid var(--color-teal, #18b2bc);
}

.btn-refresh:hover:not(:disabled) {
  background: var(--color-teal, #18b2bc);
  color: white;
  transform: translateY(-2px);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-export {
  background: #10b981;
  color: white;
}

.btn-export:hover {
  background: #059669;
  transform: translateY(-2px);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
}

.stat-icon.primary { background: #eef2ff; color: #667eea; }
.stat-icon.success { background: #ecfdf5; color: #10b981; }
.stat-icon.warning { background: #fffbeb; color: #f59e0b; }
.stat-icon.info { background: #e0f2fe; color: #0ea5e9; }

.stat-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
}

.stat-info p {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  position: relative;
  min-width: 250px;
}

.search-wrapper i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.7rem 2rem 0.7rem 2.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-teal, #18B2BC);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
}

.filter-wrapper {
  display: flex;
  gap: 0.8rem;
}

.filter-select {
  padding: 0.7rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  color: #1e293b;
}

/* Table */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: auto;
  border: 1px solid #e2e8f0;
}

.messages-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.messages-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
}

.messages-table th:hover {
  background: linear-gradient(135deg, var(--color-navy, #17284a), var(--color-blue, #324a6f));

}

.messages-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.messages-table tr:last-child td {
  border-bottom: none;
}

.messages-table tr:hover {
  background: #f8fafc;
}

.sortable i {
  font-size: 0.7rem;
  margin-left: 0.3rem;
}

.sender-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.avatar {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, var(--color-navy, #17284a), var(--color-blue, #324a6f));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.email-link {
  color: #667eea;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.subject-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  background: #f1f5f9;
  color: #475569;
  border-radius: 20px;
  font-size: 0.75rem;
}

.message-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  max-width: 250px;
}

.message-preview span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #64748b;
  font-size: 0.85rem;
}

.view-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 0.7rem;
  white-space: nowrap;
}

.view-btn:hover {
  text-decoration: underline;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.date {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1e293b;
}

.time {
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Actions */
.actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.view { background: #eef2ff; color: #667eea; }
.action-btn.reply { background: #ecfdf5; color: #10b981; }
.action-btn.delete { background: #fef2f2; color: #ef4444; }

.action-btn:hover { transform: scale(1.05); }

/* Mobile Cards */
.mobile-view {
  display: none;
}

.message-card {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.message-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sender-info {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.sender-info h4 {
  margin: 0 0 0.2rem;
  font-size: 1rem;
  color: #1e293b;
}

.date-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: #f1f5f9;
  border-radius: 20px;
  color: #64748b;
}

.card-body {
  margin-bottom: 1rem;
}

.card-subject {
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.card-subject strong {
  color: #475569;
}

.card-message p {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.8rem;
  border-top: 1px solid #f1f5f9;
}

.card-footer .time {
  font-size: 0.7rem;
  color: #94a3b8;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  margin-top: 1rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.3rem;
}

.page-num {
  width: 36px;
  height: 36px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-num.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.page-num:hover:not(.active) {
  background: #f1f5f9;
}

/* Loading, Error, Empty */
.loading-container, .error-container, .empty-container {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.error-container i, .empty-container i {
  font-size: 3rem;
  color: #94a3b8;
  margin-bottom: 1rem;
}
.empty-container h3 {
  margin: 0 0 0.5rem;
  color: #1e293b;
}
.empty-container p {
  margin: 0;
  color: #64748b;
}
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
  position: relative;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.modal-header h3 {
  margin: 0;
  color: #1e293b;
}
.close-modal {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
}
.modal-body .info-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}
.modal-body .info-row label {
  font-weight: 600;
  color: #475569;
  min-width: 80px;
}
.modal-body .info-row span, .modal-body .info-row a {
  color: #1e293b;
}
.modal-body .message-row {  flex-direction: column;
}
.modal-body .message-content {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 12px;
  color: #64748b;
  white-space: pre-wrap;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}
.reply-btn-modal {
  background: #ecfdf5;
  color: #10b981;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.reply-btn-modal i.reply-flip {
  transform: scaleX(-1);
}
.delete-btn-modal {
  background: #fef2f2;
  color: #ef4444;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
/* Delete Confirmation */
.confirm-dialog {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  padding: 1.5rem;
  text-align: center;
}
.confirm-icon {
  width: 50px;
  height: 50px;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}
.confirm-dialog h3 {
  margin: 0 0 0.5rem;
  color: #1e293b;
}
.confirm-dialog p {
  margin: 0 0 1rem;
  color: #64748b;
}
.confirm-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.cancel-btn {
  background: #e2e8f0;
  color: #475569;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
}
.confirm-btn {  background: #ef4444;
  color: white;  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
}
/* Toast */
.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: white;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}
.toast.success {
  border-left: 4px solid #10b981;
}
.toast.error {
  border-left: 4px solid #ef4444;
}
.toast i {
  font-size: 1.2rem;
}
.toast span {
  color: #1e293b;
  font-size: 0.9rem;
}
.toast.rtl-toast {
  right: auto;
  left: 1.5rem;
}
/* Responsive */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }
  .mobile-view {
    display: block;
  }
}
</style>
