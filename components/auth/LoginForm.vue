<template>
  <UCard class="w-full max-w-md mx-auto">
    <form class="flex flex-col gap-2" @submit.prevent="handleLogin">
      <h2 class="text-2xl font-bold mb-4 text-center">Logowanie</h2>
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
          @keydown="onPasswordKeyDown"
          @keyup="onPasswordKeyUp"
        />
      </UFormField>

      <p v-if="error">
        {{ error }}
      </p>

      <UButton type="submit" color="primary" block class="mt-2" :loading="loading">
        Zaloguj się
      </UButton>

      <p class="text-center text-sm mt-2">
        Nie masz konta?
        <UButton
          variant="link"
          color="primary"
          size="sm"
          @click.prevent="$emit('switch')"
        >
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

// --- LOGIKA ŚLEDZENIA KLAWISZY ---
type KeyPressEntry = {
  value: string;
  pressedAt: Date;
  releasedAt: Date;
  pressDuration: number; // ms
  waitDuration: number;  // ms
  modifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  }
};

const shiftSpecialChars: Record<string, string> = {
  '1': '!',
  '2': '@',
  '3': '#',
  '4': '$',
  '5': '%',
  '6': '^',
  '7': '&',
  '8': '*',
  '9': '(',
  '0': ')',
  '`': '~',
  '-': '_',
  '=': '+',
  '[': '{',
  ']': '}',
  '\\': '|',
  ';': ':',
  '\'': '"',
  ',': '<',
  '.': '>',
  '/': '?',
};

// Lista klawiszy modyfikujących, których NIE zapisujemy
const modifierKeys = ['Shift', 'Control', 'Alt', 'Meta'];

const keyPresses = ref<KeyPressEntry[]>([]);
let lastReleasedAt: Date | null = null;
const activeKeys = new Map<string, { pressedAt: Date, modifiers: any }>();

// Mapowanie kombinacji klawiszy na znaki specjalne (przykład PL)
function resolveKeyValue(e: KeyboardEvent): string {
  // Przykładowe mapowanie dla polskich znaków
  if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 'a') return 'ą';
  if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'a') return 'Ą';
  if (e.altKey && !e.shiftKey && e.key.toLowerCase() === 'c') return 'ć';
  if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'c') return 'Ć';
  // ...dodaj kolejne mapowania wg potrzeb...

  // Mapowanie znaków specjalnych dla Shift+cyfra/znak
  if (e.shiftKey && Object.prototype.hasOwnProperty.call(shiftSpecialChars, e.key)) {
    return shiftSpecialChars[e.key];
  }

  // Jeśli Shift, zwracamy wielką literę
  if (e.shiftKey && e.key.length === 1) return e.key.toUpperCase();
  // Zwykły znak
  return e.key;
}

// Obsługa naciśnięcia klawisza
function onPasswordKeyDown(e: KeyboardEvent) {
  // Ignoruj powtarzające się naciśnięcia (trzymanie klawisza)
  if (e.repeat) return;
  const now = new Date();
  const value = resolveKeyValue(e);

  // Zapamiętaj moment naciśnięcia i modyfikatory
  activeKeys.set(e.code, {
    pressedAt: now,
    modifiers: {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    }
  });
}

// Obsługa puszczenia klawisza
function onPasswordKeyUp(e: KeyboardEvent) {
  if (modifierKeys.includes(e.key)) {
    activeKeys.delete(e.code); // czyść z mapy, jeśli był trzymany
    return;
  }

  const now = new Date();
  const value = resolveKeyValue(e);

  const active = activeKeys.get(e.code);
  if (!active) return;

  const pressDuration = now.getTime() - active.pressedAt.getTime();
  const waitDuration = lastReleasedAt ? active.pressedAt.getTime() - lastReleasedAt.getTime() : 0;

  keyPresses.value.push({
    value,
    pressedAt: active.pressedAt,
    releasedAt: now,
    pressDuration,
    waitDuration,
    modifiers: active.modifiers
  });

  lastReleasedAt = now;
  activeKeys.delete(e.code);
}

// Resetowanie przy wysyłaniu formularza
const handleLogin = async () => {
  loading.value = true;
  try {
    const user = await useFetchWithAuth<User>('/users/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        keyPresses: keyPresses.value
      },
    });

    useUserStore().setUser(user);

    toast.add({
      title: 'Zalogowano poprawnie',
    });

  } catch (err) {
    const fetchErr = err as FetchError;
    error.value = fetchErr.data.message;
  } finally {
    loading.value = false;
  }
};

defineEmits(['switch']);
</script>