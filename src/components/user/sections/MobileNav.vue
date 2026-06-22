<template>
  <div v-if="isOpen" class="mobile-overlay" @click="$emit('closeMobileMenu')"></div>
  <nav :class="['mobile-nav', { open: isOpen }]">
    <a href="#home" @click.prevent="$emit('scrollTo', 'home'); $emit('closeMobileMenu')">{{ t.home }}</a>
    <a href="#about" @click.prevent="$emit('scrollTo', 'about'); $emit('closeMobileMenu')">{{ t.about }}</a>
    <a href="#services" @click.prevent="$emit('scrollTo', 'services'); $emit('closeMobileMenu')">{{ t.services }}</a>
    <a href="#contact" @click.prevent="$emit('scrollTo', 'contact'); $emit('closeMobileMenu')">{{ t.contact }}</a>
  </nav>
</template>

<script setup>
defineProps({
  t: Object,
  isOpen: Boolean
})

defineEmits(['scrollTo', 'closeMobileMenu'])
</script>

<style scoped>
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s;
}

.mobile-nav {
  position: fixed;
  top: 0;
  right: -100%;
  width: 70%;
  max-width: 300px;
  height: 100vh;
  background: white;
  padding: 5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1000;
  transition: right 0.3s ease;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.dark .mobile-nav {
  background: #1e1e1e;
}

.mobile-nav.open {
  right: 0;
}

.mobile-nav a {
  text-decoration: none;
  color: inherit;
  font-size: 1.2rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.dark .mobile-nav a {
  border-bottom-color: #333;
}

.mobile-nav a:hover {
  color: #667eea;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (min-width: 769px) {
  .mobile-nav,
  .mobile-overlay {
    display: none;
  }
}
</style>
