import { ref, computed, watch } from 'vue'
import translations from '@/translations/index.js'
// system settings
const locale = ref(localStorage.getItem('locale') || 'ar')
const darkMode = ref(localStorage.getItem('darkMode') === 'true')

export function useSettings() {
  // تبديل اللغة
  const toggleLocale = () => {
    const newLocale = locale.value === 'en' ? 'ar' : 'en'
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLocale)
  }

  // تبديل الوضع الليلي
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode.value
    darkMode.value = newDarkMode
    localStorage.setItem('darkMode', newDarkMode)

    if (newDarkMode) {
      document.body.classList.add('dark-mode')
      document.documentElement.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.documentElement.classList.remove('dark-mode')
    }
  }

  // دالة الترجمة مع دعم المتغيرات
  const t = (key, variables = {}) => {
    let text = translations[locale.value][key] || key
    // استبدال المتغيرات مثل {{title}}
    Object.keys(variables).forEach(varKey => {
      text = text.replace(new RegExp(`{{${varKey}}}`, 'g'), variables[varKey])
    })
    return text
  }

  // مراقبة التغييرات
  watch(locale, (newLocale) => {
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', newLocale)
  }, { immediate: true })

  watch(darkMode, (newDarkMode) => {
    if (newDarkMode) {
      document.body.classList.add('dark-mode')
      document.documentElement.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
      document.documentElement.classList.remove('dark-mode')
    }
  }, { immediate: true })

  return {
    locale,
    darkMode,
    toggleLocale,
    toggleDarkMode,
    t,
    isRtl: computed(() => locale.value === 'ar')
  }
}


