<template>
  <div class="blog-page" :class="{ rtl: isRtl }">

    <!-- ── Page Header ── -->
    <div class="page-header">
      <div class="ph-left">
        <h1 class="ph-title">
          <i class="ti ti-article" aria-hidden="true"></i>
          {{ t('Blog') || 'المدونة' }}
        </h1>
        <p class="ph-sub">{{ t('manageBlog') || 'إدارة وتنظيم منشورات موقعك' }}</p>
      </div>
 <div class="btn-links">
      <router-link to="/admin/blog/create" class="btn-primary">
          <i class="bi bi-plus" aria-hidden="true"></i>
        {{ t('newPost') || 'مقال جديد' }}
      </router-link>

      <router-link :to="{ name: 'admin.blog.categories' }" class="btn-primary-2">
      <i class="bi bi-folder"></i>
      {{ t('categories') || 'التصنيفات' }}
    </router-link>

     <router-link :to="{ name: 'admin.blog.tags' }" class="btn-primary-3">
        <i class="bi bi-tags"></i>
        {{ t('tags') || 'الوسوم' }}
      </router-link>
</div>
    </div>

    <!-- ── Stats Bar ── -->
    <div class="stats-bar">
      <div class="stat-chip">
        <i class="bi bi-files" aria-hidden="true"></i>
        <span class="sc-val">{{ stats.total }}</span>
        <span class="sc-lbl">{{ t('totalPosts') || 'إجمالي المقالات' }}</span>
      </div>
      <div class="stat-chip">
        <i class="bi bi-circle-check" style="color:#059669" aria-hidden="true"></i>
        <span class="sc-val" style="color:#059669">{{ stats.published }}</span>
        <span class="sc-lbl">{{ t('published') || 'منشور' }}</span>
      </div>
      <div class="stat-chip">
        <i class="bi bi-pencil" style="color:#d97706" aria-hidden="true"></i>
        <span class="sc-val" style="color:#d97706">{{ stats.draft }}</span>
        <span class="sc-lbl">{{ t('drafts') || 'مسودة' }}</span>
      </div>
      <div class="stat-chip">
        <i class="bi bi-eye" style="color:#162FBB" aria-hidden="true"></i>
        <span class="sc-val" style="color:#162FBB">{{ formatNumber(stats.totalViews) }}</span>
        <span class="sc-lbl">{{ t('totalViews') || 'إجمالي المشاهدات' }}</span>
      </div>
    </div>

    <!-- ── Filters & Search ── -->
    <div class="toolbar">
      <div class="search-wrap">
        <i class="ti ti-search" aria-hidden="true"></i>
        <input
          v-model="search"
          type="search"
          :placeholder="t('searchPosts') || 'ابحث عن مقال...'"
          class="search-input"
          @input="onSearch"
        />
        <button v-if="search" class="clear-search" @click="search = ''; onSearch()">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>

      <div class="filter-group">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: activeFilter === f.value }"
          @click="setFilter(f.value)"
        >
          {{ f.label }}
          <span class="filter-count">{{ f.count }}</span>
        </button>
      </div>

      <div class="view-toggle">
        <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'" :title="t('tableView') || 'جدول'">
          <i class="bi bi-list-ul" aria-hidden="true"></i>
        </button>
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'" :title="t('gridView') || 'شبكة'">
          <i class="bi bi-grid" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="loading-rows">
      <div class="skeleton-row" v-for="i in 5" :key="i"></div>
    </div>

    <!-- ── Empty ── -->
    <div v-else-if="posts.length === 0" class="empty-state">
      <div class="empty-icon"><i class="bi bi-file-off" aria-hidden="true"></i></div>
      <h3>{{ t('noPostsYet') || 'لا توجد مقالات بعد' }}</h3>
      <p>{{ t('createFirstPost') || 'ابدأ بكتابة أول مقال لك' }}</p>
      <router-link to="/admin/blog/create" class="btn-primary">
        <i class="bi bi-plus" aria-hidden="true"></i>
        {{ t('writeNow') || 'اكتب الآن' }}
      </router-link>
    </div>

    <!-- ── Table View ── -->
    <div v-else-if="viewMode === 'table'" class="table-wrap">
      <table class="blog-table">
        <thead>
          <tr>
            <th style="width:44px">
              <input type="checkbox" v-model="selectAll" @change="toggleAll" />
            </th>
            <th>{{ t('title') || 'العنوان' }}</th>
            <th>{{ t('category') || 'التصنيف' }}</th>
            <th>{{ t('status') || 'الحالة' }}</th>
            <th>{{ t('views') || 'المشاهدات' }}</th>
            <th>{{ t('publishedAt') || 'تاريخ النشر' }}</th>
            <th style="width:110px">{{ t('actions') || 'الإجراءات' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id" :class="{ selected: selectedIds.includes(post.id) }">
            <td>
              <input type="checkbox" :value="post.id" v-model="selectedIds" />
            </td>
            <td>
              <div class="post-cell">
                <div class="post-thumb-sm">
                  <img v-if="post.featured_image || post.thumbnail"
                       :src="post.featured_image || post.thumbnail"
                       :alt="postTitle(post)" />
                  <i v-else class="bi bi-article" aria-hidden="true"></i>
                </div>
                <div>
                  <div class="post-title-cell">{{ postTitle(post) }}</div>
                  <div class="post-slug-cell">{{ post.slug }}</div>
                </div>
              </div>
            </td>
            <td>
              <span v-if="postCategory(post)" class="cat-pill">{{ postCategory(post) }}</span>
              <span v-else class="no-val">—</span>
            </td>
            <td>
              <span :class="['status-pill', 'sp-' + post.status]">
                {{ t(post.status) || post.status }}
              </span>
            </td>
            <td>
              <span class="views-cell">
                <i class="bi bi-eye" aria-hidden="true"></i>
                {{ formatNumber(post.views_count || 0) }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(post.published_at) }}</td>
            <td>

              <div class="action-btns">

                      <router-link :to="{ name: 'admin.blog.edit', params: { id: post.id } }"
                        class="act-btn edit">
                        <i class="bi bi-pencil"></i>
                      </router-link>

                <button class="act-btn view" @click="preview(post)">
                  <i class="bi bi-eye"></i>
                </button>

                <button class="act-btn del" :title="t('delete') || 'حذف'" @click="deletePost(post)">
                  <i class="bi bi-trash" aria-hidden="true"></i>
                </button>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── Grid View ── -->
    <div v-else class="grid-wrap">
      <div v-for="post in posts" :key="post.id" class="grid-card">
        <div class="gc-thumb">

          <img v-if="post.featured_image || post.thumbnail"
               :src="post.featured_image || post.thumbnail"
               :alt="postTitle(post)" />
          <div v-else class="gc-thumb-placeholder">
            <i class="bi bi-article" aria-hidden="true"></i>
          </div>
          <span :class="['gc-status', 'sp-' + post.status]">{{ t(post.status) || post.status }}</span>
        </div>
        <div class="gc-body">
          <span v-if="postCategory(post)" class="cat-pill small">{{ postCategory(post) }}</span>

          <h3 class="gc-title">{{ postTitle(post) }}</h3>
          <p class="gc-excerpt">{{ postExcerpt(post) }}</p>
          <div class="gc-meta">
            <span><i class="bi bi-eye" aria-hidden="true"></i> {{ formatNumber(post.views_count || 0) }}</span>
            <span><i class="bi bi-calendar" aria-hidden="true"></i> {{ formatDate(post.published_at) }}</span>
          </div>
        </div>
        <div class="gc-footer">

            <router-link :to="{ name: 'admin.blog.edit', params: { id: post.id } }"
              class="act-btn edit">
              <i class="bi bi-pencil"></i> {{ t('edit') || 'تعديل' }}
            </router-link>

          <button class="action-btn btn-delete" @click="deletePost(post)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ── Bulk Actions ── -->
    <Transition name="slide-up">
      <div v-if="selectedIds.length > 0" class="bulk-bar">
        <span class="bulk-count">
          {{ t('selected') || 'محدد' }}: <b>{{ selectedIds.length }}</b>
        </span>
        <div class="bulk-actions">
          <button class="bulk-btn" @click="bulkPublish">
            <i class="bi bi-check-circle" aria-hidden="true"></i>
            {{ t('publish') || 'نشر' }}
          </button>
          <button class="bulk-btn" @click="bulkDraft">
            <i class="bi bi-pencil" aria-hidden="true"></i>
            {{ t('moveToDraft') || 'تحويل لمسودة' }}
          </button>

          <button class="bulk-btn danger" @click="deletePost(post)">
            <i class="bi bi-trash" aria-hidden="true"></i>
            {{ t('deleteSelected') || 'حذف المحدد' }}
          </button>

          <button class="bulk-btn ghost" @click="selectedIds = []">
            <i class="bi bi-x" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </Transition>

    <!-- ── Pagination ── -->
    <div v-if="pagination.lastPage > 1" class="pagination">
      <button class="pag-btn" :disabled="pagination.currentPage === 1" @click="goToPage(pagination.currentPage - 1)">
        <i class="bi bi-chevron-right" aria-hidden="true"></i>
      </button>
      <button
        v-for="p in pageNumbers"
        :key="p"
        class="pag-btn"
        :class="{ active: p === pagination.currentPage, ellipsis: p === '...' }"
        :disabled="p === '...'"
        @click="p !== '...' && goToPage(p)"
      >{{ p }}</button>
      <button class="pag-btn" :disabled="pagination.currentPage === pagination.lastPage" @click="goToPage(pagination.currentPage + 1)">
        <i class="bi bi-chevron-left" aria-hidden="true"></i>
      </button>
      <span class="pag-info">
        {{ pagination.from }}–{{ pagination.to }} {{ t('of') || 'من' }} {{ pagination.total }}
      </span>
    </div>

    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="'toast-' + toast.type" role="alert">
        <i :class="toast.type === 'success' ? 'bi bi-check-circle' : 'bi bi-x-circle'" aria-hidden="true"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '@/composables/useSettings'
import axios from '@/api/axios'
import { useConfirm } from '@/composables/useConfirm'
const { confirm } = useConfirm()

const router = useRouter()
const { t, isRtl, currentLang } = useSettings()

// ── State ──────────────────────────────────────
const loading      = ref(false)
const posts        = ref([])
const search       = ref('')
const activeFilter = ref('all')
const viewMode     = ref('table')
const selectedIds  = ref([])
const selectAll    = ref(false)
const searchTimer  = ref(null)

const stats = ref({ total: 0, published: 0, draft: 0, totalViews: 0 })

const pagination = ref({
  currentPage: 1, lastPage: 1, total: 0,
  from: 0, to: 0, perPage: 15,
})

const deleteModal = ref({ show: false, post: null, loading: false })
const toast       = ref({ show: false, message: '', type: 'success' })

const postTitle = (post) => {
  if (!post) return ''
  const lang = isRtl.value ? 'ar' : 'en'
  if (lang === 'ar') return post.title_ar || post.title_en || post.title || ''
  return post.title_en || post.title_ar || post.title || ''
}

const postExcerpt = (post) => {
  if (!post) return ''
  const lang = isRtl.value ? 'ar' : 'en'
  if (lang === 'ar') return post.excerpt_ar || post.excerpt_en || post.excerpt || ''
  return post.excerpt_en || post.excerpt_ar || post.excerpt || ''
}

// Category: backend may return an object, array of objects, or plain string
const postCategory = (post) => {
  if (!post) return ''
  const lang = isRtl.value ? 'ar' : 'en'

  // Array of category objects (from with())
  if (Array.isArray(post.categories) && post.categories.length > 0) {
    const cat = post.categories[0]
    return lang === 'ar' ? (cat.name_ar || cat.name_en || cat.name || '') : (cat.name_en || cat.name_ar || cat.name || '')
  }

  // Single category object
  if (post.category && typeof post.category === 'object') {
    const cat = post.category
    return lang === 'ar' ? (cat.name_ar || cat.name_en || cat.name || '') : (cat.name_en || cat.name_ar || cat.name || '')
  }

  // Legacy plain string field
  if (typeof post.category === 'string') return post.category

  return ''
}

// ── Filters ────────────────────────────────────
const filters = computed(() => [
  { value: 'all',       label: t('all')       || 'الكل',     count: stats.value.total     },
  { value: 'published', label: t('published') || 'منشور',    count: stats.value.published },
  { value: 'draft',     label: t('draft')     || 'مسودة',    count: stats.value.draft     },
])

// ── Pagination numbers ─────────────────────────
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

// ── Helpers ─────────────────────────────────────
const formatNumber = (v) =>
  new Intl.NumberFormat(isRtl.value ? 'ar-SA' : 'en-US').format(Number(v) || 0)

const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString(isRtl.value ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

// ── API ─────────────────────────────────────────
const fetchPosts = async (page = 1) => {
  loading.value = true
  try {
    const params = {
      page,
      per_page: pagination.value.perPage,
      search: search.value || undefined,
      status: activeFilter.value !== 'all' ? activeFilter.value : undefined,
    }
    const { data } = await axios.get('/admin/blog', { params })
    posts.value      = data.data        || []
    stats.value      = data.stats       || stats.value
    pagination.value = {
      currentPage: data.current_page,
      lastPage:    data.last_page,
      total:       data.total,
      from:        data.from || 0,
      to:          data.to   || 0,
      perPage:     data.per_page || 15,
    }
  } catch {
    showToast(t('fetchError') || 'فشل تحميل المقالات', 'error')
  } finally {
    loading.value = false
  }
}

const setFilter = (v) => { activeFilter.value = v; fetchPosts(1) }
const goToPage  = (p)  => fetchPosts(p)
const onSearch  = ()   => {
  clearTimeout(searchTimer.value)
  searchTimer.value = setTimeout(() => fetchPosts(1), 400)
}

// const preview = (post) => window.open(`/blog/${post.slug}`, '_blank')

const preview = (post) => {
  router.push({ name: 'admin.blog.show', params: { id: post.id } })
}

// ── Selection ──────────────────────────────────
const toggleAll = () => {
  selectedIds.value = selectAll.value ? posts.value.map(p => p.id) : []
}

// ── Delete ─────────────────────────────────────
const deletePost = async (post) => {

  const ok = await confirm({
    title: t('ConfirmDelete'),
    message: t('DeleteConfirmMessage'),
    confirmText: t('Delete'),
    cancelText: t('Cancel')
  })

  if (!ok) return

  await axios.delete(`/admin/blog/${post.id}`)

  fetchPosts()
}

// ── Bulk ───────────────────────────────────────
const bulkAction = async (action) => {
  if (!selectedIds.value.length) return
  try {
    await axios.post('/admin/blog/bulk', { ids: selectedIds.value, action })
    showToast(t('bulkSuccess') || 'تم تنفيذ الإجراء', 'success')
    selectedIds.value = []
    fetchPosts(pagination.value.currentPage)
  } catch {
    showToast(t('bulkFailed') || 'فشل الإجراء', 'error')
  }
}
const bulkPublish = () => bulkAction('publish')
const bulkDraft   = () => bulkAction('draft')

onMounted(() => fetchPosts())
</script>

<style scoped>
.blog-page { padding: 1.3rem; background: #F0F0F0; min-height: 100vh; }
.blog-page.rtl { direction: rtl; }

/* Header */
.page-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 1.1rem; flex-wrap: wrap; gap: 10px;
}
.ph-title { font-size: 19px; font-weight: 700; color: #0D1830; display: flex; align-items: center; gap: 8px; margin: 0; }
.ph-title i { color: #162FBB; }
.ph-sub { font-size: 12.5px; color: #7A8CAB; margin: 3px 0 0; }

/* Buttons */
.btn-primary,
.btn-primary-2,
.btn-primary-3 {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 18px; border-radius: 9px;
  background: #162FBB; color: #fff; border: none; cursor: pointer;
  font-size: 13px; font-weight: 600; text-decoration: none;
  transition: background .2s;
}
.btn-primary:hover { background: #0F2196; }
.btn-primary-2 { background-color: palevioletred}
.btn-primary-3 { background-color: green}
.btn-links {
  display: flex;
  gap: 3px;
  justify-content: center;
}

.btn-ghost {
  padding: 8px 16px; border-radius: 8px; border: 1px solid #D0D6E5;
  background: #fff; color: #5A6B8A; cursor: pointer; font-size: 13px; transition: all .15s;
}
.btn-ghost:hover { background: #F0F0F0; }

.btn-danger {
  padding: 8px 16px; border-radius: 8px; border: none;
  background: #dc2626; color: #fff; cursor: pointer; font-size: 13px;
  font-weight: 600; display: flex; align-items: center; gap: 5px; transition: background .15s;
}
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: .6; cursor: not-allowed; }

/* Stats bar */
.stats-bar {
  display: flex; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;
}
.stat-chip {
  background: #fff; border: 1px solid #D0D6E5; border-radius: 10px;
  padding: 10px 16px; display: flex; align-items: center; gap: 8px;
}
.stat-chip i { font-size: 16px; color: #7A8CAB; }
.sc-val { font-size: 16px; font-weight: 700; color: #0D1830; }
.sc-lbl { font-size: 11.5px; color: #7A8CAB; }

/* Toolbar */
.toolbar {
  background: #fff; border: 1px solid #D0D6E5; border-radius: 11px;
  padding: 10px 14px; display: flex; align-items: center; gap: 10px;
  flex-wrap: wrap; margin-bottom: 10px;
}
.search-wrap {
  display: flex; align-items: center; gap: 7px; flex: 1; min-width: 200px;
  background: #F8FAFC; border: 1px solid #D0D6E5; border-radius: 8px; padding: 0 10px;
}
.search-wrap i { color: #7A8CAB; font-size: 15px; flex-shrink: 0; }
.search-input { flex: 1; border: none; background: none; font-size: 13px; color: #0D1830; padding: 8px 0; outline: none; }
.clear-search { background: none; border: none; cursor: pointer; color: #7A8CAB; font-size: 13px; padding: 0; }

.filter-group { display: flex; gap: 5px; }
.filter-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 8px; border: 1px solid #D0D6E5;
  background: none; cursor: pointer; font-size: 12.5px; color: #5A6B8A; transition: all .15s;
}
.filter-btn:hover { background: #F0F0F0; }
.filter-btn.active { background: rgba(22,47,187,.08); border-color: rgba(22,47,187,.25); color: #162FBB; font-weight: 600; }
.filter-count { background: #E8EDF5; color: #5A6B8A; font-size: 10px; padding: 1px 6px; border-radius: 20px; }
.filter-btn.active .filter-count { background: rgba(22,47,187,.15); color: #162FBB; }

.view-toggle { display: flex; gap: 4px; }
.view-toggle button {
  width: 34px; height: 34px; border-radius: 7px; border: 1px solid #D0D6E5;
  background: none; cursor: pointer; font-size: 15px; color: #7A8CAB; transition: all .15s;
  display: flex; align-items: center; justify-content: center;
}
.view-toggle button.active { background: rgba(22,47,187,.08); border-color: rgba(22,47,187,.25); color: #162FBB; }

/* Skeleton */
.loading-rows { display: flex; flex-direction: column; gap: 8px; }
.skeleton-row {
  height: 52px; border-radius: 10px;
  background: linear-gradient(90deg, #e8edf5 25%, #f0f4fa 50%, #e8edf5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

/* Empty */
.empty-state {
  text-align: center; padding: 4rem 2rem;
  background: #fff; border-radius: 14px; border: 1px solid #D0D6E5;
}
.empty-icon { font-size: 48px; color: #D0D6E5; margin-bottom: 12px; }
.empty-state h3 { font-size: 16px; font-weight: 600; color: #0D1830; margin: 0 0 6px; }
.empty-state p  { font-size: 13px; color: #7A8CAB; margin: 0 0 20px; }

/* Table */
.table-wrap { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; overflow: hidden; }
.blog-table { width: 100%; border-collapse: collapse; }
.blog-table thead tr { background: #FAFBFE; }
.blog-table th {
  padding: 11px 14px; font-size: 11px; font-weight: 700; letter-spacing: .5px;
  text-transform: uppercase; color: #7A8CAB; text-align: start;
  border-bottom: 1px solid #D0D6E5;
}
.blog-table td { padding: 12px 14px; border-bottom: 1px solid #F0F4FA; font-size: 13px; color: #0D1830; }
.blog-table tbody tr { transition: background .15s; }
.blog-table tbody tr:hover { background: #FAFBFE; }
.blog-table tbody tr.selected { background: rgba(22,47,187,.04); }
.blog-table tbody tr:last-child td { border: none; }

.post-cell { display: flex; align-items: center; gap: 10px; }
.post-thumb-sm {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  background: #E8EDF5; overflow: hidden;
  display: flex; align-items: center; justify-content: center; font-size: 16px; color: #7A8CAB;
}
.post-thumb-sm img { width: 100%; height: 100%; object-fit: cover; }
.post-title-cell { font-size: 13px; font-weight: 600; color: #0D1830; max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.post-slug-cell  { font-size: 11px; color: #7A8CAB; margin-top: 1px; }
.date-cell       { font-size: 12px; color: #7A8CAB; white-space: nowrap; }
.views-cell      { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: #5A6B8A; }
.views-cell i    { font-size: 13px; }
.no-val          { color: #D0D6E5; }

/* Pills & Status */
.cat-pill {
  background: rgba(22,47,187,.08); color: #162FBB;
  padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 500;
}
.cat-pill.small { font-size: 10px; }

.status-pill { padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.sp-published { background: #dcfce7; color: #15803d; }
.sp-draft     { background: #f1f5f9; color: #64748b; }
.sp-scheduled { background: rgba(231,174,24,.12); color: #C49310; }

/* Action buttons */
.action-btns { display: flex; gap: 5px; }
.act-btn {
  width: 30px; height: 30px; border-radius: 7px; border: 1px solid #D0D6E5;
  background: none; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
  text-decoration: none; color: #7A8CAB;
}
.act-btn.edit:hover  { background: rgba(22,47,187,.08); border-color: rgba(22,47,187,.25); color: #162FBB; }
.act-btn.view:hover  { background: rgba(16,185,129,.08); border-color: rgba(16,185,129,.25); color: #059669; }
.act-btn.del:hover   { background: rgba(220,38,38,.08); border-color: rgba(220,38,38,.2);  color: #dc2626; }

/* Grid View */
.grid-wrap { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.grid-card { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; overflow: hidden; transition: transform .2s, box-shadow .2s; }
.grid-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(22,47,187,.1); }
.gc-thumb { position: relative; height: 160px; background: #E8EDF5; overflow: hidden; }
.gc-thumb img { width: 100%; height: 100%; object-fit: cover; }
.gc-thumb-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #C5CCDB; }
.gc-status { position: absolute; top: 10px; inset-inline-end: 10px; }
.gc-body { padding: 12px 14px; }
.gc-title { font-size: 14px; font-weight: 600; color: #0D1830; margin: 6px 0 4px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.gc-excerpt { font-size: 12px; color: #7A8CAB; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.gc-meta { display: flex; gap: 12px; margin-top: 8px; font-size: 11.5px; color: #7A8CAB; }
.gc-meta i { font-size: 13px; }
.gc-footer { display: flex; gap: 6px; padding: 10px 12px; border-top: 1px solid #F0F4FA; }
.gc-footer .act-btn.edit { flex: 1; width: auto; padding: 0 12px; font-size: 12.5px; gap: 5px; color: #162FBB; border-color: rgba(22,47,187,.2); background: rgba(22,47,187,.05); }

/* Bulk bar */
.bulk-bar {
  position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%);
  background: #0D1830; color: #fff; border-radius: 12px;
  padding: 10px 16px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 8px 32px rgba(13,24,48,.35); z-index: 100; white-space: nowrap;
}
.bulk-count { font-size: 13px; color: rgba(255,255,255,.7); }
.bulk-count b { color: #F5C842; }
.bulk-actions { display: flex; gap: 6px; }
.bulk-btn {
  padding: 6px 12px; border-radius: 7px; border: 1px solid rgba(255,255,255,.15);
  background: rgba(255,255,255,.1); color: #fff; cursor: pointer;
  font-size: 12px; display: flex; align-items: center; gap: 5px; transition: background .15s;
}
.bulk-btn:hover  { background: rgba(255,255,255,.2); }
.bulk-btn.danger { background: rgba(220,38,38,.3); border-color: rgba(220,38,38,.5); }
.bulk-btn.danger:hover { background: rgba(220,38,38,.5); }
.bulk-btn.ghost  { background: none; border-color: rgba(255,255,255,.1); }

/* Pagination */
.pagination { display: flex; align-items: center; gap: 5px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
.pag-btn {
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid #D0D6E5;
  background: #fff; cursor: pointer; font-size: 13px; color: #0D1830;
  display: flex; align-items: center; justify-content: center; transition: all .15s;
}
.pag-btn:hover:not(:disabled) { background: #F0F0F0; }
.pag-btn.active { background: #162FBB; border-color: #162FBB; color: #fff; font-weight: 600; }
.pag-btn:disabled { opacity: .4; cursor: not-allowed; }
.pag-btn.ellipsis { cursor: default; border: none; background: none; }
.pag-info { font-size: 12px; color: #7A8CAB; margin-inline-start: 8px; }

/* Modal */
.modal-wrap {
  position: fixed; inset: 0; background: rgba(10,24,112,.45);
  display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(4px);
}
.modal-box { background: #fff; border-radius: 14px; width: 90%; max-width: 420px; overflow: hidden; box-shadow: 0 20px 60px rgba(10,24,112,.22); border-top: 3px solid #E7AE18; }
.modal-head { display: flex; align-items: center; gap: 8px; padding: 14px 16px; background: #FAFBFE; border-bottom: 1px solid #D0D6E5; font-size: 14px; font-weight: 600; color: #0D1830; }
.modal-head i { font-size: 18px; }
.danger-head i { color: #dc2626; }
.modal-body { padding: 16px; font-size: 13.5px; color: #5A6B8A; }
.modal-body p { margin: 0 0 6px; }
.delete-target { font-weight: 600; color: #0D1830; font-size: 14px; }
.delete-warning { font-size: 12px; color: #dc2626; }
.modal-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #D0D6E5; background: #FAFBFE; }

/* Spinners */
.spin-xs { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.toast { position: fixed; bottom: 1.3rem; inset-inline-end: 1.3rem; padding: 9px 15px; border-radius: 10px; color: #fff; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; z-index: 3000; box-shadow: 0 8px 28px rgba(0,0,0,.18); }
.toast-success { background: #10b981; }
.toast-error   { background: #ef4444; }

/* Transitions */
.slide-up-enter-active, .slide-up-leave-active { transition: all .25s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateX(-50%) translateY(20px); opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.96); }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { transform: translateY(12px); opacity: 0; }

@media (max-width: 768px) {
  .blog-page { padding: .9rem; }
  .stats-bar { display: grid; grid-template-columns: 1fr 1fr; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .filter-group { flex-wrap: wrap; }
  .table-wrap { overflow-x: auto; }
}
</style>
