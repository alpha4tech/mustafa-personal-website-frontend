
<template>
  <div class="portfolio-form">
    <div class="form-layout">

      <!-- MAIN -->
      <div class="form-main">

        <div class="lang-tabs">
          <button :class="{ active: lang==='ar' }" @click="lang='ar'">🇸🇦 العربية</button>
          <button :class="{ active: lang==='en' }" @click="lang='en'">🇬🇧 English</button>
        </div>

        <div class="form-card">
          <label class="form-label">{{ lang==='ar' ? 'العنوان (AR)' : 'Title (EN)' }} <span class="required">*</span></label>
          <input v-model="form[`title_${lang}`]" type="text" class="form-input" :class="{ error: hasError(`title_${lang}`) }" :dir="lang" />

          <p v-if="hasError(`title_${lang}`)" class="error-msg"> {{ getError(`title_${lang}`) }} </p>
        </div>

        <div class="form-card">
          <label class="form-label">{{ lang==='ar' ? 'وصف مختصر' : 'Short Description' }}</label>
          <textarea v-model="form[`short_desc_${lang}`]" class="form-input" rows="3" :class="{ error: hasError(`short_desc_${lang}`) }" :dir="lang" />

          <p v-if="hasError(`short_desc_${lang}`)" class="error-msg"> {{ getError(`short_desc_${lang}`) }} </p>

        </div>

        <div class="form-card">
          <label class="form-label">{{ lang==='ar' ? 'تفاصيل المشروع' : 'Project Details' }}</label>
          <div class="rich-toolbar">
            <button type="button" @click="execCmd('bold')"><b>B</b></button>
            <button type="button" @click="execCmd('italic')"><i>I</i></button>
            <button type="button" @click="execCmd('underline')"><u>U</u></button>
            <span class="sep"></span>
            <button type="button" @click="execCmd('formatBlock','h2')">H2</button>
            <button type="button" @click="execCmd('formatBlock','h3')">H3</button>
            <button type="button" @click="execCmd('formatBlock','p')">P</button>
            <span class="sep"></span>
            <button type="button" @click="execCmd('insertUnorderedList')"><i class="bi bi-list-ul"></i></button>
            <button type="button" @click="execCmd('insertOrderedList')"><i class="bi bi-list-ol"></i></button>
            <span class="sep"></span>
            <button type="button" @click="execCmd('justifyRight')"><i class="bi bi-text-right"></i></button>
            <button type="button" @click="execCmd('justifyCenter')"><i class="bi bi-text-center"></i></button>
            <button type="button" @click="execCmd('justifyLeft')"><i class="bi bi-text-left"></i></button>
          </div>
          <div :ref="el => setEditorRef(lang, el)" class="rich-editor" contenteditable="true" :dir="lang" @input="onEditorInput(lang)" />
            <p v-if="hasError(`content_${lang}`)" class="error-msg">
  {{ getError(`content_${lang}`) }}
</p>
        </div>

        <!-- KPIs -->
         <div v-for="(res, idx) in form.results" :key="idx" class="result-row">

  <div>
    <input
      v-model="res.label_ar"
      class="form-input"
      placeholder="التسمية AR"
      dir="rtl"
      :class="{ error: hasError(`results.${idx}.label_ar`) }"
    />

    <p v-if="hasError(`results.${idx}.label_ar`)" class="error-msg">
      {{ getError(`results.${idx}.label_ar`) }}
    </p>
  </div>

  <div>
    <input
      v-model="res.label_en"
      class="form-input"
      placeholder="Label EN"
      dir="ltr"
      :class="{ error: hasError(`results.${idx}.label_en`) }"
    />

    <p v-if="hasError(`results.${idx}.label_en`)" class="error-msg">
      {{ getError(`results.${idx}.label_en`) }}
    </p>
  </div>

  <div>
    <input
      v-model="res.value"
      class="form-input"
      placeholder="+150%"
      :class="{ error: hasError(`results.${idx}.value`) }"
    />

    <p v-if="hasError(`results.${idx}.value`)" class="error-msg">
      {{ getError(`results.${idx}.value`) }}
    </p>
  </div>

  <button
    type="button"
    class="btn-remove"
    @click="form.results.splice(idx,1)"
  >
    <i class="bi bi-x"></i>
  </button>

</div>
        <!-- <div class="form-card">
          <div class="section-header">
            <label class="form-label">نتائج / KPIs</label>
            <button type="button" class="btn-add-small" @click="addResult"><i class="bi bi-plus"></i> إضافة</button>
          </div>
          <div v-if="form.results.length" class="results-list">
            <div v-for="(res, idx) in form.results" :key="idx" class="result-row">
              <input v-model="res.label_ar" class="form-input" placeholder="التسمية AR" dir="rtl" :class="{ error: hasError(`label_ar_${lang}`) }"/>
              <input v-model="res.label_en" class="form-input" placeholder="Label EN"  dir="ltr" :class="{ error: hasError(`label_en_${lang}`) }" />
              <input v-model="res.value"    class="form-input" placeholder="+150%" />
              <button type="button" class="btn-remove" @click="form.results.splice(idx,1)"><i class="bi bi-x"></i></button>
                <p v-if="hasError(`label_en_${lang}`)" class="error-msg"> {{ getError(`label_en_${lang}`) }} </p>
            </div>
          </div>
          <p v-else class="hint">أضف أرقام الأداء مثل: نسبة الزيادة في المبيعات…</p>
        </div> -->

        <!-- SEO -->
        <div class="form-card">
          <label class="form-label"><i class="bi bi-search"></i> {{ t('seo') || 'SEO' }}</label>
          <div class="seo-grid">
            <div>
              <label class="sub-label">{{ t('metaTitleAr') || 'Meta Title AR' }}</label>
              <input v-model="form.meta_title_ar" class="form-input" dir="rtl" />
            </div>
            <div>
              <label class="sub-label">{{ t('metaTitleEn') || 'Meta Title EN' }}</label>
              <input v-model="form.meta_title_en" class="form-input" dir="ltr" />
            </div>
            <div>
              <label class="sub-label">{{ t('metaDescriptionAr') || 'Meta Description AR' }}</label>
              <textarea v-model="form.meta_description_ar" class="form-input" rows="2" dir="rtl" />
            </div>
            <div>
              <label class="sub-label">{{ t('metaDescriptionEn') || 'Meta Description EN' }}</label>
              <textarea v-model="form.meta_description_en" class="form-input" rows="2" dir="ltr" />
            </div>
          </div>
        </div>

      </div>

      <!-- SIDEBAR -->
      <div class="form-sidebar">

        <div class="form-card">
          <label class="form-label">{{ t('status') || 'الحالة' }}</label>
            <select v-model="form.status" class="form-input" :class="{ error: hasError('status') }">
            <option value="draft">{{ t('draft') || 'مسودة' }}</option>
            <option value="published">{{ t('published') || 'منشور' }}</option>
            <option value="archived">{{ t('archived') || 'مؤرشف' }}</option>
          </select>
          <p v-if="hasError('status')" class="error-msg"> {{ getError('status') }} </p>


          <label class="toggle-row">
            <input type="checkbox" v-model="form.featured" />
            <span>{{ t('feature') || 'تمييز ⭐' }}</span>
          </label>

          <label class="form-label mt">{{ t('sortOrder') || 'ترتيب العرض' }}</label>
          <input v-model.number="form.sort_order" type="number" min="0" class="form-input" :class="{ error: hasError('sort_order') }"/>

              <p v-if="hasError('sort_order')" class="error-msg">
                {{ getError('sort_order') }}
              </p>
          <div class="form-actions">
            <button type="button" class="btn btn-outline" @click="$emit('cancel')">{{ t('cancel') || 'إلغاء' }}</button>
            <button type="button" class="btn btn-primary" :disabled="loading" @click="$emit('submit', buildFormData())">
              <span v-if="loading"><i class="bi bi-arrow-repeat spin"></i></span>

              <span v-else>{{ isEdit ? 'حفظ التعديلات' : 'نشر العمل' }}</span>
            </button>
          </div>
        </div>

        <!-- Thumbnail -->
        <div class="form-card">
          <label class="form-label">{{ t('thumbnail') || 'الصورة الرئيسية' }}</label>
          <div class="upload-zone" :class="{ dragging: thumbDragging }"
            @dragover.prevent="thumbDragging=true" @dragleave="thumbDragging=false"
            @drop.prevent="onThumbDrop" @click="$refs.thumbInput.click()">
            <img v-if="thumbPreview" :src="thumbPreview" class="thumb-preview" />
            <template v-else>
              <i class="bi bi-cloud-arrow-up"></i>
              <span>{{ t('dragDrop') || 'اسحب أو اضغط لرفع الصورة' }}</span>
              <small>{{ t('fileSizeLimit') || 'JPG, PNG, WEBP — حد أقصى 3MB' }}</small>
            </template>
          </div>
          <input ref="thumbInput" type="file" accept="image/*" hidden @change="onThumbSelect" />
          <button v-if="thumbPreview" type="button" class="btn-remove-thumb" @click="removeThumb">
            <i class="bi bi-x-circle"></i> {{ t('removeThumbnail') || 'إزالة الصورة' }}
          </button>

          <p v-if="hasError('thumbnail')" class="error-msg"> {{ getError('thumbnail') }} </p>
        </div>

        <!-- Gallery -->
        <div class="form-card">
          <label class="form-label">{{ t('gallery') || 'معرض الصور' }}</label>
          <div class="gallery-grid">
            <div v-for="(src, idx) in galleryPreviews" :key="idx" class="gallery-item">
              <img :src="src.preview" />
              <button type="button" @click="removeGalleryItem(idx, src.existing)"><i class="bi bi-x"></i></button>
            </div>
            <div class="gallery-add" @click="$refs.galleryInput.click()">
              <i class="bi bi-plus-lg"></i>
            </div>
          </div>
          <input ref="galleryInput" type="file" accept="image/*" multiple hidden @change="onGallerySelect" />
          <p v-if="hasError('gallery')" class="error-msg"> {{ getError('gallery') }} </p>
          <p v-if="hasError('gallery.0')" class="error-msg"> {{ getError('gallery.0') }} </p>
        </div>

        <!-- Category -->
        <div class="form-card">
            <label class="form-label">
              {{ t('category') || 'الفئة' }}
            </label>

        <select v-model="form.category_id" class="form-input" :class="{ error: hasError('category_id') }">
          <option :value="null">
            {{ t('selectCategory') || 'اختر فئة' }}
          </option>

          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ isRtl ? cat.name_ar : cat.name_en }}
          </option>
  </select>

  <p v-if="hasError('category_id')" class="error-msg">
    {{ getError('category_id') }}
  </p>
</div>

        <!-- Client & Links -->
        <div class="form-card">
          <label class="form-label">{{ t('projectInfo') || 'معلومات المشروع' }}</label>
          <label class="sub-label">{{ t('clientName') || 'اسم العميل' }}</label>
          <input v-model="form.client_name" class="form-input" :placeholder="t('projectUrl1') || 'ادخل العميل' " :class="{ error: hasError('client_name') }" />
          <p v-if="hasError('client_name')" class="error-msg"> {{ getError('client_name') }}</p>

          <label class="sub-label mt">{{ t('projectUrl') || 'رابط المشروع' }}</label>
          <input v-model="form.project_url" class="form-input" type="url" :placeholder="t('projectUrl2') || 'ادخل رابط المشروع' " :class="{ error: hasError('project_url') }" />
          <p v-if="hasError('project_url')" class="error-msg"> {{ getError('project_url') }}</p>

          <label class="sub-label mt">{{ t('caseStudyUrl') || 'رابط دراسة الحالة' }}</label>
          <input v-model="form.case_study_url" class="form-input" type="url"
           :placeholder="t('caseStudyUrl') || 'رابط دراسة الحالة' " :class="{ error: hasError('case_study_url') }" />
          <p v-if="hasError('case_study_url')" class="error-msg"> {{ getError('case_study_url') }}</p>
        </div>

        <!-- Tags -->
        <div class="form-card">
          <label class="form-label">{{ t('tags') || 'الوسوم' }}</label>
          <div class="tag-input-wrap">
            <div class="tag-chips">
              <span v-for="(tag,i) in form.tags" :key="i" class="tag-chip">
                {{ tag }}
                <button type="button" @click="form.tags.splice(i,1)">×</button>
              </span>
            </div>
            <input v-model="tagInput" class="tag-input" :placeholder="t('tags') || 'الوسوم'"
              @keydown.enter.prevent="addTag" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick } from 'vue'
import { useSettings } from '@/composables/useSettings'
const { t, isRtl, currentLang } = useSettings()

function hasError(field) {
  return !!props.errors?.[field]
}

function getError(field) {
  return props.errors?.[field]?.[0] || ''
}

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  categories:  { type: Array,  default: () => [] },
  errors:      { type: Object, default: () => ({}) },
  loading:     { type: Boolean, default: false },
  isEdit:      { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'cancel'])

const lang = ref('ar')

const form = reactive({
  title_ar: '', title_en: '', short_desc_ar: '', short_desc_en: '',
  content_ar: '', content_en: '', client_name: '', project_url: '',
  case_study_url: '', category_id: null, tags: [], results: [],
  status: 'draft', featured: false, sort_order: 0,
  meta_title_ar: '', meta_title_en: '', meta_description_ar: '', meta_description_en: '',
})

const thumbInput    = ref()
const thumbPreview  = ref(null)
const thumbFile     = ref(null)
const thumbDragging = ref(false)
const removingThumb = ref(false)

const galleryInput    = ref()
const galleryPreviews = ref([])
const removedGallery  = ref([])


watch(() => props.initialData, (d) => {
  if (!d?.id) return
  Object.assign(form, {
    title_ar: d.title_ar??'', title_en: d.title_en??'',
    short_desc_ar: d.short_desc_ar??'', short_desc_en: d.short_desc_en??'',
    content_ar: d.content_ar??'', content_en: d.content_en??'',
    client_name: d.client_name??'', project_url: d.project_url??'',
    case_study_url: d.case_study_url??'', category_id: d.category_id??null,
    tags: d.tags??[], results: d.results??[], status: d.status??'draft',
    featured: d.featured??false, sort_order: d.sort_order??0,
    meta_title_ar: d.meta_title_ar??'', meta_title_en: d.meta_title_en??'',
    meta_description_ar: d.meta_description_ar??'', meta_description_en: d.meta_description_en??'',
  })
  if (d.thumbnail) thumbPreview.value = d.thumbnail
  if (d.gallery?.length) {
    galleryPreviews.value = d.gallery.map(url => ({ preview: url, existing: url, file: null }))
  }
  nextTick(() => {
    if (editorRefs.ar) editorRefs.ar.innerHTML = form.content_ar
    if (editorRefs.en) editorRefs.en.innerHTML = form.content_en
  })
}, { immediate: true })

const editorRefs = reactive({ ar: null, en: null })
function setEditorRef(l, el) { editorRefs[l] = el }
function execCmd(cmd, val = null) {
  document.execCommand(cmd, false, val)
  editorRefs[lang.value]?.focus()
}
function onEditorInput(l) {
  form[`content_${l}`] = editorRefs[l]?.innerHTML ?? ''
}


function onThumbDrop(e) {
  thumbDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) setThumb(file)
}
function onThumbSelect(e) { if (e.target.files[0]) setThumb(e.target.files[0]) }
function setThumb(file) {
  thumbFile.value = file; removingThumb.value = false
  const r = new FileReader()
  r.onload = () => (thumbPreview.value = r.result)
  r.readAsDataURL(file)
}
function removeThumb() { thumbPreview.value = null; thumbFile.value = null; removingThumb.value = true }


function onGallerySelect(e) {
  Array.from(e.target.files).forEach(file => {
    const r = new FileReader()
    r.onload = () => galleryPreviews.value.push({ preview: r.result, file, existing: null })
    r.readAsDataURL(file)
  })
}
function removeGalleryItem(idx, existingUrl) {
  if (existingUrl) removedGallery.value.push(existingUrl)
  galleryPreviews.value.splice(idx, 1)
}

const tagInput = ref('')
function addTag() {
  const t = tagInput.value.trim()
  if (t && !form.tags.includes(t)) form.tags.push(t)
  tagInput.value = ''
}
function addResult() { form.results.push({ label_ar: '', label_en: '', value: '' }) }

function buildFormData() {
  const fd = new FormData()
  ;['title_ar','title_en','short_desc_ar','short_desc_en','content_ar','content_en',
    'client_name','project_url','case_study_url','status','sort_order',
    'meta_title_ar','meta_title_en','meta_description_ar','meta_description_en',
  ].forEach(f => fd.append(f, form[f] ?? ''))
  fd.append('featured', form.featured ? '1' : '0')
  if (form.category_id) fd.append('category_id', form.category_id)
  form.tags.forEach(t => fd.append('tags[]', t))

  // form.results.forEach((r, i) => {
  //   fd.append(`results[${i}][label_ar]`, r.label_ar)
  //   fd.append(`results[${i}][label_en]`, r.label_en)
  //   fd.append(`results[${i}][value]`,    r.value)
  // })
form.results
  .filter(r =>
    r.label_ar?.trim() ||
    r.label_en?.trim() ||
    r.value?.trim()
  )
  .forEach((r, i) => {
    fd.append(`results[${i}][label_ar]`, r.label_ar)
    fd.append(`results[${i}][label_en]`, r.label_en)
    fd.append(`results[${i}][value]`, r.value)
  })

  if (thumbFile.value)     fd.append('thumbnail', thumbFile.value)
  if (removingThumb.value) fd.append('remove_thumbnail', '1')
  galleryPreviews.value.filter(g => g.file).forEach(g => fd.append('gallery[]', g.file))
  removedGallery.value.forEach(url => fd.append('remove_gallery[]', url))
  return fd
}
</script>

<style scoped>
.form-input.error,
.rich-editor.error,
select.error {
  border-color: #e53e3e !important;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.12);
}

.error-msg {
  color: #e53e3e;
  font-size: 0.78rem;
  margin-top: 4px;
  display: block;
}

.portfolio-form { max-width:1200px; }
.form-layout { display:grid; grid-template-columns:1fr 340px; gap:24px; align-items:start; }
@media (max-width:900px) { .form-layout { grid-template-columns:1fr; } }
.form-card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 4px 20px rgba(22,47,187,.06); margin-bottom:20px; }
.lang-tabs { display:flex; margin-bottom:20px; border:1.5px solid #D0D6E5; border-radius:8px; overflow:hidden; }
.lang-tabs button { flex:1; padding:9px 16px; background:none; border:none; cursor:pointer; font-size:.875rem; transition:.2s; }
.lang-tabs button.active { background:#162FBB; color:#fff; }
.form-label { display:block; font-size:.875rem; font-weight:600; color:#2d3748; margin-bottom:8px; }
.sub-label  { display:block; font-size:.8rem; color:#666; margin-bottom:5px; }
.required   { color:#e53e3e; }
.mt         { margin-top:14px; }
.form-input { width:100%; padding:9px 12px; border:1.5px solid #D0D6E5; border-radius:8px; font-size:.875rem; outline:none; transition:.2s; background:#fafbff; box-sizing:border-box; }
.form-input:focus { border-color:#162FBB; box-shadow:0 0 0 3px rgba(22,47,187,.1); }
.form-input.error { border-color:#e53e3e; }
.error-msg  { color:#e53e3e; font-size:.78rem; margin-top:4px; }
.hint       { color:#aaa; font-size:.8rem; margin:0; }
.section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.section-header .form-label { margin:0; }
.btn-add-small { padding:5px 12px; background:#ebf4ff; color:#162FBB; border:none; border-radius:6px; cursor:pointer; font-size:.8rem; font-weight:600; display:flex; align-items:center; gap:4px; }
.rich-toolbar { display:flex; gap:4px; flex-wrap:wrap; padding:8px; background:#f7f8fc; border:1.5px solid #D0D6E5; border-bottom:none; border-radius:8px 8px 0 0; }
.rich-toolbar button { width:30px; height:30px; border:1.5px solid #D0D6E5; border-radius:5px; background:#fff; cursor:pointer; font-size:.8rem; display:flex; align-items:center; justify-content:center; }
.rich-toolbar button:hover { background:#162FBB; color:#fff; border-color:#162FBB; }
.rich-toolbar .sep { width:1px; background:#D0D6E5; margin:4px 2px; }
.rich-editor { min-height:200px; padding:14px; border:1.5px solid #D0D6E5; border-radius:0 0 8px 8px; outline:none; font-size:.9rem; line-height:1.7; }
.rich-editor:focus { border-color:#162FBB; }
.results-list { display:flex; flex-direction:column; gap:8px; }
.result-row { display:grid; grid-template-columns:1fr 1fr 1fr auto; gap:8px; align-items:center; }
.btn-remove { width:30px; height:30px; background:#fff5f5; border:1.5px solid #fed7d7; border-radius:6px; color:#e53e3e; cursor:pointer; display:flex; align-items:center; justify-content:center; }
.seo-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media (max-width:600px) { .seo-grid { grid-template-columns:1fr; } }
.toggle-row { display:flex; align-items:center; gap:8px; margin:14px 0; font-size:.875rem; cursor:pointer; }
.form-actions { display:flex; gap:10px; margin-top:16px; }
.btn { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; border-radius:8px; font-size:.875rem; font-weight:600; cursor:pointer; border:none; transition:.2s; flex:1; justify-content:center; }
.btn-primary { background:#162FBB; color:#fff; }
.btn-primary:hover { background:#1228a0; }
.btn-outline { background:transparent; border:1.5px solid #D0D6E5; color:#444; }
.btn:disabled { opacity:.6; cursor:not-allowed; }
.upload-zone { border:2px dashed #D0D6E5; border-radius:10px; padding:24px; text-align:center; cursor:pointer; transition:.2s; display:flex; flex-direction:column; align-items:center; gap:6px; color:#888; font-size:.875rem; }
.upload-zone:hover,.upload-zone.dragging { border-color:#162FBB; background:#f0f4ff; color:#162FBB; }
.upload-zone i { font-size:2rem; }
.thumb-preview { max-height:180px; border-radius:8px; object-fit:cover; width:100%; }
.btn-remove-thumb { margin-top:8px; width:100%; padding:6px; background:#fff5f5; border:1.5px solid #fed7d7; border-radius:7px; color:#e53e3e; cursor:pointer; font-size:.8rem; display:flex; align-items:center; justify-content:center; gap:5px; }
.gallery-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.gallery-item { position:relative; border-radius:8px; overflow:hidden; aspect-ratio:1; }
.gallery-item img { width:100%; height:100%; object-fit:cover; }
.gallery-item button { position:absolute; top:3px; right:3px; background:rgba(0,0,0,.55); border:none; border-radius:50%; width:20px; height:20px; color:#fff; cursor:pointer; font-size:.75rem; display:flex; align-items:center; justify-content:center; }
.gallery-add { aspect-ratio:1; border:2px dashed #D0D6E5; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#bbb; font-size:1.4rem; transition:.2s; }
.gallery-add:hover { border-color:#162FBB; color:#162FBB; }
.tag-input-wrap { border:1.5px solid #D0D6E5; border-radius:8px; padding:8px; background:#fafbff; }
.tag-chips { display:flex; flex-wrap:wrap; gap:5px; margin-bottom:6px; }
.tag-chip { background:#ebf4ff; color:#162FBB; padding:3px 10px; border-radius:12px; font-size:.78rem; display:flex; align-items:center; gap:4px; }
.tag-chip button { background:none; border:none; cursor:pointer; color:#162FBB; }
.tag-input { border:none; outline:none; width:100%; font-size:.875rem; background:transparent; }
@keyframes spin { to { transform:rotate(360deg); } }
.spin { animation:spin .8s linear infinite; display:inline-block; }
</style>
