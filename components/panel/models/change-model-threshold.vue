<template>
  <UModal
    v-model:open="showModal" title="Zmień próg poprawności modelu"
    :ui="{
      footer: 'justify-end'
    }"
  >
    <template #body>
      <div>
        Nazwa modelu: <b class="text-primary"> {{ selectedModel?.name || selectedModel?.modelName }}</b>
      </div>
      <div class="my-3">
        Próg poprawności <UBadge variant="soft" :label="`${newThreshold} %`" />
      </div>
      <USlider v-model="newThreshold" :min="10" :max="99" :default-value="selectedModel?.threshold" />

    </template>

    <template #footer>
      <UButton label="Anuluj" color="error" variant="ghost" @click="showModal = false" />
      <UButton label="Potwierdź" variant="ghost" @click="updateThreshold" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Model } from '~/types/types';

const toast = useToast();

const selectedModel = defineModel<Model | null>({
  required: true
});

watch(selectedModel, () => {
  if(selectedModel.value) {
    newThreshold.value = selectedModel.value.threshold;
  }
});

const showModal = computed({
  get: () => !!selectedModel.value,
  set: (nv) => {
    if(!nv) selectedModel.value = null;
  }
});

const newThreshold = ref(0);

const updateThreshold = async () => {
  if(!selectedModel.value) return;

  try{
    const res = await useFetchWithAuth<{acceptanceThreshold: number}>('/model/threshold', {
      method: 'patch',
      body: {
        modelName: selectedModel.value.modelName,
        threshold: newThreshold.value
      }
    });

    selectedModel.value.threshold = res.acceptanceThreshold;

    toast.add({
      title: 'Próg poprawności',
      description: `Zmieniono próg poprawności. Nowy próg wynosi ${res.acceptanceThreshold}%`
    });
    console.log(res);
  } catch (err) {
    console.error(err);
    toast.add({
      title: 'Próg poprawności',
      description: 'Błąd podczas zmiany progu'
    });
  }
};
</script>