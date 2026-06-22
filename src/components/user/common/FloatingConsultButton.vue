<template>
  <div class="floating-consult" :class="{ rtl: locale === 'ar' }">
    <!-- Main Button -->
    <button
      class="consult-main-btn"
      :class="{ active: isOpen }"
      @click.stop="toggleMenu"
    >
      <div class="btn-content">
        <Icon
          class="btn-icon"
          :icon="isOpen ? 'mdi:close' : 'mdi:account-tie-voice'"
        />
        <span class="btn-text">{{ t.consultButton }}</span>
      </div>
      <span class="gold-accent"></span>
    </button>

    <!-- Social Icons Menu -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="social-menu">
        <a
          v-for="(social, index) in socialLinks"
          :key="social.platform"
          :href="social.link"
          target="_blank"
          rel="noopener noreferrer"
          class="social-item"
          :style="{ animationDelay: `${index * 0.06}s` }"
          @click.stop
        >
          <div class="social-icon" :style="{ background: social.color }">
            <Icon :icon="social.icon" />
          </div>
          <span class="social-name">{{ social.name }}</span>
        </a>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  t: Object
})

const locale = inject('locale', ref('ar'))
const isOpen = ref(false)

const socialLinks = ref([
  {
    platform: 'whatsapp',
    name: 'WhatsApp',
    icon: 'logos:whatsapp-icon',
    color: '#162FBB',
    link: 'https://wa.me/249924535131',
  },
  {
    platform: 'telegram',
    name: 'Telegram',
    icon: 'logos:telegram',
    color: '#0A1870',
    link: 'https://t.me/Mustafasido'
  },
  {
    platform: 'email',
    name: 'Email',
    icon: 'mdi:email-outline',
    color: '#E7AE18',
    link: 'mailto:mustafahasbsido@gmail.com'
  },
  {
    platform: 'phone',
    name: 'Phone',
    icon: 'mdi:phone-outline',
    color: '#162FBB',
    link: 'tel:+249924535131'
  },
  {
    platform: 'linkedin',
    name: 'LinkedIn',
    icon: 'logos:linkedin-icon',
    color: '#0A1870',
    link: 'https://www.linkedin.com/in/mustafahasbsido/'
  }
])

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleClickOutside = (event) => {
  const el = document.querySelector('.floating-consult')
  if (el && !el.contains(event.target) && isOpen.value) {
    isOpen.value = false
  }
}

const handleEscKey = (event) => {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscKey)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscKey)
})
</script>

<style scoped>
/* ─── Design Tokens ─────────────────────────────── */
:root {
  --primary: #162FBB;
  --dark-navy: #0A1870;
  --gold: #E7AE18;
  --light-gray: #F0F0F0;
  --neutral-gray: #D0D6E5;
}

/* ─── Container ─────────────────────────────────── */
.floating-consult {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.floating-consult.rtl {
  right: auto;
  left: 2rem;
  align-items: flex-start;
}

/* ─── Main Button ────────────────────────────────── */
.consult-main-btn {
  position: relative;
  background: linear-gradient(135deg, #162FBB 0%, #0A1870 100%);
  border: none;
  border-radius: 50px;
  padding: 0.85rem 1.6rem;
  cursor: pointer;
  box-shadow: 0 6px 24px rgba(22, 47, 187, 0.38);
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1),
              box-shadow 0.3s ease;
  overflow: hidden;
}

/* Gold left-edge accent — brand signature */
.gold-accent {
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: #E7AE18;
  transition: height 0.3s ease;
}

.consult-main-btn:hover .gold-accent {
  height: 80%;
  top: 10%;
}

.rtl .gold-accent {
  left: auto;
  right: 0;
  border-radius: 2px 0 0 2px;
}

.consult-main-btn.active {
  background: linear-gradient(135deg, #0A1870 0%, #162FBB 100%);
  box-shadow: 0 6px 24px rgba(10, 24, 112, 0.45);
}

.consult-main-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(22, 47, 187, 0.45);
}

/* Ripple on click */
.consult-main-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(231, 174, 24, 0.15);
  opacity: 0;
  transition: opacity 0.3s;
}

.consult-main-btn:active::after {
  opacity: 1;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.btn-icon {
  font-size: 1.25rem;
  transition: transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.consult-main-btn:hover .btn-icon {
  transform: scale(1.15);
}

.consult-main-btn.active .btn-icon {
  transform: rotate(90deg);
}

.btn-text {
  font-size: 0.9rem;
  white-space: nowrap;
}

/* ─── Pulse Ring (brand color) ───────────────────── */
@keyframes pulse-brand {
  0%   { box-shadow: 0 0 0 0 rgba(22, 47, 187, 0.55); }
  70%  { box-shadow: 0 0 0 12px rgba(22, 47, 187, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 47, 187, 0); }
}

.consult-main-btn {
  animation: pulse-brand 2.5s infinite;
}

.consult-main-btn:hover,
.consult-main-btn.active {
  animation: none;
}

/* ─── Social Menu ────────────────────────────────── */
.social-menu {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 190px;
}

/* ─── Social Item ────────────────────────────────── */
.social-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: #ffffff;
  border: 1px solid #D0D6E5;
  border-radius: 50px;
  padding: 0.6rem 1.1rem;
  text-decoration: none;
  box-shadow: 0 3px 12px rgba(10, 24, 112, 0.08);
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1),
              box-shadow 0.3s ease,
              border-color 0.25s ease;
  animation: slideInRight 0.35s cubic-bezier(0.34, 1.2, 0.64, 1) both;
  opacity: 0;
}

.rtl .social-item {
  flex-direction: row-reverse;
  animation-name: slideInLeft;
}

.social-item:hover {
  transform: translateX(-6px);
  box-shadow: 0 8px 24px rgba(22, 47, 187, 0.18);
  border-color: #162FBB;
}

.rtl .social-item:hover {
  transform: translateX(6px);
}

.social-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
  transition: transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.social-item:hover .social-icon {
  transform: scale(1.12) rotate(4deg);
}

.social-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0A1870;
  letter-spacing: 0.01em;
}

/* ─── Transition ─────────────────────────────────── */
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.97);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ─── Keyframes ──────────────────────────────────── */
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ─── Responsive ─────────────────────────────────── */
@media (max-width: 768px) {
  .floating-consult {
    bottom: 1rem;
    right: 1rem;
  }

  .floating-consult.rtl {
    right: auto;
    left: 1rem;
  }

  .consult-main-btn {
    padding: 0.75rem 1.25rem;
  }

  .btn-text {
    font-size: 0.82rem;
  }

  .social-menu {
    min-width: 165px;
  }

  .social-item {
    padding: 0.5rem 0.9rem;
    gap: 0.7rem;
  }

  .social-icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
    font-size: 1rem;
  }

  .social-name {
    font-size: 0.8rem;
  }
}

/* ─── Reduced Motion ─────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .consult-main-btn {
    animation: none;
  }

  .social-item,
  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: none;
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
