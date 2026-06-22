<template>
  <div class="service-list" :class="{ rtl: isRtl }">

    <!-- Header -->
    <div class="page-header d-flex align-items-center justify-content-between mb-4">
      <div>
        <h1 class="page-title mb-1">
            {{ t('Services') || 'الخدمات' }}
        </h1>
        <p class="page-subtitle mb-0">
            {{ t('manageServices') || 'إدارة الخدمات' }}
        </p>
      </div>
      <router-link to="/admin/services/create" class="btn-create">
        <i class="bi bi-plus-lg me-2"></i>
        {{ t('addNewService') || 'إضافة خدمة جديدة' }}
      </router-link>

      <router-link to="/admin/services/service-requests" class="btn-create">
        <i class="bi bi-clipboard-check me-2"></i>
        {{ t('serviceRequests') || 'طلبات الخدمات' }}
      </router-link>


    </div>

    <!-- Filters -->
    <div class="filters-card mb-4">
      <div class="row g-3 align-items-end">
        <div class="col-md-6">
          <div class="search-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
              v-model="filters.search"
              type="text"
              class="search-input"
              :placeholder="t('searchPlaceholder') || 'بحث'"
              @input="debouncedFetch"
            />
          </div>
        </div>
        <div class="col-md-3">
          <label class="filter-label">{{ t('status') || 'الحالة' }}</label>
          <select v-model="filters.is_active" class="filter-select" @change="fetchServices">
            <option value="">{{ t('all') || 'الكل' }}</option>
            <option value="1">{{ t('active') || 'نشط' }}</option>
            <option value="0">{{ t('inactive') || 'غير نشط' }}</option>
          </select>
        </div>
        <div class="col-md-3 d-flex gap-2">
          <button class="btn-reset flex-fill" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i>{{ t('reset') || 'إعادة تعيين' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-wrap">
        <div class="spinner-border" role="status"></div>
        <span>{{ t('loading') || 'جاري التحميل' }}</span>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!services.length" class="empty-state">
      <div class="empty-icon"><i class="bi bi-briefcase"></i></div>
      <h5>{{ t('noServices') || 'لا توجد خدمات' }}</h5>
      <p>{{ t('noServicesDesc') || 'لا توجد خدمات متوفرة' }}</p>
      <router-link to="/admin/services/create" class="btn-create">
        <i class="bi bi-plus-lg me-2"></i>{{ t('addNew') || 'إضافة جديد' }}
      </router-link>
    </div>

    <!-- Grid -->
    <div v-else class="services-grid">
      <div v-for="service in services" :key="service.id" class="service-card">
        <!-- Icon -->
        <div class="service-icon-wrap">
          <i :class="`bi ${service.icon || 'bi-briefcase'}`"></i>
        </div>

        <!-- Badge -->
        <span class="status-badge" :class="service.is_active ? 'badge-active' : 'badge-inactive'">
          {{ service.is_active ? t('active') || 'نشط' : t('inactive') || 'غير نشط' }}
        </span>

        <!-- Content -->
        <div class="service-content">
          <h5 class="service-title">
            {{ isRtl ? service.title_ar : service.title_en }}
          </h5>
          <p class="service-desc">
            {{ isRtl ? service.desc_service_ar : service.desc_service_en }}
          </p>
          <div v-if="(isRtl ? service.list_desc_ar : service.list_desc_en)?.length" class="service-list-preview">
            <span v-for="(item, i) in (isRtl ? service.list_desc_ar : service.list_desc_en).slice(0,2)" :key="i" class="list-chip">
              <i class="bi bi-check2 me-1"></i>{{ item }}
            </span>
            <span v-if="(isRtl ? service.list_desc_ar : service.list_desc_en).length > 2" class="list-chip more-chip">
              +{{ (isRtl ? service.list_desc_ar : service.list_desc_en).length - 2 }}
            </span>
          </div>
          <div class="service-meta">
            <span class="meta-order"><i class="bi bi-sort-numeric-up me-1"></i>{{ t('order') || 'الترتيب' }}: {{ service.sort_order }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions">
          <router-link :to="`/admin/services/${service.id}`" class="action-btn btn-view" :title="t.view">
            <i class="bi bi-eye"></i>
          </router-link>
          <router-link :to="`/admin/services/${service.id}/edit`" class="action-btn btn-edit" :title="t.edit">
            <i class="bi bi-pencil"></i>
          </router-link>
          <button class="action-btn btn-toggle" :title="service.is_active ? t.deactivate : t.activate" @click="toggleActive(service)">
            <i :class="`bi ${service.is_active ? 'bi-toggle-on' : 'bi-toggle-off'}`"></i>
          </button>

          <button class="action-btn btn-delete" @click="deleteService(service)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination-wrap mt-4">
      <button class="page-btn" :disabled="pagination.current_page === 1" @click="goToPage(pagination.current_page - 1)">
        <i class="bi bi-chevron-right"></i>
      </button>
      <span class="page-info">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
      <button class="page-btn" :disabled="pagination.current_page === pagination.last_page" @click="goToPage(pagination.current_page + 1)">
        <i class="bi bi-chevron-left"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/api/axios'
import { useSettings } from '@/composables/useSettings'
import { useConfirm } from '@/composables/useConfirm'


const { t, isRtl, currentLang } = useSettings()


const services = ref([])
const loading = ref(false)
const pagination = ref({ current_page: 1, last_page: 1, per_page: 12, total: 0 })
const filters = ref({ search: '', is_active: '' })
const toast = ref({ show: false, type: 'success', message: '' })

const { confirm } = useConfirm()

let debounceTimer = null
const debouncedFetch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchServices, 400)
}

const fetchServices = async (page = 1) => {
  loading.value = true
  try {
    const params = { page, ...filters.value }
    const res = await axios.get('/admin/services', { params })
    services.value = res.data.data
    pagination.value = res.data.pagination
  } catch {
    showToast('error', isRtl ? 'فشل في جلب البيانات' : 'Failed to load data')
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => fetchServices(page)

const resetFilters = () => {
  filters.value = { search: '', is_active: '' }
  fetchServices()
}

const deleteService = async (service) => {

  const ok = await confirm({
    title: t('ConfirmDelete'),
    message: t('DeleteConfirmMessage'),
    confirmText: t('Delete'),
    cancelText: t('Cancel')
  })

  if (!ok) return

  await axios.delete(`/admin/services/${service.id}`)

  fetchServices()
}

const toggleActive = async (service) => {
  try {
    const res = await axios.patch(`/admin/services/${service.id}/toggle-active`)
    service.is_active = res.data.is_active
    showToast('success', t.value.successToggle)
  } catch {
    showToast('error', isRtl ? 'فشل في تغيير الحالة' : 'Failed to update status')
  }
}

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3500)
}
onMounted(fetchServices)

</script>

<style scoped>
.service-list { padding: 1.5rem; }

/* Header */
.page-title { font-size: 1.5rem; font-weight: 700; color: #162FBB; }
.page-subtitle { font-size: 0.875rem; color: #6b7280; }
.btn-create {
  display: inline-flex; align-items: center; padding: .6rem 1.25rem;
  background: linear-gradient(135deg, #162FBB, #0A1870); color: #fff;
  border-radius: 10px; font-weight: 600; font-size: .875rem;
  text-decoration: none; border: none; cursor: pointer; transition: all .2s;
}
.btn-create:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(22,47,187,.35); color: #fff; }

/* Filters */
.filters-card { background: #fff; border-radius: 14px; padding: 1.25rem; box-shadow: 0 2px 12px rgba(0,0,0,.06); }
.filter-label { display: block; font-size: .8rem; font-weight: 600; color: #374151; margin-bottom: .4rem; }
.search-wrapper { position: relative; }
.search-icon { position: absolute; top: 50%; transform: translateY(-50%); inset-inline-start: .85rem; color: #9ca3af; font-size: .9rem; }
.search-input {
  width: 100%; padding: .6rem .85rem .6rem 2.5rem; border: 1.5px solid #e5e7eb;
  border-radius: 9px; font-size: .875rem; outline: none; transition: border .2s;
}
[dir="rtl"] .search-input { padding: .6rem 2.5rem .6rem .85rem; }
.search-input:focus { border-color: #162FBB; }
.filter-select {
  width: 100%; padding: .6rem .85rem; border: 1.5px solid #e5e7eb;
  border-radius: 9px; font-size: .875rem; outline: none; background: #fff; cursor: pointer;
}
.btn-reset {
  padding: .6rem; background: #f3f4f6; border: 1.5px solid #e5e7eb;
  border-radius: 9px; font-size: .875rem; cursor: pointer; transition: all .2s; color: #374151;
}
.btn-reset:hover { background: #e5e7eb; }

/* Loading */
.loading-state { display: flex; justify-content: center; padding: 4rem; }
.spinner-wrap { display: flex; flex-direction: column; align-items: center; gap: 1rem; color: #162FBB; }
.spinner-border { color: #162FBB; }

/* Empty */
.empty-state { text-align: center; padding: 5rem 2rem; background: #fff; border-radius: 16px; }
.empty-icon { font-size: 3rem; color: #D0D6E5; margin-bottom: 1rem; }
.empty-state h5 { color: #374151; font-weight: 700; }
.empty-state p { color: #9ca3af; margin-bottom: 1.5rem; }

/* Grid */
.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

.service-card {
  background: #fff; border-radius: 16px; padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,.06); position: relative;
  transition: transform .2s, box-shadow .2s; display: flex; flex-direction: column; gap: .75rem;
}
.service-card:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(22,47,187,.12); }

.service-icon-wrap {
  width: 52px; height: 52px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(22,47,187,.1), rgba(231,174,24,.15));
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem; color: #162FBB;
}

.status-badge {
  position: absolute; top: 1rem; inset-inline-end: 1rem;
  padding: .25rem .7rem; border-radius: 20px; font-size: .72rem; font-weight: 600;
}
.badge-active { background: #dcfce7; color: #15803d; }
.badge-inactive { background: #fee2e2; color: #dc2626; }

.service-content { flex: 1; }
.service-title { font-weight: 700; font-size: 1rem; color: #111827; margin-bottom: .4rem; }
.service-desc {
  font-size: .825rem; color: #6b7280; line-height: 1.55;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.service-list-preview { display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .6rem; }
.list-chip {
  font-size: .72rem; padding: .2rem .6rem; border-radius: 20px;
  background: rgba(22,47,187,.07); color: #162FBB; font-weight: 500;
}
.more-chip { background: rgba(231,174,24,.15); color: #92700a; }

.service-meta { margin-top: .5rem; }
.meta-order { font-size: .75rem; color: #9ca3af; }

.card-actions { display: flex; gap: .5rem; padding-top: .5rem; border-top: 1px solid #f3f4f6; }
.action-btn {
  flex: 1; display: flex; align-items: center; justify-content: center;
  padding: .45rem; border-radius: 8px; border: none; cursor: pointer;
  font-size: .9rem; text-decoration: none; transition: all .2s;
}
.btn-view   { background: rgba(22,47,187,.08); color: #162FBB; }
.btn-edit   { background: rgba(231,174,24,.12); color: #92700a; }
.btn-toggle { background: rgba(16,185,129,.08); color: #059669; }
.btn-delete { background: rgba(239,68,68,.08); color: #dc2626; }
.action-btn:hover { filter: brightness(.9); transform: scale(1.05); }

/* Pagination */
.pagination-wrap { display: flex; align-items: center; justify-content: center; gap: 1rem; }
.page-btn {
  width: 38px; height: 38px; border-radius: 9px; border: 1.5px solid #e5e7eb;
  background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
.page-btn:hover:not(:disabled) { border-color: #162FBB; color: #162FBB; }
.page-btn:disabled { opacity: .4; cursor: not-allowed; }
.page-info { font-size: .875rem; color: #374151; font-weight: 600; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
}
.modal-card {
  background: #fff; border-radius: 18px; padding: 2rem; max-width: 420px;
  width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,.2);
}
.modal-icon.danger { font-size: 2.5rem; color: #dc2626; margin-bottom: .75rem; }
.modal-card h5 { font-weight: 700; margin-bottom: .5rem; }
.modal-card p { color: #6b7280; margin-bottom: 1.5rem; font-size: .9rem; }
.modal-actions { display: flex; gap: .75rem; justify-content: center; }
.btn-cancel {
  padding: .6rem 1.5rem; background: #f3f4f6; border: none;
  border-radius: 9px; cursor: pointer; font-weight: 600; transition: all .2s;
}
.btn-danger {
  padding: .6rem 1.5rem; background: #dc2626; color: #fff; border: none;
  border-radius: 9px; cursor: pointer; font-weight: 600; transition: all .2s;
}
.btn-danger:hover { background: #b91c1c; }

/* Toast */
.toast-msg {
  position: fixed; bottom: 2rem; inset-inline-end: 2rem; z-index: 99999;
  padding: .85rem 1.5rem; border-radius: 12px; font-weight: 600; font-size: .875rem;
  display: flex; align-items: center; box-shadow: 0 8px 30px rgba(0,0,0,.15);
}
.toast-success { background: #dcfce7; color: #15803d; }
.toast-error   { background: #fee2e2; color: #dc2626; }
.toast-enter-active, .toast-leave-active { transition: all .35s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }
</style>
