<template>
  <div class="tags-page" :class="{ rtl: isRtl }">

    <!-- ── Header ── -->
    <div class="page-header">
      <div class="ph-left">
        <div>
          <h1 class="ph-title">
            <i class="bi bi-tags" aria-hidden="true"></i>
            {{ t('tags') || 'الوسوم' }}
          </h1>
          <p class="ph-sub">{{ t('manageTags') || 'إدارة وسوم المدونة' }}</p>
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
          <i class="bi bi-tag-plus" aria-hidden="true"></i>
          {{ editingId ? (t('editTag') || 'تعديل الوسم') : (t('addTag') || 'إضافة وسم') }}
        </div>
        <div class="fc-body">
          <div class="field-row">
            <label class="field-label">{{ t('nameAr') || 'الاسم بالعربية' }} <span class="req">*</span></label>
            <input v-model="form.name_ar" class="field-input" placeholder="مثال: تسويق إلكتروني" />
            <div v-if="errors.name_ar" class="field-error">{{ errors.name_ar }}</div>
          </div>
          <div class="field-row">
            <label class="field-label">{{ t('nameEn') || 'الاسم بالإنجليزية' }} <span class="req">*</span></label>
            <input v-model="form.name_en" class="field-input"
              placeholder="e.g. Digital Marketing" @input="autoSlug" />
            <div v-if="errors.name_en" class="field-error">{{ errors.name_en }}</div>
          </div>
          <div class="field-row">
            <label class="field-label">{{ t('slug') || 'الرابط المختصر' }}</label>
            <div class="slug-wrap">
              <span class="slug-prefix">/blog/tag/</span>
              <input v-model="form.slug" class="field-input slug-input" placeholder="digital-marketing" />
              <button class="slug-btn" @click="autoSlug" title="توليد تلقائي">
                <i class="ti ti-refresh" aria-hidden="true"></i>
              </button>
            </div>
            <div v-if="errors.slug" class="field-error">{{ errors.slug }}</div>
          </div>
          <div class="form-actions">
            <button v-if="editingId" class="btn-ghost" @click="resetForm">
              <i class="ti ti-x" aria-hidden="true"></i>
              {{ t('cancel') || 'إلغاء' }}
            </button>
            <button class="btn-primary" @click="save" :disabled="saving">
              <span v-if="saving" class="spin-xs"></span>
              <i v-else :class="editingId ? 'bi bi-device-floppy' : 'bi bi-plus'" aria-hidden="true"></i>
              {{ editingId ? (t('saveChanges') || 'حفظ') : (t('addTag') || 'إضافة') }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Tags List ── -->
      <div class="list-card">
        <div class="lc-head">
          <span>
            <i class="ti ti-tags" aria-hidden="true"></i>
            {{ t('allTags') || 'جميع الوسوم' }}
            <span class="count-badge">{{ tags.length }}</span>
          </span>
          <div class="search-wrap">
            <i class="ti ti-search" aria-hidden="true"></i>
            <input v-model="search" class="search-input" :placeholder="t('search') || 'بحث...'" />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="loading-rows">
          <div class="sk-row" v-for="i in 5" :key="i"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="filtered.length === 0" class="empty-state">
          <i class="ti ti-tag-off" aria-hidden="true"></i>
          <p>{{ search ? (t('noResults') || 'لا توجد نتائج') : (t('noTags') || 'لا توجد وسوم بعد') }}</p>
        </div>

        <!-- Tags cloud view -->
        <div v-else-if="viewMode === 'cloud'" class="tags-cloud">
          <div v-for="tag in filtered" :key="tag.id"
            class="tag-cloud-item"
            :class="{ editing: editingId === tag.id }">
            <span class="tag-name">{{ currentLang === 'ar' ? tag.name_ar : tag.name_en }}</span>
            <span class="tag-count">{{ tag.posts_count ?? 0 }}</span>
            <div class="tag-actions">
              <button class="tag-act edit" @click="startEdit(tag)">
                <i class="bi bi-penciel" aria-hidden="true"></i>
              </button>
              <button class="tag-act del" @click="confirmDelete(tag)">
                <i class="bi bi-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Table view -->
        <table v-else class="tags-table">
          <thead>
            <tr>
              <th>{{ t('nameAr') || 'الاسم العربي' }}</th>
              <th>{{ t('nameEn') || 'الاسم الإنجليزي' }}</th>
              <th>{{ t('slug') || 'الرابط' }}</th>
              <th>{{ t('posts') || 'المقالات' }}</th>
              <th style="width:90px">{{ t('actions') || 'إجراءات' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in filtered" :key="tag.id" :class="{ editing: editingId === tag.id }">
              <td class="name-cell">{{ tag.name_ar }}</td>
              <td class="name-cell">{{ tag.name_en }}</td>
              <td><span class="slug-pill">{{ tag.slug }}</span></td>
              <td><span class="posts-count">{{ tag.posts_count ?? 0 }}</span></td>
              <td>
                <div class="action-btns">
                  <button class="act-btn edit" @click="startEdit(tag)">
                    <i class="bi bi-pencil" aria-hidden="true"></i>
                  </button>
                  <button class="act-btn del" @click="confirmDelete(tag)">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- View toggle -->
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'"
            :title="t('tableView') || 'جدول'">
            <i class="bi bi-list-ul" aria-hidden="true"></i>
          </button>
          <button :class="{ active: viewMode === 'cloud' }" @click="viewMode = 'cloud'"
            :title="t('cloudView') || 'سحابة'">
            <i class="bi bi-tags" aria-hidden="true"></i>
          </button>
        </div>
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
            <p>{{ t('deleteTagConfirm') || 'هل أنت متأكد من حذف الوسم؟' }}</p>
            <p class="delete-target">"{{ deleteModal.tag?.name_ar }}"</p>
            <p class="delete-warning">
              {{ t('deleteTagWarning') || 'سيتم إزالة هذا الوسم من جميع المقالات المرتبطة به.' }}
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
const tags       = ref([])
const search     = ref('')
const editingId  = ref(null)
const viewMode   = ref('table')
const currentLang = ref('ar')
const errors     = ref({})
const toast      = ref({ show: false, message: '', type: 'success' })
const deleteModal = ref({ show: false, tag: null, loading: false })

const form = reactive({
  name_ar: '',
  name_en: '',
  slug:    '',
})

// ── Filtered ──────────────────────────────────
const filtered = computed(() => {
  if (!search.value.trim()) return tags.value
  const q = search.value.toLowerCase()
  return tags.value.filter(t =>
    t.name_ar?.includes(search.value) ||
    t.name_en?.toLowerCase().includes(q) ||
    t.slug?.toLowerCase().includes(q)
  )
})

// ── Slug ──────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().trim()
     .replace(/\s+/g, '-')
     .replace(/[^a-z0-9-]/g, '')
     .replace(/-+/g, '-').replace(/^-|-$/g, '')

const autoSlug = () => { form.slug = slugify(form.name_en) }

// ── Helpers ───────────────────────────────────
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const resetForm = () => {
  editingId.value = null
  errors.value    = {}
  form.name_ar    = ''
  form.name_en    = ''
  form.slug       = ''
}

// ── Validate ──────────────────────────────────
const validate = () => {
  errors.value = {}
  if (!form.name_ar.trim()) errors.value.name_ar = 'الاسم العربي مطلوب'
  if (!form.name_en.trim()) errors.value.name_en = 'English name is required'
  return Object.keys(errors.value).length === 0
}

// ── Fetch ─────────────────────────────────────
const fetchTags = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/admin/blog/tags')
    tags.value = data.data || data || []
  } catch {
    showToast(t('fetchError') || 'فشل التحميل', 'error')
  } finally {
    loading.value = false
  }
}

// ── Save ──────────────────────────────────────
const save = async () => {
  if (!validate()) return
  if (!form.slug.trim()) autoSlug()
  saving.value = true
  try {
    if (editingId.value) {
      await axios.put(`/admin/blog/tags/${editingId.value}`, form)
      showToast(t('tagUpdated') || 'تم تحديث الوسم')
    } else {
      await axios.post('/admin/blog/tags', form)
      showToast(t('tagAdded') || 'تم إضافة الوسم')
    }
    resetForm()
    await fetchTags()
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
const startEdit = (tag) => {
  editingId.value = tag.id
  errors.value    = {}
  form.name_ar    = tag.name_ar || ''
  form.name_en    = tag.name_en || ''
  form.slug       = tag.slug    || ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Delete ────────────────────────────────────
const confirmDelete = (tag) => {
  deleteModal.value = { show: true, tag, loading: false }
}

const doDelete = async () => {
  deleteModal.value.loading = true
  try {
    await axios.delete(`/admin/blog/tags/${deleteModal.value.tag.id}`)
    showToast(t('tagDeleted') || 'تم حذف الوسم')
    deleteModal.value.show = false
    await fetchTags()
  } catch {
    showToast(t('deleteFailed') || 'فشل الحذف', 'error')
  } finally {
    deleteModal.value.loading = false
  }
}

onMounted(fetchTags)
</script>

<style scoped>
.tags-page { padding: 1.3rem; background: #F0F0F0; min-height: 100vh; }
.tags-page.rtl { direction: rtl; }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 10px; }
.ph-left  { display: flex; align-items: flex-start; gap: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #5A6B8A; transition: all .15s; flex-shrink: 0; margin-top: 2px; }
.back-btn:hover { background: #F0F0F0; }
.ph-title { font-size: 19px; font-weight: 700; color: #0D1830; margin: 0; display: flex; align-items: center; gap: 8px; }
.ph-title i { color: #E7AE18; }
.ph-sub   { font-size: 12.5px; color: #7A8CAB; margin: 3px 0 0; }

/* Buttons */
.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 9px; background: #162FBB; color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: background .2s; }
.btn-primary:hover:not(:disabled) { background: #0F2196; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; color: #5A6B8A; cursor: pointer; font-size: 13px; text-decoration: none; transition: all .15s; }
.btn-ghost:hover { background: #F0F0F0; }
.btn-danger { display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px; border-radius: 8px; border: none; background: #dc2626; color: #fff; cursor: pointer; font-size: 13px; font-weight: 600; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: .6; cursor: not-allowed; }

/* Layout */
.main-layout { display: grid; grid-template-columns: 300px 1fr; gap: 14px; align-items: start; }

/* Form card */
.form-card { background: #fff; border-radius: 14px; border: 1px solid #D0D6E5; overflow: hidden; position: sticky; top: 1rem; }
.fc-head { display: flex; align-items: center; gap: 7px; padding: 12px 16px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; font-size: 13px; font-weight: 600; color: #0D1830; }
.fc-head i { color: #E7AE18; font-size: 16px; }
.fc-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.field-row { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 12.5px; font-weight: 600; color: #0D1830; }
.req { color: #dc2626; }
.field-input { width: 100%; padding: 8px 11px; border: 1.5px solid #D0D6E5; border-radius: 8px; font-size: 13px; color: #0D1830; background: #fff; outline: none; transition: border-color .15s; font-family: inherit; box-sizing: border-box; }
.field-input:focus { border-color: #162FBB; }
.field-error { font-size: 11.5px; color: #dc2626; }
.form-actions { display: flex; gap: 8px; justify-content: flex-end; padding-top: 4px; }

/* Slug */
.slug-wrap { display: flex; align-items: center; border: 1.5px solid #D0D6E5; border-radius: 8px; overflow: hidden; transition: border-color .15s; }
.slug-wrap:focus-within { border-color: #162FBB; }
.slug-prefix { background: #F8FAFC; padding: 8px 9px; font-size: 11px; color: #7A8CAB; border-inline-end: 1px solid #D0D6E5; white-space: nowrap; }
.slug-input  { flex: 1; border: none; padding: 8px 9px; font-size: 12.5px; color: #162FBB; outline: none; background: none; font-family: monospace; }
.slug-btn    { padding: 0 9px; border: none; background: none; cursor: pointer; color: #7A8CAB; font-size: 14px; display: flex; align-items: center; transition: color .15s; }
.slug-btn:hover { color: #162FBB; }

/* List card */
.list-card { background: #fff; border-radius: 14px; border: 1px solid #D0D6E5; overflow: hidden; }
.lc-head { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; font-size: 13px; font-weight: 600; color: #0D1830; gap: 12px; flex-wrap: wrap; }
.lc-head i { color: #E7AE18; }
.count-badge { background: rgba(231,174,24,.12); color: #C49310; font-size: 11px; padding: 1px 7px; border-radius: 20px; margin-inline-start: 6px; font-weight: 700; }
.search-wrap { display: flex; align-items: center; gap: 6px; background: #F8FAFC; border-radius: 8px; padding: 0 10px; border: 1px solid #D0D6E5; }
.search-wrap i { color: #7A8CAB; font-size: 14px; }
.search-input { border: none; background: none; outline: none; font-size: 12.5px; color: #0D1830; padding: 7px 0; width: 160px; }

/* Table */
.tags-table { width: 100%; border-collapse: collapse; }
.tags-table thead tr { background: #FAFBFE; }
.tags-table th { padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .4px; color: #7A8CAB; text-align: start; border-bottom: 1px solid #D0D6E5; }
.tags-table td { padding: 11px 14px; border-bottom: 1px solid #F0F4FA; font-size: 13px; color: #0D1830; }
.tags-table tbody tr { transition: background .15s; }
.tags-table tbody tr:hover { background: #FAFBFE; }
.tags-table tbody tr.editing { background: rgba(231,174,24,.06); }
.tags-table tbody tr:last-child td { border: none; }
.name-cell { font-weight: 500; }
.slug-pill { background: #FFFBEB; color: #C49310; padding: 2px 8px; border-radius: 6px; font-size: 11.5px; font-family: monospace; border: 1px solid rgba(231,174,24,.2); }
.posts-count { background: #E8EDF5; color: #5A6B8A; padding: 2px 8px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.action-btns { display: flex; gap: 5px; }
.act-btn { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #D0D6E5; background: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all .15s; color: #7A8CAB; }
.act-btn.edit:hover { background: rgba(22,47,187,.08); border-color: rgba(22,47,187,.25); color: #162FBB; }
.act-btn.del:hover  { background: rgba(220,38,38,.08); border-color: rgba(220,38,38,.2);  color: #dc2626; }

/* Tags cloud */
.tags-cloud { padding: 16px; display: flex; flex-wrap: wrap; gap: 8px; }
.tag-cloud-item { display: inline-flex; align-items: center; gap: 6px; background: #FFFBEB; border: 1px solid rgba(231,174,24,.25); border-radius: 20px; padding: 5px 12px; transition: all .2s; }
.tag-cloud-item:hover { border-color: #E7AE18; background: rgba(231,174,24,.1); }
.tag-cloud-item.editing { border-color: #E7AE18; background: rgba(231,174,24,.15); }
.tag-name { font-size: 13px; font-weight: 500; color: #0D1830; }
.tag-count { background: rgba(231,174,24,.2); color: #C49310; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; }
.tag-actions { display: flex; gap: 3px; margin-inline-start: 2px; }
.tag-act { width: 22px; height: 22px; border-radius: 50%; border: none; background: none; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; transition: all .15s; color: #7A8CAB; }
.tag-act.edit:hover { background: rgba(22,47,187,.1); color: #162FBB; }
.tag-act.del:hover  { background: rgba(220,38,38,.1); color: #dc2626; }

/* View toggle */
.view-toggle { display: flex; gap: 4px; padding: 10px 14px; border-top: 1px solid #F0F4FA; justify-content: flex-end; }
.view-toggle button { width: 30px; height: 30px; border-radius: 7px; border: 1px solid #D0D6E5; background: none; cursor: pointer; font-size: 14px; color: #7A8CAB; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.view-toggle button.active { background: rgba(22,47,187,.08); border-color: rgba(22,47,187,.25); color: #162FBB; }

/* Loading */
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
  .tags-page { padding: .9rem; }
}
</style>
