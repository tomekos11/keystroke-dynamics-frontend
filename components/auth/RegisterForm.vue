<template>
  <UCard class="w-full max-w-md mx-auto">
    <form class="flex flex-col gap-2" @submit.prevent="handleRegister">
      <h2 class="text-2xl font-bold mb-4 text-center">Rejestracja</h2>
      <UFormField>
        <UInput
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="w-[100%]"
          icon="i-heroicons-envelope"
        />
      </UFormField>
      <UFormField>
        <UInput
          v-model="password"
          type="password"
          placeholder="Hasło"
          required
          class="w-[100%]"
          icon="i-heroicons-lock-closed"
        />
      </UFormField>
      <UFormField>
        <UInput
          v-model="repeatPassword"
          type="password"
          placeholder="Powtórz hasło"
          required
          class="w-[100%]"
          icon="i-heroicons-lock-closed"
        />
      </UFormField>

      <div class="text-sm mx-1">
        Hasło musi zawierać:<br>

        <ul class="space-y-1 mt-1" aria-label="Password requirements">
          <li
            v-for="(req, index) in strength"
            :key="index"
            class="flex items-center gap-0.5"
            :class="req.met ? 'text-success' : 'text-muted'"
          >
            <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
    
            <span class="text-xs font-light">
              {{ req.text }}
              <span class="sr-only">
                {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
              </span>
            </span>
          </li>
        </ul>
      </div>

      <p v-if="error">
        {{ error }}
      </p>

      <UButton type="submit" block class="mt-2">
        Zarejestruj się
      </UButton>

      <p class="text-center text-sm mt-2">
        Masz już konto?
        <UButton
          variant="link"
          color="primary"
          size="sm"
          @click.prevent="$emit('switch')"
        >
          Zaloguj się
        </UButton>
      </p>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FetchError } from 'ofetch';
import type { User } from '~/types/types';

const router = useRouter();

const loading = ref(false);
const toast = useToast();
const error = ref('');

const email = ref('');
const repeatPassword = ref('');

const handleRegister = async () => {
  loading.value = true;
  try {
    const user = await useFetchWithAuth<User>('/users/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    useUserStore().setUser(user);

    toast.add({
      title: 'Poprawnie zarejestrowano',
    });

    router.replace('/');

  } catch (err) {
    const fetchErr = err as FetchError;
    error.value = fetchErr.data.message;
  } finally {
    loading.value = false;
  }
};


defineEmits(['switch']);

const password = ref('');

function checkStrength(str: string) {
  const requirements = [
    { regex: /.{8,}/, text: 'Co najmniej 8 znaków' },
    { regex: /\d/, text: 'Co najmniej 1 numer' },
    { regex: /[a-z]/, text: 'Co najmniej 1 małą literę' },
    { regex: /[A-Z]/, text: 'Co najmniej 1 dużą literę' }
  ];

  return requirements.map(req => ({ met: req.regex.test(str), text: req.text }));
}

const strength = computed(() => checkStrength(password.value));
</script>
