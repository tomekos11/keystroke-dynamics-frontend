<template>
  <div>
    <UButtonGroup>
      <UInput
        v-model="newSecretWord"
        placeholder="Wprowadź sekretne słowo"
        :disabled="entries.length >= 30"
        :autofocus="false"
        class="text-center text-lg font-mono"
        @update:model-value="showHint = true"
      />
  
      <UModal v-model:open="showModal" description="zmiana sekretnego słowa" @after:leave="error = ''">
        <UButton
          color="primary" variant="subtle" icon="i-lucide-clipboard" label="Potwierdź"
          :disabled="!allRequirementsFullfiled" />
        <template #header>
          Zmiana sekretnego słowa
        </template>
        <template #body>
          Czy na pewno chcesz ustawić sekretne słowo jako
          <UInput v-model="newSecretWord" :disabled="true" class="mt-2" /><br>
  
          <div v-if="error" class="text-error">
            {{ error }}
          </div>
  
          <div class="flex gap-2 mt-2">
            <UButton label="Anuluj" color="error" variant="ghost" @click="showModal = false" />
            <UButton label="Potwierdź" variant="ghost" @click="updateSecretWord" />
          </div>
  
        </template>
      </UModal>
    </UButtonGroup>
  
    <UCollapsible v-model:open="showHint">
      <template #content>
        <p class="text-sm mx-1 mt-2">
          Sekretne słowo musi spełniać warunki:<br>
      
          <ul class="space-y-1 mt-1" aria-label="Password requirements">
            <li
              v-for="(req, index) in strength" :key="index" class="flex items-center gap-0.5"
              :class="req.met ? 'text-success' : 'text-muted'">
              <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
      
              <span class="text-xs font-light">
                {{ req.text }}
                <span class="sr-only">
                  {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
                </span>
              </span>
            </li>
          </ul>
        </p>
      </template>
    </UCollapsible>
  </div>
</template>

<script setup lang="ts">
import type { ActiveSecretWordInfo, SecretWordInfo } from '~/types/types';

const showModal = ref(false);
const newSecretWord = ref('');
const error = ref('');
const showHint = ref(false);

const requirements = [
  {
    regex: /^.{8,15}$/,
    text: 'Od 8 do 15 znaków',
    validate: (value: string) => value.length >= 8 && value.length <= 15
  },
  { regex: /\d/, text: 'Co najmniej 1 numer' },
  { regex: /[a-z]/, text: 'Co najmniej 1 małą literę' },
  { regex: /[A-Z]/, text: 'Co najmniej 1 dużą literę' },
  { regex: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]/, text: 'Co najmniej 1 znak specjalny' }
];

const checkRequirements = (str: string) => {
  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }));
};

const allRequirementsFullfiled = computed(() => (strength.value.filter(el => el.met).length === requirements.length));

const strength = computed(() => checkRequirements(newSecretWord.value));

const entries = ref([]);

const loading = ref(false);

const toast = useToast();

const updateSecretWord = async () => {
  loading.value = true;
  try {
    const { activeSecretWord } = await useFetchWithAuth<{ activeSecretWord: ActiveSecretWordInfo, inactiveSecretWords: SecretWordInfo[] }>('/secret-word', {
      method: 'patch',
      body: {
        secretWord: newSecretWord.value
      }
    });

    console.log(activeSecretWord);

    toast.add({
      title: 'Poprawnie ustawiłeś secretWord'
    });

    useUserStore().activeSecretWord = activeSecretWord;
    showModal.value = false;
  }
  catch (err) {
    error.value = err.data.message;
    console.error(err);
  }
  finally {
    loading.value = false;
  }

};
</script>