<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'

import StatusPill from '@/components/StatusPill.vue'
import type { VacationRequest } from '@/api/vacationRequestsApi'
import { formatDisplayDate } from '@/utils/format'
import { inclusiveVacationDays } from '@/utils/vacationDates'

const props = defineProps<{
  request: VacationRequest
}>()

const visible = defineModel<boolean>('visible', { required: true })

const vacationDays = computed(() =>
  inclusiveVacationDays(props.request.startDate, props.request.endDate),
)

const dayLabel = computed(() => {
  const n = vacationDays.value
  return `${n} day${n === 1 ? '' : 's'}`
})

const dateRangeLabel = computed(
  () =>
    `${formatDisplayDate(props.request.startDate)} – ${formatDisplayDate(props.request.endDate)}`,
)

const validatorComment = computed(() => props.request.comments?.trim() ?? '')
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    header="Request details"
    class="request-details-dialog"
    :style="{ width: '32rem' }"
    :breakpoints="{ '575px': '95vw' }"
    :dismissable-mask="true"
  >
    <div class="request-details">
      <div class="request-details-summary">
        <span class="pi pi-calendar request-details-icon" aria-hidden="true" />
        <div class="request-details-summary-body">
          <p class="request-details-eyebrow">Vacation dates</p>
          <p class="request-details-dates">{{ dateRangeLabel }}</p>
          <p class="request-details-meta">{{ dayLabel }}</p>
        </div>
        <StatusPill class="request-details-status" :status="request.status" />
      </div>

      <dl class="request-details-fields">
        <div class="request-details-field">
          <dt class="request-details-field-label">
            <span class="pi pi-align-left" aria-hidden="true" />
            Reason
          </dt>
          <dd class="request-details-field-value">{{ request.reason }}</dd>
        </div>

        <div v-if="validatorComment" class="request-details-field">
          <dt class="request-details-field-label">
            <span class="pi pi-comment" aria-hidden="true" />
            Comment
          </dt>
          <dd class="request-details-field-value request-details-field-value--comment">
            {{ validatorComment }}
          </dd>
        </div>

        <div class="request-details-field">
          <dt class="request-details-field-label">
            <span class="pi pi-clock" aria-hidden="true" />
            Submitted
          </dt>
          <dd class="request-details-field-value">
            {{ formatDisplayDate(request.createdAt) }}
          </dd>
        </div>
      </dl>
    </div>

    <template #footer>
      <Button type="button" label="Close" severity="secondary" @click="visible = false" />
    </template>
  </Dialog>
</template>

<style scoped>
.request-details {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.request-details-summary {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-white);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.request-details-icon {
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.request-details-summary-body {
  min-width: 0;
  flex: 1;
}

.request-details-eyebrow {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  margin-bottom: 0.2rem;
}

.request-details-dates {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.15rem;
}

.request-details-meta {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin: 0;
}

.request-details-status {
  flex-shrink: 0;
  align-self: flex-start;
}

.request-details-fields {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  margin: 0;
}

.request-details-field {
  margin: 0;
}

.request-details-field-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

.request-details-field-label .pi {
  font-size: 0.75rem;
}

.request-details-field-value {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.request-details-field-value--comment {
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-background-mute);
}
</style>
