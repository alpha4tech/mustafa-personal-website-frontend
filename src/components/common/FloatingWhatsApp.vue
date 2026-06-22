<template>
  <div class="floating-whatsapp" :class="{ 'rtl-wa': isRtl }">
    <a
      :href="whatsappLink"
      target="_blank"
      rel="noopener noreferrer"
      class="whatsapp-button"
      @click="trackClick"
    >
      <div class="whatsapp-icon">
        <i class="bi bi-whatsapp"></i>
      </div>
      <div class="whatsapp-tooltip">
        <span>{{ isRtl ? 'تواصل معنا عبر واتساب' : 'Chat with us on WhatsApp' }}</span>
      </div>
      <div class="pulse-ring"></div>
      <div class="notification-badge" v-if="showNotification">
        <span>1</span>
      </div>
    </a>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettings } from '@/composables/useSettings'

const { isRtl } = useSettings()
const phoneNumber = '249122211662'
const whatsappLink = computed(() => {

  const message = isRtl.value
    ? 'مرحباً، أود الاستفسار عن خدماتكم'
    : 'Hello, I would like to inquire about your services'
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
})

const showNotification = ref(true)

onMounted(() => {
  setTimeout(() => {
    showNotification.value = false
  }, 5000)
})

const trackClick = () => {
  console.log('WhatsApp button clicked')
  // يمكن إضافة كود Google Analytics هنا
  // gtag('event', 'whatsapp_click', { 'event_category': 'contact' })
}
</script>

<style scoped>
.floating-whatsapp {
  position: fixed;
  bottom: 5rem;
  right: 3rem;
  z-index: 9999;
}

/* RTL Support */
.floating-whatsapp.rtl-wa {
  right: auto;
  left: 2rem;
}

/* Main Button */
.whatsapp-button {
  display: block;
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); */
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  cursor: pointer;
  text-decoration: none;
}

.whatsapp-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(37, 211, 102, 0.4);
}

/* Icon */
.whatsapp-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  color: var(--color-teal, #18B2BC);

  font-size: 2rem;
  animation: heartbeat 1.5s ease-in-out infinite;
}

/* Pulse Ring Animation */
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: rgba(37, 211, 102, 0.4);
  border-radius: 50%;
  animation: pulse 2s infinite;
  pointer-events: none;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  70% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0;
  }
}

/* Heartbeat Animation for Icon */
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Tooltip */
.whatsapp-tooltip {
  position: absolute;
  top: 50%;
  right: 75px;
  transform: translateY(-50%);
  background: #1e293b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

.whatsapp-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  right: -6px;
  transform: translateY(-50%);
  border-style: solid;
  border-width: 6px 0 6px 6px;
  border-color: transparent transparent transparent #1e293b;
}

.whatsapp-button:hover .whatsapp-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(-5px);
}

/* RTL Tooltip */
.rtl-wa .whatsapp-tooltip {
  right: auto;
  left: 75px;
}

.rtl-wa .whatsapp-tooltip::before {
  right: auto;
  left: -6px;
  border-width: 6px 6px 6px 0;
  border-color: transparent #1e293b transparent transparent;
}

.rtl-wa .whatsapp-button:hover .whatsapp-tooltip {
  transform: translateY(-50%) translateX(5px);
}

/* Notification Badge */
.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 22px;
  height: 22px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* RTL Notification Badge */
.rtl-wa .notification-badge {
  right: auto;
  left: -5px;
}

/* Responsive */
@media (max-width: 768px) {
  .floating-whatsapp {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .rtl-wa {
    right: auto;
    left: 1.5rem;
  }

  .whatsapp-button {
    width: 50px;
    height: 50px;
  }

  .whatsapp-icon {
    font-size: 1.6rem;
  }

  .whatsapp-tooltip {
    display: none;
  }
}

@media (max-width: 480px) {
  .floating-whatsapp {
    bottom: 1rem;
    right: 1rem;
  }

  .rtl-wa {
    right: auto;
    left: 1rem;
  }

  .whatsapp-button {
    width: 45px;
    height: 45px;
  }

  .whatsapp-icon {
    font-size: 1.4rem;
  }
}
</style>
