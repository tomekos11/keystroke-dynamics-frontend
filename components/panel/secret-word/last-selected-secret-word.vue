<template>
  <UCard
    v-if="userStore.activeSecretWord"
    class="bg-gray-800"
  >
    <div>
      Ostatnio wybrane słowo  
    </div>

    <div class="flex items-center gap-4">
      <UIcon name="i-heroicons-globe-alt" class="w-8 h-8 text-primary" />
      <div>
        <h3 class="font-semibold text-start">{{ userStore.activeSecretWord.word }}</h3>
        <p class="text-gray-500 text-sm text-start">
          Liczba modeli: {{ userStore.activeSecretWord.modelCount }}
        </p>
        <div class="flex gap-2 mt-2">
          <UButton label="Dodaj model" variant="ghost" :loading="loading" @click="addModel()"/>
          <UButton 
            label="Zmień sekretne słowo" 
            color="secondary"
            variant="ghost"
            @click="showChangeWordModal = true"
          />
        </div>
      </div>
    </div>

    <panel-secret-word-change-modal v-model="showChangeWordModal" />

    <UModal v-model:open="loading" title="Trwa tworzenie modelu">

      <template #body>
        Model jest tworzony, to może chwilę zająć. Proszę czekać.
        <UProgress v-model="progress" />
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';

const userStore = useUserStore();
const showChangeWordModal = ref(false);
const toast = useToast();

const loading = ref<boolean>(false);
const progress = ref(null);

const addModel = async () => {
  if(!userStore.activeSecretWord) return;

  loading.value = true;
  try {
    const res = await useFetchWithAuth<{message: string, success: boolean}>('/keystrokes/make-model', {
      params: {
        secretWord: userStore.activeSecretWord.word
      }
    });

    userStore.activeSecretWord.modelCount++;
    // models.value?.splice(index, 1);
    toast.add({
      title: res.message
    });
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

</script>
