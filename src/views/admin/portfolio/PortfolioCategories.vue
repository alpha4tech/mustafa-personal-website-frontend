<template>
  <div class="portfolio-categories mt-4">

    <div class="page-header">
      <div class="header-left">
        <router-link to="/admin/portfolio" class="back-btn">
          <i class="bi bi-arrow-right"></i>
        </router-link>
        <h1 class="page-title"><i class="bi bi-tags"></i> {{ t('portfolioCategories') || 'تصنيفات المشاريع' }}</h1>
      </div>
    </div>

    <!-- Form Card -->
    <div class="form-card">
      <h3>{{ editingId ? t('editCategory') || 'تعديل الفئة' : t('addNewCategory') || 'إضافة فئة جديدة' }}</h3>
      <div class="form-grid">
        <div class="field">
          <label class="form-label">{{ t('nameAr') || 'الاسم بالعربية' }} <span class="required">*</span> </label>
          <input
            v-model="catForm.name_ar"
            class="form-input"
            :class="{ error: errors.name_ar }"
            placeholder="مثال: تسويق رقمي"
            dir="rtl"
          />
          <p v-if="errors.name_ar" class="error-msg">{{ errors.name_ar[0] }}</p>
        </div>
        <div class="field">
          <label class="form-label">{{ t('nameEn') || 'Name in English' }} <span class="required">*</span></label>
          <input
            v-model="catForm.name_en"
            class="form-input"
            :class="{ error: errors.name_en }"
            placeholder="e.g. Digital Marketing"
            dir="ltr"
          />
          <p v-if="errors.name_en" class="error-msg">{{ errors.name_en[0] }}</p>
        </div>
      </div>

      <!-- Slug preview -->
      <div v-if="slugPreview" class="slug-preview">
        <i class="bi bi-link-45deg"></i>
        slug: <code>{{ slugPreview }}</code>
      </div>

      <div class="form-actions">
        <button v-if="editingId" class="btn btn-outline" @click="cancelEdit">
          <i class="bi bi-x"></i> {{ t('cancel') || 'إلغاء' }}
        </button>
        <button class="btn btn-primary" @click="submitCat" :disabled="saving">
          <i v-if="saving" class="bi bi-arrow-repeat spin"></i>
          <i v-else-if="editingId" class="bi bi-check-lg"></i>
          <i v-else class="bi bi-plus-lg"></i>
          {{ editingId ? t('saveChanges') || 'حفظ التعديلات' : t('addNewCategory') || 'إضافة فئة جديدة' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <!-- Skeleton -->
      <template v-if="loading">
        <div v-for="n in 4" :key="n" class="skeleton-row"></div>
      </template>

      <template v-else-if="categories.length">
        <table class="cat-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{{ t('nameAr') || 'الاسم بالعربية' }}</th>
              <th>{{ t('nameEn') || 'Name in English' }}</th>
              <th>{{ t('slug') || 'Slug' }}</th>
              <th>{{ t('itemsCount') || 'عدد الأعمال' }}</th>
              <th>{{ t('actions') || 'الإجراءات' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cat in categories"
              :key="cat.id"
              :class="{ editing: editingId === cat.id }"
            >
              <td class="id-cell">{{ cat.id }}</td>
              <td>{{ cat.name_ar }}</td>
              <td dir="ltr">{{ cat.name_en }}</td>
              <td dir="ltr"><code>{{ cat.slug }}</code></td>
              <td>
                <span class="count-badge">{{ cat.items_count ?? 0 }}</span>
              </td>
              <td>
                <div class="actions">
                  <button class="action-btn edit" @click="startEdit(cat)" title="{{ t('edit') || 'تعديل' }}">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="action-btn delete" @click="confirmDelete(cat)" title="{{ t('delete') || 'حذف' }}">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <div v-else class="empty-state">
        <i class="bi bi-tags"></i>
        <p>{{ t('noCategories') || 'لا توجد فئات بعد، أضف أول فئة' }}</p>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <transition name="fade">
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal-box">
          <i class="bi bi-exclamation-triangle confirm-icon"></i>
          <h3>{{ t('deleteCategory') || 'حذف الفئة' }}</h3>
          <p>
              {{ t('confirmDeleteCategory') || 'هل تريد حذف فئة' }}  "<strong>{{ deleteTarget.name_ar }}</strong>"؟
            <br />
            <small class="warning-note">
              <i class="bi bi-info-circle"></i>
              {{ t('categoryDeleteWarning') || 'سيتم إزالة الفئة من جميع الأعمال المرتبطة بها.' }}
            </small>
          </p>
          <div class="confirm-actions">
            <button class="btn btn-outline" @click="deleteTarget = null">{{ t('cancel') || 'إلغاء' }}</button>
            <button class="btn btn-danger" @click="doDelete" :disabled="saving">
              <i v-if="saving" class="bi bi-arrow-repeat spin"></i>
              <span v-else>{{ t('delete') || 'حذف' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { usePortfolio } from '@/composables/usePortfolio'
import { useSettings } from '@/composables/useSettings'
const { t, isRtl, currentLang } = useSettings()

// import { usePortfolio } from '@/composables/usePortfolio'

const {
  categories,
  loading,
  fetchCategories,
  saveCategory,
  deleteCategory,
} = usePortfolio()

const catForm    = reactive({ name_ar: '', name_en: '' })
const editingId  = ref(null)
const saving     = ref(false)
const errors     = ref({})
const deleteTarget = ref(null)

// Slug preview من الاسم الإنجليزي
const slugPreview = computed(() =>
  catForm.name_en
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
)

async function submitCat() {
  errors.value = {}

  // Client-side validation
  if (!catForm.name_ar.trim()) {
    errors.value.name_ar = ['الاسم بالعربية مطلوب']
  }
  if (!catForm.name_en.trim()) {
    errors.value.name_en = ['Name in English is required']
  }
  if (Object.keys(errors.value).length) return

  saving.value = true
  try {
    await saveCategory({ ...catForm }, editingId.value)
    catForm.name_ar = ''
    catForm.name_en = ''
    editingId.value = null
    await fetchCategories()
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors
    }
  } finally {
    saving.value = false
  }
}

function startEdit(cat) {
  editingId.value  = cat.id
  catForm.name_ar  = cat.name_ar
  catForm.name_en  = cat.name_en
  // scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingId.value = null
  catForm.name_ar = ''
  catForm.name_en = ''
  errors.value    = {}
}

function confirmDelete(cat) {
  deleteTarget.value = cat
}

async function doDelete() {
  saving.value = true
  try {
    await deleteCategory(deleteTarget.value.id)
    deleteTarget.value = null
    await fetchCategories()
  } finally {
    saving.value = false
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.portfolio-categories { max-width: 860px; padding-bottom: 60px; }

/* Header */
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.header-left  { display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 8px; background: #fff; border: 1.5px solid #D0D6E5; display: flex; align-items: center; justify-content: center; color: #444; text-decoration: none; transition: .2s; }
.back-btn:hover { border-color: #162FBB; color: #162FBB; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #0A1870; margin: 0; display: flex; align-items: center; gap: 8px; }

/* Form card */
.form-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 20px rgba(22,47,187,.07); margin-bottom: 24px; }
.form-card h3 { margin: 0 0 18px; font-size: 1rem; color: #333; font-weight: 600; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
.field { display: flex; flex-direction: column; }
.form-label { font-size: .875rem; font-weight: 600; color: #2d3748; margin-bottom: 6px; }
.required { color: #e53e3e; }
.form-input {
  padding: 9px 12px; border: 1.5px solid #D0D6E5; border-radius: 8px;
  font-size: .875rem; outline: none; transition: .2s; background: #fafbff;
}
.form-input:focus { border-color: #162FBB; box-shadow: 0 0 0 3px rgba(22,47,187,.1); }
.form-input.error { border-color: #e53e3e; }
.error-msg { color: #e53e3e; font-size: .78rem; margin: 4px 0 0; }

/* Slug preview */
.slug-preview { margin-top: 12px; font-size: .8rem; color: #666; display: flex; align-items: center; gap: 5px; }
.slug-preview code { background: #f0f4ff; color: #162FBB; padding: 2px 8px; border-radius: 4px; }

/* Actions */
.form-actions { display: flex; gap: 10px; margin-top: 18px; justify-content: flex-end; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; border-radius: 8px; font-size: .875rem; font-weight: 600; cursor: pointer; border: none; transition: .2s; }
.btn-primary { background: #162FBB; color: #fff; }
.btn-primary:hover { background: #1228a0; }
.btn-outline { background: transparent; border: 1.5px solid #D0D6E5; color: #444; }
.btn-outline:hover { border-color: #162FBB; color: #162FBB; }
.btn-danger  { background: #e53e3e; color: #fff; }
.btn:disabled { opacity: .6; cursor: not-allowed; }

/* Table */
.table-wrap { background: #fff; border-radius: 12px; box-shadow: 0 4px 20px rgba(22,47,187,.07); overflow: hidden; }
.cat-table { width: 100%; border-collapse: collapse; }
.cat-table th { background: #F0F0F0; padding: 12px 16px; text-align: right; font-size: .8rem; color: #555; font-weight: 600; border-bottom: 1.5px solid #D0D6E5; }
.cat-table td { padding: 13px 16px; border-bottom: 1px solid #D0D6E5; font-size: .875rem; vertical-align: middle; }
.cat-table tbody tr:hover  { background: #fafbff; }
.cat-table tbody tr.editing { background: #fffbeb; }
.id-cell { color: #aaa; font-size: .8rem; }
code { background: #f0f4ff; color: #162FBB; padding: 2px 8px; border-radius: 4px; font-size: .8rem; }
.count-badge { background: #D0D6E5; color: #0A1870; padding: 2px 10px; border-radius: 12px; font-size: .78rem; font-weight: 600; }
.actions { display: flex; gap: 6px; }
.action-btn { width: 32px; height: 32px; border-radius: 7px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: .9rem; transition: .2s; }
.action-btn.edit   { background: #ebf4ff; color: #162FBB; }
.action-btn.delete { background: #fff5f5; color: #e53e3e; }
.action-btn:hover  { filter: brightness(.9); }

/* Skeleton */
.skeleton-row { height: 52px; background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size: 400% 100%; animation: shimmer 1.4s infinite; margin: 4px 16px; border-radius: 6px; }
@keyframes shimmer { to { background-position: -400% 0; } }

/* Empty */
.empty-state { padding: 50px 20px; text-align: center; color: #bbb; }
.empty-state i { font-size: 2.5rem; display: block; margin-bottom: 10px; }
.empty-state p { margin: 0; font-size: .9rem; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-box { background: #fff; border-radius: 16px; padding: 32px 28px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,.2); text-align: center; }
.confirm-icon { font-size: 3rem; color: #ed8936; display: block; margin-bottom: 12px; }
.modal-box h3 { margin: 0 0 10px; }
.modal-box p  { color: #555; line-height: 1.6; }
.warning-note { color: #888; font-size: .8rem; display: flex; align-items: center; gap: 4px; justify-content: center; margin-top: 6px; }
.confirm-actions { display: flex; gap: 10px; justify-content: center; margin-top: 22px; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

/* Spin */
@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin .8s linear infinite; display: inline-block; }
</style>

