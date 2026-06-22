<template>
  <div>
    <div class="page-header">
      <router-link to="/admin/portfolio" class="back-btn"><i class="bi bi-arrow-right"></i></router-link>
      <h1 class="page-title"><i class="bi bi-plus-circle"></i> إضافة عمل جديد</h1>
    </div>
    <PortfolioForm
      :categories="categories" :errors="errors" :loading="loading" :is-edit="false"
      @submit="handleSubmit" @cancel="$router.push('/admin/portfolio')"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PortfolioForm from './PortfolioForm.vue'
import { usePortfolio } from '@/composables/usePortfolio'

const router = useRouter()
const { categories, errors, loading, fetchCategories, createItem } = usePortfolio()

async function handleSubmit(formData) {
  try { await createItem(formData); router.push('/admin/portfolio') } catch {}
}
onMounted(fetchCategories)
</script>

<style scoped>
.page-header { display:flex; align-items:center; gap:12px; margin-bottom:28px; }
.back-btn { width:36px; height:36px; border-radius:8px; background:#fff; border:1.5px solid #D0D6E5; display:flex; align-items:center; justify-content:center; color:#444; text-decoration:none; }
.back-btn:hover { border-color:#162FBB; color:#162FBB; }
.page-title { font-size:1.4rem; font-weight:700; color:#0A1870; margin:0; display:flex; align-items:center; gap:8px; }
</style>



