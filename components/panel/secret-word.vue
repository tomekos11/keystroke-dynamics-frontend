<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8 text-center">



      <template v-if="userStore.activeSecretWord">
        <panel-secret-word-last-selected-secret-word class="mb-4"/>
        <panel-secret-word-add-attempt class="mb-4"/>
        <panel-secret-word-attempts-table :loading="loading" />

        <div v-if="error" class="flex items-center gap-2 justify-center text-error mt-3">
          <UIcon name="i-lucide-circle-alert" />
          {{ error }}
        </div>
      </template>
      <panel-secret-word-set v-else />

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';
import type { Attempt } from '~/types/types';

const userStore = useUserStore();
const loading = ref(false);
const error = ref<null | string>(null);


const fetchAttempts = async () => {
  if(!userStore.activeSecretWord) return;

  loading.value = true;
  error.value = null;
  try {
    const attempts = await useFetchWithAuth<Attempt[]>('/secret-word/attempts');

    if (userStore.activeSecretWord && userStore.activeSecretWord.attempts) {
      userStore.activeSecretWord.attempts = attempts;
    }

    error.value = null;
  } catch (err: any) {
    userStore.activeSecretWord.attempts = [];
    error.value = err;
  } finally {
    loading.value = false;
  }
};

fetchAttempts();

</script>