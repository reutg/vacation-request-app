<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import RequestStatsCards from '@/components/Validator/RequestStatsCards.vue'
import UpcomingVacationCard from '@/components/Validator/UpcomingVacationCard.vue'
import ValidatorRequests from '@/components/Validator/ValidatorRequests.vue'
import {
  getVacationRequests,
  getVacationRequestStats,
  type VacationRequest,
  type VacationRequestStats,
  type VacationRequestStatus,
} from '@/api/vacationRequestsApi'
import { pickNextUpcomingApproved, toYmdLocal } from '@/utils/vacationDates'

const requests = ref<VacationRequest[]>([])
const loading = ref(false)
const errorMessage = ref('')
const statusFilter = ref<VacationRequestStatus | null>(null)

const stats = ref<VacationRequestStats>({ total: 0, approved: 0, pending: 0, rejected: 0 })
const statsLoading = ref(false)

const approvedForUpcoming = ref<VacationRequest[]>([])
const upcomingLoading = ref(false)

const upcomingVacation = computed(() =>
  pickNextUpcomingApproved(approvedForUpcoming.value, toYmdLocal(new Date())),
)

const loadStats = async () => {
  statsLoading.value = true
  try {
    stats.value = await getVacationRequestStats()
  } catch {
    stats.value = { total: 0, approved: 0, pending: 0, rejected: 0 }
  } finally {
    statsLoading.value = false
  }
}

const loadApprovedForUpcoming = async () => {
  upcomingLoading.value = true
  try {
    approvedForUpcoming.value = await getVacationRequests({ status: 'Approved' })
  } catch {
    approvedForUpcoming.value = []
  } finally {
    upcomingLoading.value = false
  }
}

const loadRequests = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    requests.value = await getVacationRequests(
      statusFilter.value ? { status: statusFilter.value } : undefined,
    )
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to load requests'
  } finally {
    loading.value = false
  }
}

const refreshListAndStats = async () => {
  await Promise.all([loadStats(), loadRequests(), loadApprovedForUpcoming()])
}

onMounted(() => {
  void refreshListAndStats()
})

watch(statusFilter, () => {
  void loadRequests()
})
</script>

<template>
  <main>
    <RequestStatsCards
      v-model:status-filter="statusFilter"
      :stats="stats"
      :loading="statsLoading"
    />
    <UpcomingVacationCard :vacation="upcomingVacation" :loading="upcomingLoading" />
    <ValidatorRequests
      v-model:status-filter="statusFilter"
      :requests="requests"
      :loading="loading"
      :error-message="errorMessage"
      @updated="refreshListAndStats"
    />
  </main>
</template>

<style scoped>
main {
  padding: 16px;
}
</style>
