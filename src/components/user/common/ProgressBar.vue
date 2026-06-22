<template>
  <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
</template>

<script setup>
defineProps({
  progressWidth: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #18B2BC 0%, #17284A 100%);
  z-index: 1002;
  transition: width 0.1s ease-out;
  box-shadow: 0 0 10px rgba(24, 178, 188, 0.5);
  animation: progressGlow 2s infinite;
}

@keyframes progressGlow {
  0%   { box-shadow: 0 0 5px  rgba(24, 178, 188, 0.5); }
  50%  { box-shadow: 0 0 15px rgba(24, 178, 188, 0.9); }
  100% { box-shadow: 0 0 5px  rgba(24, 178, 188, 0.5); }
}
</style>
