<template>
  <div class="max-w-md w-full mx-auto flex flex-col gap-4">
    <p class="text-muted mb-4 text-center">
      {{ item.description }}
    </p>

    <UFormField
      label="E-mail"
      class="w-full"
      :ui="{ container: 'w-full' }"
    >
      <UInput v-model="userStore.email" :disabled="true" class="w-full" />
    </UFormField>

    <UFormField
      label="Hasło"
      class="w-full"
      :ui="{ container: 'w-full' }"
    >
      <div class="flex w-full">
        <UButton label="Zmień hasło" variant="ghost" class="w-full" />
      </div>
    </UFormField>

    <UFormField
      label="Imię"
      class="w-full"
      :ui="{ container: 'w-full' }"
    >
      <UInput v-model="firstName" class="w-full" />
    </UFormField>

    <UFormField
      label="Nazwisko"
      class="w-full"
      :ui="{ container: 'w-full' }"
    >
      <UInput v-model="lastName" class="w-full" />
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { useUserStore } from '#imports';

const userStore = useUserStore();

const firstName = ref(userStore.firstName);
const lastName = ref(userStore.lastName);

defineProps<{item: TabsItem}>();

</script>