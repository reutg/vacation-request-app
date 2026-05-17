<script setup lang="ts">
import { computed } from 'vue'

import { REASON_DISPLAY_MAX_LENGTH, truncate } from '@/utils/truncate'

const props = withDefaults(
  defineProps<{
    text: string
    maxLength?: number
  }>(),
  {
    maxLength: REASON_DISPLAY_MAX_LENGTH,
  },
)

const displayText = computed(() => truncate(props.text, props.maxLength))
</script>

<template>
  <span class="truncated-text">{{ displayText }}</span>
</template>

<style scoped>
.truncated-text {
  display: block;
  overflow: hidden;
  word-break: break-word;
}
</style>
