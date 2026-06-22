<template>
  <div class="portfolio-list mt-5" :class="{ rtl: isRtl }">

    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title"><i class="bi bi-briefcase"></i>
                    {{ t('Portfolio') || 'معرض الأعمال' }}
       </h1>
       <span class="total-badge">{{ pagination.total ?? items.length }} {{ t('project') || 'مشروع' }}</span>
      </div>

      <div class="header-actions">
        <button class="btn btn-outline" @click="showTrashed = !showTrashed">
          <i class="bi bi-trash3"></i> {{ t('Trashed') || 'المحذوفات' }}
        </button>
        <router-link to="/admin/portfolio/create" class="btn btn-primary">
          <i class="bi bi-plus-lg"></i> {{ t('newItem') || 'عمل جديد' }}
        </router-link>

        <router-link to="/admin/portfolio/categories" class="btn btn-primary">
          <i class="bi bi-plus-lg"></i> {{ t('newCategory') || 'إضافة فئة' }}
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="search-wrap">
        <i class="bi bi-search"></i>
        <input v-model="filters.search" type="text" :placeholder="t('search') || 'ابحث...'" @input="debouncedFetch"/>
      </div>
      <select v-model="filters.status" @change="fetchItems">
        <option value="">{{ t('allStatuses') || 'كل الحالات' }}</option>
        <option value="published">{{ t('published') || 'منشور' }}</option>
        <option value="draft">{{ t('draft') || 'مسودة' }}</option>
        <option value="archived">{{ t('archived') || 'مؤرشف' }}</option>
      </select>
      <select v-model="filters.category" @change="fetchItems">
        <option value="">{{ t('allCategories') || 'كل الفئات' }}</option>
        <!-- <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name_ar }}</option> -->
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ categoryName(cat) }}
       </option>
      </select>
      <div class="view-toggle">
        <button :class="{ active: viewMode==='grid' }"  @click="viewMode='grid'"><i class="bi bi-grid-3x3-gap"></i></button>
        <button :class="{ active: viewMode==='table' }" @click="viewMode='table'"><i class="bi bi-list-ul"></i></button>
      </div>
    </div>

    <!-- Bulk bar -->
    <transition name="slide-down">
      <div v-if="selectedIds.length" class="bulk-bar">
        <span>{{ selectedIds.length }}</span>
        <button class="bulk-btn" @click="doBulk('publish')">{{ t('publish') || 'نشر' }}</button>
        <button class="bulk-btn" @click="doBulk('draft')">{{ t('draft') || 'مسودة' }}</button>
        <button class="bulk-btn" @click="doBulk('feature')">{{ t('feature') || 'تمييز ⭐' }}</button>
        <button class="bulk-btn delete" @click="doBulk('delete')">{{ t('delete') || 'حذف' }}</button>
        <button class="bulk-clear" @click="selectedIds=[]">✕</button>
      </div>
    </transition>

    <!-- Skeleton -->
    <template v-if="loading">
      <div class="grid-view">
        <div v-for="n in 6" :key="n" class="skeleton-card"></div>
      </div>
    </template>

    <!-- Empty -->
    <div v-else-if="!items.length" class="empty-state">
      <i class="bi bi-briefcase"></i>
      <p>{{ t('noItems') || 'لا توجد أعمال بعد' }}</p>
      <router-link to="/admin/portfolio/create" class="btn btn-primary">{{ t('newItem') || 'عمل جديد' }}</router-link>
    </div>

    <!-- GRID -->
    <div v-else-if="viewMode==='grid'" class="grid-view">
      <div v-for="itm in items" :key="itm.id" class="portfolio-card" :class="{ featured: itm.featured }">
        <div class="card-check">
          <input type="checkbox" :value="itm.id" v-model="selectedIds" />
        </div>
        <div class="card-thumb">
          <img v-if="itm.thumbnail" :src="itm.thumbnail" :alt="itm.title_ar" />
          <div v-else class="thumb-placeholder"><i class="bi bi-image"></i></div>
          <span v-if="itm.featured" class="featured-badge"><i class="bi bi-star-fill"></i></span>
          <span class="status-dot" :class="itm.status"></span>
        </div>
        <div class="card-body">
          <p class="card-category"> {{ categoryName(itm.category) }} </p>

              <h3 class="card-title">
                {{ portfolioTitle(itm) }}
              </h3>
          <h3 class="card-title">{{ itm.title_ar }}</h3>
          <p class="card-client" v-if="itm.client_name"><i class="bi bi-building"></i> {{ itm.client_name }}</p>
          <div class="card-tags">
            <span v-for="tag in (itm.tags ?? []).slice(0,3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="status-badge" :class="itm.status">{{ statusLabel(itm.status) }}</span>
          <div class="card-actions">
            <router-link :to="`/admin/portfolio/${itm.id}/edit`" class="action-btn edit"><i class="bi bi-pencil"></i></router-link>
            <button class="action-btn delete" @click="confirmDelete(itm)"><i class="bi bi-trash3"></i></button>
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div v-else class="table-wrap">
      <table class="portfolio-table">
        <thead>
          <tr>
            <th><input type="checkbox" @change="toggleAll" :checked="allSelected" /></th>
            <th>{{ t('thumbnail') || 'الصورة' }}</th><th>{{ t('title') || 'العنوان' }}</th><th>{{ t('category') || 'الفئة' }}</th><th>{{ t('client') || 'العميل' }}</th>
            <th>{{ t('status') || 'الحالة' }}</th><th>{{ t('featured') || 'مميز' }}</th><th>{{ t('actions') || 'الإجراءات' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itm in items" :key="itm.id">
            <td><input type="checkbox" :value="itm.id" v-model="selectedIds" /></td>
            <td>
              <img v-if="itm.thumbnail" :src="itm.thumbnail" class="table-thumb" />
              <div v-else class="table-thumb-placeholder"><i class="bi bi-image"></i></div>
            </td>
            <td>
                <p class="table-title-ar"> {{ portfolioTitle(itm) }} </p>

                <p v-if="itm.title_ar && itm.title_en" class="table-title-en">
                  {{ isRtl ? itm.title_en : itm.title_ar }}
                </p>
           </td>
           <td>{{ categoryName(itm.category) }}</td>
            <!-- <td>{{ itm.category?.name_ar ?? '—' }}</td> -->
            <td>{{ itm.client_name ?? '—' }}</td>
            <td><span class="status-badge" :class="itm.status">{{ statusLabel(itm.status) }}</span></td>
            <td><i :class="itm.featured ? 'bi bi-star-fill text-gold' : 'bi bi-star'"></i></td>
            <td>
              <div class="table-actions">
                <router-link :to="`/admin/portfolio/${itm.id}/edit`" class="action-btn edit"><i class="bi bi-pencil"></i></router-link>
                <button class="action-btn delete" @click="confirmDelete(itm)"><i class="bi bi-trash3"></i></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
        v-for="page in pagination.last_page" :key="page"
        :class="{ active: page === pagination.current_page }"
        @click="goToPage(page)"
      >{{ page }}</button>
    </div>

    <!-- Trashed Modal -->
    <transition name="fade">
      <div v-if="showTrashed" class="modal-overlay" @click.self="showTrashed=false">
        <div class="modal-box">
          <div class="modal-header">
            <h3><i class="bi bi-trash3"></i> {{ t('Trashed') || 'المحذوفات' }} </h3>
            <button @click="showTrashed=false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div v-if="!trashedItems.length" class="empty-state small"><p>{{ t('noTrashedItems') || 'لا توجد عناصر محذوفة' }}</p></div>
          <div v-else class="trashed-list">
            <div v-for="itm in trashedItems" :key="itm.id" class="trashed-row">
              <!-- <span>{{ itm.title_ar }}</span> -->
              <span>{{ portfolioTitle(itm) }}</span>
              <small>{{ itm.deleted_at }}</small>
              <div class="trashed-actions">
                <button class="btn btn-sm btn-success" @click="doRestore(itm.id)">
                  <i class="bi bi-arrow-counterclockwise"></i> {{ t('restore') || 'استعادة' }}
                </button>
                <button class="btn btn-sm btn-danger" @click="doForceDelete(itm.id)">
                  <i class="bi bi-x-circle"></i> {{ t('forceDelete') || 'حذف نهائي' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirm -->
    <transition name="fade">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget=null">
        <div class="modal-box confirm-modal">
          <i class="bi bi-exclamation-triangle confirm-icon"></i>
          <h3>{{ t('deleteItem') || 'حذف العمل' }}</h3>
          <p>{{ t('confirmDelete') || 'هل تريد حذف ' }} "
           <strong>{{ portfolioTitle(deleteTarget) }}</strong>
            <!-- <strong>{{ deleteTarget.title_ar }}</strong> -->
            "؟</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="deleteTarget=null">{{ t('cancel') || 'إلغاء' }}</button>
            <button class="btn btn-danger"  @click="doDelete">{{ t('delete') || 'حذف' }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { usePortfolio } from '@/composables/usePortfolio'
import { useSettings } from '@/composables/useSettings'
const { t, isRtl, currentLang } = useSettings()
const {
  items, categories, pagination, loading, filters,
  fetchItems, fetchCategories, deleteItem, bulkAction, restoreItem, forceDeleteItem,
} = usePortfolio()

const viewMode     = ref('grid')
const selectedIds  = ref([])
const deleteTarget = ref(null)
const showTrashed  = ref(false)
const trashedItems = ref([])

let searchTimer = null
function debouncedFetch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchItems, 400)
}

const allSelected = computed(() =>
  items.value.length > 0 && selectedIds.value.length === items.value.length
)

function toggleAll(e) {
  selectedIds.value = e.target.checked ? items.value.map(i => i.id) : []
}

function statusLabel(s) {
  return { published: 'منشور', draft: 'مسودة', archived: 'مؤرشف' }[s] ?? s
}
function portfolioTitle(item) {
  const lang = isRtl.value ? 'ar' : 'en'

  if (lang === 'ar') {
    return item.title_ar || item.title_en || ''
  }

  return item.title_en || item.title_ar || ''
}

function categoryName(category) {
  if (!category) return '—'

  const lang = isRtl.value ? 'ar' : 'en'

  if (lang === 'ar') {
    return category.name_ar || category.name_en || ''
  }

  return category.name_en || category.name_ar || ''
}

function goToPage(page) { filters.page = page; fetchItems() }
function confirmDelete(itm) { deleteTarget.value = itm }

async function doDelete() {
  await deleteItem(deleteTarget.value.id)
  deleteTarget.value = null
  fetchItems()
}

async function doBulk(action) {
  await bulkAction(action, selectedIds.value)
  selectedIds.value = []
  fetchItems()
}

watch(showTrashed, async (val) => {
  if (!val) return
  const { data } = await axios.get('/api/admin/portfolio/trashed')
  trashedItems.value = data.data
})

async function doRestore(id) {
  await restoreItem(id)
  trashedItems.value = trashedItems.value.filter(i => i.id !== id)
  fetchItems()
}

async function doForceDelete(id) {
  await forceDeleteItem(id)
  trashedItems.value = trashedItems.value.filter(i => i.id !== id)
}

onMounted(() => { fetchItems(); fetchCategories() })
</script>

<style scoped>
.portfolio-list { padding: 0 0 60px; }
.page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
.header-left { display:flex; align-items:center; gap:12px; }
.page-title { font-size:1.5rem; font-weight:700; color:#0A1870; margin:0; display:flex; align-items:center; gap:8px; }
.total-badge { background:#D0D6E5; color:#0A1870; padding:3px 12px; border-radius:20px; font-size:.8rem; font-weight:600; }
.header-actions { display:flex; gap:10px; }
.btn { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; border-radius:8px; font-size:.875rem; font-weight:600; cursor:pointer; border:none; transition:.2s; text-decoration:none; }
.btn-primary { background:#162FBB; color:#fff; }
.btn-primary:hover { background:#1228a0; }
.btn-outline { background:transparent; border:1.5px solid #D0D6E5; color:#444; }
.btn-danger  { background:#e53e3e; color:#fff; }
.btn-success { background:#38a169; color:#fff; }
.btn-sm { padding:5px 12px; font-size:.8rem; }
.filters-bar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; align-items:center; }
.search-wrap { display:flex; align-items:center; gap:8px; background:#fff; border:1.5px solid #D0D6E5; border-radius:8px; padding:6px 12px; flex:1; min-width:200px; }
.search-wrap input { border:none; outline:none; flex:1; font-size:.875rem; }
.filters-bar select { padding:8px 12px; border:1.5px solid #D0D6E5; border-radius:8px; font-size:.875rem; background:#fff; cursor:pointer; }
.view-toggle { display:flex; border:1.5px solid #D0D6E5; border-radius:8px; overflow:hidden; }
.view-toggle button { padding:7px 12px; background:none; border:none; cursor:pointer; color:#888; }
.view-toggle button.active { background:#162FBB; color:#fff; }
.bulk-bar { display:flex; align-items:center; gap:8px; background:#0A1870; color:#fff; padding:10px 16px; border-radius:8px; margin-bottom:16px; flex-wrap:wrap; }
.bulk-btn { padding:5px 14px; border-radius:6px; border:1.5px solid rgba(255,255,255,.3); background:transparent; color:#fff; font-size:.8rem; cursor:pointer; }
.bulk-btn.delete { border-color:#fc8181; }
.bulk-clear { margin-right:auto; background:transparent; border:none; color:rgba(255,255,255,.6); cursor:pointer; }
.grid-view { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }
.portfolio-card { background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 4px 20px rgba(22,47,187,.08); transition:transform .25s cubic-bezier(.34,1.2,.64,1); position:relative; }
.portfolio-card:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(22,47,187,.14); }
.portfolio-card.featured { box-shadow:0 0 0 2px #E7AE18, 0 4px 20px rgba(22,47,187,.08); }
.card-check { position:absolute; top:10px; right:10px; z-index:2; }
.card-thumb { position:relative; height:180px; overflow:hidden; background:#F0F0F0; }
.card-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .4s; }
.portfolio-card:hover .card-thumb img { transform:scale(1.04); }
.thumb-placeholder { display:flex; align-items:center; justify-content:center; height:100%; color:#bbb; font-size:2.5rem; }
.featured-badge { position:absolute; top:8px; left:8px; background:#E7AE18; color:#fff; padding:2px 8px; border-radius:20px; font-size:.7rem; }
.status-dot { position:absolute; bottom:8px; right:8px; width:10px; height:10px; border-radius:50%; border:2px solid #fff; }
.status-dot.published { background:#48bb78; }
.status-dot.draft     { background:#ed8936; }
.status-dot.archived  { background:#a0aec0; }
.card-body { padding:14px 16px; }
.card-category { font-size:.72rem; color:#162FBB; font-weight:600; margin:0 0 4px; }
.card-title { font-size:1rem; font-weight:700; color:#1a202c; margin:0 0 6px; }
.card-client { font-size:.8rem; color:#666; margin:0 0 8px; display:flex; align-items:center; gap:5px; }
.card-tags { display:flex; gap:5px; flex-wrap:wrap; }
.tag { background:#F0F0F0; color:#555; padding:2px 9px; border-radius:12px; font-size:.72rem; }
.card-footer { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-top:1px solid #D0D6E5; }
.card-actions { display:flex; gap:6px; }
.status-badge { padding:3px 10px; border-radius:12px; font-size:.75rem; font-weight:600; }
.status-badge.published { background:#c6f6d5; color:#276749; }
.status-badge.draft     { background:#feebc8; color:#744210; }
.status-badge.archived  { background:#e2e8f0; color:#4a5568; }
.action-btn { width:32px; height:32px; border-radius:7px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.9rem; transition:.2s; text-decoration:none; }
.action-btn.edit   { background:#ebf4ff; color:#162FBB; }
.action-btn.delete { background:#fff5f5; color:#e53e3e; }
.table-wrap { background:#fff; border-radius:12px; box-shadow:0 4px 20px rgba(22,47,187,.08); overflow:hidden; }
.portfolio-table { width:100%; border-collapse:collapse; }
.portfolio-table th { background:#F0F0F0; padding:12px 14px; text-align:right; font-size:.8rem; color:#555; font-weight:600; }
.portfolio-table td { padding:12px 14px; border-bottom:1px solid #D0D6E5; vertical-align:middle; font-size:.875rem; }
.portfolio-table tbody tr:hover { background:#fafbff; }
.table-thumb { width:52px; height:40px; object-fit:cover; border-radius:6px; }
.table-thumb-placeholder { width:52px; height:40px; background:#F0F0F0; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#bbb; }
.table-title-ar { font-weight:600; margin:0; }
.table-title-en { font-size:.78rem; color:#888; margin:2px 0 0; }
.table-actions { display:flex; gap:6px; }
.text-gold { color:#E7AE18; }
.pagination { display:flex; gap:6px; justify-content:center; margin-top:28px; }
.pagination button { width:36px; height:36px; border-radius:8px; border:1.5px solid #D0D6E5; background:#fff; cursor:pointer; font-size:.875rem; transition:.2s; }
.pagination button.active { background:#162FBB; color:#fff; border-color:#162FBB; }
.skeleton-card { height:300px; background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:400% 100%; animation:shimmer 1.4s infinite; border-radius:12px; }
@keyframes shimmer { to { background-position:-400% 0; } }
.empty-state { text-align:center; padding:60px 20px; color:#aaa; }
.empty-state i { font-size:3rem; margin-bottom:12px; display:block; }
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal-box { background:#fff; border-radius:16px; padding:28px; width:100%; max-width:520px; box-shadow:0 20px 60px rgba(0,0,0,.2); }
.modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.modal-header h3 { margin:0; }
.modal-header button { background:none; border:none; cursor:pointer; font-size:1.1rem; color:#888; }
.confirm-modal { text-align:center; }
.confirm-icon { font-size:3rem; color:#ed8936; display:block; margin-bottom:12px; }
.confirm-actions { display:flex; gap:10px; justify-content:center; margin-top:20px; }
.trashed-list { max-height:400px; overflow-y:auto; }
.trashed-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #D0D6E5; flex-wrap:wrap; }
.trashed-row span { flex:1; font-weight:600; }
.trashed-row small { color:#888; font-size:.78rem; }
.trashed-actions { display:flex; gap:6px; }
.fade-enter-active,.fade-leave-active { transition:opacity .2s; }
.fade-enter-from,.fade-leave-to { opacity:0; }
.slide-down-enter-active,.slide-down-leave-active { transition:all .25s; }
.slide-down-enter-from,.slide-down-leave-to { opacity:0; transform:translateY(-12px); }
</style>
