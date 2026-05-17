<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import Message from 'primevue/message'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable'
import Menu from 'primevue/menu'
import Select from 'primevue/select'
import type { MenuItem } from 'primevue/menuitem'

import RejectDialog from '@/components/Validator/RejectDialog.vue'
import StatusPill from '@/components/StatusPill.vue'
import TruncatedText from '@/components/TruncatedText.vue'
import RequestDetailsDialog from '@/components/RequestDetailsDialog.vue'
import {
  approveVacationRequest,
  rejectVacationRequest,
  type VacationRequest,
  type VacationRequestStatus,
} from '@/api/vacationRequestsApi'
import { formatDisplayDate } from '@/utils/format'

const props = defineProps<{
  requests: VacationRequest[]
  loading?: boolean
  errorMessage?: string
}>()

const emit = defineEmits<{
  updated: []
}>()

const statusFilter = defineModel<VacationRequestStatus | null>('statusFilter')

const statusOptions: { name: string; code: VacationRequestStatus | null }[] = [
  { name: 'All statuses', code: null },
  { name: 'Pending', code: 'Pending' },
  { name: 'Approved', code: 'Approved' },
  { name: 'Rejected', code: 'Rejected' },
]

type RowMutation = 'approve' | 'reject'

type ActiveRowAction = {
  requestId: number
  mutation: RowMutation
}

const activeRowAction = ref<ActiveRowAction | null>(null)
const actionError = ref('')

const rejectDialogVisible = ref(false)
const rejectTarget = ref<VacationRequest | null>(null)

const isRejectSubmitting = computed(() => activeRowAction.value?.mutation === 'reject')

const areRowActionsBlocked = computed(
  () => activeRowAction.value !== null || rejectDialogVisible.value,
)

const isRowMutationInProgress = (requestId: number) =>
  activeRowAction.value?.requestId === requestId

const isRowActionsButtonDisabled = (requestId: number) =>
  areRowActionsBlocked.value && !isRowMutationInProgress(requestId)

const showApproveButton = (status: VacationRequestStatus) => {
  return status === 'Pending' || status === 'Rejected'
}

const showRejectButton = (status: VacationRequestStatus) => {
  return status === 'Pending' || status === 'Approved'
}

const hasRowActions = (status: VacationRequestStatus) =>
  showApproveButton(status) || showRejectButton(status)

const rowActionsMenu = ref<InstanceType<typeof Menu> | null>(null)
const rowActionMenuItems = ref<MenuItem[]>([])

const openRowActionsMenu = async (event: Event, request: VacationRequest) => {
  const items: MenuItem[] = []
  if (showApproveButton(request.status)) {
    items.push({
      label: 'Approve',
      icon: 'pi pi-check',
      class: 'row-actions-menu-item row-actions-menu-item--approve',
      command: () => {
        void approve(request)
      },
    })
  }
  if (showRejectButton(request.status)) {
    items.push({
      label: 'Reject',
      icon: 'pi pi-times',
      class: 'row-actions-menu-item row-actions-menu-item--reject',
      command: () => {
        openRejectDialog(request)
      },
    })
  }
  rowActionMenuItems.value = items
  await nextTick()
  rowActionsMenu.value?.toggle(event)
}

const openRejectDialog = (row: VacationRequest) => {
  rejectTarget.value = row
  rejectDialogVisible.value = true
}

const closeRejectDialog = () => {
  rejectDialogVisible.value = false
  rejectTarget.value = null
}

const confirmReject = async (comments: string) => {
  const row = rejectTarget.value
  if (!row) return

  activeRowAction.value = { requestId: row.id, mutation: 'reject' }
  actionError.value = ''

  try {
    await rejectVacationRequest(row.id, { comments })
    closeRejectDialog()
    emit('updated')
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Reject failed'
  } finally {
    activeRowAction.value = null
  }
}

const approve = async (row: VacationRequest) => {
  actionError.value = ''
  activeRowAction.value = { requestId: row.id, mutation: 'approve' }
  try {
    await approveVacationRequest(row.id)
    emit('updated')
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Approve failed'
  } finally {
    activeRowAction.value = null
  }
}

const requestDetailsVisible = ref(false)
const requestDetails = ref<VacationRequest | null>(null)

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

    <Message v-if="actionError" severity="error" class="list-message" :closable="false">
      {{ actionError }}
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
          <h6 class="table-header-title">All requests</h6>

          <Select
            v-model="statusFilter"
            :options="statusOptions"
            optionLabel="name"
            optionValue="code"
            placeholder="Filter by status"
            class="w-full md:w-56"
          />
        </div>
      </template>

      <template #empty>
        <div class="empty-state">No requests found.</div>
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

      <Column field="comments" header="Comments" :style="{ maxWidth: '14rem' }">
        <template #body="{ data }">
          <TruncatedText :text="data.comments?.trim() ?? ''" />
        </template>
      </Column>

      <Column
        header="Actions"
        :exportable="false"
        :style="{ width: '1%', whiteSpace: 'nowrap' }"
        :headerStyle="{ textAlign: 'center' }"
        :bodyStyle="{ textAlign: 'center' }"
      >
        <template #body="{ data: request }">
          <div v-if="hasRowActions(request.status)" class="action-buttons">
            <Button
              type="button"
              icon="pi pi-ellipsis-v"
              text
              rounded
              severity="secondary"
              size="small"
              class="btn-row-actions"
              aria-haspopup="true"
              aria-label="Open request actions"
              :loading="isRowMutationInProgress(request.id)"
              :disabled="isRowActionsButtonDisabled(request.id)"
              @click.stop="openRowActionsMenu($event, request)"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <Menu
      ref="rowActionsMenu"
      :model="rowActionMenuItems"
      popup
      :pt="{ root: { class: 'validator-requests-row-actions-menu' } }"
    />

    <RejectDialog
      v-model:reject-dialog-visible="rejectDialogVisible"
      :reject-target="rejectTarget"
      :is-submitting="isRejectSubmitting"
      @confirm="confirmReject"
      @cancel="closeRejectDialog"
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

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
}

.btn-row-actions {
  flex-shrink: 0;
}

.btn-vacation-reject,
.btn-vacation-reject:not(:disabled):hover,
.btn-vacation-reject:not(:disabled):active {
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

.btn-vacation-reject :deep(.p-button-label) {
  color: var(--color-text) !important;
}

.btn-vacation-reject :deep(.p-button-icon),
.btn-vacation-reject :deep(.p-icon-spin) {
  color: var(--color-reject-text) !important;
}

.btn-vacation-reject:not(:disabled):hover :deep(.p-button-icon),
.btn-vacation-reject:not(:disabled):hover :deep(.p-icon-spin) {
  color: color-mix(in srgb, var(--color-reject-text) 82%, #000) !important;
}

.btn-vacation-reject:focus-visible {
  outline: 2px solid var(--color-reject-border);
  outline-offset: 2px;
}

.reject-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reject-dialog-hint {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin: 0;
}

.reject-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.reject-textarea {
  width: 100%;
}
</style>

<style>
.validator-requests-row-actions-menu .row-actions-menu-item--approve .p-menu-item-label,
.validator-requests-row-actions-menu .row-actions-menu-item--approve .p-menu-item-icon {
  color: var(--color-approve-text);
}

.validator-requests-row-actions-menu .row-actions-menu-item--reject .p-menu-item-label,
.validator-requests-row-actions-menu .row-actions-menu-item--reject .p-menu-item-icon {
  color: var(--color-reject-text);
}
</style>
