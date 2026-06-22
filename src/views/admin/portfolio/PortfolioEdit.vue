
<template>
  <div>
    <div class="page-header mt-4">
      <router-link to="/admin/portfolio" class="back-btn"><i class="bi bi-arrow-right"></i></router-link>
      <h1 class="page-title"><i class="bi bi-pencil-square"></i>{{ t('editProject') || 'تعديل المشروع' }}</h1>
      <span v-if="item" class="item-name">{{isRtl ? item.title_ar : item.title_en }}</span>
    </div>

    <div v-if="loading && !item" class="skeleton-form">
      <div class="skeleton-block tall"></div>
      <div class="skeleton-block"></div>
    </div>

    <PortfolioForm
      v-else-if="item"
      :initial-data="item" :categories="categories" :errors="errors"
      :loading="loading" :is-edit="true"
      @submit="handleSubmit" @cancel="$router.push('/admin/portfolio')"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PortfolioForm from './PortfolioForm.vue'
import { usePortfolio } from '@/composables/usePortfolio'
import { useSettings } from '@/composables/useSettings'
const { t, isRtl, currentLang } = useSettings()

const router = useRouter()
const route  = useRoute()
const { item, categories, errors, loading, fetchItem, fetchCategories, updateItem } = usePortfolio()

async function handleSubmit(formData) {
  try { await updateItem(route.params.id, formData); router.push('/admin/portfolio') } catch {}
}
onMounted(() => { fetchItem(route.params.id); fetchCategories() })

onMounted(async () => {
  await fetchItem(route.params.id)

  console.log('ITEM DATA =>')
  console.log(item.value)

  await fetchCategories()
})

</script>

<style scoped>
.page-header { display:flex; align-items:center; gap:12px; margin-bottom:28px; flex-wrap:wrap; }
.back-btn { width:36px; height:36px; border-radius:8px; background:#fff; border:1.5px solid #D0D6E5; display:flex; align-items:center; justify-content:center; color:#444; text-decoration:none; }
.back-btn:hover { border-color:#162FBB; color:#162FBB; }
.page-title { font-size:1.4rem; font-weight:700; color:#0A1870; margin:0; display:flex; align-items:center; gap:8px; }
.item-name { font-size:.875rem; color:#888; background:#f0f0f0; padding:3px 10px; border-radius:12px; }
.skeleton-form { display:flex; flex-direction:column; gap:16px; }
.skeleton-block { height:120px; background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%); background-size:400% 100%; animation:shimmer 1.4s infinite; border-radius:12px; }
.skeleton-block.tall { height:240px; }
@keyframes shimmer { to { background-position:-400% 0; } }
</style>
