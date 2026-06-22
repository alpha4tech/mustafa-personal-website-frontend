import { ref, computed, onMounted } from 'vue'
import adminTranslations from '@/locales/admin.js'

const currentLocale = ref('en')

export function useLocale() {
  const t = computed(() => adminTranslations[currentLocale.value])

  const setLocale = (locale) => {
    if (locale === currentLocale.value) return
    currentLocale.value = locale
    localStorage.setItem('admin_locale', locale)

    // تحديث اتجاه الصفحة
    if (locale === 'ar') {
      document.documentElement.dir = 'rtl'
      document.documentElement.lang = 'ar'
      document.body.classList.add('rtl-mode')
    } else {
      document.documentElement.dir = 'ltr'
      document.documentElement.lang = 'en'
      document.body.classList.remove('rtl-mode')
    }
  }

  const initLocale = () => {
    const saved = localStorage.getItem('admin_locale')
    const browserLang = navigator.language.split('-')[0]
    const defaultLocale = (saved === 'ar' || saved === 'en') ? saved : (browserLang === 'ar' ? 'ar' : 'en')
    currentLocale.value = defaultLocale
    setLocale(defaultLocale)
  }

  onMounted(() => {
    initLocale()
  })

  return { t, currentLocale, setLocale }
}
