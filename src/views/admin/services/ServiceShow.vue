<template>
  <div class="service-show" :class="{ rtl: isRtl }">

    <!-- Header -->
    <div class="page-header mb-4">
      <button class="back-btn" @click="$router.back()">
          <i :class="`bi bi-arrow-${isRtl ? 'right' : 'left'}`"></i>
      </button>
      <div class="flex-fill">
        <h1 class="page-title mb-0">
          {{ t('ServiceDetails') || 'تفاصيل الخدمة' }}
        </h1>
      </div>
      <router-link :to="`/admin/services/${service?.id}/edit`" class="btn-edit-head">
        <i class="bi bi-pencil me-2"></i>{{ t('edit' || 'تعديل') }}
      </router-link>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="service" class="row g-4">

      <!-- Main Info -->
      <div class="col-lg-8">
        <div class="detail-card mb-4">
          <!-- Icon + Title -->
          <div class="service-hero">
            <div class="hero-icon">
              <i :class="`bi ${service.icon || 'bi-briefcase'}`"></i>
            </div>
            <div>
               <h2 class="service-title"> {{ isRtl ? service.title_ar : service.title_en }} </h2>
            </div>
          </div>

          <!-- Descriptions -->
          <div class="divider my-3"></div>
          <div class="row g-3">
            <div class="col-md-6">
              <div class="detail-label">{{ t('descAr' || 'الوصف بالعربية') }}</div>
              <p class="detail-text">
                {{ isRtl ? service.desc_service_ar : service.desc_service_ar  || '—' }}
              </p>
            </div>
            <div class="col-md-6">
              <div class="detail-label">{{ t('descEn' || 'الوصف بالإنجليزية') }}</div>
              <p class="detail-text" dir="ltr">
                {{ isRtl ? service.desc_service_en : service.desc_service_en  || '—' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Lists -->
        <div class="row g-4">
          <div class="col-md-6">
            <div class="detail-card">
              <div class="card-section-title"><i class="bi bi-list-check me-2"></i>{{ t('listAr' || 'النقاط (عربي)') }}</div>
              <ul v-if="service.list_desc_ar?.length" class="points-list" dir="rtl">
                <li v-for="(item, i) in service.list_desc_ar" :key="i">
                  <i class="bi bi-check2-circle"></i>{{ item }}
                </li>
              </ul>
              <div v-else class="empty-points">{{ t('noPoints' || 'لا توجد نقاط') }}</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="detail-card">
              <div class="card-section-title"><i class="bi bi-list-check me-2"></i>{{ t('listEn' || 'النقاط (إنجليزي)') }}</div>
              <ul v-if="service.list_desc_en?.length" class="points-list" dir="ltr">
                <li v-for="(item, i) in service.list_desc_en" :key="i">
                  <i class="bi bi-check2-circle"></i>{{ item }}
                </li>
              </ul>
              <div v-else class="empty-points">{{ t('noPoints' || 'لا توجد نقاط') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <div class="detail-card mb-4">
          <div class="card-section-title"><i class="bi bi-info-circle me-2"></i>{{ t('details' || 'معلومات') }}</div>
          <div class="detail-row">
            <span class="dr-label">{{ t('status' || 'الحالة') }}</span>
            <span class="status-badge" :class="service.is_active ? 'badge-active' : 'badge-inactive'">
              {{ service.is_active ? t('active' || 'نشط') : t('inactive' || 'غير نشط') }}
            </span>
          </div>
          <div class="detail-row">
            <span class="dr-label">{{ t('sortOrder' || 'الترتيب') }}</span>
            <span class="dr-val">{{ service.sort_order }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-label">{{ t('icon' || 'الأيقونة') }}</span>
            <span class="dr-val" style="font-family:monospace">{{ service.icon || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-label">{{ t('created' || 'تاريخ الإنشاء') }}</span>
            <span class="dr-val">{{ service.created_at }}</span>
          </div>
          <div class="detail-row">
            <span class="dr-label">{{ t('updated' || 'آخر تحديث') }}</span>
            <span class="dr-val">{{ service.updated_at }}</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="detail-card">
          <div class="card-section-title"><i class="bi bi-lightning me-2"></i>{{ t('quickActions' || 'إجراءات') }}</div>
          <button class="btn-toggle-status w-100 mb-2" :class="service.is_active ? 'btn-deactivate' : 'btn-activate'" @click="toggleActive">
            <i :class="`bi ${service.is_active ? 'bi-toggle-off' : 'bi-toggle-on'} me-2`"></i>
            {{ service.is_active ? t('deactivate' || 'إيقاف') : t('activate' || 'تفعيل') }}
          </button>
          <button class="btn-delete-action w-100" @click="showDeleteModal = true">
            <i class="bi bi-trash me-2"></i>{{ t('delete' || 'حذف') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-card">
        <div class="modal-icon danger"><i class="bi bi-exclamation-triangle"></i></div>
        <h5>{{ t('deleteConfirmTitle' || 'تأكيد الحذف') }}</h5>
        <p>{{ t('deleteConfirmMsg' || 'هل أنت متأكد من رغبتك في حذف هذا الخدمة؟') }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">{{ t('cancel' || 'إلغاء') }}</button>
          <button class="btn-danger" :disabled="deleting" @click="deleteService">
            <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
            {{ t('confirmDelete' || 'تأكيد الحذف') }}
          </button>
        </div>
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/api/axios'
import { useSettings } from '@/composables/useSettings'
const { t, isRtl, currentLang } = useSettings()



const route = useRoute()
const router = useRouter()



const service = ref(null)
const loading = ref(true)
const deleting = ref(false)
const showDeleteModal = ref(false)
const toast = ref({ show: false, type: 'success', message: '' })

const toggleActive = async () => {
  try {
    const res = await axios.patch(`/admin/services/${service.value.id}/toggle-active`)
    service.value.is_active = res.data.is_active
    showToast('success', t.value.successToggle)
  } catch {
    showToast('error', locale.value === 'ar' ? 'فشل في تغيير الحالة' : 'Failed')
  }
}

const deleteService = async () => {
  deleting.value = true
  try {
    await axios.delete(`/admin/services/${service.value.id}`)
    showToast('success', t.value.successDelete)
    setTimeout(() => router.push('/admin/services'), 1200)
  } catch {
    showToast('error', locale.value === 'ar' ? 'فشل في الحذف' : 'Failed to delete')
  } finally {
    deleting.value = false
  }
}

const showToast = (type, message) => {
  toast.value = { show: true, type, message }
  setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(async () => {
  try {
    const res = await axios.get(`/admin/services/${route.params.id}`)
    service.value = res.data.data
  } catch {
    showToast('error', isRtl.value ? 'فشل في جلب البيانات' : 'Failed to load')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.service-show { padding: 1.5rem; }
.page-header { display: flex; align-items: center; gap: 1rem; }
.back-btn {
  width: 42px; height: 42px; border-radius: 11px; border: 1.5px solid #e5e7eb;
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .2s; font-size: 1rem; flex-shrink: 0;
}
.back-btn:hover { border-color: #162FBB; color: #162FBB; }
.page-title { font-size: 1.4rem; font-weight: 700; color: #162FBB; }
.btn-edit-head {
  display: inline-flex; align-items: center; padding: .55rem 1.2rem;
  background: rgba(231,174,24,.12); color: #92700a; border-radius: 10px;
  text-decoration: none; font-weight: 600; font-size: .875rem; transition: all .2s;
}
.btn-edit-head:hover { background: rgba(231,174,24,.25); color: #92700a; }

.loading-state { display: flex; justify-content: center; padding: 4rem; color: #162FBB; }

.detail-card {
  background: #fff; border-radius: 16px; padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}
.card-section-title {
  font-size: .875rem; font-weight: 700; color: #374151;
  display: flex; align-items: center; margin-bottom: 1rem;
  padding-bottom: .65rem; border-bottom: 1.5px solid #f3f4f6;
}

.service-hero { display: flex; align-items: center; gap: 1.25rem; }
.hero-icon {
  width: 64px; height: 64px; border-radius: 16px; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(22,47,187,.1), rgba(231,174,24,.15));
  display: flex; align-items: center; justify-content: center;
  font-size: 1.75rem; color: #162FBB;
}
.hero-title-ar { font-size: 1.25rem; font-weight: 800; color: #111827; margin: 0; }
.hero-title-en { font-size: 1rem; color: #6b7280; margin: .25rem 0 0; font-weight: 500; }

.divider { height: 1px; background: #f3f4f6; }
.detail-label { font-size: .75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .35rem; }
.detail-text { font-size: .875rem; color: #374151; line-height: 1.6; }

.points-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .5rem; }
.points-list li { display: flex; align-items: flex-start; gap: .5rem; font-size: .875rem; color: #374151; }
.points-list li .bi { color: #162FBB; flex-shrink: 0; margin-top: .15rem; }
.empty-points { font-size: .85rem; color: #9ca3af; text-align: center; padding: 1rem; }

.detail-row { display: flex; align-items: center; justify-content: space-between; padding: .5rem 0; border-bottom: 1px solid #f9fafb; }
.detail-row:last-child { border-bottom: none; }
.dr-label { font-size: .8rem; color: #6b7280; }
.dr-val { font-size: .8rem; font-weight: 600; color: #374151; }

.status-badge { padding: .2rem .65rem; border-radius: 20px; font-size: .72rem; font-weight: 600; }
.badge-active { background: #dcfce7; color: #15803d; }
.badge-inactive { background: #fee2e2; color: #dc2626; }

.btn-toggle-status {
  padding: .65rem; border: none; border-radius: 10px; font-weight: 600; font-size: .875rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.btn-activate { background: rgba(22,47,187,.08); color: #162FBB; }
.btn-deactivate { background: rgba(231,174,24,.12); color: #92700a; }
.btn-delete-action {
  padding: .65rem; background: rgba(239,68,68,.08); color: #dc2626;
  border: none; border-radius: 10px; font-weight: 600; font-size: .875rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s;
}
.btn-delete-action:hover { background: rgba(239,68,68,.15); }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-card { background: #fff; border-radius: 18px; padding: 2rem; max-width: 420px; width: 90%; text-align: center; }
.modal-icon.danger { font-size: 2.5rem; color: #dc2626; margin-bottom: .75rem; }
.modal-card h5 { font-weight: 700; margin-bottom: .5rem; }
.modal-card p { color: #6b7280; margin-bottom: 1.5rem; font-size: .9rem; }
.modal-actions { display: flex; gap: .75rem; justify-content: center; }
.btn-cancel { padding: .6rem 1.5rem; background: #f3f4f6; border: none; border-radius: 9px; cursor: pointer; font-weight: 600; }
.btn-danger { padding: .6rem 1.5rem; background: #dc2626; color: #fff; border: none; border-radius: 9px; cursor: pointer; font-weight: 600; }

/* Toast */
.toast-msg { position: fixed; bottom: 2rem; inset-inline-end: 2rem; z-index: 99999; padding: .85rem 1.5rem; border-radius: 12px; font-weight: 600; font-size: .875rem; display: flex; align-items: center; box-shadow: 0 8px 30px rgba(0,0,0,.15); }
.toast-success { background: #dcfce7; color: #15803d; }
.toast-error   { background: #fee2e2; color: #dc2626; }
.toast-enter-active, .toast-leave-active { transition: all .35s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(1rem); }
</style>
