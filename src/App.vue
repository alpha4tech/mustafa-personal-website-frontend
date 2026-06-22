<script setup>
import PageLoader from '@/components/PageLoader.vue'
import AppConfirm from '@/components/AppConfirm.vue'
</script>

<template>
  <PageLoader />
  <AppConfirm />
  <router-view />
</template>

<style>
@import './styles/colors.css';
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--color-bg);
  color: var(--text-primary);
  font-family: 'Poppins', 'Cairo', sans-serif;
}
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-gray-light);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-teal);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-teal-dark);
}
</style>

