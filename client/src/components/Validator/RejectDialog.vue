<script setup lang="ts">
import { ref } from 'vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'

import type { VacationRequest } from '@/api/vacationRequestsApi'

defineProps<{
  rejectTarget?: VacationRequest | null
  isSubmitting?: boolean
}>()

const rejectDialogVisible = defineModel<boolean>('rejectDialogVisible', { required: true })

const emit = defineEmits<{
  confirm: [comments: string]
  cancel: []
}>()

const rejectComment = ref('')
const rejectCommentError = ref('')

const clear = () => {
  rejectComment.value = ''
  rejectCommentError.value = ''
}

const onConfirm = () => {
  const trimmed = rejectComment.value.trim()
  if (!trimmed) {
    rejectCommentError.value = 'A comment is required when rejecting a request.'
    return
  }
  rejectCommentError.value = ''

  emit('confirm', trimmed)
  clear()
}

const onCancel = () => {
  emit('cancel')
  clear()
}
</script>

<template>
  <Dialog
    v-model:visible="rejectDialogVisible"
    modal
    header="Reject vacation request"
    class="reject-dialog"
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '95vw' }"
    :dismissable-mask="true"
    @after-hide="onCancel"
  >
    <div v-if="rejectTarget" class="reject-dialog-body">
      <label for="reject-comment" class="reject-label">Comment (required)</label>
      <Textarea
        id="reject-comment"
        v-model="rejectComment"
        rows="4"
        class="reject-textarea"
        placeholder="Enter a comment for the requester…"
        fluid
        :invalid="Boolean(rejectCommentError)"
        maxlength="4000"
      />
      <Message v-if="rejectCommentError" severity="error" size="small" variant="simple">
        {{ rejectCommentError }}
      </Message>
    </div>
    <template #footer>
      <Button type="button" label="Cancel" severity="secondary" @click="onCancel" />
      <Button
        type="button"
        label="Reject request"
        icon="pi pi-times"
        text
        class="btn-vacation-reject"
        :loading="isSubmitting"
        @click="onConfirm"
      />
    </template>
  </Dialog>
</template>
