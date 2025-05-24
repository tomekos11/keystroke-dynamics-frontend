<template>
  <div>
    <UBreadcrumb :items="items" class="m-4">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>
      
    <!-- Header -->
    <header class="py-10 px-4 text-center">
      <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
        Keystroke Dynamics
      </h1>
      <p class="text-slate-300 text-lg max-w-xl mx-auto">
        Projekt, który integruje dodatkową warstwę zabezpieczeń zwaną <span class="font-semibold text-cyan-400">biometrią behawioralną</span>.
      </p>
    </header>

    <!-- Main Tiles -->
    <div class="flex-1 flex flex-col items-center justify-center gap-10 px-4">

      <UCard
        class="mx-auto mt-16 mb-10 p-4 max-w-lg text-center bg-white/2 shadow-xl rounded-xl border border-primary/10"
        :ui="{
          root: 'p-0',
          body: 'sm:px-1 p-0',
          header: 'sm:px-0 p-0 w-full',
          footer: 'p-0',
        }"
      >
        <div class="flex justify-center mb-4">
          <span class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
            <UIcon name="i-lucide-shield-check"  size="26px"/>
          </span>
        </div>
        <h2 class="text-2xl font-bold mb-2 text-primary tracking-tight">Witaj Użytkowniku!</h2>
        <p class="mb-5 text-base text-gray-500">
          Wykryliśmy, że jesteś <span class="font-semibold text-primary">zalogowany</span>, ale nie ustawiłeś jeszcze własnego hasła.
        </p>
        <p class="mb-4 text-gray-700">
          Przejdź do 
          <router-link to="/panel" class="text-primary underline font-medium hover:text-primary-700 transition">panelu użytkownika</router-link>, aby:
        </p>
        <ul class="mb-6 text-left mx-auto max-w-[380px] space-y-3">
          <li class="flex items-start gap-2">
            <span class="text-primary text-lg mt-0.5">
              <UIcon name="i-lucide-badge-check" />
            </span>
            <span>
              Ustawić swoje unikalne hasło i wyzwać innych do jego złamania.
            </span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary text-lg mt-0.5">
              <UIcon name="i-lucide-badge-check" />
            </span>
            <span>
              Spróbować przełamać dodatkową warstwę zabezpieczeń innych użytkowników.
            </span>
          </li>
        </ul>
        <p class="text-sm text-gray-500">
          Zadbaj o swoje bezpieczeństwo i sprawdź, jak dobrze potrafisz łamać hasła!
        </p>
      </UCard>
    
      <main-view-cards />

      <main-view-login-register-buttons v-if="!userStore.isLoggedIn"/>
      <main-view-set-security-level v-else />

      <!-- Film edukacyjny -->
      <div class="w-full max-w-3xl mt-10 flex flex-col items-center mb-5">
        <h3 class="text-2xl font-bold text-white mb-4">Zobacz, jak działa biometryka behawioralna</h3>
        <div class="w-full rounded-lg overflow-hidden shadow-lg border border-slate-800 min-h-[450px]">
          <iframe
            src="https://www.youtube.com/embed/0vHDuZEVGHA"
            title="Understanding Behavioral Biometrics"
            frameborder="0"
            allowfullscreen
            class="w-full h-[450px]"
          />
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';
import { useUserStore } from '#imports';

const items: BreadcrumbItem[] = [
  {
    label: 'Strona główna',
    to: '/',
    icon: 'i-heroicons-home',
    class: 'text-secondary'
  },
];

const userStore = useUserStore();
</script>