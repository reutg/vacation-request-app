<script setup lang="ts">
import DatePicker from 'primevue/datepicker'
import Message from 'primevue/message'

defineProps<{
  name: string
  label: string
  error?: string
  invalid?: boolean
  minDate?: Date
}>()
</script>

<template>
  <div class="form-field">
    <label :for="name">{{ label }}</label>

    <DatePicker
      :name="name"
      :input-id="name"
      dateFormat="dd/mm/yy"
      show-icon
      fluid
      :min-date="minDate"
    />

    <Message v-if="invalid" severity="error" size="small" variant="simple">
      {{ error }}
    </Message>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
</style>
