<template>
  <ServiceForm :service-id="$route.params.id" />
</template>

<script setup>
import ServiceForm from './ServiceForm.vue'
</script>
