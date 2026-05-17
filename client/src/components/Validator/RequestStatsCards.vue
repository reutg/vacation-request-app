<script setup lang="ts">
import { computed } from 'vue'
import type { VacationRequestStats, VacationRequestStatus } from '@/api/vacationRequestsApi'

const props = defineProps<{
  stats: VacationRequestStats
  loading?: boolean
}>()

const statusFilter = defineModel<VacationRequestStatus | null>('statusFilter', { required: true })

const formatCount = (n: number) => {
  return new Intl.NumberFormat().format(n)
}

const statCards = computed(() => [
  {
    label: 'Requests',
    value: props.stats.total,
    className: '',
    filter: null as VacationRequestStatus | null,
  },
  {
    label: 'Approved',
    value: props.stats.approved,
    className: 'stat-card--approved',
    filter: 'Approved' as const,
  },
  {
    label: 'Pending',
    value: props.stats.pending,
    className: 'stat-card--pending',
    filter: 'Pending' as const,
  },
  {
    label: 'Rejected',
    value: props.stats.rejected,
    className: 'stat-card--rejected',
    filter: 'Rejected' as const,
  },
])

const isActive = (filter: VacationRequestStatus | null) => statusFilter.value === filter

const onCardClick = (filter: VacationRequestStatus | null) => {
  statusFilter.value = isActive(filter) ? null : filter
}
</script>

<template>
  <section class="stats" aria-label="Request overview">
    <template v-if="loading">
      <div v-for="i in 4" :key="i" class="stat-card stat-card--skeleton" aria-hidden="true">
        <div class="stat-card-value skeleton-block" />
        <div class="stat-card-label skeleton-block skeleton-block--narrow" />
      </div>
    </template>
    <template v-else>
      <button
        v-for="card in statCards"
        :key="card.label"
        type="button"
        class="stat-card"
        :class="[card.className, { 'stat-card--active': isActive(card.filter) }]"
        :aria-pressed="isActive(card.filter)"
        @click="onCardClick(card.filter)"
      >
        <p class="stat-card-value">
          {{ formatCount(card.value) }}
        </p>

        <p class="stat-card-label">
          {{ card.label }}
        </p>
      </button>
    </template>
  </section>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  display: block;
  width: 100%;
  text-align: left;
  cursor: pointer;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1rem 1.125rem;
  background: var(--color-white);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    background-color 0.15s ease;
}

.stat-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: 0 2px 6px rgb(15 23 42 / 0.08);
}

.stat-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.stat-card--active {
  background: var(--color-background-mute);
  border-color: var(--color-border-hover);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.stat-card-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-heading);
  letter-spacing: -0.02em;
}

.stat-card-label {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.stat-card--approved .stat-card-value {
  color: var(--color-approve-text);
}

.stat-card--pending .stat-card-value {
  color: var(--color-primary);
}

.stat-card--rejected .stat-card-value {
  color: var(--color-reject-text);
}

.stat-card--skeleton {
  min-height: 4.5rem;
}

.skeleton-block {
  height: 1.75rem;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    var(--color-background-mute) 0%,
    var(--color-border) 50%,
    var(--color-background-mute) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

.skeleton-block--narrow {
  margin-top: 0.5rem;
  height: 0.875rem;
  width: 55%;
}

@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}
</style>
