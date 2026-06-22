<template>
  <div class="blog-show-page" :class="{ rtl: isRtl }">

    <!-- ── Header ── -->
    <div class="page-header">
      <div class="ph-left">
        <button class="back-btn" @click="$router.back()">
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
        <div>
          <h1 class="ph-title">{{ t('postDetails') || 'تفاصيل المقال' }}</h1>
          <p class="ph-sub">{{ t('readOnly') || 'عرض المقال — للتعديل اضغط تعديل' }}</p>
        </div>
      </div>
      <div class="ph-actions">
        <a :href="'/blog/' + post.slug" target="_blank" class="btn-ghost">
          <i class="bi bi-external-link" aria-hidden="true"></i>
          {{ t('viewOnSite') || 'عرض في الموقع' }}
        </a>
        <router-link :to="{ name: 'admin.blog.edit', params: { id: post.id } }" class="btn-primary">
          <i class="bi bi-edit" aria-hidden="true"></i>
          {{ t('edit') || 'تعديل' }}
        </router-link>
        <button class="btn-danger-outline" @click="confirmDelete">
          <i class="bi bi-trash" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <!-- ── Loading ── -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-layout">
        <div class="sk-main">
          <div class="sk-thumb"></div>
          <div class="sk-card">
            <div class="sk-line w60"></div>
            <div class="sk-line w40"></div>
            <div class="sk-line w80"></div>
            <div class="sk-line w100"></div>
            <div class="sk-line w90"></div>
          </div>
        </div>
        <div class="sk-side">
          <div class="sk-card" v-for="i in 3" :key="i" style="height:120px"></div>
        </div>
      </div>
    </div>

    <template v-else>

      <!-- ── Language Tabs ── -->
      <div class="lang-switch">
        <button :class="['ls-btn', { active: viewLang === 'ar' }]" @click="viewLang = 'ar'">
          <i class="bi bi-language" aria-hidden="true"></i> العربية
        </button>
        <button :class="['ls-btn', { active: viewLang === 'en' }]" @click="viewLang = 'en'">
          <i class="bi bi-language" aria-hidden="true"></i> English
        </button>
      </div>

      <!-- ── Meta bar ── -->
      <div class="meta-bar">
        <span :class="['status-pill', 'sp-' + post.status]">
          {{ t(post.status) || post.status }}
        </span>
        <div class="meta-items">
          <div class="meta-item">
            <i class="bi bi-eye" aria-hidden="true"></i>
            <span>{{ formatNumber(post.views_count || 0) }}</span>
          </div>
          <div class="meta-item">
            <i class="bi bi-calendar" aria-hidden="true"></i>
            <span>{{ formatDate(post.published_at || post.created_at) }}</span>
          </div>
          <div v-if="post.read_time" class="meta-item">
            <i class="bi bi-clock" aria-hidden="true"></i>
            <span>{{ post.read_time }} {{ t('min') || 'د' }}</span>
          </div>
        </div>
        <span v-if="post.is_featured" class="featured-badge">
          <i class="bi bi-star-filled" aria-hidden="true"></i>
          {{ t('featured') || 'مميز' }}
        </span>
      </div>

      <!-- ── Main layout ── -->
      <div class="show-layout">

        <!-- ── Content ── -->
        <div class="show-main">

          <!-- Thumbnail -->
          <div v-if="post.featured_image || post.thumbnail" class="show-thumbnail">
            <img :src="post.featured_image || post.thumbnail" :alt="postTitle" />
          </div>

          <div class="show-content-card">
            <!-- Category + Tags -->
            <div class="ct-row">
              <span v-if="postCategory" class="cat-pill">
                <i class="bi bi-folder" aria-hidden="true"></i>
                {{ postCategory }}
              </span>
              <span v-for="tag in postTags" :key="tag.id" class="tag-pill">
                # {{ viewLang === 'ar' ? tag.name_ar : tag.name_en }}
              </span>
            </div>

            <!-- Title -->
            <h1 class="show-title">{{ postTitle }}</h1>

            <!-- Slug -->
            <div class="show-slug">
              <i class="bi bi-link" aria-hidden="true"></i>
              /blog/{{ post.slug }}
            </div>

            <!-- Excerpt -->
            <div v-if="postExcerpt" class="show-excerpt">{{ postExcerpt }}</div>

            <div class="content-divider"></div>

            <!-- Body -->
            <div class="show-body" v-html="postContent"></div>
          </div>
        </div>

        <!-- ── Sidebar ── -->
        <div class="show-sidebar">

          <!-- Quick Actions -->
          <div class="info-card">
            <div class="ic-head">
              <i class="bi bi-bolt" aria-hidden="true"></i>
              {{ t('quickActions') || 'إجراءات سريعة' }}
            </div>
            <div class="ic-body quick-actions">
              <router-link :to="{ name: 'admin.blog.edit', params: { id: post.id } }" class="qa-item blue">
                <i class="bi bi-pencil" aria-hidden="true"></i>
                {{ t('edit') || 'تعديل المقال' }}
              </router-link>
              <button
                class="qa-item"
                :class="post.status === 'published' ? 'amber' : 'green'"
                @click="toggleStatus"
              >
                <i :class="post.status === 'published' ? 'bi bi-eye-of' : 'bi bi-world-upload'" aria-hidden="true"></i>
                {{ post.status === 'published' ? (t('unpublish') || 'إلغاء النشر') : (t('publish') || 'نشر') }}
              </button>
              <button class="qa-item red" @click="confirmDelete">
                <i class="bi bi-trash" aria-hidden="true"></i>
                {{ t('delete') || 'حذف المقال' }}
              </button>
            </div>
          </div>

          <!-- Post Info -->
          <div class="info-card">
            <div class="ic-head">
              <i class="bi bi-info-circle" aria-hidden="true"></i>
              {{ t('postInfo') || 'معلومات المقال' }}
            </div>
            <div class="ic-body">
              <div class="info-row">
                <span class="ir-label">{{ t('status') || 'الحالة' }}</span>
                <span :class="['status-pill', 'sp-' + post.status]">{{ t(post.status) || post.status }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">{{ t('views') || 'المشاهدات' }}</span>
                <span class="ir-val blue-val">{{ formatNumber(post.views_count || 0) }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">{{ t('createdAt') || 'تاريخ الإنشاء' }}</span>
                <span class="ir-val">{{ formatDate(post.created_at) }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">{{ t('updatedAt') || 'آخر تحديث' }}</span>
                <span class="ir-val">{{ formatDate(post.updated_at) }}</span>
              </div>
              <div v-if="post.published_at" class="info-row">
                <span class="ir-label">{{ t('publishedAt') || 'تاريخ النشر' }}</span>
                <span class="ir-val">{{ formatDate(post.published_at) }}</span>
              </div>
              <div class="info-row">
                <span class="ir-label">{{ t('comments') || 'التعليقات' }}</span>
                <span class="ir-val">{{ post.allow_comments ? '✅' : '🚫' }}</span>
              </div>
            </div>
          </div>

          <!-- SEO Card -->
          <div class="info-card">
            <div class="ic-head">
              <i class="bi bi-search" aria-hidden="true"></i>
              SEO
            </div>
            <div class="ic-body">
              <div class="serp-preview">
                <div class="serp-url">mustafa.com/blog/{{ post.slug }}</div>
                <div class="serp-title">
                  {{ viewLang === 'ar'
                    ? (post.seo_title_ar || postTitle)
                    : (post.seo_title_en || postTitle) }}
                </div>
                <div class="serp-desc">
                  {{ viewLang === 'ar'
                    ? (post.seo_description_ar || postExcerpt)
                    : (post.seo_description_en || postExcerpt) }}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </template>

    <!-- ── Delete Modal ── -->
    <Transition name="modal">
      <div v-if="deleteModal" class="modal-wrap" @click.self="deleteModal = false">
        <div class="modal-box">
          <div class="modal-head danger-head">
            <i class="bi bi-alert-triangle" aria-hidden="true"></i>
            {{ t('confirmDelete') || 'تأكيد الحذف' }}
          </div>
          <div class="modal-body">
            <p>{{ t('deletePostConfirm') || 'هل أنت متأكد من حذف هذا المقال؟' }}</p>
            <p class="delete-target">"{{ postTitle }}"</p>
            <p class="delete-warning">{{ t('cannotUndo') || 'لا يمكن التراجع عن هذا الإجراء.' }}</p>
          </div>
          <div class="modal-foot">
            <button class="btn-ghost" @click="deleteModal = false">{{ t('cancel') || 'إلغاء' }}</button>
            <button class="btn-danger" :disabled="deleting" @click="doDelete">
              <span v-if="deleting" class="spin-xs"></span>
              <i v-else class="i i-trash" aria-hidden="true"></i>
              {{ t('delete') || 'حذف' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Toast ── -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="'toast-' + toast.type" role="alert">
        <i :class="toast.type === 'success' ? 'bi bi-circle-check' : 'bi bi-circle-x'" aria-hidden="true"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter }      from 'vue-router'
import { useSettings }              from '@/composables/useSettings'
import axios from '@/api/axios'

const route  = useRoute()
const router = useRouter()
const { t, isRtl } = useSettings()

const loading     = ref(true)
const deleting    = ref(false)
const deleteModal = ref(false)
const post        = ref({})
const toast       = ref({ show: false, message: '', type: 'success' })
const viewLang    = ref('ar')

// ── Bilingual helpers ──────────────────────────
const postTitle = computed(() =>
  viewLang.value === 'ar'
    ? (post.value.title_ar   || post.value.title_en   || '')
    : (post.value.title_en   || post.value.title_ar   || '')
)
const postExcerpt = computed(() =>
  viewLang.value === 'ar'
    ? (post.value.excerpt_ar || post.value.excerpt_en || '')
    : (post.value.excerpt_en || post.value.excerpt_ar || '')
)
const postContent = computed(() =>
  viewLang.value === 'ar'
    ? (post.value.content_ar || post.value.content_en || '')
    : (post.value.content_en || post.value.content_ar || '')
)
const postCategory = computed(() => {
  // categories array من الـ Resource
  if (Array.isArray(post.value.categories) && post.value.categories.length) {
    const c = post.value.categories[0]
    return viewLang.value === 'ar' ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar)
  }
  // category object مفرد
  if (post.value.category && typeof post.value.category === 'object') {
    const c = post.value.category
    return viewLang.value === 'ar' ? (c.name_ar || c.name_en) : (c.name_en || c.name_ar)
  }
  return ''
})
const postTags = computed(() => post.value.tags || [])

// ── Helpers ───────────────────────────────────
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

// ── Fetch ─────────────────────────────────────
const fetchPost = async () => {
  loading.value = true
  try {
    const { data } = await axios.get(`/admin/blog/${route.params.id}`)
    // adminShow يرجع البيانات مباشرة (JsonResource بدون wrapper)
    post.value = data.data ?? data
  } catch {
    showToast(t('fetchError') || 'فشل التحميل', 'error')
  } finally {
    loading.value = false
  }
}

// ── Toggle status ─────────────────────────────
const toggleStatus = async () => {
  try {
    await axios.patch(`/admin/blog/${post.value.id}/toggle`)
    post.value.status = post.value.status === 'published' ? 'draft' : 'published'
    showToast(t('statusUpdated') || 'تم تحديث الحالة', 'success')
  } catch {
    showToast(t('updateFailed') || 'فشل التحديث', 'error')
  }
}

// ── Delete ────────────────────────────────────
const confirmDelete = () => { deleteModal.value = true }
const doDelete = async () => {
  deleting.value = true
  try {
    await axios.delete(`/admin/blog/${post.value.id}`)
    showToast(t('postDeleted') || 'تم الحذف', 'success')
    setTimeout(() => router.push({ name: 'admin.blog' }), 1000)
  } catch {
    showToast(t('deleteFailed') || 'فشل الحذف', 'error')
  } finally {
    deleting.value = false }
}

onMounted(fetchPost)
</script>

<style scoped>
.blog-show-page { padding: 1.3rem; background: #F0F0F0; min-height: 100vh; }
.blog-show-page.rtl { direction: rtl; }

/* Header */
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 12px; }
.ph-left  { display: flex; align-items: flex-start; gap: 12px; }
.back-btn { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #5A6B8A; transition: all .15s; flex-shrink: 0; margin-top: 2px; }
.back-btn:hover { background: #F0F0F0; }
.ph-title { font-size: 19px; font-weight: 700; color: #0D1830; margin: 0; }
.ph-sub   { font-size: 12.5px; color: #7A8CAB; margin: 3px 0 0; }
.ph-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }

/* Buttons */
.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 9px; background: #162FBB; color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600; text-decoration: none; transition: background .2s; }
.btn-primary:hover { background: #0F2196; }
.btn-ghost { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; color: #5A6B8A; cursor: pointer; font-size: 13px; text-decoration: none; transition: all .15s; }
.btn-ghost:hover { background: #F0F0F0; }
.btn-danger-outline { width: 36px; height: 36px; border-radius: 9px; border: 1px solid rgba(220,38,38,.25); background: rgba(220,38,38,.05); color: #dc2626; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px; transition: all .15s; }
.btn-danger-outline:hover { background: rgba(220,38,38,.12); }

/* Language switch */
.lang-switch { display: flex; gap: 6px; margin-bottom: 10px; }
.ls-btn { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 8px; border: 1px solid #D0D6E5; background: #fff; color: #5A6B8A; cursor: pointer; font-size: 12.5px; font-weight: 600; transition: all .15s; }
.ls-btn:hover { background: #F0F4FF; }
.ls-btn.active { background: #162FBB; color: #fff; border-color: #162FBB; }

/* Meta bar */
.meta-bar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; background: #fff; border: 1px solid #D0D6E5; border-radius: 10px; padding: 9px 14px; margin-bottom: 12px; }
.meta-items { display: flex; gap: 14px; flex-wrap: wrap; }
.meta-item { display: flex; align-items: center; gap: 4px; font-size: 12.5px; color: #5A6B8A; }
.meta-item i { font-size: 14px; }
.featured-badge { display: flex; align-items: center; gap: 4px; background: rgba(231,174,24,.12); color: #C49310; padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; margin-inline-start: auto; }

/* Status pills */
.status-pill { padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
.sp-published { background: #dcfce7; color: #15803d; }
.sp-draft     { background: #f1f5f9; color: #64748b; }
.sp-scheduled { background: rgba(231,174,24,.12); color: #C49310; }

/* Layout */
.show-layout { display: grid; grid-template-columns: 1fr 270px; gap: 12px; align-items: start; }
.show-main   { display: flex; flex-direction: column; gap: 10px; }

/* Thumbnail */
.show-thumbnail { border-radius: 12px; overflow: hidden; aspect-ratio: 16/6; background: #E8EDF5; }
.show-thumbnail img { width: 100%; height: 100%; object-fit: cover; }

/* Content card */
.show-content-card { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; padding: 24px 28px; }
.ct-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; align-items: center; }
.cat-pill { display: inline-flex; align-items: center; gap: 4px; background: rgba(22,47,187,.08); color: #162FBB; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.tag-pill { background: #F8FAFC; color: #5A6B8A; padding: 3px 9px; border-radius: 20px; font-size: 11.5px; border: 1px solid #D0D6E5; }
.show-title  { font-size: 22px; font-weight: 700; color: #0D1830; line-height: 1.4; margin: 0 0 8px; }
.show-slug   { font-size: 12px; color: #7A8CAB; display: flex; align-items: center; gap: 4px; margin-bottom: 14px; font-family: monospace; }
.show-excerpt { font-size: 14px; color: #5A6B8A; line-height: 1.6; padding: 12px 14px; background: #F8FAFC; border-radius: 8px; border-inline-start: 3px solid #162FBB; margin-bottom: 14px; }
.content-divider { height: 1px; background: #F0F4FA; margin: 16px 0; }
.show-body { font-size: 14.5px; line-height: 1.85; color: #0D1830; }
.show-body :deep(h2) { font-size: 18px; font-weight: 700; margin: 1.4rem 0 .6rem; }
.show-body :deep(h3) { font-size: 15px; font-weight: 600; margin: 1.1rem 0 .5rem; }
.show-body :deep(p)  { margin: 0 0 1rem; }
.show-body :deep(a)  { color: #162FBB; }
.show-body :deep(ul), .show-body :deep(ol) { padding-inline-start: 1.5rem; margin: 0 0 1rem; }
.show-body :deep(blockquote) { border-inline-start: 3px solid #162FBB; margin: 1rem 0; padding: .6rem 1rem; background: #F0F4FF; border-radius: 0 8px 8px 0; color: #3A4A6B; }

/* Sidebar */
.show-sidebar { display: flex; flex-direction: column; gap: 10px; }
.info-card { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; overflow: hidden; }
.ic-head { display: flex; align-items: center; gap: 7px; padding: 10px 14px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; font-size: 13px; font-weight: 600; color: #0D1830; }
.ic-head i { color: #162FBB; font-size: 15px; }
.ic-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }

.info-row { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #F0F4FA; }
.info-row:last-child { border: none; }
.ir-label { font-size: 12px; color: #7A8CAB; }
.ir-val   { font-size: 12.5px; font-weight: 500; color: #0D1830; }
.ir-val.blue-val { color: #162FBB; font-weight: 700; }

/* Quick actions */
.quick-actions { gap: 6px !important; }
.qa-item { display: flex; align-items: center; gap: 7px; padding: 9px 12px; border-radius: 9px; border: 1px solid #D0D6E5; background: none; cursor: pointer; font-size: 13px; color: #0D1830; text-decoration: none; transition: all .15s; width: 100%; font-family: inherit; }
.qa-item.blue  { background: rgba(22,47,187,.06);  border-color: rgba(22,47,187,.2);  color: #162FBB; }
.qa-item.green { background: rgba(16,185,129,.06); border-color: rgba(16,185,129,.2); color: #059669; }
.qa-item.amber { background: rgba(217,119,6,.06);  border-color: rgba(217,119,6,.2);  color: #d97706; }
.qa-item.red   { background: rgba(220,38,38,.05);  border-color: rgba(220,38,38,.18); color: #dc2626; }
.qa-item:hover { filter: brightness(.94); }

/* SEO */
.serp-preview { background: #F8FAFC; border-radius: 8px; padding: 10px 12px; border: 1px solid #E8EDF5; }
.serp-url   { font-size: 11px; color: #059669; margin-bottom: 3px; }
.serp-title { font-size: 14px; color: #162FBB; font-weight: 500; margin-bottom: 4px; line-height: 1.3; }
.serp-desc  { font-size: 12px; color: #5A6B8A; line-height: 1.5; }

/* Skeleton loading */
.skeleton-layout { display: grid; grid-template-columns: 1fr 270px; gap: 12px; }
.sk-main { display: flex; flex-direction: column; gap: 10px; }
.sk-side { display: flex; flex-direction: column; gap: 10px; }
.sk-thumb { height: 260px; border-radius: 12px; background: linear-gradient(90deg,#e8edf5 25%,#f0f4fa 50%,#e8edf5 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.sk-card  { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.sk-line  { height: 14px; border-radius: 6px; background: linear-gradient(90deg,#e8edf5 25%,#f0f4fa 50%,#e8edf5 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
.sk-line.w40 { width: 40%; } .sk-line.w60 { width: 60%; } .sk-line.w80 { width: 80%; } .sk-line.w90 { width: 90%; } .sk-line.w100 { width: 100%; }
@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }

/* Modal */
.modal-wrap { position: fixed; inset: 0; background: rgba(10,24,112,.45); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(4px); }
.modal-box  { background: #fff; border-radius: 14px; width: 90%; max-width: 400px; overflow: hidden; box-shadow: 0 20px 60px rgba(10,24,112,.22); border-top: 3px solid #E7AE18; }
.modal-head { display: flex; align-items: center; gap: 8px; padding: 14px 16px; background: #FAFBFE; border-bottom: 1px solid #D0D6E5; font-size: 14px; font-weight: 600; }
.danger-head { color: #dc2626; }
.modal-body { padding: 16px; font-size: 13.5px; color: #5A6B8A; }
.modal-body p { margin: 0 0 6px; }
.delete-target  { font-weight: 600; color: #0D1830; }
.delete-warning { font-size: 12px; color: #dc2626; }
.modal-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #D0D6E5; background: #FAFBFE; }
.btn-danger { padding: 8px 16px; border-radius: 8px; border: none; background: #dc2626; color: #fff; cursor: pointer; font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 5px; }
.btn-danger:hover:not(:disabled) { background: #b91c1c; }
.btn-danger:disabled { opacity: .6; cursor: not-allowed; }

/* Spinners */
.spin-xs { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Toast */
.toast { position: fixed; bottom: 1.3rem; inset-inline-end: 1.3rem; padding: 9px 15px; border-radius: 10px; color: #fff; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; z-index: 3000; box-shadow: 0 8px 28px rgba(0,0,0,.18); }
.toast-success { background: #10b981; }
.toast-error   { background: #ef4444; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(.96); }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { transform: translateY(12px); opacity: 0; }

@media (max-width: 900px) {
  .show-layout { grid-template-columns: 1fr; }
  .skeleton-layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .blog-show-page { padding: .9rem; }
  .show-content-card { padding: 16px; }
}
</style>
