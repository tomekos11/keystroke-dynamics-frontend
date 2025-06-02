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
          <UButton label="Dodaj model" variant="ghost" :loading="loading" @click="showAddModelModal = true"/>
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



    <UModal v-model:open="showAddModelModal" title="Tworzenie modelu" @after:leave="res = null">
      <template #body>

        <div v-if="loading">
          Model jest tworzony, to może chwilę zająć. Proszę czekać.
          <UProgress v-model="progress" />
        </div>

        <div v-else-if="!res">
          <UFormField label="Nazwa modelu (opcjonalnie)">
            <UInput
              v-model="newModelName"
              type="text"
              placeholder="Wpisz nazwę modelu"
              required
              class="w-[100%]"
            />
          </UFormField>

          <UFormField :label="`Próg poprawności modelu [10-99]: ${newThreshold}%`" class="mt-5">
            <USlider v-model="newThreshold" :min="10" :max="99" />
          </UFormField>
        </div>

        <!-- <div v-else-if="1">
          {{ res?.message }}
        </div> -->
        
        <div v-else class="text-center flex flex-col items-center gap-2">

          <div v-if="!res.message">
            <div class="flex items-center justify-center gap-2">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6" />
              Można dodac maksymalnie 5 modeli
            </div>
            <UButton label="Przejdź do swoich modeli" variant="ghost" to="/panel?mode=models" />
          </div>

          <div v-else>
            Poprawnie stworzono model
          </div>
        </div>
      </template>

      <template v-if="!loading && !res" #footer>
        <div>
          <UButton label="Anuluj" color="error" variant="ghost" @click="showAddModelModal = false" />
          <UButton label="Potwierdź" variant="ghost" @click="addModel" />
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';
import type { Stats } from '~/types/types';

interface Response {
  message: string;
  success: boolean;
  stats: Stats
}

const userStore = useUserStore();
const showChangeWordModal = ref(false);
const toast = useToast();

const showAddModelModal = ref(false);
const loading = ref<boolean>(false);
const progress = ref(null);

const newModelName = ref('');
const newThreshold = ref(80);
const res = ref<Response | null>(null);

const addModel = async () => {
  if(!userStore.activeSecretWord) return;

  loading.value = true;
  try {
    res.value = await useFetchWithAuth<Response>('/keystrokes/make-model', {
      params: {
        secretWord: userStore.activeSecretWord.word,
        threshold: newThreshold.value,
        name: newModelName.value
      }
    });

    userStore.activeSecretWord.modelCount++;
    toast.add({
      title: res.value.message
    });

  } catch (err) {
    console.error(err);
    res.value = err.data.message;
  } finally {
    loading.value = false;
  }
};

</script>
