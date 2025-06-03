<template>
  <div>
    <UCard
      v-if="userStore.activeSecretWord"
      class="bg-transparent"
    >
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-primary drop-shadow-sm">
          Dodaj próbkę
        </h2>

        <ul class="mb-6 mt-4 text-left space-y-3 text-sm">
          <li class="flex items-start gap-2">
            <span class="text-primary text-lg mt-0.5">
              <UIcon name="i-lucide-badge-check" />
            </span>
            <span>
              Czas liczy się od momentu wpisania pierwszego znaku
            </span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary text-lg mt-0.5">
              <UIcon name="i-lucide-badge-check" />
            </span>
            <span>
              Jeżeli się pomylisz, to kliknij guzik "odśwież wpisywanie"
            </span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary text-lg mt-0.5">
              <UIcon name="i-lucide-badge-check" />
            </span>
            <span>
              Po odświeżeniu lub wysłaniu próbki, czas ponownie liczy się od momentu wpisania pierwszego znaku
            </span>
          </li>
        </ul>
      </div>
      <UForm :state="{}" @submit="onSubmit">
        <UButtonGroup>
          <input-counting-key-presses ref="input-counting-key-presses" v-model="newSample" />
          <UTooltip>
            <UButton
              type="submit"
              :color="newSample !== userStore.activeSecretWord?.word ? 'neutral' : 'primary'"
              variant="subtle"
              icon="i-lucide-clipboard"
              label="Potwierdź"
              :disabled="newSample !== userStore.activeSecretWord?.word"
              :loading="input?.loading"
            />
            <template v-if="newSample !== userStore.activeSecretWord?.word" #content>
              <template v-if="!newSample">
                Wpisany ciąg znaków jest pusty
              </template>
              <template v-else>
                Wpisany ciąg znaków <strong class="text-primary">{{ newSample }}</strong> nie zgadza się z ustawionym
                słowem sekretnym
              </template>
            </template>
          </UTooltip>
        </UButtonGroup>
      </UForm>

      <UButton
        icon="i-lucide-refresh-cw" label="Odśwież wpisywanie" class="mt-5" variant="ghost"
        @click="input?.clearKeyPresses()" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from 'ofetch';
import { useFetchWithAuth } from '#imports';
import type { Attempt } from '~/types/types';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();

const newSample = ref('');

const toast = useToast();
const input = useTemplateRef('input-counting-key-presses');

const onSubmit = async () => {
  if (!input.value) return;

  input.value.loading = true;

  try {
    const correctedKeyPresses = input.value.validateAndCorrectKeyPresses(input.value.keyPresses);

    const newAttempt = await useFetchWithAuth<Attempt>('/secret-word/add-data', {
      method: 'POST',
      body: {
        secretWord: newSample.value,
        keyPresses: correctedKeyPresses
      },
    });

    userStore.activeSecretWord?.attempts?.unshift(newAttempt);
    input.value.clearKeyPresses();

    toast.add({
      title: 'Poprawnie dodano próbkę danych!',
    });
    input.value.error = '';
  } catch (err) {
    const fetchErr = err as FetchError;
    input.value.error = fetchErr.data.message;
    input.value.clearKeyPresses();

    toast.add({
      title: input.value.error
    });
  } finally {
    input.value.loading = false;
  }
};
</script>
