import { createI18n } from 'vue-i18n'

// استيراد جميع ملفات الترجمة
import enCommon from '../locales/en/common.json'
import enMedicines from '../locales/en/medicines.json'
import arCommon from '../locales/ar/common.json'
import arMedicines from '../locales/ar/medicines.json'

// دمج الترجمات لكل لغة
const messages = {
  en: {
    ...enCommon,
    ...enMedicines
  },
  ar: {
    ...arCommon,
    ...arMedicines
  }
}

// تحديد اللغة الافتراضية من localStorage
const savedLocale = localStorage.getItem('locale') || 'ar'

// إنشاء i18n instance
const i18n = createI18n({
  legacy: false, // استخدام Composition API
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
  globalInjection: true, // إتاحة $t في القوالب
  missingWarn: false, // عدم التحذير للمفاتيح المفقودة
  fallbackWarn: false
})

// تغيير اتجاه الصفحة حسب اللغة
export function setupI18nDirection(locale) {
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
}

// تطبيق الاتجاه الأولي
setupI18nDirection(savedLocale)

export default i18n
