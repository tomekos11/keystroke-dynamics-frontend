<template>
  <UModal v-model:open="showChangeWordModal">
    <template #header>
      <h3 class="text-lg font-semibold">Zmień sekretne słowo</h3>
    </template>
    <template #body>
      <div>Wybierz z listy swoich sekretnych słów</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <UCard
          v-for="secret in userStore.inactiveSecretWords"
          :key="secret.id"
          class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="select(secret)"
        >
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-globe-alt" class="w-8 h-8 text-primary" />
            <div>
              <h3 class="font-semibold">{{ secret.word }}</h3>
              <p class="text-gray-500 text-sm text-start">
                Liczba modeli: {{ secret.modelCount }}
              </p>
            </div>
          </div>
        </UCard>
      </div>

      <div class="my-2">Lub wpisz nowe</div>

      <panel-secret-word-set-input/>

    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';
import type { ActiveSecretWordInfo, SecretWordInfo } from '~/types/types';

const userStore = useUserStore();
const toast = useToast();

const showChangeWordModal = defineModel<boolean>({
  required: true
});


const select = async (secretWordInfo: SecretWordInfo) => {
  const { activeSecretWord, inactiveSecretWords } = await useFetchWithAuth<{ activeSecretWord: ActiveSecretWordInfo, inactiveSecretWords: SecretWordInfo[] }>('/secret-word', {
    method: 'patch',
    body: {
      secretWord: secretWordInfo.word
    }
  });

  console.log(activeSecretWord);

  toast.add({
    title: 'Poprawnie ustawiłeś secretWord'
  });

  showChangeWordModal.value = false;

  userStore.activeSecretWord = activeSecretWord;
  userStore.inactiveSecretWords = inactiveSecretWords;
};
</script>
