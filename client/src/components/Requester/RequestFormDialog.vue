<script setup lang="ts">
import Dialog from 'primevue/dialog'
import RequestForm from '@/components/Requester/RequestForm.vue'
import type { VacationRequest } from '@/api/vacationRequestsApi'

defineProps<{
  existingRequests: VacationRequest[]
}>()

const formVisible = defineModel<boolean>('formVisible', { required: true })

const emit = defineEmits<{
  created: []
}>()
</script>

<template>
  <Dialog
    v-model:visible="formVisible"
    modal
    header="New vacation request"
    class="request-dialog"
    :style="{ width: '50vw' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    :dismissable-mask="true"
  >
    <RequestForm
      v-if="formVisible"
      :existing-requests="existingRequests"
      @created="emit('created')"
    />
  </Dialog>
</template>
