<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable'
import Message from 'primevue/message'

import RequestFormDialog from '@/components/Requester/RequestFormDialog.vue'
import StatusPill from '@/components/StatusPill.vue'
import TruncatedText from '@/components/TruncatedText.vue'
import RequestDetailsDialog from '@/components/RequestDetailsDialog.vue'
import type { VacationRequest } from '@/api/vacationRequestsApi'
import { formatDisplayDate } from '@/utils/format'

const props = defineProps<{
  requests: VacationRequest[]
  loading?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  created: []
}>()

const formVisible = ref(false)
const requestDetailsVisible = ref(false)
const requestDetails = ref<VacationRequest | null>(null)

const onRequestCreated = () => {
  formVisible.value = false
  emit('created')
}

const onRowClick = (event: DataTableRowClickEvent) => {
  requestDetailsVisible.value = true
  requestDetails.value = event.data as VacationRequest
}
</script>

<template>
  <div>
    <Message v-if="errorMessage" severity="error" class="list-message" :closable="false">
      {{ errorMessage }}
    </Message>

    <DataTable
      class="requests-table"
      size="small"
      tableStyle="min-width: 50rem"
      :value="props.requests"
      :loading="props.loading"
      @row-click="onRowClick"
    >
      <template #header>
        <div class="table-header">
          <h6 class="table-header-title">My requests</h6>

          <Button type="button" label="New request" icon="pi pi-plus" @click="formVisible = true" />
        </div>
      </template>

      <template #empty>
        <div class="empty-state">You have no vacation requests yet.</div>
      </template>

      <Column field="startDate" header="Start Date">
        <template #body="{ data }">
          {{ formatDisplayDate(data.startDate) }}
        </template>
      </Column>

      <Column field="endDate" header="End Date">
        <template #body="{ data }">
          {{ formatDisplayDate(data.endDate) }}
        </template>
      </Column>

      <Column field="reason" header="Reason" :style="{ maxWidth: '14rem' }">
        <template #body="{ data }">
          <TruncatedText :text="data.reason" />
        </template>
      </Column>

      <Column field="status" header="Status">
        <template #body="{ data }">
          <StatusPill :status="data.status" />
        </template>
      </Column>
    </DataTable>

    <RequestFormDialog
      v-model:form-visible="formVisible"
      :existing-requests="props.requests"
      @created="onRequestCreated"
    />

    <RequestDetailsDialog
      v-if="requestDetails"
      v-model:visible="requestDetailsVisible"
      :request="requestDetails"
    />
  </div>
</template>

<style scoped>
.p-datatable {
  border: 1px solid var(--color-border);
  padding: 16px;
  width: 100%;
  margin: 0 auto;
  background: var(--color-white);
}

.requests-table :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.empty-state {
  padding: 1.5rem 0.5rem;
  text-align: center;
  color: var(--color-text-muted);
}

.list-message {
  margin-bottom: 12px;
}

.table-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
}

.table-header-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-heading);
}

.request-dialog :deep(.p-dialog-content) {
  padding-top: 0;
}
</style>
