<template>
  <Transition name="fade">
    <div v-if="isLoading" class="global-loader">
      <div class="loader-spinner"></div>
      <p>{{ t('Loading') }}</p>
    </div>
  </Transition>
</template>

<script setup>
import { useSettings } from '@/composables/useSettings'
const { t, isRtl } = useSettings()

defineProps({
  isLoading: Boolean
})
</script>

<style scoped>

.global-loader {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(255,255,255,0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.loader-spinner {
  width: 56px;
  height: 56px;
  border: 5px solid #e2e8f0;
  border-top-color: var(--color-teal, #18B2BC);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

p {
  color: #475569;
  font-size: 1rem;
  font-weight: 500;
}

.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
