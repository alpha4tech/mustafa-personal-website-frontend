<template>
  <div class="categories-page" :class="{ rtl: isRtl }">

    <!-- ── Header ── -->
    <div class="page-header">
      <div class="ph-left">
        <!-- <button class="back-btn" @click="$router.back()">
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button> -->
        <div>
          <h1 class="ph-title">
            <i class="bi bi-folder" aria-hidden="true"></i>
            {{ t('categories') || 'التصنيفات' }}
          </h1>
          <p class="ph-sub">{{ t('manageCategories') || 'إدارة تصنيفات المدونة' }}</p>
        </div>
      </div>
      <router-link :to="{ name: 'admin.blog' }" class="btn-ghost">
        <i class="bi bi-arrow-left" aria-hidden="true"></i>
        {{ t('backToBlog') || 'العودة للمدونة' }}
      </router-link>
    </div>

    <div class="main-layout">

      <!-- ── Add / Edit Form ── -->
      <div class="form-card">
        <div class="fc-head">
          <i class="ti ti-folder-plus" aria-hidden="true"></i>
          {{ editingId ? (t('editCategory') || 'تعديل التصنيف') : (t('addCategory') || 'إضافة تصنيف') }}
        </div>
        <div class="fc-body">
          <div class="field-row">
            <label class="field-label">{{ t('nameAr') || 'الاسم بالعربية' }} <span class="req">*</span></label>
            <input v-model="form.name_ar" class="field-input" placeholder="مثال: تسويق رقمي" />
            <div v-if="errors.name_ar" class="field-error">{{ errors.name_ar }}</div>
          </div>
          <div class="field-row">
            <label class="field-label">{{ t('nameEn') || 'الاسم بالإنجليزية' }} <span class="req">*</span></label>
            <input v-model="form.name_en" class="field-input" placeholder="e.g. Digital Marketing" @input="autoSlug" />
            <div v-if="errors.name_en" class="field-error">{{ errors.name_en }}</div>
          </div>
          <div class="field-row">
            <label class="field-label">{{ t('slug') || 'الرابط المختصر' }}</label>
            <div class="slug-wrap">
              <span class="slug-prefix">/blog/category/</span>
              <input v-model="form.slug" class="field-input slug-input" placeholder="digital-marketing" />
              <button class="slug-btn" @click="autoSlug" title="توليد تلقائي">
                <i class="ti ti-refresh" aria-hidden="true"></i>
              </button>
            </div>
            <div v-if="errors.slug" class="field-error">{{ errors.slug }}</div>
          </div>
          <div class="field-row toggle-row">
            <label class="field-label">{{ t('active') || 'نشط' }}</label>
            <button class="toggle-btn" :class="{ on: form.is_active }" @click="form.is_active = !form.is_active">
              <span class="toggle-knob"></span>
            </button>
          </div>
          <div class="form-actions">
            <button v-if="editingId" class="btn-ghost" @click="resetForm">
              <i class="ti ti-x" aria-hidden="true"></i>
              {{ t('cancel') || 'إلغاء' }}
            </button>
            <button class="btn-primary" @click="save" :disabled="saving">
              <span v-if="saving" class="spin-xs"></span>
              <i v-else :class="editingId ? 'ti ti-device-floppy' : 'ti ti-plus'" aria-hidden="true"></i>
              {{ editingId ? (t('saveChanges') || 'حفظ التغييرات') : (t('addCategory') || 'إضافة') }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Categories List ── -->
      <div class="list-card">
        <div class="lc-head">
          <span>
            <i class="ti ti-list" aria-hidden="true"></i>
            {{ t('allCategories') || 'جميع التصنيفات' }}
            <span class="count-badge">{{ categories.length }}</span>
          </span>
          <div class="search-wrap">
            <i class="ti ti-search" aria-hidden="true"></i>
            <input v-model="search" class="search-input" :placeholder="t('search') || 'بحث...'" />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-rows">
          <div class="sk-row" v-for="i in 4" :key="i"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="filtered.length === 0" class="empty-state">
          <i class="ti ti-folder-off" aria-hidden="true"></i>
          <p>{{ search ? (t('noResults') || 'لا توجد نتائج') : (t('noCategories') || 'لا توجد تصنيفات بعد') }}</p>
        </div>

        <!-- Table -->
        <table v-else class="cat-table">
          <thead>
            <tr>
              <th>{{ t('nameAr') || 'الاسم العربي' }}</th>
              <th>{{ t('nameEn') || 'الاسم الإنجليزي' }}</th>
              <th>{{ t('slug') || 'الرابط' }}</th>
              <th>{{ t('posts') || 'المقالات' }}</th>
              <th>{{ t('status') || 'الحالة' }}</th>
              <th style="width:90px">{{ t('actions') || 'إجراءات' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in filtered" :key="cat.id" :class="{ editing: editingId === cat.id }">
              <td class="name-cell">{{ cat.name_ar }}</td>
              <td class="name-cell">{{ cat.name_en }}</td>
              <td><span class="slug-pill">{{ cat.slug }}</span></td>
              <td>
                <span class="posts-count">{{ cat.posts_count ?? 0 }}</span>
              </td>
              <td>
                <span :class="['status-dot', cat.is_active ? 'active' : 'inactive']">
                  {{ cat.is_active ? (t('active') || 'نشط') : (t('inactive') || 'غير نشط') }}
                </span>
              </td>
              <td>
                <div class="action-btns">
                  <button class="act-btn edit" @click="startEdit(cat)" :title="t('edit') || 'تعديل'">
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                  </button>
                  <button class="act-btn delete" @click="confirmDelete(cat)" :title="t('delete') || 'حذف'">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Delete Modal ── -->
    <Transition name="modal">
      <div v-if="deleteModal.show" class="modal-wrap" @click.self="deleteModal.show = false">
        <div class="modal-box">
          <div class="modal-head danger-head">
            <i class="ti ti-alert-triangle" aria-hidden="true"></i>
            {{ t('confirmDelete') || 'تأكيد الحذف' }}
          </div>
          <div class="modal-body">
            <p>{{ t('deleteCategoryConfirm') || 'هل أنت متأكد من حذف التصنيف؟' }}</p>
            <p class="delete-target">"{{ deleteModal.category?.name_ar }}"</p>
            <p class="delete-warning">
              {{ t('deleteCategoryWarning') || 'سيتم إزالة هذا التصنيف من جميع المقالات المرتبطة به.' }}
            </p>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" @click="deleteModal.show = false">{{ t('cancel') || 'إلغاء' }}</button>
            <button class="btn-danger" :disabled="deleteModal.loading" @click="doDelete">
              <span v-if="deleteModal.loading" class="spin-xs"></span>
              <i v-else class="ti ti-trash" aria-hidden="true"></i>
              {{ t('delete') || 'حذف' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="'toast-' + toast.type" role="alert">
        <i :class="toast.type === 'success' ? 'ti ti-circle-check' : 'ti ti-circle-x'" aria-hidden="true"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useSettings } from '@/composables/useSettings'
import axios from '@/api/axios'

const { t, isRtl } = useSettings()

// ── State ─────────────────────────────────────
const loading    = ref(false)
const saving     = ref(false)
const categories = ref([])
const search     = ref('')
const editingId  = ref(null)
const errors     = ref({})
const toast      = ref({ show: false, message: '', type: 'success' })
const deleteModal = ref({ show: false, category: null, loading: false })

const form = reactive({
  name_ar:   '',
  name_en:   '',
  slug:      '',
  is_active: true,
})

// ── Filtered ──────────────────────────────────
const filtered = computed(() => {
  if (!search.value.trim()) return categories.value
  const q = search.value.toLowerCase()
  return categories.value.filter(c =>
    c.name_ar?.includes(search.value) ||
    c.name_en?.toLowerCase().includes(q) ||
    c.slug?.toLowerCase().includes(q)
  )
})

// ── Slug ──────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().trim()
     .replace(/\s+/g, '-')
     .replace(/[^a-z0-9-]/g, '')
     .replace(/-+/g, '-').replace(/^-|-$/g, '')

const autoSlug = () => {
  form.slug = slugify(form.name_en)
}

// ── Helpers ───────────────────────────────────
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const resetForm = () => {
  editingId.value  = null
  errors.value     = {}
  form.name_ar     = ''
  form.name_en     = ''
  form.slug        = ''
  form.is_active   = true
}

// ── Validate ──────────────────────────────────
const validate = () => {
  errors.value = {}
  if (!form.name_ar.trim()) errors.value.name_ar = 'الاسم العربي مطلوب'
  if (!form.name_en.trim()) errors.value.name_en = 'English name is required'
  return Object.keys(errors.value).length === 0
}

// ── Fetch ─────────────────────────────────────
const fetchCategories = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/admin/blog/categories')
    categories.value = data.data || data || []
  } catch {
    showToast(t('fetchError') || 'فشل التحميل', 'error')
  } finally {
    loading.value = false
  }
}

// ── Save (create / update) ────────────────────
const save = async () => {
  if (!validate()) return
  if (!form.slug.trim()) autoSlug()
  saving.value = true
  try {
    if (editingId.value) {
      await axios.put(`/admin/blog/categories/${editingId.value}`, form)
      showToast(t('categoryUpdated') || 'تم تحديث التصنيف')
    } else {
      await axios.post('/admin/blog/categories', form)
      showToast(t('categoryAdded') || 'تم إضافة التصنيف')
    }
    resetForm()
    await fetchCategories()
  } catch (err) {
    const msg = err.response?.data?.message || t('saveFailed') || 'فشل الحفظ'
    showToast(msg, 'error')
    if (err.response?.data?.errors) {
      Object.entries(err.response.data.errors).forEach(([k, v]) => {
        errors.value[k] = Array.isArray(v) ? v[0] : v
      })
    }
  } finally {
    saving.value = false
  }
}

// ── Edit ──────────────────────────────────────
const startEdit = (cat) => {
  editingId.value = cat.id
  errors.value    = {}
  form.name_ar    = cat.name_ar  || ''
  form.name_en    = cat.name_en  || ''
  form.slug       = cat.slug     || ''
  form.is_active  = !!cat.is_active
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Delete ────────────────────────────────────
const confirmDelete = (cat) => {
  deleteModal.value = { show: true, category: cat, loading: false }
}

const doDelete = async () => {
  deleteModal.value.loading = true
  try {
    await axios.delete(`/admin/blog/categories/${deleteModal.value.category.id}`)
    showToast(t('categoryDeleted') || 'تم حذف التصنيف')
    deleteModal.value.show = false
    await fetchCategories()
  } catch {
    showToast(t('deleteFailed') || 'فشل الحذف', 'error')
  } finally {
    deleteModal.value.loading = false
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.categories-page { padding: 1.3rem; background: #F0F0F0; min-height: 100vh; }
.categories-page.rtl { direction: rtl; }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px; }
.ph-left  { display: flex; align-items: flex-start; gap: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #5A6B8A; transition: all .15s; flex-shrink: 0; margin-top: 2px; }
.back-btn:hover { background: #F0F0F0; }
.ph-title { font-size: 19px; font-weight: 700; color: #0D1830; margin: 0; display: flex; align-items: center; gap: 8px; }
.ph-title i { color: #162FBB; }
.ph-sub   { font-size: 12.5px; color: #7A8CAB; margin: 3px 0 0; }

/* Buttons */
.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 9px; background: #162FBB; color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: background .2s; }
.btn-primary:hover:not(:disabled) { background: #0F2196; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; color: #5A6B8A; cursor: pointer; font-size: 13px; text-decoration: none; transition: all .15s; }
.btn-ghost:hover { background: #F0F0F0; }
.btn-danger { display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px; border-radius: 8px; border: none; background: #dc2626; color: #fff; cursor: pointer; font-size: 13px; font-weight: 600; transition: background .15s; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: .6; cursor: not-allowed; }

/* Layout */
.main-layout { display: grid; grid-template-columns: 320px 1fr; gap: 14px; align-items: start; }

/* Form card */
.form-card { background: #fff; border-radius: 14px; border: 1px solid #D0D6E5; overflow: hidden; position: sticky; top: 1rem; }
.fc-head { display: flex; align-items: center; gap: 7px; padding: 12px 16px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; font-size: 13px; font-weight: 600; color: #0D1830; }
.fc-head i { color: #162FBB; font-size: 16px; }
.fc-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.field-row { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 12.5px; font-weight: 600; color: #0D1830; }
.req { color: #dc2626; }
.field-input { width: 100%; padding: 8px 11px; border: 1.5px solid #D0D6E5; border-radius: 8px; font-size: 13px; color: #0D1830; background: #fff; outline: none; transition: border-color .15s; font-family: inherit; box-sizing: border-box; }
.field-input:focus { border-color: #162FBB; }
.field-error { font-size: 11.5px; color: #dc2626; display: flex; align-items: center; gap: 4px; }
.toggle-row { flex-direction: row; align-items: center; justify-content: space-between; }
.toggle-btn  { width: 38px; height: 22px; border-radius: 20px; border: none; background: #D0D6E5; cursor: pointer; position: relative; transition: background .2s; flex-shrink: 0; }
.toggle-btn.on { background: #162FBB; }
.toggle-knob { width: 16px; height: 16px; border-radius: 50%; background: #fff; position: absolute; top: 3px; inset-inline-start: 3px; transition: inset-inline-start .2s; box-shadow: 0 1px 4px rgba(0,0,0,.15); }
.toggle-btn.on .toggle-knob { inset-inline-start: 19px; }
.form-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px; }

/* Slug wrap */
.slug-wrap { display: flex; align-items: center; border: 1.5px solid #D0D6E5; border-radius: 8px; overflow: hidden; transition: border-color .15s; }
.slug-wrap:focus-within { border-color: #162FBB; }
.slug-prefix { background: #F8FAFC; padding: 8px 9px; font-size: 11px; color: #7A8CAB; border-inline-end: 1px solid #D0D6E5; white-space: nowrap; }
.slug-input  { flex: 1; border: none; padding: 8px 9px; font-size: 12.5px; color: #162FBB; outline: none; background: none; font-family: monospace; }
.slug-btn    { padding: 0 9px; border: none; background: none; cursor: pointer; color: #7A8CAB; font-size: 14px; display: flex; align-items: center; transition: color .15s; }
.slug-btn:hover { color: #162FBB; }

/* List card */
.list-card { background: #fff; border-radius: 14px; border: 1px solid #D0D6E5; overflow: hidden; }
.lc-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; font-size: 13px; font-weight: 600; color: #0D1830; gap: 12px; flex-wrap: wrap; }
.lc-head i { color: #162FBB; }
.count-badge { background: rgba(22,47,187,.1); color: #162FBB; font-size: 11px; padding: 1px 7px; border-radius: 20px; margin-inline-start: 6px; font-weight: 700; }
.search-wrap { display: flex; align-items: center; gap: 6px; background: #F0F4FF; border-radius: 8px; padding: 0 10px; border: 1px solid #D0D6E5; }
.search-wrap i { color: #7A8CAB; font-size: 14px; }
.search-input { border: none; background: none; outline: none; font-size: 12.5px; color: #0D1830; padding: 7px 0; width: 160px; }

/* Table */
.cat-table { width: 100%; border-collapse: collapse; }
.cat-table thead tr { background: #FAFBFE; }
.cat-table th { padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: #7A8CAB; text-align: start; border-bottom: 1px solid #D0D6E5; }
.cat-table td { padding: 11px 14px; border-bottom: 1px solid #F0F4FA; font-size: 13px; color: #0D1830; }
.cat-table tbody tr { transition: background .15s; }
.cat-table tbody tr:hover { background: #FAFBFE; }
.cat-table tbody tr.editing { background: rgba(22,47,187,.04); }
.cat-table tbody tr:last-child td { border: none; }
.name-cell { font-weight: 500; }
.slug-pill { background: #F0F4FF; color: #162FBB; padding: 2px 8px; border-radius: 6px; font-size: 11.5px; font-family: monospace; }
.posts-count { background: #E8EDF5; color: #5A6B8A; padding: 2px 8px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.status-dot { display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.status-dot::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.status-dot.active   { background: #dcfce7; color: #15803d; }
.status-dot.inactive { background: #f1f5f9; color: #64748b; }
.action-btns { display: flex; gap: 5px; }
.act-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #D0D6E5; background: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all .15s; color: #7A8CAB; }
.act-btn.edit:hover { background: rgba(22,47,187,.08); border-color: rgba(22,47,187,.25); color: #162FBB; }
.act-btn.del:hover  { background: rgba(220,38,38,.08); border-color: rgba(220,38,38,.2);  color: #dc2626; }

/* Loading skeleton */
.loading-rows { padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
.sk-row { height: 44px; border-radius: 8px; background: linear-gradient(90deg,#e8edf5 25%,#f0f4fa 50%,#e8edf5 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

/* Empty */
.empty-state { padding: 3rem 2rem; text-align: center; color: #B0BAD0; }
.empty-state i { font-size: 40px; display: block; margin-bottom: 10px; }
.empty-state p { font-size: 13px; color: #7A8CAB; margin: 0; }

/* Modal */
.modal-wrap { position: fixed; inset: 0; background: rgba(10,24,112,.45); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(4px); }
.modal-box  { background: #fff; border-radius: 14px; width: 90%; max-width: 400px; overflow: hidden; box-shadow: 0 20px 60px rgba(10,24,112,.22); border-top: 3px solid #E7AE18; }
.modal-head { display: flex; align-items: center; gap: 8px; padding: 14px 16px; background: #FAFBFE; border-bottom: 1px solid #D0D6E5; font-size: 14px; font-weight: 600; }
.danger-head { color: #dc2626; }
.modal-body { padding: 16px; font-size: 13.5px; color: #5A6B8A; }
.modal-body p { margin: 0 0 6px; }
.delete-target  { font-weight: 600; color: #0D1830; }
.delete-warning { font-size: 12px; color: #d97706; }
.modal-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #D0D6E5; background: #FAFBFE; }

/* Spinners */
.spin-xs { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.toast { position: fixed; bottom: 1.3rem; inset-inline-end: 1.3rem; padding: 9px 15px; border-radius: 10px; color: #fff; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; z-index: 3000; box-shadow: 0 8px 28px rgba(0,0,0,.18); }
.toast-success { background: #10b981; }
.toast-error   { background: #ef4444; }
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.96); }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { transform: translateY(12px); opacity: 0; }

@media (max-width: 900px) {
  .main-layout { grid-template-columns: 1fr; }
  .form-card { position: static; }
}
@media (max-width: 640px) {
  .categories-page { padding: .9rem; }
}
</style>
