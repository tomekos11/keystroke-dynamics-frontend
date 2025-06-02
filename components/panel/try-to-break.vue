<template>
  <div class="space-y-6 p-4">
    <!-- Wyszukiwarka -->
    <UInput
      v-if="!selectedUserId"
      v-model="searchTerm"
      placeholder="Wyszukaj użytkownika"
      icon="i-heroicons-magnifying-glass"
      class="max-w-96"
    />

    <div v-if="!selectedUserId" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TransitionGroup v-if="filteredUsers && filteredUsers.length" name="list">
        <UCard
          v-for="user in filteredUsers"
          :key="user.id"
          class="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="select(user.id)"
        >
          <div class="flex items-center gap-4">
            <UIcon name="i-heroicons-user-circle" class="w-8 h-8 text-primary" />
            <div>
              <h3 class="font-semibold">{{ user.firstName }} {{ user.lastName }}</h3>
              <p class="text-gray-500 text-sm">{{ user.email }}</p>
            </div>
          </div>
        </UCard>

      </TransitionGroup>
      <div v-else>
        Brak użytkowników
      </div>
    </div>

    <div v-else>
      <UCard>
        <template #header>
          <div class="flex justify-between items-center flex-wrap">
            <h2 class="text-xl font-bold">Szczegóły użytkownika</h2>
            <UButton
              label="Zmień użytkownika"
              color="primary"
              variant="ghost"
              @click="selectedUserId = null"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div class="flex items-center gap-4 flex-wrap justify-around">
            <div class="flex gap-2 items-center">
              <UIcon name="i-heroicons-user-circle" class="w-12 h-12 text-primary" />
              <p class="text-2xl font-bold">
                {{ selectedUser?.firstName }} {{ selectedUser?.lastName }}
              </p>
              <p class="text-gray-500">{{ selectedUser?.email }}</p>
            </div>

            <div class="p-5">
              Sekretne hasło:
              <b v-if="selectedUser?.activeSecretWord" class="text-primary">
                {{ selectedUser?.activeSecretWord.word }}
              </b>
              <b v-else class="text-error">
                Brak ustawionego
              </b>
            </div>
            <UTooltip>
              <UButton
                v-if="!showForm && selectedUser?.activeSecretWord"
                label="Spróbuj swoich sił"
                :disabled="!selectedUser?.activeSecretWord?.hasActiveModel"
                @click="showForm = true"
              />
              <template v-if="!selectedUser?.activeSecretWord?.hasActiveModel" #content>
                Model do tego sekretnego słowa jeszcze nie istnieje
              </template>
            </UTooltip>
          </div>

          <UForm v-if="showForm" :state="{}" @submit="onSubmit">
            <UCard class="flex justify-center bg-slate-950">
              <UFormField>
                <template #label>
                  Wpisz sekret <b class="text-primary">{{ selectedUser?.activeSecretWord?.word }}</b>
                </template>
  
                <UButtonGroup class="flex mt-2">
                  <input-counting-key-presses
                    ref="input-counting-key-presses"
                    v-model="secret"
                    placeholder="Wpisz sekret"
                    icon="i-lucide-lock-open"
                    :color="secret === selectedUser?.activeSecretWord?.word ? 'success' : 'neutral'"
                  />

                  <UTooltip>
                    <UButton
                      type="submit"
                      :color="secret !== selectedUser?.activeSecretWord?.word ? 'neutral' : 'primary'"
                      variant="subtle"
                      icon="i-lucide-clipboard"
                      label="Potwierdź"
                      :disabled="secret !== selectedUser?.activeSecretWord?.word"
                      :loading="input?.loading"
                    />
                    <template v-if="secret !== selectedUser?.activeSecretWord?.word" #content>
                      <template v-if="!secret">
                        Wpisany ciąg znaków jest pusty
                      </template>
                      <template v-else>
                        Wpisany ciąg znaków <strong class="text-primary">{{ secret }}</strong> nie zgadza się z ustawionym
                        słowem sekretnym
                      </template>
                    </template>
                  </UTooltip>
                </UButtonGroup>

                <template #help>
                  <ul>
                    <li class="flex items-start gap-2">
                      <span class="text-primary text-lg mt-0.5">
                        <UIcon name="i-lucide-badge-check" />
                      </span>
                      <span>
                        Liczenie czasu zaczyna się wraz z wpisaniem pierwszego znaku
                      </span>
                    </li>

                    <li class="flex items-start gap-2">
                      <span class="text-primary text-lg mt-0.5">
                        <UIcon name="i-lucide-badge-check" />
                      </span>
                      <span>
                        Liczenie czasu kończy się przy kliknięciu Enter
                      </span>
                    </li>

                    <li class="flex items-start gap-2">
                      <span class="text-primary text-lg mt-0.5">
                        <UIcon name="i-lucide-badge-check" />
                      </span>
                      <span>
                        Pomyłki potrafią zepsuć wynik, zaleca się uważanie na nie
                      </span>
                    </li>
                  </ul>
                </template>
              </UFormField>
            </UCard>
          </UForm>

          <div v-if="selectedUser?.activeSecretWord && selectedUser?.activeSecretWord.hasActiveModel" class="flex justify-evenly">
            <div>
              Ilość próbek modelu <UBadge variant="soft">{{ selectedUser?.activeSecretWord?.samplesCount || 0 }}</UBadge>
            </div>
            <div>
              Ilość moich prób <UBadge variant="soft">{{ selectedUser?.activeSecretWord?.myAttemptsCount || 0 }} </UBadge>
            </div>
            <div>
              Ilość moich poprawnych prób <UBadge variant="soft">{{ selectedUser?.activeSecretWord?.mySuccessfulAttemptsCount || 0 }}</UBadge>
            </div>

          </div>

          <USeparator />

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Status konta</p>
              <UBadge
                :label="selectedUser?.isActive ? 'Aktywne' : 'Nieaktywne'"
                :color="selectedUser?.isActive ? 'green' : 'red'"
              />
            </div>
            <div>
              <p class="text-sm text-gray-500">Data utworzenia</p>
              <p>{{ formatDate(selectedUser?.createdAt) }}</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Ładowanie i błędy -->
    <div v-if="pending" class="text-center py-8">
      <UProgress animation="carousel" />
      <p class="mt-2 text-gray-500">Ładowanie użytkowników...</p>
    </div>

    <UAlert
      v-if="error"
      icon="i-heroicons-exclamation-triangle"
      title="Błąd ładowania"
      :description="error.message"
      color="red"
      variant="outline"
    />
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from 'ofetch';
import type { PredictResult, UserWithoutAttempts } from '~/types/types';

const searchTerm = ref('');
const selectedUserId = ref<number | null>(null);

const secret = ref('');
const showForm = ref(false);

const { data: users, pending, error } = useAsyncData<UserWithoutAttempts[]>(
  () => 'users',
  async () => {
    try {
      const res = await useFetchWithAuth<UserWithoutAttempts[]>('/users');
      return res;
    } catch (e: any) {
      throw createError({
        message: e.message || 'Nie udało się pobrać użytkowników',
        statusCode: e.statusCode || 500
      });
    }
  }
);

const select = (id: number) => {
  selectedUserId.value = id;
};

// Filtrowanie
const filteredUsers = computed(() => {
  if (!users.value) return [];
  const term = searchTerm.value.toLowerCase();
  return users.value.filter(user => 
    [user.firstName, user.lastName, user.email].join(' ').toLowerCase().includes(term)
  );
});

// Wybrany użytkownik
const selectedUser = computed(() => 
  users.value?.find(user => user.id === selectedUserId.value)
);

// Formatowanie daty
const formatDate = (dateString?: string | null) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const input = useTemplateRef('input-counting-key-presses');
const toast = useToast();

const onSubmit = async () => {
  if(!input.value) return;

  input.value.loading = true;

  try {
    const correctedKeyPresses = input.value.validateAndCorrectKeyPresses(input.value.keyPresses);

    // TODO dodac endpoint
    console.log(correctedKeyPresses);
    const { error, similarity, success } = await useFetchWithAuth<PredictResult>('/keystrokes/predict', {
      method: 'POST',
      body: {
        secretWord: input.value.newSample,
        keyPresses: correctedKeyPresses
      },
    });

    // pozniej dodac do statystyk na tym froncie jakos
    input.value.clearKeyPresses();

    toast.add({
      title: success ? 'Sukces' : 'Niezgodność',
      description:  success ? 'Udało ci się napisać sekretne słowo w taki sam sposób jak jego twórca' : 'Sposób wpisania nie zgadza się ze sposobem twórcy',
      icon: success ? 'i-lucide-circle-check' : 'i-lucide-circle-alert'
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

watch(selectedUser, (nv) => {
  // usun tutaj kliki klawiszy
  secret.value = '';

  if(input.value) {
    input.value.clearKeyPresses();
  }

  if(nv && !nv.secretWord) {
    showForm.value = false;
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    refreshNuxtData('users'); // 'users' to Twój klucz z useAsyncData
  });
}
</script>

<style>
.list-move {
  transition: all 0.3s ease;
}
</style>
