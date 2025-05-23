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
        />
      </UFormField>

      <UButton type="submit" color="primary" block class="mt-2">
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

<script setup>
import { ref } from 'vue'
const email = ref('')
const password = ref('')
const handleLogin = () => {
  // obsługa logowania
}

defineEmits(['switch'])
</script>
