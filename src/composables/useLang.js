import { ref } from "vue"
import { messages } from "../i18n"

const currentLang = ref("en")

export function useLang() {
  const t = (key) => messages[currentLang.value][key] || key

  const toggleLang = () => {
    currentLang.value = currentLang.value === "en" ? "ar" : "en"
    document.documentElement.dir = currentLang.value === "ar" ? "rtl" : "ltr"
  }

  return {
    t,
    toggleLang,
    currentLang
  }
}
