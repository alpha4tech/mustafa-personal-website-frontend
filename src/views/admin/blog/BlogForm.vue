<!-- Shared form component used by BlogCreate and BlogEdit -->
<template>
  <div class="blog-form-page" :class="{ rtl: isRtl }">
    <!-- ── Header ── -->
    <div class="bf-header">
      <div class="bfh-left">
        <button class="back-btn" @click="$router.back()">
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
        <div>
          <h1 class="bfh-title">
            {{ isEdit ? t('editPost') || 'تعديل المقال' : t('newPost') || 'مقال جديد' }}
          </h1>
          <p class="bfh-sub">{{ isEdit ? postTitle : t('fillDetails') || 'أدخل تفاصيل المقال' }}</p>
        </div>
      </div>
      <div class="bfh-actions">
        <button class="btn-ghost" @click="saveDraft" :disabled="saving">
          <i class="ti ti-device-floppy" aria-hidden="true"></i>
          {{ t('saveDraft') || 'حفظ كمسودة' }}
        </button>
        <button class="btn-primary" @click="saveAndPublish" :disabled="saving">
          <span v-if="saving" class="spin-xs"></span>
          <i v-else class="ti ti-world-upload" aria-hidden="true"></i>
          {{ isEdit ? t('saveChanges') || 'حفظ التغييرات' : t('publish') || 'نشر' }}
        </button>
      </div>
    </div>

    <!-- ── Status bar (edit mode) ── -->
    <div v-if="isEdit" class="status-bar">
      <span :class="['sp', 'sp-' + post.status]">{{ t(post.status) || post.status }}</span>
      <span class="sb-sep">|</span>
      <span class="sb-info">
        <i class="ti ti-eye" aria-hidden="true"></i>
        {{ formatNumber(post.views_count || 0) }} {{ t('views') || 'مشاهدة' }}
      </span>
      <span class="sb-sep">|</span>
      <span class="sb-info">
        <i class="ti ti-calendar" aria-hidden="true"></i>
        {{ formatDate(post.published_at || post.created_at) }}
      </span>
      <a :href="'/blog/' + post.slug" target="_blank" class="sb-preview-link">
        <i class="ti ti-external-link" aria-hidden="true"></i>
        {{ t('viewOnSite') || 'عرض في الموقع' }}
      </a>
    </div>

    <!-- ── Layout ── -->
    <div class="bf-layout">
      <!-- ── Main Column ── -->
      <div class="bf-main">

        <!-- Title -->
        <div class="field-card">
          <label class="field-label">
            {{ t('PostTitle') || 'عنوان المقال' }}<span class="required">*</span>
          </label>

          <input v-if="currentLang === 'ar'" v-model="form.title_ar" type="text"
            class="field-input title-input" placeholder="عنوان المقال بالعربية" @input="autoSlug" />
          <input v-else v-model="form.title_en" type="text"
            class="field-input title-input" placeholder="Post title in English" @input="autoSlug" />
          <div v-if="errors.title_ar" class="field-error">{{ errors.title_ar }}</div>
          <div v-if="errors.title_en" class="field-error">{{ errors.title_en }}</div>

        </div>

        <!-- Slug -->
        <div class="field-card">
          <label class="field-label">{{ t('slug') || 'الرابط المختصر' }}</label>
          <div class="slug-wrap">
            <span class="slug-prefix">/blog/</span>
            <input v-model="form.slug" type="text" class="field-input slug-input" placeholder="post-slug" />
            <button class="slug-gen-btn" @click="generateSlug" :title="t('autoGenerate') || 'توليد تلقائي'">
              <i class="ti ti-refresh" aria-hidden="true"></i>
            </button>
          </div>
          <div v-if="errors.slug" class="field-error">{{ errors.slug }}</div>
        </div>

        <!-- Excerpt -->
        <div class="field-card">
          <label class="field-label">{{ t('excerpt') || 'مقتطف المقال' }}</label>
          <textarea v-if="currentLang === 'ar'" v-model="form.excerpt_ar" class="field-input" rows="3" placeholder="مقتطف المقال بالعربية"/>
          <textarea v-else v-model="form.excerpt_en" class="field-input" rows="3" placeholder="Excerpt in English"/>
          <div class="char-count">
            {{ (currentLang === 'ar' ? form.excerpt_ar : form.excerpt_en)?.length || 0 }} / 300
          </div>
        </div>

        <!-- Content Editor -->
        <div class="field-card editor-card">
          <div class="editor-toolbar">
            <label class="field-label" style="margin:0">
              {{ t('content') || 'محتوى المقال' }}<span class="required">*</span>
            </label>

            <div class="et-btns">
              <button v-for="b in editorBtns" :key="b.cmd" class="et-btn"
                @click="execCmd(b.cmd, b.val)" :title="b.title">
                <i :class="'bi ' + b.icon" aria-hidden="true"></i>
              </button>
              <div class="et-sep"></div>
              <button class="et-btn" @click="togglePreview" :title="t('preview') || 'معاينة'">
                <i class="bi bi-eye" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div v-if="showPreview" class="preview-area" v-html="currentLang === 'ar' ? form.content_ar : form.content_en"></div>
            <textarea v-if="currentLang === 'ar'" v-model="form.content_ar" class="field-input" rows="16" placeholder="محتوى المقال بالعربية"/>
          <textarea v-else v-model="form.content_en" class="field-input" rows="16" placeholder="Content in English"/>
          <div class="char-count">
            {{ (currentLang === 'ar' ? form.content_ar : form.content_en)?.length || 0 }} {{ t('characters') || 'حرف'}}

          <div v-if="errors.content_ar" class="field-error" style="padding:8px 16px">{{ errors.content_ar }}</div>
          <div v-if="errors.content_en" class="field-error" style="padding:8px 16px">{{ errors.content_en }}</div>
        </div>
        </div>
      </div>

      <!-- ── Sidebar Column ── -->
      <div class="bf-sidebar">

        <!-- Publish settings -->
        <div class="side-card">
          <div class="sc-head">
            <i class="ti ti-settings" aria-hidden="true"></i>
            {{ t('publishSettings') || 'إعدادات النشر' }}
          </div>
          <div class="sc-body">
            <div class="field-row">
              <label class="field-label-sm">{{ t('status') || 'الحالة' }}</label>
              <select v-model="form.status" class="field-select">
                <option value="draft">{{ t('draft') || 'مسودة' }}</option>
                <option value="published">{{ t('published') || 'منشور' }}</option>
                <option value="scheduled">{{ t('scheduled') || 'مجدول' }}</option>
              </select>
            </div>
            <div v-if="form.status === 'scheduled'" class="field-row">
              <label class="field-label-sm">{{ t('publishDate') || 'تاريخ النشر' }}</label>
              <input v-model="form.published_at" type="datetime-local" class="field-input-sm" />
            </div>
            <div class="lang-tabs">
              <button type="button" class="lang-tab" :class="{ active: currentLang === 'ar' }"
                @click="currentLang = 'ar'">العربية</button>
              <button type="button" class="lang-tab" :class="{ active: currentLang === 'en' }"
                @click="currentLang = 'en'">English</button>
            </div>
            <div class="field-row toggle-row">
              <label class="field-label-sm">{{ t('allowComments') || 'السماح بالتعليقات' }}</label>
              <button class="toggle-btn" :class="{ on: form.allow_comments }"
                @click="form.allow_comments = !form.allow_comments">
                <span class="toggle-knob"></span>
              </button>
            </div>
            <div class="field-row toggle-row">
              <label class="field-label-sm">{{ t('featured') || 'مقال مميز' }}</label>
              <button class="toggle-btn" :class="{ on: form.is_featured }"
                @click="form.is_featured = !form.is_featured">
                <span class="toggle-knob"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Thumbnail -->
        <div class="side-card">
          <div class="sc-head">
            <i class="ti ti-photo" aria-hidden="true"></i>
            {{ t('thumbnail') || 'صورة المقال' }}
          </div>
          <div class="sc-body">
            <div class="thumb-drop"
              :class="{ 'has-image': form.featured_image_preview, dragging: isDragging }"
              @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
              @drop.prevent="onDrop" @click="$refs.thumbInput.click()">
              <img v-if="form.featured_image_preview" :src="form.featured_image_preview" alt="thumbnail" />
              <div v-else class="drop-placeholder">
                <i class="ti ti-cloud-upload" aria-hidden="true"></i>
                <span>{{ t('dragOrClick') || 'اسحب أو انقر للرفع' }}</span>
                <small>JPG, PNG, WebP — حتى 2MB</small>
              </div>
            </div>
            <input ref="thumbInput" type="file" accept="image/*" style="display:none" @change="onThumbChange" />
            <button v-if="form.featured_image_preview" class="remove-thumb" @click.stop="removeThumb">
              <i class="ti ti-trash" aria-hidden="true"></i>
              {{ t('removeImage') || 'إزالة الصورة' }}
            </button>
          </div>
        </div>

        <!-- Category & Tags -->
        <div class="side-card">
          <div class="sc-head">
            <i class="ti ti-tag" aria-hidden="true"></i>
            {{ t('classification') || 'التصنيف والوسوم' }}
          </div>
          <div class="sc-body">
            <div class="field-row">

              <label class="field-label-sm">{{ t('category') || 'التصنيف' }}</label>
              <select v-model="form.category_ids" class="field-select">
                  <option value="" disabled selected>
                    {{ t('selectCategory') || 'اختر تصنيفاً' }}
                  </option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ currentLang === 'ar' ? cat.name_ar : cat.name_en }}
                </option>
              </select>

            </div>
            <div class="field-row">

              <label class="field-label-sm">{{ t('tags') || 'الوسوم' }}</label>

              <select v-model="form.tag_ids" class="field-select">
                <option value="" disabled selected>
                  {{ t('selectTags') || 'اختر وسوماً' }}
                </option>
                <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                  {{ currentLang === 'ar' ? tag.name_ar : tag.name_en }}
                </option>
              </select>

            </div>
          </div>
        </div>

        <!-- SEO -->
        <div class="side-card">
          <div class="sc-head collapsible" @click="seoOpen = !seoOpen">
            <span><i class="ti ti-search" aria-hidden="true"></i> {{ t('seo') || 'تحسين محركات البحث' }}</span>
            <i :class="seoOpen ? 'ti ti-chevron-up' : 'ti ti-chevron-down'" aria-hidden="true"></i>
          </div>
          <Transition name="collapse">
            <div v-if="seoOpen" class="sc-body">
              <div class="field-row">
                <label class="field-label-sm">{{ t('seoTitle') || 'عنوان SEO' }}</label>
                <input v-if="currentLang === 'ar'" v-model="form.seo_title_ar" class="field-input-sm" />
                <input v-else v-model="form.seo_title_en" class="field-input-sm" />
              </div>
              <div class="field-row">
                <label class="field-label-sm">{{ t('metaDescription') || 'وصف Meta' }}</label>
                <textarea v-if="currentLang === 'ar'" v-model="form.seo_description_ar" class="field-input-sm" />
                <textarea v-else v-model="form.seo_description_en" class="field-input-sm" />
              </div>
              <div class="serp-preview">
                <div class="serp-url">mustafa.com/blog/{{ form.slug || 'post-slug' }}</div>
                <div class="serp-title">
                  {{ currentLang === 'ar' ? (form.seo_title_ar || form.title_ar) : (form.seo_title_en || form.title_en) }}
                </div>
                <div class="serp-desc">
                  {{ currentLang === 'ar' ? (form.seo_description_ar || form.excerpt_ar) : (form.seo_description_en || form.excerpt_en) }}
                </div>
              </div>
            </div>
          </Transition>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="'toast-' + toast.type" role="alert">
        <i :class="toast.type === 'success' ? 'ti ti-circle-check' : 'ti ti-circle-x'" aria-hidden="true"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSettings } from '@/composables/useSettings'
import axios from '@/api/axios'

const props = defineProps({ postId: { type: [Number, String], default: null } })
const isEdit = computed(() => !!props.postId)

const router = useRouter()
const { t, isRtl } = useSettings()

// ── State ─────────────────────────────────────
const saving      = ref(false)
const categories  = ref([])
const tags        = ref([])
const seoOpen     = ref(false)
const isDragging  = ref(false)
const showPreview = ref(false)
const editorRef   = ref(null)
const thumbInput  = ref(null)
const toast       = ref({ show: false, message: '', type: 'success' })
const errors      = ref({})
const post        = ref({})
const currentLang = ref('ar')

const postTitle = computed(() =>
  currentLang.value === 'ar'
    ? (form.title_ar || form.title_en)
    : (form.title_en || form.title_ar)
)

const form = reactive({
  title_ar: '', title_en: '',
  excerpt_ar: '', excerpt_en: '',
  content_ar: '', content_en: '',
  seo_title_ar: '', seo_title_en: '',
  seo_description_ar: '', seo_description_en: '',
  slug: '',
  category_ids: [],
  tag_ids: [],
  featured_image: null,
  featured_image_preview: null,
  status: 'draft',
  published_at: '',
  allow_comments: true,
  is_featured: false,
})

// ── Editor ────────────────────────────────────
const editorBtns = [
  { cmd: 'bold',               val: null, icon: 'ti-bold',         title: 'Bold' },
  { cmd: 'italic',             val: null, icon: 'ti-italic',       title: 'Italic' },
  { cmd: 'underline',          val: null, icon: 'ti-underline',    title: 'Underline' },
  { cmd: 'insertUnorderedList',val: null, icon: 'ti-list',         title: 'List' },
  { cmd: 'insertOrderedList',  val: null, icon: 'ti-list-numbers', title: 'Ordered' },
  { cmd: 'formatBlock',        val: 'H2', icon: 'ti-h-2',          title: 'H2' },
  { cmd: 'formatBlock',        val: 'H3', icon: 'ti-h-3',          title: 'H3' },
  { cmd: 'createLink',         val: null, icon: 'ti-link',         title: 'Link' },
]

watch(currentLang, async (lang) => {
  await nextTick()
  if (!editorRef.value) return
  editorRef.value.innerHTML = lang === 'ar' ? form.content_ar : form.content_en
})

const execCmd = (cmd, val) => {
  if (cmd === 'createLink') {
    const url = prompt('URL:')
    if (url) document.execCommand(cmd, false, url)
  } else {
    document.execCommand(cmd, false, val)
  }
  editorRef.value?.focus()
}

const onContentInput = () => {
  const html = editorRef.value?.innerHTML || ''
  if (currentLang.value === 'ar') form.content_ar = html
  else form.content_en = html
}

const togglePreview = () => { showPreview.value = !showPreview.value }

// ── Slug ──────────────────────────────────────
const slugify = (str) =>
  str.toLowerCase().trim()
     .replace(/[\u0600-\u06FF\s]+/g, '-')
     .replace(/[^a-z0-9-]/g, '')
     .replace(/-+/g, '-').replace(/^-|-$/g, '')

const autoSlug = () => {
  if (isEdit.value) return
  form.slug = slugify(currentLang.value === 'ar' ? form.title_ar : form.title_en)
}

const generateSlug = () => {
  form.slug = slugify(currentLang.value === 'ar' ? form.title_ar : form.title_en)
}

// ── Thumbnail ─────────────────────────────────
const onThumbChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.featured_image         = file
  form.featured_image_preview = URL.createObjectURL(file)
}

const onDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) return
  form.featured_image         = file
  form.featured_image_preview = URL.createObjectURL(file)
}

const removeThumb = () => {
  form.featured_image         = null
  form.featured_image_preview = null
  if (thumbInput.value) thumbInput.value.value = ''
}

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

// ── Validation ────────────────────────────────
const validate = () => {
  errors.value = {}
  if (!form.title_ar?.trim()) errors.value.title_ar = 'العنوان العربي مطلوب'
  if (!form.title_en?.trim()) errors.value.title_en = 'English title is required'
  if (!isEdit.value) {
    if (!form.content_ar?.trim()) errors.value.content_ar = 'المحتوى العربي مطلوب'
    if (!form.content_en?.trim()) errors.value.content_en = 'English content is required'
  }
  return Object.keys(errors.value).length === 0
}

// ── Build FormData ────────────────────────────

const buildFormData = (status) => {
  const fd = new FormData()

  // ✅ Laravel method spoofing for edit
  if (isEdit.value) fd.append('_method', 'PUT')

  fd.append('title_ar',           form.title_ar)
  fd.append('title_en',           form.title_en)
  fd.append('excerpt_ar',         form.excerpt_ar)
  fd.append('excerpt_en',         form.excerpt_en)
  fd.append('content_ar',         form.content_ar)
  fd.append('content_en',         form.content_en)
  fd.append('seo_title_ar',       form.seo_title_ar)
  fd.append('seo_title_en',       form.seo_title_en)
  fd.append('seo_description_ar', form.seo_description_ar)
  fd.append('seo_description_en', form.seo_description_en)
  fd.append('slug',               form.slug)
  fd.append('is_featured',        form.is_featured    ? 1 : 0)
  fd.append('allow_comments',     form.allow_comments ? 1 : 0)
  fd.append('status',             status)

  if (form.published_at) fd.append('published_at', form.published_at)

  const catIds = Array.isArray(form.category_ids)
    ? form.category_ids
    : (form.category_ids ? [form.category_ids] : [])
  catIds.forEach(id => fd.append('category_ids[]', id))

  // ✅ tag_ids
  const tagIds = Array.isArray(form.tag_ids)
    ? form.tag_ids
    : (form.tag_ids ? [form.tag_ids] : [])
  tagIds.forEach(id => fd.append('tags[]', id))

  if (form.featured_image instanceof File) fd.append('image', form.featured_image)

  return fd
}

// ── Save ──────────────────────────────────────
const save = async (status) => {
  if (!validate()) return
  saving.value = true
  try {
    const fd  = buildFormData(status)
    const url = isEdit.value ? `/admin/blog/${props.postId}` : '/admin/blog'
    await axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    showToast(
      isEdit.value
        ? (t('postUpdated') || 'تم تحديث المقال')
        : (t('postCreated') || 'تم نشر المقال'),
      'success'
    )
    setTimeout(() => router.push('/admin/blog'), 1200)
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

const saveDraft      = () => save('draft')
const saveAndPublish = () =>
  save(form.status === 'draft' && !isEdit.value ? 'published' : form.status)

// ── Fetch categories & tags ───────────────────
const fetchCategories = async () => {
  try {
    const { data } = await axios.get('/admin/blog/categories')
    categories.value = data.data || data || []
  } catch (err) {
    console.error('categories error:', err.response?.status, err.response?.data)
  }
}

const fetchTags = async () => {
  try {
    const { data } = await axios.get('/admin/blog/tags')
    tags.value = data.data || data || []
  } catch {}
}

// ── Fetch post for edit ───────────────────────
const fetchPost = async () => {
  if (!props.postId) return
  try {
    const { data } = await axios.get(`/admin/blog/${props.postId}`)

    const p = data.data ?? data

    post.value = p

    Object.assign(form, {
      title_ar:            p.title_ar            || '',
      title_en:            p.title_en            || '',
      slug:                p.slug                || '',
      excerpt_ar:          p.excerpt_ar          || '',
      excerpt_en:          p.excerpt_en          || '',
      content_ar:          p.content_ar          || '',
      content_en:          p.content_en          || '',
      status:              p.status              || 'draft',
      category_ids:        p.category_ids        || [],
      tag_ids:             p.tag_ids             || [],
      featured_image:         null,
      featured_image_preview: p.featured_image   || null,
      is_featured:         !!p.is_featured,
      allow_comments:      p.allow_comments !== false,
      published_at:        p.published_at        || '',
      seo_title_ar:        p.seo_title_ar        || '',
      seo_title_en:        p.seo_title_en        || '',
      seo_description_ar:  p.seo_description_ar  || '',
      seo_description_en:  p.seo_description_en  || '',
    })

    await nextTick()
    if (editorRef.value) {
      editorRef.value.innerHTML =
        currentLang.value === 'ar' ? form.content_ar : form.content_en
    }
  } catch (err) {
    console.error('fetchPost error:', err)
    showToast(t('fetchError') || 'فشل التحميل', 'error')
  }
}

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTags(), fetchPost()])
})
</script>

<style scoped>
.blog-form-page { padding: 1.3rem; background: #F0F0F0; min-height: 100vh; }
.blog-form-page.rtl { direction: rtl; }

.bf-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 12px; }
.bfh-left  { display: flex; align-items: flex-start; gap: 12px; }
.back-btn  { width: 36px; height: 36px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #5A6B8A; transition: all .15s; flex-shrink: 0; margin-top: 2px; }
.back-btn:hover { background: #F0F0F0; color: #0D1830; }
.bfh-title { font-size: 19px; font-weight: 700; color: #0D1830; margin: 0; }
.bfh-sub   { font-size: 12.5px; color: #7A8CAB; margin: 3px 0 0; }
.bfh-actions { display: flex; gap: 8px; }

.status-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; background: #fff; border: 1px solid #D0D6E5; border-radius: 10px; padding: 9px 14px; margin-bottom: 12px; font-size: 12.5px; color: #7A8CAB; }
.sp { padding: 2px 9px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.sp-published { background: #dcfce7; color: #15803d; }
.sp-draft     { background: #f1f5f9; color: #64748b; }
.sp-scheduled { background: rgba(231,174,24,.12); color: #C49310; }
.sb-sep { color: #D0D6E5; }
.sb-info { display: flex; align-items: center; gap: 4px; }
.sb-preview-link { margin-inline-start: auto; color: #162FBB; text-decoration: none; font-size: 12px; display: flex; align-items: center; gap: 4px; }
.sb-preview-link:hover { text-decoration: underline; }

.bf-layout  { display: grid; grid-template-columns: 1fr 300px; gap: 12px; align-items: start; }
.bf-main    { display: flex; flex-direction: column; gap: 10px; }
.bf-sidebar { display: flex; flex-direction: column; gap: 10px; }

.field-card  { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; padding: 14px 16px; }
.editor-card { padding: 0; overflow: hidden; }
.field-label { font-size: 12.5px; font-weight: 600; color: #0D1830; display: block; margin-bottom: 7px; }
.required    { color: #dc2626; margin-inline-start: 2px; }
.field-input { width: 100%; padding: 9px 12px; border: 1.5px solid #D0D6E5; border-radius: 9px; font-size: 13.5px; color: #0D1830; background: #fff; outline: none; transition: border-color .15s; font-family: inherit; box-sizing: border-box; }
.field-input:focus { border-color: #162FBB; }
.title-input { font-size: 15px; font-weight: 500; }
.field-error { font-size: 11.5px; color: #dc2626; margin-top: 5px; display: flex; align-items: center; gap: 4px; }
.char-count  { font-size: 11px; color: #7A8CAB; text-align: end; margin-top: 4px; }

.slug-wrap { display: flex; align-items: center; border: 1.5px solid #D0D6E5; border-radius: 9px; overflow: hidden; transition: border-color .15s; }
.slug-wrap:focus-within { border-color: #162FBB; }
.slug-prefix  { background: #F8FAFC; padding: 9px 10px; font-size: 12px; color: #7A8CAB; border-inline-end: 1px solid #D0D6E5; white-space: nowrap; }
.slug-input   { flex: 1; border: none; padding: 9px 10px; font-size: 13px; color: #162FBB; outline: none; background: none; font-family: monospace; }
.slug-gen-btn { padding: 0 10px; border: none; background: none; cursor: pointer; color: #7A8CAB; font-size: 15px; transition: color .15s; display: flex; align-items: center; }
.slug-gen-btn:hover { color: #162FBB; }

.editor-toolbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; }
.et-btns { display: flex; align-items: center; gap: 2px; }
.et-btn  { width: 30px; height: 30px; border-radius: 6px; border: none; background: none; cursor: pointer; font-size: 14px; color: #5A6B8A; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.et-btn:hover { background: rgba(22,47,187,.08); color: #162FBB; }
.et-sep  { width: 1px; height: 20px; background: #D0D6E5; margin: 0 3px; }
.rich-editor  { min-height: 300px; padding: 14px 16px; font-size: 14px; line-height: 1.8; color: #0D1830; outline: none; border: none; }
.rich-editor:empty::before { content: attr(data-placeholder); color: #B0BAD0; pointer-events: none; }
.preview-area { min-height: 300px; padding: 14px 16px; font-size: 14px; line-height: 1.8; color: #0D1830; background: #FAFBFE; }

.side-card { background: #fff; border-radius: 12px; border: 1px solid #D0D6E5; overflow: hidden; }
.sc-head   { display: flex; align-items: center; justify-content: space-between; gap: 7px; padding: 11px 14px; border-bottom: 1px solid #D0D6E5; background: #FAFBFE; font-size: 13px; font-weight: 600; color: #0D1830; }
.sc-head i { color: #162FBB; font-size: 15px; }
.sc-head.collapsible { cursor: pointer; user-select: none; }
.sc-head.collapsible:hover { background: #F0F4FF; }
.sc-body   { padding: 12px 14px; display: flex; flex-direction: column; gap: 10px; }
.field-row { display: flex; flex-direction: column; gap: 4px; }
.field-label-sm { font-size: 12px; font-weight: 600; color: #5A6B8A; }
.field-select, .field-input-sm { width: 100%; padding: 7px 10px; border: 1.5px solid #D0D6E5; border-radius: 8px; font-size: 12.5px; color: #0D1830; background: #fff; outline: none; transition: border-color .15s; font-family: inherit; }
.field-select:focus, .field-input-sm:focus { border-color: #162FBB; }
.field-select[multiple] { min-height: 120px; }
.toggle-row { flex-direction: row; align-items: center; justify-content: space-between; }

.toggle-btn  { width: 38px; height: 22px; border-radius: 20px; border: none; background: #D0D6E5; cursor: pointer; position: relative; transition: background .2s; flex-shrink: 0; }
.toggle-btn.on { background: #162FBB; }
.toggle-knob { width: 16px; height: 16px; border-radius: 50%; background: #fff; position: absolute; top: 3px; inset-inline-start: 3px; transition: inset-inline-start .2s; box-shadow: 0 1px 4px rgba(0,0,0,.15); }
.toggle-btn.on .toggle-knob { inset-inline-start: 19px; }

.thumb-drop { border: 2px dashed #D0D6E5; border-radius: 10px; overflow: hidden; cursor: pointer; transition: border-color .2s; aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; }
.thumb-drop:hover, .thumb-drop.dragging { border-color: #162FBB; background: rgba(22,47,187,.03); }
.thumb-drop.has-image { border-style: solid; border-color: #D0D6E5; }
.thumb-drop img { width: 100%; height: 100%; object-fit: cover; }
.drop-placeholder { text-align: center; color: #B0BAD0; }
.drop-placeholder i { font-size: 28px; display: block; margin-bottom: 6px; }
.drop-placeholder span { font-size: 12.5px; display: block; color: #7A8CAB; }
.drop-placeholder small { font-size: 11px; display: block; margin-top: 3px; }
.remove-thumb { width: 100%; margin-top: 7px; padding: 6px; border-radius: 7px; border: 1px solid rgba(220,38,38,.2); background: rgba(220,38,38,.05); color: #dc2626; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 5px; transition: background .15s; }
.remove-thumb:hover { background: rgba(220,38,38,.1); }

.serp-preview { background: #F8FAFC; border-radius: 8px; padding: 10px 12px; margin-top: 4px; border: 1px solid #E8EDF5; }
.serp-url   { font-size: 11px; color: #059669; margin-bottom: 2px; }
.serp-title { font-size: 14px; color: #162FBB; font-weight: 500; margin-bottom: 3px; line-height: 1.3; }
.serp-desc  { font-size: 12px; color: #5A6B8A; line-height: 1.5; }

.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 9px; background: #162FBB; color: #fff; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: background .2s; }
.btn-primary:hover:not(:disabled) { background: #0F2196; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.btn-ghost   { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 9px; border: 1px solid #D0D6E5; background: #fff; color: #5A6B8A; cursor: pointer; font-size: 13px; transition: all .15s; }
.btn-ghost:hover:not(:disabled) { background: #F0F0F0; }
.btn-ghost:disabled { opacity: .6; cursor: not-allowed; }

.spin-xs { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.lang-tabs { display: flex; gap: 8px; margin-bottom: 4px; }
.lang-tab  { padding: 8px 14px; border-radius: 8px; border: 1px solid #D0D6E5; background: #fff; color: #5A6B8A; cursor: pointer; transition: .2s; font-size: 13px; font-weight: 600; }
.lang-tab.active { background: #162FBB; color: #fff; border-color: #162FBB; }

.toast { position: fixed; bottom: 1.3rem; inset-inline-end: 1.3rem; padding: 9px 15px; border-radius: 10px; color: #fff; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; z-index: 3000; box-shadow: 0 8px 28px rgba(0,0,0,.18); }
.toast-success { background: #10b981; }
.toast-error   { background: #ef4444; }
.toast-enter-active, .toast-leave-active { transition: all .3s ease; }
.toast-enter-from, .toast-leave-to { transform: translateY(12px); opacity: 0; }
.collapse-enter-active, .collapse-leave-active { transition: all .25s ease; overflow: hidden; }
.collapse-enter-from, .collapse-leave-to { max-height: 0; opacity: 0; }
.collapse-enter-to, .collapse-leave-from { max-height: 600px; opacity: 1; }

@media (max-width: 900px) {
  .bf-layout { grid-template-columns: 1fr; }
  .bf-sidebar { order: -1; }
}
@media (max-width: 640px) {
  .blog-form-page { padding: .9rem; }
  .bfh-actions { flex-wrap: wrap; }
}
</style>
