<script setup lang="ts">
import { Form, type FormSubmitEvent } from '@primevue/forms'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Textarea from 'primevue/textarea'
import { yupResolver } from '@primevue/forms/resolvers/yup'
import { ref } from 'vue'
import dayjs from 'dayjs'

import DateInput from '@/components/DateInput.vue'
import { createVacationRequest, type VacationRequest } from '@/api/vacationRequestsApi'
import { selectionOverlapsRequest } from '@/utils/vacationDates'
import { vacationRequestResolver } from '@/schemas/vacationRequestForm.schema'

const props = withDefaults(
  defineProps<{
    existingRequests?: VacationRequest[]
  }>(),
  { existingRequests: () => [] },
)

const emit = defineEmits<{
  created: []
}>()

const initialValues = {
  startDate: null as Date | null,
  endDate: null as Date | null,
  reason: '',
}

const resolver = yupResolver(vacationRequestResolver)

const submitError = ref('')
const isSubmitting = ref(false)

const todayMin = dayjs().startOf('day').toDate()

type FormFieldState = { value?: unknown }

const getFormDateValue = (value: unknown): Date | null => {
  return value instanceof Date && !Number.isNaN(value.getTime()) ? value : null
}

const endDateMin = ($form: Record<string, unknown>): Date => {
  const startDate = getFormDateValue(($form.startDate as FormFieldState | undefined)?.value)

  if (!startDate) {
    return todayMin
  }

  return startDate > todayMin ? startDate : todayMin
}

const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

const hasVacationOverlap = (startDate: Date, endDate: Date, userId: number): boolean =>
  props.existingRequests.some(
    (request) =>
      request.userId === userId &&
      (request.status === 'Pending' || request.status === 'Approved') &&
      selectionOverlapsRequest(startDate, endDate, request),
  )

const overlapHint = ($form: Record<string, unknown>): string | null => {
  const startDate = ($form.startDate as FormFieldState | undefined)?.value
  const endDate = ($form.endDate as FormFieldState | undefined)?.value
  const userId = Number(import.meta.env.VITE_REQUESTER_USER_ID)

  if (!isValidDate(startDate) || !isValidDate(endDate) || !userId) {
    return null
  }

  return hasVacationOverlap(startDate, endDate, userId)
    ? 'You already have a vacation request during this period.'
    : null
}

const onFormSubmit = async (event: FormSubmitEvent<Record<string, unknown>>) => {
  const { valid, values, reset } = event
  if (!valid) return

  const { startDate, endDate, reason } = values as typeof initialValues
  const userId = Number(import.meta.env.VITE_REQUESTER_USER_ID)

  if (!userId) {
    submitError.value =
      'Set VITE_REQUESTER_USER_ID in client/.env (numeric id). If that user is missing, the server will create them on first submit.'
    return
  }

  submitError.value = ''
  isSubmitting.value = true

  try {
    await createVacationRequest({
      userId,
      startDate: startDate!,
      endDate: endDate!,
      reason,
    })
    reset()
    emit('created')
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : 'Request failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="request-form-container">
    <Message v-if="submitError" severity="error" class="submit-error" :closable="false">
      {{ submitError }}
    </Message>

    <Form
      v-slot="$form"
      :initial-values="initialValues"
      :resolver="resolver"
      @submit="onFormSubmit"
      class="request-form"
    >
      <DateInput
        name="startDate"
        label="Start date"
        :min-date="todayMin"
        :invalid="$form.startDate?.invalid"
        :error="$form.startDate?.error?.message"
      />

      <DateInput
        name="endDate"
        label="End date"
        :min-date="endDateMin($form)"
        :invalid="$form.endDate?.invalid"
        :error="$form.endDate?.error?.message"
      />

      <p v-if="overlapHint($form)" class="overlap-hint" role="status">
        {{ overlapHint($form) }}
      </p>

      <div class="form-field">
        <label for="reason">Reason</label>

        <Textarea
          fluid
          id="reason"
          name="reason"
          rows="4"
          placeholder="Why are you requesting vacation?"
        />

        <Message v-if="$form.reason?.invalid" severity="error" size="small" variant="simple">
          {{ $form.reason.error?.message }}
        </Message>
      </div>

      <Button
        type="submit"
        severity="primary"
        label="Submit"
        :loading="isSubmitting"
        :disabled="isSubmitting"
      />
    </Form>
  </div>
</template>

<style scoped>
.request-form-container {
  padding: 16px;
  width: 100%;
  background: var(--color-white);
}
.request-form-container form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.submit-error {
  margin-bottom: 12px;
}

.overlap-hint {
  margin: -8px 0 0;
  padding: 0.5rem 0.65rem;
  font-size: 0.8125rem;
  line-height: 1.35;
  color: var(--color-text-muted);
  background: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
</style>
