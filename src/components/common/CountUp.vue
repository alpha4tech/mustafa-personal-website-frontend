<template>
  <span ref="targetEl">{{ formattedValue }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { useCountUp } from '@/composables/useCountUp'

const props = defineProps({
  // Target number to count up to. Accepts a string too, since values
  // often come straight out of translation objects (e.g. "300").
  end: { type: [Number, String], required: true },
  // Number to start counting from.
  start: { type: [Number, String], default: 1 },
  // Animation length in ms — lower is snappier.
  duration: { type: Number, default: 1500 },
  // Decimal places to keep (use 1 for ratings like "4.9").
  decimals: { type: Number, default: 0 },
  // Adds thousands separators for big numbers (e.g. 12,500).
  separator: { type: Boolean, default: false }
})

const { targetEl, displayValue } = useCountUp({
  end: Number(props.end) || 0,
  start: Number(props.start) || 1,
  duration: props.duration,
  decimals: props.decimals
})

const formattedValue = computed(() =>
  props.separator ? displayValue.value.toLocaleString() : displayValue.value
)
</script>
