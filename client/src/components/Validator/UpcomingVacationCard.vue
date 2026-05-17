<script setup lang="ts">
import type { VacationRequest } from '@/api/vacationRequestsApi'
import { formatDisplayDate } from '@/utils/format'
import { inclusiveVacationDays } from '@/utils/vacationDates'

const props = defineProps<{
  vacation: VacationRequest | null
  loading?: boolean
}>()

const dayLabel = () => {
  if (!props.vacation) return ''
  const n = inclusiveVacationDays(props.vacation.startDate, props.vacation.endDate)
  return `${n} day${n === 1 ? '' : 's'}`
}
</script>

<template>
  <section class="upcoming" aria-label="Next upcoming approved vacation">
    <template v-if="loading">
      <div class="upcoming-inner upcoming-skeleton" aria-hidden="true">
        <div class="sk-line sk-title" />
        <div class="sk-line sk-meta" />
      </div>
    </template>
    <template v-else-if="vacation">
      <div class="upcoming-inner upcoming-filled">
        <span class="pi pi-calendar upcoming-icon" aria-hidden="true" />
        <div class="upcoming-body">
          <p class="upcoming-label">Next approved vacation</p>
          <p class="upcoming-name">User ID {{ vacation.userId }}</p>
          <p class="upcoming-dates">
            {{ formatDisplayDate(vacation.startDate) }} – {{ formatDisplayDate(vacation.endDate) }}
            <span class="upcoming-days">· {{ dayLabel() }}</span>
          </p>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="upcoming-inner upcoming-empty">
        <span class="pi pi-calendar upcoming-icon muted" aria-hidden="true" />
        <p class="empty-text">No upcoming approved vacations.</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.upcoming {
  margin-bottom: 1rem;
}

.upcoming-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-white);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.upcoming-icon {
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-top: 0.1rem;
}

.upcoming-icon.muted {
  color: var(--color-text-muted);
}

.upcoming-body {
  min-width: 0;
  flex: 1;
}

.upcoming-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  margin-bottom: 0.2rem;
}

.upcoming-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.15rem;
}

.upcoming-dates {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.upcoming-days {
  color: var(--color-text-muted);
}

.upcoming-empty {
  align-items: center;
}

.empty-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.upcoming-skeleton {
  min-height: 3.25rem;
}

.sk-line {
  border-radius: 4px;
  background: var(--color-background-mute);
  height: 0.85rem;
}

.sk-title {
  width: 40%;
  margin-bottom: 0.5rem;
  height: 1rem;
}

.sk-meta {
  width: 70%;
  height: 0.75rem;
}
</style>
