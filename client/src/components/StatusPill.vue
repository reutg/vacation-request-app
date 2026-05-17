<script setup lang="ts">
import { computed } from 'vue'
import type { VacationRequestStatus } from '@/api/vacationRequestsApi'

export type StatusPillValue = VacationRequestStatus | 'pending' | 'approved' | 'rejected'

const props = defineProps<{
  status: StatusPillValue
}>()

type Normalized = 'pending' | 'approved' | 'rejected'

const normalized = computed<Normalized>(() => {
  const raw = String(props.status)
  const key = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
  const map: Record<string, Normalized> = {
    Pending: 'pending',
    Approved: 'approved',
    Rejected: 'rejected',
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
  }
  return map[raw] ?? map[key] ?? 'pending'
})

const label = computed(() => {
  switch (normalized.value) {
    case 'approved':
      return 'Approved'
    case 'rejected':
      return 'Rejected'
    case 'pending':
    default:
      return 'Pending'
  }
})

const variantClass = computed(() => `status-pill--${normalized.value}`)
</script>

<template>
  <span class="status-pill" :class="variantClass">{{ label }}</span>
</template>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 0.2rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  border: 1px solid transparent;
  white-space: nowrap;
}

.status-pill--approved {
  background: var(--color-approved-pill-bg);
  color: var(--color-approved-pill-text);
  border-color: var(--color-approved-pill-border);
}

.status-pill--rejected {
  background: var(--color-rejected-pill-bg);
  color: var(--color-rejected-pill-text);
  border-color: var(--color-rejected-pill-border);
}

.status-pill--pending {
  background: var(--color-pending-pill-bg);
  color: var(--color-pending-pill-text);
  border-color: var(--color-pending-pill-border);
}
</style>
