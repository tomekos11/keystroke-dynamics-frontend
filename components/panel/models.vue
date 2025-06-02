<template>
  <div>
    <div
      v-for="(model, idx) in models"
      :key="model.modelName"
      class="border rounded-lg p-4 shadow flex flex-col gap-2 bg-slate-950"
    >
      <div class="flex items-center justify-between">
        <div class="font-bold text-lg">
          Model: {{ model.modelName }}
          <span v-if="model.isActive" class="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">Aktywny</span>
        </div>
        <div class="flex gap-2">
          <UButton color="error" variant="solid" size="sm" @click="handleDelete(model, idx)">
            Usuń
          </UButton>
          <UButton color="primary" variant="solid" size="sm" @click="handleSelect(model)">
            Wybierz
          </UButton>
        </div>
      </div>
      <div class="text-gray-600 text-sm">
        <div>Data trenowania: {{ new Date(model.trainedAt).toLocaleString() }}</div>
        <div>Liczba próbek: {{ model.samplesUsed }}</div>
        <div>Loss: {{ model.loss }}</div>
        <div>Hasło: <span class="font-mono bg-gray-100 px-1 rounded">{{ model.secretWord }}</span></div>
      </div>
    </div>

    <div v-if="!models || models.length === 0" class="text-center text-gray-400 py-8">
      Brak modeli do wyświetlenia.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Model } from '~/types/types';

const toast = useToast();

const { data: models } = useAsyncData('models', () => {
  const res = useFetchWithAuth<Model[]>('/model/list');
  return res || [];
});

const handleDelete = async (model: Model, index: number) => {
  try {
    const res = await useFetchWithAuth<{message: string, success: boolean}>('/keystrokes/delete-model', {
      body: {
        modelName: model.modelName
      },
      method: 'post'
    });

    models.value?.splice(index, 1);
    toast.add({
      title: res.message
    });
  } catch (err) {
    console.error(err);
  }
};


</script>