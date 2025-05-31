<template>
  <UCard class="w-full max-w-md mx-auto">
    <form class="flex flex-col gap-2" @submit.prevent="handleLogin">
      <h2 class="text-2xl font-bold mb-4 text-center">Logowanie</h2>
      <UFormField>
        <UInput v-model="email" type="email" placeholder="Email" required class="w-[100%]"
          icon="i-heroicons-envelope" />
      </UFormField>
      <UFormField>
        <UInput v-model="password" type="password" placeholder="Hasło" required class="w-[100%]"
          icon="i-heroicons-lock-closed" />
      </UFormField>

      <p v-if="error">
        {{ error }}
      </p>

      <UButton type="submit" color="primary" block class="mt-2" :loading="loading">
        Zaloguj się
      </UButton>

      <p class="text-center text-sm mt-2">
        Nie masz konta?
        <UButton variant="link" color="primary" size="sm" @click.prevent="$emit('switch')">
          Zarejestruj się
        </UButton>
      </p>
    </form>
  </UCard>
</template>

<script setup lang="ts">
import type { FetchError } from 'ofetch';
import { useFetchWithAuth } from '../../composables/useFetchWithAuth';
import type { User } from '~/types/types';
import { useUserStore } from '~/stores/user';

const toast = useToast();
const loading = ref(false);
const error = ref('');

const email = ref('');
const password = ref('');
const router = useRouter();

// Resetowanie przy wysyłaniu formularza
const handleLogin = async () => {
  loading.value = true;
  try {
    const user = await useFetchWithAuth<User>('/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    });

    useUserStore().setUser(user);

    toast.add({
      title: 'Zalogowano poprawnie',
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
</script>