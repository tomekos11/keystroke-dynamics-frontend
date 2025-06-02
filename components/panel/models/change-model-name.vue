<template>
  <UModal
    v-model:open="showModal" title="Zmiana nazwy modelu"
    :ui="{
      footer: 'justify-end'
    }"
    @update:open="onOpen"
  >
    <template #body>
      <div class="text-sm mb-5">
        Dotychczasowa Nazwa modelu: <b class="text-primary"> {{ selectedModel?.name }}</b>
      </div>

      <UFormField label="Nowa Nazwa modelu)">
        <UInput
          v-model="newName"
          type="text"
          placeholder="Wpisz nazwę modelu"
          required
          class="w-[100%]"
        />
      </UFormField>

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

const showModal = computed({
  get: () => !!selectedModel.value,
  set: (nv) => {
    if(!nv) selectedModel.value = null;
  }
});

const onOpen = () => {
  newName.value = selectedModel.value?.name || '';
};

const newName = ref(selectedModel.value?.name || '');

const updateThreshold = async () => {
  if(!selectedModel.value) return;

  try{
    const res = await useFetchWithAuth<{name: string}>('/model/name', {
      method: 'patch',
      body: {
        modelName: selectedModel.value.modelName,
        name: newName.value
      }
    });

    selectedModel.value.name = res.name;

    toast.add({
      title: 'Nazwa modelu',
      description: `Zmieniono nazwę modelu. Nowa nazwa to ${res.name}%`
    });
    console.log(res);
  } catch (err) {
    console.error(err);
    toast.add({
      title: 'Nazwa modelu',
      description: 'Błąd podczas zmiany nazwy modelu'
    });
  }
};
</script>