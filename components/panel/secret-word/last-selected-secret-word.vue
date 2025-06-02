<template>
  <UCard
    v-if="userStore.activeSecretWord"
    class="bg-transparent"
  >
    <h2 class="text-2xl font-bold tracking-tight text-primary drop-shadow-sm">
      Ostatnio wybrane słowo
    </h2>

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

    <UModal v-model:open="showModal" title="Tworzenie modelu">
      <template #body>
        <div v-if="loading">
          Model jest tworzony, to może chwilę zająć. Proszę czekać.
          <UProgress v-model="progress" />
        </div>
        <div v-else class="text-center flex flex-col items-center gap-2">
          <div class="flex items-center justify-center gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
            Osiągnięto maksymalną liczbę modeli (5)
          </div>
          <UButton label="Przejdź do swoich modeli" variant="ghost" to="/panel?mode=models" />
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';

const userStore = useUserStore();
const showChangeWordModal = ref(false);
const toast = useToast();

const showModal = ref(false);
const loading = ref<boolean>(false);
const progress = ref(null);

const addModel = async () => {
  if(!userStore.activeSecretWord) return;

  loading.value = true;
  showModal.value = true;
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

    showModal.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

</script>
