<template>
  <div>
    <p class="text-sm mb-5">
      Wybrane przez Ciebie sekretne słowo to: <span class="text-primary">{{ userStore.activeSecretWord?.word }}</span>
    </p>

    <UForm :state="{}" @submit="onSubmit">
      <UButtonGroup>
        <input-counting-key-presses ref="input-counting-key-presses" v-model="newSample" />
        <UTooltip>
          <UButton type="submit" :color="newSample !== userStore.activeSecretWord?.word ? 'neutral' : 'primary'"
            variant="subtle" icon="i-lucide-clipboard" label="Potwierdź"
            :disabled="newSample !== userStore.activeSecretWord?.word" :loading="loading" />
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

    <UButton icon="i-lucide-refresh-cw" label="Odśwież wpisywanie" class="mt-5" variant="ghost"
      @click="input?.clearKeyPresses()" />

    <panel-secret-word-attempts-table />

    <div v-if="error" class="flex items-center gap-2 justify-center text-error mt-3">
      <UIcon name="i-lucide-circle-alert" />
      {{ error }}
    </div>

  </div>
</template>

<script setup lang="ts">
import type { FetchError } from 'ofetch';
import { useFetchWithAuth, useAttemptsStore } from '#imports';
import type { Attempt } from '~/types/types';
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const attemptsStore = useAttemptsStore();

const newSample = ref('');

const toast = useToast();
const loading = ref(false);
const error = ref('');
const input = useTemplateRef('input-counting-key-presses');

const onSubmit = async () => {
  if (!input.value) return;

  input.value.loading = true;

  try {
    const correctedKeyPresses = input.value.validateAndCorrectKeyPresses(input.value.keyPresses);

    const { attempt: newAttempt } = await useFetchWithAuth<{ attempt: Attempt }>('/secret-word/add-data', {
      method: 'POST',
      body: {
        secretWord: newSample.value,
        keyPresses: correctedKeyPresses
      },
    });

    attemptsStore.attempts.unshift(newAttempt);
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
