import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// تحميل الترجمات
function loadMessages() {
  const context = require.context('../lang', true, /\.json$/);
  const messages = {};

  context.keys().forEach(key => {
    const lang = key.split('/')[1];
    const fileName = key.split('/')[2].replace('.json', '');

    if (!messages[lang]) {
      messages[lang] = {};
    }

    messages[lang][fileName] = context(key);
  });

  return messages;
}

export const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'ar',
  fallbackLocale: 'ar',
  messages: loadMessages()
});
