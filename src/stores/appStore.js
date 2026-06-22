import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // الحالة
  const darkMode = ref(false)
  const currentLang = ref('ar')
  const sidebarCollapsed = ref(false)

  // Getters
  const isRTL = computed(() => currentLang.value === 'ar')

  // Actions
  const toggleDarkMode = () => {
    darkMode.value = !darkMode.value
    saveToLocalStorage()
  }

  const setLanguage = (lang) => {
    currentLang.value = lang
    saveToLocalStorage()
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const loadPreferences = () => {
    const saved = localStorage.getItem('appPreferences')
    if (saved) {
      const preferences = JSON.parse(saved)
      darkMode.value = preferences.darkMode || false
      currentLang.value = preferences.currentLang || 'ar'
    }
  }

  const saveToLocalStorage = () => {
    const preferences = {
      darkMode: darkMode.value,
      currentLang: currentLang.value
    }
    localStorage.setItem('appPreferences', JSON.stringify(preferences))
  }

  return {
    // State
    darkMode,
    currentLang,
    sidebarCollapsed,
    
    // Getters
    isRTL,
    
    // Actions
    toggleDarkMode,
    setLanguage,
    toggleSidebar,
    loadPreferences,
    saveToLocalStorage
  }
})