<template>
  <BlogForm :post-id="postId" />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed }  from 'vue'
import BlogForm from './BlogForm.vue'

const route  = useRoute()
const postId = computed(() => route.params.id)
</script>
