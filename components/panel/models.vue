<template>
  <div>
    <div class="grid grid-cols-3 gap-4">
      <UCard
        v-for="(model, idx) in models"
        :key="model.modelName"
        class="border border-slate-950 rounded-lg shadow flex flex-col gap-2 text-start bg-slate-900"
      >
        <div class="flex items-center justify-between">
          <div class="font-bold text-lg">
            Model <span class="text-primary">{{ model.modelName }}</span>
          </div>

          <UDropdownMenu :items="getDropdownItems(model, idx)">
            <UButton icon="i-lucide-settings" variant="ghost"/>

            <template #item="{ item }">
              <UButton
                :label="item.label"
                :icon="item.icon"
                :color="item.color || 'primary'"
                variant="ghost"
                size="sm"
                class="w-full justify-start"
                @click="item.click"
              />
            </template>
          </UDropdownMenu>
        </div>

        <USeparator class="mb-2"/>

        <div class="flex gap-2">
          <UBadge variant="soft" color="neutral" :label="model.secretWord" />
          <UBadge v-if="model.isActive" variant="soft" label="Aktywny" />
        </div>

        <div class="text-gray-600 text-sm mt-1">
          <div>Data trenowania:
            <span class="text-primary">
              {{ new Date(model.trainedAt).toLocaleString() }}
            </span>
          </div>

          <div>Liczba próbek:
            <span class="text-primary">
              {{ model.samplesUsed }}
            </span>
          </div>

          <div>Loss: 
            <span class="text-primary">
              {{ model.loss }}
            </span>
          </div>
        </div>
      </UCard>
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

const getDropdownItems = (model: Model, idx: number) => [
  {
    label: 'Zobacz próbki',
    icon: 'i-heroicons-eye',
    color: 'neutral',
    click: () => showSamples(model)
  },
  {
    label: 'Aktywuj',
    icon: 'i-heroicons-check',
    click: () => handleSelect(model)
  },
  {
    label: 'Usuń',
    icon: 'i-heroicons-trash',
    color: 'error',
    click: () => handleDelete(model, idx)
  }
];

// const dropdownItems = [
//   {
//     label: 'Zobacz próbki',
//     icon: 'i-heroicons-eye', // opcjonalnie
//     click: () => showSamples(model)
//   },
//   {
//     label: 'Usuń',
//     icon: 'i-heroicons-trash',
//     color: 'error',
//     click: () => handleDelete(model, idx)
//   },
//   {
//     label: 'Aktywuj',
//     icon: 'i-heroicons-check',
//     click: () => handleSelect(model)
//   }
// ];

const showSamples = () => {
  console.log(1);
};

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

const handleSelect = async (model: Model) => {
  try {
    const _models = await useFetchWithAuth<Model[]>('/model', {
      body: {
        modelName: model.modelName
      },
      method: 'patch'
    });

    models.value = _models;
    toast.add({
      title: 'Aktywacja modelu',
      description: 'Poprawnie aktywowano'
    });
  } catch (err) {
    console.error(err);
  }
};



</script>