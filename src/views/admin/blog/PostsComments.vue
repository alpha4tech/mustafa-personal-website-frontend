<template>
  <div class="comments-page" :class="{ 'rtl-comments': isRtl }">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <i class="bi bi-chat-dots-fill"></i>
        </div>
        <div>
          <h1 class="page-title">{{ t('comments') || 'التعليقات' }}</h1>
          <p class="page-subtitle">{{ t('manageComments') || 'إدارة تعليقات المدونة ومراجعتها' }}</p>
        </div>
      </div>
    </div>

    <!-- ── Stats Cards ── -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <i class="bi bi-chat-dots"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">{{ t('totalComments') || 'إجمالي التعليقات' }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon approved">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.approved }}</div>
          <div class="stat-label">{{ t('approvedComments') || 'التعليقات المعتمدة' }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="bi bi-hourglass-split"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">{{ t('pendingComments') || 'قيد المراجعة' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Filters & Search ── -->
    <div class="toolbar">
      <div class="search-wrapper">
        <i class="bi bi-search"></i>
        <input
          v-model="search"
          type="search"
          :placeholder="t('searchComment') || 'ابحث عن تعليق...'"
          class="search-input"
          @input="onSearch"
        />
        <button v-if="search" class="clear-search" @click="search = ''; onSearch()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="filter-buttons">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: activeFilter === f.value }"
          @click="setFilter(f.value)"
        >
          <i :class="f.icon"></i>
          <span>{{ f.label }}</span>
          <span class="filter-badge">{{ f.count }}</span>
        </button>
      </div>

      <div class="view-toggle">
        <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'" :title="t('tableView') || 'جدول'">
          <i class="bi bi-table"></i>
        </button>
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" :title="t('gridView') || 'شبكة'">
          <i class="bi bi-grid-3x3-gap-fill"></i>
        </button>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="loading-container">
      <div v-for="i in 5" :key="i" class="skeleton-row">
        <div class="skeleton skeleton-avatar"></div>
        <div class="skeleton-content">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
        </div>
      </div>
    </div>

    <!-- ── Empty State ── -->
    <div v-else-if="comments.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="bi bi-chat-dots"></i>
      </div>
      <h3>{{ t('noCommentYet') || 'لا توجد تعليقات بعد' }}</h3>
      <p>{{ t('noCommentDesc') || 'عندما يترك الزوار تعليقات، ستظهر هنا.' }}</p>
    </div>

    <!-- ── Table View ── -->
    <div v-else-if="viewMode === 'table'" class="table-container">
      <table class="comments-table">
        <thead>
          <tr>
            <th>
              <div class="th-content">
                <i class="bi bi-file-text"></i>
                {{ t('post') || 'المقال' }}
              </div>
            </th>
            <th>
              <div class="th-content">
                <i class="bi bi-person"></i>
                {{ t('name') || 'الاسم' }}
              </div>
            </th>
            <th>
              <div class="th-content">
                <i class="bi bi-envelope"></i>
                {{ t('email') || 'البريد' }}
              </div>
            </th>
            <th>
              <div class="th-content">
                <i class="bi bi-chat"></i>
                {{ t('comment') || 'التعليق' }}
              </div>
            </th>
            <th>
              <div class="th-content">
                <i class="bi bi-calendar"></i>
                {{ t('created_at') || 'التاريخ' }}
              </div>
            </th>
            <th>
              <div class="th-content">
                <i class="bi bi-check-circle"></i>
                {{ t('status') || 'الحالة' }}
              </div>
            </th>
            <th>
              <div class="th-content">
                <i class="bi bi-gear"></i>
                {{ t('actions') || 'الإجراءات' }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in comments" :key="comment.id">
            <td class="post-cell">
              <div class="post-info">
                <div class="post-title">{{ comment.post_title }}</div>
              </div>
            </td>
            <td class="author-cell">
              <div class="author-info">
                <div class="author-avatar">
                  <span>{{ getInitials(comment.name) }}</span>
                </div>
                <div class="author-name">{{ comment.name }}</div>
              </div>
            </td>
            <td class="email-cell">
              <a :href="'mailto:' + comment.email" class="email-link">
                {{ comment.email }}
              </a>
            </td>
            <td class="comment-cell">
              <div class="comment-preview">
                {{ truncateText(comment.comment, 80) }}
              </div>
            </td>
            <td class="date-cell">
              <div class="date-info">
                <i class="bi bi-calendar3"></i>
                {{ formatDate(comment.created_at) }}
              </div>
            </td>
            <td class="status-cell">
              <span :class="['status-badge', comment.is_approved ? 'approved' : 'pending']">
                <i :class="comment.is_approved ? 'bi bi-check-circle-fill' : 'bi bi-clock-fill'"></i>
                {{ comment.is_approved ? (t('approved') || 'معتمد') : (t('pending') || 'قيد المراجعة') }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button
                  class="action-btn approve"
                  @click="toggleApproval(comment)"
                  :title="comment.is_approved ? (t('unapprove') || 'إلغاء الموافقة') : (t('approve') || 'موافقة')"
                >
                  <i :class="comment.is_approved ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
                </button>
                <button
                  class="action-btn delete"
                  @click="confirmDelete(comment)"
                  :title="t('delete') || 'حذف'"
                >
                  <i class="bi bi-trash"></i>
                </button>
                <button
                  class="action-btn reply"
                    @click="openReply(comment)"
                  :title="t('replyTocomment') || 'الرد على التعليق'"
                >
                  <i class="bi bi-reply-fill"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Grid View ── -->
    <div v-else class="grid-container">
      <div v-for="comment in comments" :key="comment.id" class="comment-card">
        <div class="card-header">
          <div class="author-avatar-large">
            <span>{{ getInitials(comment.name) }}</span>
          </div>
          <div class="author-details">
            <h4 class="author-name">{{ comment.name }}</h4>
            <a :href="'mailto:' + comment.email" class="author-email">{{ comment.email }}</a>
          </div>
          <span :class="['status-badge-sm', comment.is_approved ? 'approved' : 'pending']">
            {{ comment.is_approved ? (t('approved') || 'معتمد') : (t('pending') || 'قيد المراجعة') }}
          </span>
        </div>
        <div class="card-body">
          <div class="post-reference">
            <i class="bi bi-file-text"></i>
            <span>{{ t('post') }}: {{ comment.post_title }}</span>
          </div>
          <div class="comment-text">
            <i class="bi bi-chat-quote"></i>
            <p>{{ comment.comment }}</p>
          </div>
        </div>
        <div class="card-footer">
          <div class="comment-date">
            <i class="bi bi-calendar3"></i>
            {{ formatDate(comment.created_at) }}
          </div>
          <div class="card-actions">
            <button class="card-action-btn approve" @click="toggleApproval(comment)">
              <i :class="comment.is_approved ? 'bi bi-x-circle' : 'bi bi-check-circle'"></i>
              <span>{{ comment.is_approved ? (t('unapprove') || 'إلغاء') : (t('approve') || 'موافقة') }}</span>
            </button>
            <button class="card-action-btn delete" @click="confirmDelete(comment)">
              <i class="bi bi-trash"></i>
              <span>{{ t('delete') || 'حذف' }}</span>
            </button>
          </div>

          <Transition name="modal">
  <div
    v-if="replyModal.show"
    class="modal-overlay"
    @click.self="replyModal.show = false"
  >
    <div class="modal-container">
      <div class="modal-header">
        <i class="bi bi-reply-fill"></i>
        <h3>الرد على التعليق</h3>
      </div>

      <div class="modal-body">
        <div class="original-comment">
          {{ replyModal.comment?.comment }}

        </div>

        <textarea
          v-model="replyModal.text"
          class="reply-textarea"
          rows="5"
          placeholder="اكتب الرد هنا..."
        ></textarea>
      </div>

      <div class="modal-footer">
        <button
          class="btn-cancel"
          @click="replyModal.show = false"
        >
          إلغاء
        </button>

        <button
          class="btn-primary"
          @click="sendReply"
        >
          إرسال الرد
        </button>
      </div>
    </div>
  </div>
</Transition>
        </div>
      </div>
    </div>

    <!-- ── Pagination ── -->
    <div v-if="pagination.lastPage > 1" class="pagination">
      <button class="page-btn" :disabled="pagination.currentPage === 1" @click="goToPage(pagination.currentPage - 1)">
        <i class="bi bi-chevron-right"></i>
      </button>
      <button
        v-for="p in pageNumbers"
        :key="p"
        class="page-num"
        :class="{ active: p === pagination.currentPage, dots: p === '...' }"
        :disabled="p === '...'"
        @click="p !== '...' && goToPage(p)"
      >{{ p }}</button>
      <button class="page-btn" :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.currentPage + 1)">
        <i class="bi bi-chevron-left"></i>
      </button>
    </div>

    <!-- ── Delete Confirm Modal ── -->
    <Transition name="modal">
      <div v-if="deleteModal.show" class="modal-overlay" @click.self="deleteModal.show = false">
        <div class="modal-container">
          <div class="modal-header danger">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <h3>{{ t('confirmDelete') || 'تأكيد الحذف' }}</h3>
          </div>
          <div class="modal-body">
            <p>{{ t('deleteCommentConfirm') || 'هل أنت متأكد من حذف هذا التعليق؟' }}</p>
            <p class="delete-target">"{{ deleteModal.comment?.comment }}"</p>
            <p class="delete-warning">{{ t('cannotUndo') || 'لا يمكن التراجع عن هذا الإجراء.' }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="deleteModal.show = false">
              {{ t('cancel') || 'إلغاء' }}
            </button>
            <button class="btn-danger" :disabled="deleteModal.loading" @click="doDelete">
              <i v-if="deleteModal.loading" class="bi bi-hourglass-split spinning"></i>
              <i v-else class="bi bi-trash"></i>
              {{ t('delete') || 'حذف' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

     <!-- ── Bulk Actions Bar ── -->
    <Transition name="slide-up">
      <div v-if="selectedIds.length > 0" class="bulk-bar">
        <div class="bulk-info">
          <i class="bi bi-check2-circle"></i>
          <span>{{ t('selected') || 'محدد' }}: <strong>{{ selectedIds.length }}</strong></span>
        </div>
        <div class="bulk-actions">
          <button class="bulk-btn approve" @click="bulkApprove">
            <i class="bi bi-check-circle"></i>
            {{ t('approveSelected') || 'موافقة' }}
          </button>
          <button class="bulk-btn delete" @click="bulkDelete">
            <i class="bi bi-trash"></i>
            {{ t('deleteSelected') || 'حذف المحدد' }}
          </button>
          <button class="bulk-btn cancel" @click="selectedIds = []">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast-message" :class="toast.type">
        <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'
import axios from '@/api/axios'

const { t, isRtl } = useSettings()

// State
const comments = ref([])
const loading = ref(false)
const search = ref('')
const activeFilter = ref('all')
const viewMode = ref('table')
const selectedIds = ref([])
const deleteModal = ref({ show: false, comment: null, loading: false })
const toast = ref({ show: false, message: '', type: 'success' })

const stats = ref({ total: 0, approved: 0, pending: 0 })

const pagination = ref({
  currentPage: 1, lastPage: 1, total: 0, from: 0, to: 0, perPage: 10
})

// Filters
const filters = computed(() => [
  { value: 'all', label: t('all') || 'الكل', icon: 'bi bi-grid', count: stats.value.total },
  { value: 'approved', label: t('approved') || 'معتمد', icon: 'bi bi-check-circle', count: stats.value.approved },
  { value: 'pending', label: t('pending') || 'معلق', icon: 'bi bi-hourglass', count: stats.value.pending }
])

// Pagination
const pageNumbers = computed(() => {
  const { currentPage: c, lastPage: l } = pagination.value
  if (l <= 7) return Array.from({ length: l }, (_, i) => i + 1)
  const pages = [1]
  if (c > 3) pages.push('...')
  for (let i = Math.max(2, c - 1); i <= Math.min(l - 1, c + 1); i++) pages.push(i)
  if (c < l - 2) pages.push('...')
  pages.push(l)
  return pages
})

// Helpers
const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const replyModal = ref({
  show: false,
  comment: null,
  text: ''
})

const openReply = (comment) => {
  replyModal.value = {
    show: true,
    comment,
    text: ''
  }
}

const sendReply = async () => {
  try {
    await axios.post('/admin/comments/reply', {
      parent_id: replyModal.value.comment.id,
      comment: replyModal.value.text
    })

    showToast('تم إرسال الرد بنجاح')

    replyModal.value.show = false

    fetchComments()
  } catch (error) {
    showToast('فشل إرسال الرد', 'error')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleDateString(
    isRtl.value ? 'ar-EG' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  )
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const setFilter = (filter) => {
  activeFilter.value = filter
  fetchComments()
}

const onSearch = () => {
  fetchComments()
}

const goToPage = (page) => {
  pagination.value.currentPage = page
  fetchComments()
}

// Fetch comments
const fetchComments = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.currentPage,
      per_page: pagination.value.perPage,
      search: search.value,
      status: activeFilter.value !== 'all' ? activeFilter.value : undefined
    }
    const { data } = await axios.get('/admin/comments', { params })

    comments.value = data.data || []
    pagination.value = {
      currentPage: data.current_page,
      lastPage: data.last_page,
      total: data.total,
      from: data.from,
      to: data.to,
      perPage: data.per_page
    }

    stats.value.total = data.total
    stats.value.approved = comments.value.filter(c => c.is_approved).length
    stats.value.pending = comments.value.filter(c => !c.is_approved).length
  } catch (error) {
    console.error(error)
    showToast(t('failedToLoad') || 'فشل تحميل التعليقات', 'error')
  } finally {
    loading.value = false
  }
}

// Toggle approval
const toggleApproval = async (comment) => {
  try {
    await axios.patch(`/admin/comments/${comment.id}/approve`)
    comment.is_approved = !comment.is_approved
    showToast(comment.is_approved ? (t('approvedSuccess') || 'تم اعتماد التعليق') : (t('unapprovedSuccess') || 'تم إلغاء الاعتماد'))
    fetchComments()
  } catch {
    showToast(t('failedToUpdate') || 'فشل العملية', 'error')
  }
}

// Delete
const confirmDelete = (comment) => {
  deleteModal.value = { show: true, comment, loading: false }
}

const doDelete = async () => {
  deleteModal.value.loading = true
  try {
    await axios.delete(`/admin/comments/${deleteModal.value.comment.id}`)
    showToast(t('deletedSuccess') || 'تم حذف التعليق')
    deleteModal.value.show = false
    fetchComments()
  } catch {
    showToast(t('failedToDelete') || 'فشل الحذف', 'error')
  } finally {
    deleteModal.value.loading = false
  }
}

// Bulk actions
const bulkApprove = async () => {
  try {
    await axios.post('/admin/comments/bulk-approve', { ids: selectedIds.value })
    showToast(t('bulkApproved') || 'تم اعتماد التعليقات المحددة')
    selectedIds.value = []
    fetchComments()
  } catch {
    showToast(t('failedToUpdate') || 'فشل العملية', 'error')
  }
}

const bulkDelete = async () => {
  if (!confirm(t('confirmBulkDelete') || 'هل أنت متأكد من حذف التعليقات المحددة؟')) return
  try {
    await axios.post('/admin/comments/bulk-delete', { ids: selectedIds.value })
    showToast(t('bulkDeleted') || 'تم حذف التعليقات المحددة')
    selectedIds.value = []
    fetchComments()
  } catch {
    showToast(t('failedToDelete') || 'فشل الحذف', 'error')
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comments-page {
  padding: 1.5rem;
  background: #F0F0F0;
  min-height: 100vh;
}

/* RTL Support */
.comments-page.rtl-comments {
  direction: rtl;
}

.comments-page.rtl-comments .th-content i {
  margin-left: 0.5rem;
  margin-right: 0;
}

.comments-page.rtl-comments .author-info {
  flex-direction: row-reverse;
}

.comments-page.rtl-comments .action-buttons {
  flex-direction: row-reverse;
}

/* Page Header */
.page-header {
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

/* Stats Grid */
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
.stat-icon.approved { background: #ecfdf5; color: #10b981; }
.stat-icon.pending { background: #fffbeb; color: #f59e0b; }

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

/* Toolbar */
.toolbar {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.search-wrapper {
  flex: 1;
  position: relative;
  min-width: 250px;
}

.search-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1rem;
}

.rtl-comments .search-wrapper i {
  left: auto;
  right: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.7rem 2rem 0.7rem 2.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.85rem;
  background: #f8fafc;
}

.rtl-comments .search-input {
  padding: 0.7rem 2.2rem 0.7rem 1rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-teal, #18B2BC);
  box-shadow: 0 0 0 3px rgba(24, 178, 188, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
}

.rtl-comments .clear-search {
  right: auto;
  left: 0.8rem;
}

/* Filter Buttons */
.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  transition: all 0.3s;
}

.filter-btn i {
  font-size: 0.8rem;
}

.filter-btn:hover {
  background: #f1f5f9;
}

.filter-btn.active {
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  color: white;
  border-color: transparent;
}

.filter-badge {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.filter-btn.active .filter-badge {
  background: rgba(255, 255, 255, 0.2);
}

/* View Toggle */
.view-toggle {
  display: flex;
  gap: 0.3rem;
}

.view-toggle button {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  color: #94a3b8;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-toggle button.active {
  background: var(--color-teal, #18B2BC);
  color: white;
  border-color: transparent;
}

/* Table Container */
.table-container {
  background: white;
  border-radius: 16px;
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

.comments-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}

.comments-table th {
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
  font-size: 0.8rem;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comments-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.comments-table tr:hover {
  background: #f8fafc;
}

/* Author Cell */
.author-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.author-avatar {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
}

.author-name {
  font-weight: 600;
  color: #1e293b;
}

/* Email Cell */
.email-link {
  color: var(--color-teal, #18B2BC);
  text-decoration: none;
  font-size: 0.85rem;
}

.email-link:hover {
  text-decoration: underline;
}

/* Comment Cell */
.comment-preview {
  max-width: 300px;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
}

/* Date Cell */
.date-info {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.approved {
  background: #ecfdf5;
  color: #10b981;
}

.status-badge.pending {
  background: #fffbeb;
  color: #f59e0b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn.approve {
  background: #eef2ff;
  color: var(--color-teal, #18B2BC);
}

.action-btn.approve:hover {
  background: var(--color-teal, #18B2BC);
  color: white;
}

.action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #ef4444;
  color: white;
}

/* Grid View */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.comment-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s;
}

.comment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.author-avatar-large {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, var(--color-teal, #18B2BC), var(--color-teal-dark, #13888D));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
}

.author-details {
  flex: 1;
}

.author-details h4 {
  margin: 0;
  font-size: 0.9rem;
  color: #1e293b;
}

.author-email {
  font-size: 0.7rem;
  color: #94a3b8;
  text-decoration: none;
}

.status-badge-sm {
  padding: 0.2rem 0.6rem;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-badge-sm.approved {
  background: #ecfdf5;
  color: #10b981;
}

.status-badge-sm.pending {
  background: #fffbeb;
  color: #f59e0b;
}

.card-body {
  padding: 1rem;
}

.post-reference {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.8rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.comment-text {
  display: flex;
  gap: 0.5rem;
}

.comment-text i {
  color: var(--color-teal, #18B2BC);
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.comment-text p {
  margin: 0;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.comment-date {
  font-size: 0.7rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-action-btn {
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s;
}

.card-action-btn.approve {
  background: #eef2ff;
  color: var(--color-teal, #18B2BC);
}

.card-action-btn.approve:hover {
  background: var(--color-teal, #18B2BC);
  color: white;
}

.card-action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
}

.card-action-btn.delete:hover {
  background: #ef4444;
  color: white;
}

/* Loading */
.loading-container {
  background: white;
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.skeleton {
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  animation: shimmer 1.4s infinite;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-content {
  flex: 1;
}

.skeleton-title {
  width: 60%;
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-text {
  width: 80%;
  height: 12px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.empty-icon {
  font-size: 3rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.1rem;
  color: #1e293b;
  margin-bottom: 0.3rem;
}

.empty-state p {
  color: #94a3b8;
  font-size: 0.85rem;
}

/* Bulk Bar */
.bulk-bar {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  border-radius: 50px;
  padding: 0.6rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.85rem;
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;
}

.bulk-btn {
  padding: 0.4rem 1rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s;
}

.bulk-btn.approve {
  background: #10b981;
  color: white;
}

.bulk-btn.delete {
  background: #ef4444;
  color: white;
}

.bulk-btn.cancel {
  background: #475569;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
  margin-top: 1.5rem;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: var(--color-teal, #18B2BC);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-num {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.page-num.active {
  background: var(--color-teal, #18B2BC);
  color: white;
  border-color: transparent;
}

.page-num.dots {
  border: none;
  background: none;
  cursor: default;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  overflow: hidden;
  animation: modalIn 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.2rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header.danger i {
  color: #ef4444;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.modal-body {
  padding: 1.2rem;
}

.delete-target {
  font-weight: 600;
  color: #1e293b;
  margin: 0.5rem 0;
}

.delete-warning {
  color: #ef4444;
  font-size: 0.75rem;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
}

.btn-danger {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #ef4444;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.action-btn.reply {
  background: #eff6ff;
  color: #2563eb;
}

.action-btn.reply:hover {
  background: #2563eb;
  color: white;
}

/* Toast */
.toast-message {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 1100;
  animation: slideIn 0.3s ease;
}

.toast-message.success { background: #10b981; }
.toast-message.error { background: #ef4444; }

.rtl-comments .toast-message {
  right: auto;
  left: 2rem;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

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

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .comments-page {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
  }

  .filter-buttons {
    justify-content: center;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .bulk-bar {
    width: 90%;
    border-radius: 40px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .toast-message {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}
</style>
