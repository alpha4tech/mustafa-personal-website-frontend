<template>
  <div class="service-form" :class="{ rtl: isRtl }">

    <!-- Header -->
    <div class="page-header mb-4">
      <button class="back-btn" @click="$router.back()">
        <i :class="`bi bi-arrow-${isRtl ? 'right' : 'left'}`"></i>
      </button>
      <div>
          <h1 class="page-title"> {{isEdit ? t('editTitle') || 'تعديل خدمة' : t('createTitle') || 'اضافة خدمة' }}</h1>
          <p class="page-subtitle mb-0">{{ isEdit ? t('editSub') || 'تعديل خدمة' : t('createSub') || 'اضافة خدمة جديدة' }}</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="row g-4">

        <!-- Left / Main -->
        <div class="col-lg-8">

          <!-- Titles -->
          <div class="form-card mb-4">
            <div class="card-section-title">
              <i class="bi bi-translate me-2"></i>{{ t('titles') || 'عناوين الخدمة' }}
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="field-label">{{ t('titleAr') || 'العنوان بالعربية' }} <span class="req">*</span></label>
                <input v-model="form.title_ar" type="text" class="field-input" :class="{ error: errors.title_ar }" :placeholder="t('titleArPh') || 'أدخل العنوان بالعربية'"/>
                <span v-if="errors.title_ar" class="error-msg">{{ errors.title_ar }}</span>
              </div>
              <div class="col-md-6">
                <label class="field-label">{{ t('titleEn') || 'العنوان بالإنجليزية' }} <span class="req">*</span></label>
                <input v-model="form.title_en" type="text" class="field-input" :class="{ error: errors.title_en }" :placeholder="t('titleEnPh') || 'أدخل العنوان بالإنجليزية'" dir="ltr" />
                <span v-if="errors.title_en" class="error-msg">{{ errors.title_en }}</span>
              </div>
            </div>
          </div>

          <!-- Descriptions -->
          <div class="form-card mb-4">
            <div class="card-section-title">
              <i class="bi bi-card-text me-2"></i>{{ t('descriptions') || 'وصف الخدمة' }}
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="field-label">{{ t('descAr') || 'الوصف بالعربية' }}</label>
                <textarea v-model="form.desc_service_ar" class="field-textarea" :placeholder="t('descArPh') || 'أدخل الوصف بالعربية'" dir="rtl" rows="4"></textarea>
              </div>
              <div class="col-md-6">
                <label class="field-label">{{ t('descEn') || 'الوصف بالإنجليزية' }}</label>
                <textarea v-model="form.desc_service_en" class="field-textarea" :placeholder="t('descEnPh') || 'أدخل الوصف بالإنجليزية'" dir="ltr" rows="4"></textarea>
              </div>
            </div>
          </div>

          <!-- List Items AR -->
          <div class="form-card mb-4">
            <div class="card-section-title">
              <i class="bi bi-list-check me-2"></i>{{ t('listAr') || 'عناصر القائمة بالعربية' }}
              <button type="button" class="btn-add-item ms-auto" @click="addListItem('ar')">
                <i class="bi bi-plus-circle me-1"></i>{{ t('addItem') || 'إضافة عنصر' }}
              </button>
            </div>
            <div v-for="(item, idx) in form.list_desc_ar" :key="`ar-${idx}`" class="list-item-row">
              <span class="item-num">{{ idx + 1 }}</span>
              <input v-model="form.list_desc_ar[idx]" type="text" class="field-input flex-fill" :placeholder="`${t('itemArPh') || 'أدخل عنصر القائمة'} ${idx + 1}`" dir="rtl" />
              <button type="button" class="btn-remove-item" @click="removeListItem('ar', idx)">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
            <div v-if="!form.list_desc_ar.length" class="empty-list-hint">
              <i class="bi bi-info-circle me-2"></i>{{ t('emptyList') || 'القائمة فارغة' }}
            </div>
          </div>

          <!-- List Items EN -->
          <div class="form-card mb-4">
            <div class="card-section-title">
              <i class="bi bi-list-check me-2"></i>{{ t('listEn') || 'عناصر القائمة بالإنجليزية' }}
              <button type="button" class="btn-add-item ms-auto" @click="addListItem('en')">
                <i class="bi bi-plus-circle me-1"></i>{{ t('addItem') || 'إضافة عنصر' }}
              </button>
            </div>
            <div v-for="(item, idx) in form.list_desc_en" :key="`en-${idx}`" class="list-item-row">
              <span class="item-num">{{ idx + 1 }}</span>
              <input v-model="form.list_desc_en[idx]" type="text" class="field-input flex-fill" :placeholder="`${t('itemEnPh') || 'أدخل عنصر القائمة'} ${idx + 1}`" dir="ltr" />
              <button type="button" class="btn-remove-item" @click="removeListItem('en', idx)">
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
            <div v-if="!form.list_desc_en.length" class="empty-list-hint">
              <i class="bi bi-info-circle me-2"></i>{{ t('emptyList') || 'القائمة فارغة' }}
            </div>
          </div>

        </div>

        <!-- Right / Sidebar -->
        <div class="col-lg-4">

          <!-- Actions -->
          <div class="form-card mb-4">
            <div class="card-section-title"><i class="bi bi-gear me-2"></i>{{ t('actions') || 'الإجراءات' }}</div>
            <button type="submit" class="btn-submit w-100 mb-2" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-check-lg me-2"></i>
              {{ submitting ? t('saving') || 'جاري الحفظ' : t('save') || 'حفظ' }}
            </button>
            <button type="button" class="btn-secondary-action w-100" @click="$router.back()">
              <i class="bi bi-x me-2"></i>{{ t('cancel') || 'إلغاء' }}
            </button>
          </div>

          <!-- Icon -->
          <div class="form-card mb-4">
            <div class="card-section-title"><i class="bi bi-emoji-smile me-2"></i>{{ t('icon') || 'الأيقونة' }}</div>
            <div class="icon-preview-wrap mb-3">
              <div class="icon-preview">
                <i :class="`bi ${form.icon || 'bi-briefcase'}`"></i>
              </div>
              <span class="icon-name-preview">{{ form.icon || 'bi-briefcase' }}</span>
            </div>
            <input v-model="form.icon" type="text" class="field-input" :placeholder="t('iconPh') || 'أدخل اسم الأيقونة'" />
            <p class="field-hint mt-2"><i class="bi bi-info-circle me-1"></i>{{ t('iconHint') || 'أدخل اسم الأيقونة' }}</p>
            <!-- Quick icons -->
            <div class="quick-icons mt-3">
              <button
                v-for="ic in quickIcons" :key="ic"
                type="button"
                class="quick-icon-btn"
                :class="{ active: form.icon === ic }"
                @click="form.icon = ic"
                :title="ic"
              >
                <i :class="`bi ${ic}`"></i>
              </button>
            </div>
          </div>

          <!-- Settings -->
          <div class="form-card mb-4">
            <div class="card-section-title"><i class="bi bi-sliders me-2"></i>{{ t('settings') || 'الإعدادات' }}</div>
            <div class="setting-row">
              <div>
                <div class="setting-label">{{ t('sortOrder') || 'ترتيب الفرز' }}</div>
                <div class="setting-hint">{{ t('sortOrderHint') || 'أدخل ترتيب الفرز' }}</div>
              </div>
              <input v-model.number="form.sort_order" type="number" min="0" class="field-input setting-input" />
            </div>
            <div class="setting-row mt-3">
              <div>
                <div class="setting-label">{{ t('isActive') || 'نشط' }}</div>
                <div class="setting-hint">{{ t('isActiveHint') || 'حدد ما إذا كان الخدمة نشطة' }}</div>
              </div>
              <label class="toggle-switch">
                <input v-model="form.is_active" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </form>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="toast.show" :class="`toast-msg toast-${toast.type}`">
        <i :class="`bi ${toast.type === 'success' ? 'bi-check-circle' : 'bi-x-circle'} me-2`"></i>
        {{ toast.message }}
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/api/axios'
import { useSettings } from '@/composables/useSettings'
const { t, isRtl, currentLang } = useSettings()



const props = defineProps({
  serviceId: { type: [String, Number], default: null },
})

const router = useRouter()
const isEdit = computed(() => !!props.serviceId)

const quickIcons = [
  'bi-megaphone','bi-instagram', 'bi-linkedin',
  'bi-palette', 'bi-brush', 'bi-camera-video',
  'bi-chat-dots', 'bi-people','bi-search',
  'bi-google', 'bi-graph-up-arrow', 'bi-bar-chart-line',
  'bi-bullseye','bi-globe','bi-lightbulb','bi-rocket-takeoff',
  'bi-award',
  'bi-briefcase', 'bi-megaphone', 'bi-graph-up', 'bi-palette', 'bi-camera',
  'bi-code-slash', 'bi-globe', 'bi-envelope', 'bi-phone', 'bi-stars',
  'bi-search', 'bi-bar-chart', 'bi-people', 'bi-shield-check', 'bi-rocket',
  'bi-lightbulb', 'bi-trophy', 'bi-chat-dots', 'bi-film', 'bi-instagram',

]

const form = ref({
  title_ar: '', title_en: '',
  desc_service_ar: '', desc_service_en: '',
  list_desc_ar: [], list_desc_en: [],
  icon: 'bi-briefcase',
  sort_order: 0,
  is_active: true,
})

const errors = ref({})
const submitting = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })

const addListItem = (lang) => {
  if (lang === 'ar') form.value.list_desc_ar.push('')
  else form.value.list_desc_en.push('')
}

const removeListItem = (lang, idx) => {
  if (lang === 'ar') form.value.list_desc_ar.splice(idx, 1)
  else form.value.list_desc_en.splice(idx, 1)
}

const validate = () => {
  errors.value = {}

  if (!form.value.title_ar.trim())
    errors.value.title_ar =
      isRtl.value
        ? 'العنوان مطلوب'
        : 'Arabic title is required'

  if (!form.value.title_en.trim())
    errors.value.title_en =
      isRtl.value
        ? 'العنوان الإنجليزي مطلوب'
        : 'English title is required'

  return !Object.keys(errors.value).length
}

const handleSubmit = async () => {
  if (!validate()) return
  submitting.value = true
    try {
    const payload = {
      ...form.value,
      list_desc_ar: form.value.list_desc_ar.filter(i => i.trim() !== ''),
      list_desc_en: form.value.list_desc_en.filter(i => i.trim() !== ''),
    }
    if (isEdit.value) {
      await axios.put(`/admin/services/${props.serviceId}`, payload)
      showToast('success', t('successUpdate') || 'تم تحديث الخدمة بنجاح')
    } else {
      await axios.post('/admin/services', payload)
      showToast('success', t('successCreate') || 'تم إنشاء الخدمة بنجاح')
    }
    setTimeout(() => router.push('/admin/services'), 1200)
  } catch (err) {
    const serverErrors = err.response?.data?.errors
    if (serverErrors) {
      errors.value = Object.fromEntries(
        Object.entries(serverErrors).map(([k, v]) => [k, v[0]])
      )
    } else {
      showToast('error', t('errorSave') || 'حدث خطأ أثناء الحفظ')
    }
  } finally {
    submitting.value = false
  }
}
const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3500)
}
onMounted(async () => {
  if (isEdit.value) {
    try {

      const res = await axios.get(`/admin/services/${props.serviceId}`)
      const d = res.data.data

      form.value = {
        title_ar: d.title_ar || '',
        title_en: d.title_en || '',
        desc_service_ar: d.desc_service_ar || '',
        desc_service_en: d.desc_service_en || '',
        list_desc_ar: Array.isArray(d.list_desc_ar) ? d.list_desc_ar : [],
        list_desc_en: Array.isArray(d.list_desc_en) ? d.list_desc_en : [],
        icon: d.icon || 'bi-briefcase',
        sort_order: d.sort_order || 0,
        is_active: d.is_active ?? true,
      }
    } catch (err) {
      console.error(err.response?.data)
      showToast('error', t('errorLoad') || 'حدث خطأ أثناء تحميل البيانات')
    }
  }
})

</script>

<style scoped>
.service-form { padding: 1.5rem; }

/* Header */
.page-header { display: flex; align-items: center; gap: 1rem; }
.back-btn {
  width: 42px; height: 42px; border-radius: 11px; border: 1.5px solid #e5e7eb;
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; font-size: 1rem; flex-shrink: 0;
}
.back-btn:hover { border-color: #162FBB; color: #162FBB; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #162FBB; }
.page-subtitle { font-size: .85rem; color: #6b7280; }

/* Form Card */
.form-card {
  background: #fff; border-radius: 16px; padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}
.card-section-title {
  font-size: .875rem; font-weight: 700; color: #374151;
  display: flex; align-items: center; margin-bottom: 1.25rem;
  padding-bottom: .75rem; border-bottom: 1.5px solid #f3f4f6;
}

/* Fields */
.field-label { display: block; font-size: .8rem; font-weight: 600; color: #374151; margin-bottom: .4rem; }
.req { color: #ef4444; }
.field-input {
  width: 100%; padding: .65rem .9rem; border: 1.5px solid #e5e7eb;
  border-radius: 10px; font-size: .875rem; outline: none; transition: border .2s;
  background: #fafafa;
}
.field-input:focus { border-color: #162FBB; background: #fff; }
.field-input.error { border-color: #ef4444; }
.field-textarea {
  width: 100%; padding: .65rem .9rem; border: 1.5px solid #e5e7eb;
  border-radius: 10px; font-size: .875rem; outline: none; resize: vertical;
  transition: border .2s; background: #fafafa; min-height: 100px;
}
.field-textarea:focus { border-color: #162FBB; background: #fff; }
.error-msg { font-size: .75rem; color: #ef4444; margin-top: .25rem; display: block; }
.field-hint { font-size: .75rem; color: #9ca3af; }

/* List Items */
.list-item-row { display: flex; align-items: center; gap: .65rem; margin-bottom: .65rem; }
.item-num {
  width: 26px; height: 26px; border-radius: 50%; background: #162FBB; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: .72rem;
  font-weight: 700; flex-shrink: 0;
}
.btn-add-item {
  display: flex; align-items: center; padding: .3rem .85rem;
  background: rgba(22,47,187,.08); color: #162FBB; border: none;
  border-radius: 8px; font-size: .8rem; cursor: pointer; font-weight: 600;
  transition: all .2s;
}
.btn-add-item:hover { background: rgba(22,47,187,.15); }
.btn-remove-item {
  background: none; border: none; color: #ef4444; cursor: pointer;
  font-size: 1rem; padding: .25rem; flex-shrink: 0; transition: color .2s;
}
.btn-remove-item:hover { color: #b91c1c; }
.empty-list-hint { font-size: .8rem; color: #9ca3af; padding: .75rem; text-align: center; background: #f9fafb; border-radius: 9px; }

/* Icon */
.icon-preview-wrap { display: flex; align-items: center; gap: 1rem; }
.icon-preview {
  width: 60px; height: 60px; border-radius: 15px;
  background: linear-gradient(135deg, rgba(22,47,187,.1), rgba(231,174,24,.15));
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem; color: #162FBB; flex-shrink: 0;
}
.icon-name-preview { font-size: .8rem; color: #6b7280; font-family: monospace; }
.quick-icons { display: flex; flex-wrap: wrap; gap: .4rem; }
.quick-icon-btn {
  width: 36px; height: 36px; border-radius: 9px; border: 1.5px solid #e5e7eb;
  background: #f9fafb; cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: .95rem; transition: all .2s; color: #374151;
}
.quick-icon-btn:hover, .quick-icon-btn.active { border-color: #162FBB; background: rgba(22,47,187,.08); color: #162FBB; }

/* Settings */
.setting-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.setting-label { font-size: .875rem; font-weight: 600; color: #374151; }
.setting-hint { font-size: .75rem; color: #9ca3af; }
.setting-input { width: 80px; text-align: center; }

/* Toggle */
.toggle-switch { position: relative; display: inline-block; width: 48px; height: 26px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; inset: 0; background: #d1d5db; border-radius: 26px; cursor: pointer; transition: .3s;
}
.toggle-slider::before {
  content: ''; position: absolute; height: 20px; width: 20px; left: 3px; bottom: 3px;
  background: white; border-radius: 50%; transition: .3s;
}
.toggle-switch input:checked + .toggle-slider { background: #162FBB; }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(22px); }

/* Submit */
.btn-submit {
  padding: .75rem; background: linear-gradient(135deg, #162FBB, #0A1870);
  color: #fff; border: none; border-radius: 10px; font-weight: 700;
  font-size: .9rem; cursor: pointer; transition: all .2s;
  display: flex; align-items: center; justify-content: center;
}
.btn-submit:hover:not(:disabled) { box-shadow: 0 4px 15px rgba(22,47,187,.4); }
.btn-submit:disabled { opacity: .7; cursor: not-allowed; }
.btn-secondary-action {
  padding: .65rem; background: #f3f4f6; border: 1.5px solid #e5e7eb;
  border-radius: 10px; font-weight: 600; font-size: .875rem; cursor: pointer; transition: all .2s;
  display: flex; align-items: center; justify-content: center; color: #374151;
}
.btn-secondary-action:hover { background: #e5e7eb; }

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
</style>F
