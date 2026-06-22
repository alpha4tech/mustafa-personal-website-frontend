import { ref, reactive } from 'vue'
import api from '@/services/api'
import translations from '@/translations/index.js'

const locale = ref(localStorage.getItem('locale') || 'ar')
const darkMode = ref(localStorage.getItem('darkMode') === 'true')

const BASE = '/admin/portfolio'
const CAT_BASE = '/admin/portfolio/categories'

export function usePortfolio() {
  const toggleLocale = () => {
    const newLocale = locale.value === 'en' ? 'ar' : 'en'
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLocale)
  }

  const t = (key, variables = {}) => {
    let text = translations[locale.value][key] || key

    Object.keys(variables).forEach(varKey => {
      text = text.replace(
        new RegExp(`{{${varKey}}}`, 'g'),
        variables[varKey]
      )
    })

    return text
  }

  const items = ref([])
  const item = ref(null)
  const categories = ref([])
  const pagination = ref({})
  const loading = ref(false)
  const errors = ref({})

  const filters = reactive({
    search: '',
    status: '',
    category: '',
    featured: '',
    per_page: 12,
    page: 1,
  })

  // ─────────────────────────────────────────────
  // Fetch Items
  // ─────────────────────────────────────────────
  async function fetchItems() {
    loading.value = true

    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== '')
      )

      const { data } = await api.get(BASE, { params })

      items.value = data.data || []
      pagination.value = data.meta || {}
    } catch (error) {
      console.error('Fetch Items Error:', error)
    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // Fetch Single Item
  // ─────────────────────────────────────────────
  async function fetchItem(id) {
    loading.value = true
    item.value = null

    try {
      const { data } = await api.get(`${BASE}/${id}`)
      item.value = data.data
    } catch (error) {
      console.log(error.response.data.errors)
      // console.error('Fetch Item Error:', error)
    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // Fetch Categories
  // ─────────────────────────────────────────────
  async function fetchCategories() {
    try {
      const { data } = await api.get(CAT_BASE)
      categories.value = data.data || []
    } catch (error) {
      console.error('Fetch Categories Error:', error)
    }
  }

  // ─────────────────────────────────────────────
  // Create Item
  // ─────────────────────────────────────────────
  async function createItem(formData) {
    errors.value = {}
    loading.value = true

    try {
      const { data } = await api.post(BASE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return data.data
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors || {}
      }

      console.error('Create Item Error:', error.response || error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // Update Item
  // ─────────────────────────────────────────────
  async function updateItem(id, formData) {
    errors.value = {}
    loading.value = true

    try {
      const { data } = await api.post(`${BASE}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return data.data
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors || {}
      }

      console.error('Update Item Error:', error.response || error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ─────────────────────────────────────────────
  // Delete Item
  // ─────────────────────────────────────────────
  async function deleteItem(id) {
    await api.delete(`${BASE}/${id}`)
  }

  // ─────────────────────────────────────────────
  // Bulk Action
  // ─────────────────────────────────────────────
  async function bulkAction(action, ids) {
    await api.post(`${BASE}/bulk`, {
      action,
      ids,
    })
  }

  // ─────────────────────────────────────────────
  // Restore Item
  // ─────────────────────────────────────────────
  async function restoreItem(id) {
    await api.post(`${BASE}/${id}/restore`)
  }

  // ─────────────────────────────────────────────
  // Force Delete
  // ─────────────────────────────────────────────
  async function forceDeleteItem(id) {
    await api.delete(`${BASE}/${id}/force`)
  }

  // ─────────────────────────────────────────────
  // Reorder
  // ─────────────────────────────────────────────
  async function reorderItems(order) {
    await api.post(`${BASE}/reorder`, { order })
  }

  // ─────────────────────────────────────────────
  // Save Category
  // ─────────────────────────────────────────────
  async function saveCategory(category, id = null) {
    if (id) {
      const { data } = await api.put(`${CAT_BASE}/${id}`, category)
      return data.data
    }

    const { data } = await api.post(CAT_BASE, category)
    return data.data
  }

  // ─────────────────────────────────────────────
  // Delete Category
  // ─────────────────────────────────────────────
  async function deleteCategory(id) {
    await api.delete(`${CAT_BASE}/${id}`)
  }

  return {
    locale,
    darkMode,
    toggleLocale,
    t,

    items,
    item,
    categories,
    pagination,
    loading,
    errors,
    filters,

    fetchItems,
    fetchItem,
    fetchCategories,

    createItem,
    updateItem,
    deleteItem,

    bulkAction,
    restoreItem,
    forceDeleteItem,
    reorderItems,

    saveCategory,
    deleteCategory,
  }
}

// import { ref, reactive } from 'vue'
// import axios from '@/services/api'
// import translations from '@/translations/index.js'
// const locale = ref(localStorage.getItem('locale') || 'ar')
// const darkMode = ref(localStorage.getItem('darkMode') === 'true')

// const BASE = '/admin/portfolio'
// const CAT_BASE = '/admin/portfolio-categories'

// export function usePortfolio() {
//     const toggleLocale = () => {
//     const newLocale = locale.value === 'en' ? 'ar' : 'en'
//     locale.value = newLocale
//     localStorage.setItem('locale', newLocale)
//     document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
//     document.documentElement.setAttribute('lang', newLocale)
//   }

//     const t = (key, variables = {}) => {
//     let text = translations[locale.value][key] || key
//     // استبدال المتغيرات مثل {{title}}
//     Object.keys(variables).forEach(varKey => {
//       text = text.replace(new RegExp(`{{${varKey}}}`, 'g'), variables[varKey])
//     })
//     return text
//   }

//   const items      = ref([])
//   const item       = ref(null)
//   const categories = ref([])
//   const pagination = ref({})
//   const loading    = ref(false)
//   const errors     = ref({})

//   const filters = reactive({
//     search:   '',
//     status:   '',
//     category: '',
//     featured: '',
//     per_page: 12,
//     page:     1,
//   })

//   // ── Fetch list ──────────────────────────────────────────────────
//   async function fetchItems() {
//     loading.value = true
//     try {
//       const params = Object.fromEntries(
//         Object.entries(filters).filter(([, v]) => v !== '')
//       )
//       const { data } = await axios.get(BASE, { params })
//       items.value      = data.data
//       pagination.value = data.meta ?? {}
//     } finally {
//       loading.value = false
//     }
//   }

//   // ── Fetch single ────────────────────────────────────────────────
//   async function fetchItem(id) {
//     loading.value = true
//     item.value = null
//     try {
//       const { data } = await axios.get(`${BASE}/${id}`)
//       item.value = data.data
//     } finally {
//       loading.value = false
//     }
//   }

//   // ── Fetch categories ────────────────────────────────────────────
//   async function fetchCategories() {
//     const { data } = await axios.get(CAT_BASE)
//     categories.value = data.data
//   }

//   // ── Create ──────────────────────────────────────────────────────
//   async function createItem(formData) {
//     errors.value = {}
//     loading.value = true
//     try {
//       const { data } = await axios.post(BASE, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       return data.data
//     } catch (err) {
//       if (err.response?.status === 422) errors.value = err.response.data.errors
//       throw err
//     } finally {
//       loading.value = false
//     }
//   }

//   // ── Update ──────────────────────────────────────────────────────
//   async function updateItem(id, formData) {
//     errors.value = {}
//     loading.value = true
//     // Spoof PUT with _method for multipart
//     formData.append('_method', 'PUT')
//     try {
//       const { data } = await axios.post(`${BASE}/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       })
//       return data.data
//     } catch (err) {
//       if (err.response?.status === 422) errors.value = err.response.data.errors
//       throw err
//     } finally {
//       loading.value = false
//     }
//   }

//   // ── Delete (soft) ───────────────────────────────────────────────
//   async function deleteItem(id) {
//     await axios.delete(`${BASE}/${id}`)
//   }

//   // ── Bulk action ─────────────────────────────────────────────────
//   async function bulkAction(action, ids) {
//     await axios.post(`${BASE}/bulk`, { action, ids })
//   }

//   // ── Restore ─────────────────────────────────────────────────────
//   async function restoreItem(id) {
//     await axios.post(`${BASE}/${id}/restore`)
//   }

//   // ── Force delete ────────────────────────────────────────────────
//   async function forceDeleteItem(id) {
//     await axios.delete(`${BASE}/${id}/force`)
//   }

//   // ── Reorder ─────────────────────────────────────────────────────
//   async function reorderItems(order) {
//     await axios.post(`${BASE}/reorder`, { order })
//   }

//   // ── Category CRUD ────────────────────────────────────────────────
//   async function saveCategory(cat, id = null) {
//     if (id) {
//       const { data } = await axios.put(`${CAT_BASE}/${id}`, cat)
//       return data.data
//     }
//     const { data } = await axios.post(CAT_BASE, cat)
//     return data.data
//   }

//   async function deleteCategory(id) {
//     await axios.delete(`${CAT_BASE}/${id}`)
//   }

//   return {
//     items, item, categories, pagination, loading, errors, filters,
//     fetchItems, fetchItem, fetchCategories,
//     createItem, updateItem, deleteItem,
//     bulkAction, restoreItem, forceDeleteItem, reorderItems,
//     saveCategory, deleteCategory,
//   }
// }
