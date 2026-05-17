<script setup lang="ts">
import { onMounted, ref } from 'vue'
import RequestsList from '@/components/Requester/RequestsList.vue'
import { getVacationRequests, type VacationRequest } from '@/api/vacationRequestsApi'

const requests = ref<VacationRequest[]>([])
const isLoadingRequests = ref(false)
const loadError = ref('')

const loadRequests = async () => {
  isLoadingRequests.value = true
  loadError.value = ''
  try {
    requests.value = await getVacationRequests()
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Failed to load requests'
  } finally {
    isLoadingRequests.value = false
  }
}

onMounted(() => {
  void loadRequests()
})
</script>

<template>
  <main>
    <RequestsList
      :requests="requests"
      :loading="isLoadingRequests"
      :error-message="loadError"
      @created="loadRequests"
    />
  </main>
</template>

<style scoped>
main {
  padding: 16px;
}
</style>
