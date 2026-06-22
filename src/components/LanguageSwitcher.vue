<template>
  <div class="language-switcher">
    <button
      @click="switchLanguage('ar')"
      :class="{ active: currentLang === 'ar' }"
      class="lang-btn"
    >
      عربي
    </button>
    <button
      @click="switchLanguage('en')"
      :class="{ active: currentLang === 'en' }"
      class="lang-btn"
    >
      English
    </button>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      currentLang: localStorage.getItem('locale') || 'ar'
    }
  },
  mounted() {
    this.setDirection();
  },
  methods: {
    switchLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem('locale', lang);

      // إرسال طلب لتغيير اللغة في Laravel
      axios.post('/change-locale', { locale: lang })
        .then(response => {
          window.location.reload();
        })
        .catch(error => {
          console.error('Language switch error:', error);
          window.location.reload();
        });

      this.setDirection();
    },
    setDirection() {
      if (this.currentLang === 'ar') {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
      }
    }
  }
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 5px;
}

.lang-btn {
  background: none;
  border: none;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.lang-btn.active {
  background-color: #3498db;
  color: white;
}

.lang-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>




<!-- <template>
  <div class="dropdown">
    <button
      class="btn btn-outline-light btn-sm dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="fas fa-globe me-1"></i>
      {{ currentLanguage.name }}
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li v-for="lang in languages" :key="lang.code">
        <a
          class="dropdown-item"
          href="#"
          @click.prevent="switchLanguage(lang.code)"
          :class="{ 'active': currentLanguage.code === lang.code }"
        >
          <i :class="lang.icon" class="me-2"></i>
          {{ lang.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()

const languages = ref([
  { code: 'ar', name: 'العربية', icon: 'fas fa-language', dir: 'rtl' },
  { code: 'en', name: 'English', icon: 'fas fa-language', dir: 'ltr' },
  { code: 'fr', name: 'Français', icon: 'fas fa-language', dir: 'ltr' }
])

const currentLanguage = computed(() => {
  return languages.value.find(lang => lang.code === appStore.currentLang) || languages.value[0]
})

const switchLanguage = (langCode) => {
  appStore.setLanguage(langCode)

  // هنا يمكنك إضافة منطق تغيير اللغة في التطبيق
  const selectedLang = languages.value.find(lang => lang.code === langCode)
  if (selectedLang) {
    document.documentElement.dir = selectedLang.dir
    document.documentElement.lang = langCode
  }
}
</script> -->
