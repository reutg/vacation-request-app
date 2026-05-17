<script setup lang="ts">
import Menubar from 'primevue/menubar'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = [
  {
    label: 'Review Requests',
    icon: 'pi pi-check-square',
    command: () => router.push('/'),
  },
  {
    label: 'Create Request',
    icon: 'pi pi-plus',
    command: () => router.push('/request'),
  },
]
</script>

<template>
  <Menubar :model="items" />
</template>

<style scoped>
.p-menubar {
  border: none;
  height: 64px;
}
:deep(.p-menubar-mobile .p-menubar-item-content) {
  color: var(--color-text);
}

:deep(.p-menubar-mobile .p-menubar-item-icon) {
  color: var(--color-primary);
}

:deep(.p-menubar-mobile .p-menubar-item.p-focus > .p-menubar-item-content),
:deep(.p-menubar-mobile .p-menubar-item:not(.p-disabled) > .p-menubar-item-content:hover) {
  color: var(--color-heading);
}
@media (max-width: 960px) {
  :deep(.p-menubar-item-content),
  :deep(.p-menubar-item.p-focus > .p-menubar-item-content) {
    color: var(--color-heading);
  }
}
:deep(.p-menubar-mobile .p-menubar-item-active > .p-menubar-item-content) {
  color: var(--color-heading);
}

:deep(.p-menubar-mobile .p-menubar-item-active > .p-menubar-item-content .p-menubar-item-icon) {
  color: var(--color-primary);
}

:deep(.p-menubar-mobile .p-menubar-submenu-icon) {
  color: var(--color-text-muted);
}
</style>
