<template>
  <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
    <div class="text-sm text-gray-700">
      {{ t('showing') }} {{ from }} {{ t('to') }} {{ to }} {{ t('of') }} {{ total }} {{ t('results') }}
    </div>
    <div class="flex gap-2">
      <button
        @click="$emit('page-changed', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ t('previous') }}
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="typeof page === 'number' ? $emit('page-changed', page) : null"
        :disabled="page === '...'"
        :class="[
          'px-3 py-1 border rounded-md transition',
          currentPage === page
            ? 'bg-blue-600 text-white'
            : page !== '...' ? 'hover:bg-gray-50' : 'cursor-default'
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="$emit('page-changed', currentPage + 1)"
        :disabled="currentPage === lastPage"
        class="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ t('next') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  lastPage: {
    type: Number,
    required: true
  },
  perPage: {
    type: Number,
    default: 15
  },
  total: {
    type: Number,
    default: 0
  }
})

defineEmits(['page-changed'])

const t = (key) => {
  const translations = {
    showing: 'عرض',
    to: 'إلى',
    of: 'من',
    results: 'نتائج',
    previous: 'السابق',
    next: 'التالي'
  }
  return translations[key] || key
}

const from = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

const to = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.total)
})

const visiblePages = computed(() => {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l

  for (let i = 1; i <= props.lastPage; i++) {
    if (i === 1 || i === props.lastPage || (i >= props.currentPage - delta && i <= props.currentPage + delta)) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
})
</script>
