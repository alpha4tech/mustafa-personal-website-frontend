<template>
  <Transition name="loader">
    <div v-if="visible" id="page-loader">
      <div class="loader-inner">

        <div class="rings-wrap">
          <svg width="120" height="120" viewBox="0 0 120 120" class="ring-svg absolute">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(22,47,187,0.15)" stroke-width="10"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#162FBB" stroke-width="10"
              stroke-dasharray="80 260" stroke-linecap="round" class="spin-a"/>
          </svg>

          <svg width="86" height="86" viewBox="0 0 86 86" class="ring-svg absolute" style="inset:17px;">
            <circle cx="43" cy="43" r="37" fill="none" stroke="rgba(231,174,24,0.15)" stroke-width="7"/>
            <circle cx="43" cy="43" r="37" fill="none" stroke="#E7AE18" stroke-width="7"
              stroke-dasharray="45 188" stroke-linecap="round" class="spin-b"/>
          </svg>

          <svg width="52" height="52" viewBox="0 0 52 52" class="ring-svg absolute" style="inset:34px;">
            <circle cx="26" cy="26" r="25" fill="none" stroke="#E7AE18" stroke-width="0.5" class="ripple-1"/>
            <circle cx="26" cy="26" r="25" fill="none" stroke="#E7AE18" stroke-width="0.5" class="ripple-2"/>
          </svg>

          <div class="loader-core">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 20L7 4L12 14L17 4L21 20"/>
              <path d="M7 14H17"/>
            </svg>
          </div>
        </div>

        <svg width="200" height="3" viewBox="0 0 200 3">
          <rect x="0" y="0" width="200" height="3" rx="2" fill="rgba(255,255,255,0.07)"/>
          <rect x="0" y="0" width="200" height="3" rx="2" fill="none"
            stroke="url(#loaderGrad)" stroke-width="3"
            stroke-dasharray="110 220" stroke-linecap="round" class="bar-flow"/>
          <defs>
            <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0A1870"/>
              <stop offset="50%" stop-color="#162FBB"/>
              <stop offset="100%" stop-color="#E7AE18"/>
            </linearGradient>
          </defs>
        </svg>

        <div class="dots">
          <div class="dot" style="animation-delay:0s"/>
          <div class="dot" style="animation-delay:0.2s; background:#162FBB;"/>
          <div class="dot" style="animation-delay:0.4s"/>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)

onMounted(() => {
  window.addEventListener('load', () => {
    setTimeout(() => { visible.value = false }, 300)
  })

  // احتياطي — يختفي بعد 4 ثواني على أي حال
  setTimeout(() => { visible.value = false }, 4000)
})
</script>

<style scoped>
#page-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #0A1870;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.rings-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
}

.loader-core {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #162FBB, #E7AE18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  animation: pulseCore 2s ease-in-out infinite;
}

.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #E7AE18;
  animation: dotPop 1.2s ease-in-out infinite;
}

.spin-a {
  transform-origin: 60px 60px;
  animation: spinA 1.6s cubic-bezier(0.4,0,0.2,1) infinite;
}

.spin-b {
  transform-origin: 43px 43px;
  animation: spinB 1.1s linear infinite;
}

.ripple-1 { animation: ripple 2s ease-out infinite; opacity: 0; }
.ripple-2 { animation: ripple 2s 0.8s ease-out infinite; opacity: 0; }
.bar-flow  { animation: barFlow 1.8s ease-in-out infinite; }

.loader-enter-active,
.loader-leave-active { transition: opacity 0.6s ease; }
.loader-enter-from,
.loader-leave-to    { opacity: 0; }

@keyframes spinA    { to { transform: rotate(360deg); } }
@keyframes spinB    { to { transform: rotate(-360deg); } }
@keyframes pulseCore{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(0.88);opacity:0.7} }
@keyframes ripple   { 0%{r:18;opacity:0.5} 100%{r:60;opacity:0} }
@keyframes barFlow  { 0%{stroke-dashoffset:220} 100%{stroke-dashoffset:-220} }
@keyframes dotPop   { 0%,100%{transform:scale(0.6);opacity:0.25} 50%{transform:scale(1);opacity:1} }
</style>
