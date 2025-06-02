<template>
  <div class="max-w-md w-full mx-auto flex flex-col gap-4">
    <p class="text-muted mb-4 text-center">
      {{ item.description }}
    </p>

    <UFormField
      label="E-mail"
      class="w-full"
      :required="true"
      :ui="{ container: 'w-full' }"
    >
      <UInput v-model="userStore.email" :disabled="true" class="w-full" />
    </UFormField>

    <UFormField
      label="Imię"
      class="w-full"
      :ui="{ container: 'w-full' }"
    >
      <UInput v-model="firstName" class="w-full" placeholder="Uzupełnij swoje imie" />
    </UFormField>

    <UFormField
      label="Nazwisko"
      class="w-full"
      :ui="{ container: 'w-full' }"
    >
      <UInput v-model="lastName" class="w-full" placeholder="Uzupełnij swoje nazwisko" />
    </UFormField>

    <UButton label="Zaktualizuj dane" icon="i-lucide-save" variant="ghost" @click="updateProfile" />
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui';
import { useUserStore } from '#imports';
import type { User } from '~/types/types';

const userStore = useUserStore();

const firstName = ref(userStore.firstName);
const lastName = ref(userStore.lastName);

const toast = useToast();

defineProps<{item: TabsItem}>();

const updateProfile = async () => {

  const body: Record<string, string> = {};

  if(firstName.value) body.firstName = firstName.value;
  if(lastName.value) body.lastName = lastName.value;

  try {
    const user = await useFetchWithAuth<User>('/user/name', {
      method: 'patch',
      body
    });

    userStore.setUser(user);
    toast.add({
      title: 'Aktualizacja profilu',
      description: 'Poprawnie zaktualizowano profil'
    });
  } catch (err) {
    console.error(err);
    toast.add({
      title: 'Aktualizacja profilu',
      description: 'Błąd podczas aktualizacji'
    });
  }
};

</script>