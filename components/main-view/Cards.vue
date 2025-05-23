<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
    <!-- Karta 1 -->
    <UCard
      class="bg-white/5 backdrop-blur-md border border-slate-800 text-white shadow-lg flex flex-col items-center overflow-hidden transition-all duration-300"
      :class="{ 'max-h-full': expandedCards[0] }"
      :ui="{
        root: 'p-0',
        body: 'sm:px-1 p-0',
        header: 'sm:px-0 p-0 w-full',
        footer: 'p-0',
      }"
    >
      <template #header>
        <img
          src="assets/img/Biometria_behawioralna.jpg"
          alt="Biometria behawioralna"
          class="object-cover mb-2 h-22 w-full"
          loading="lazy"
        >
      </template>

      <h3 class="text-xl font-semibold mb-2 text-center">Biometria behawioralna?</h3>
      <p
        class="text-slate-200 text-sm transition-all text-justify duration-300 px-4"
        :class="{ 'line-clamp-3': !expandedCards[0] }"
      >
        Biometria behawioralna analizuje unikalne wzorce zachowań użytkownika podczas korzystania z urządzeń cyfrowych, np. sposób pisania na klawiaturze, ruchy myszką, gesty na ekranie dotykowym czy sposób przewijania strony. Dzięki temu pozwala rozpoznać, czy to naprawdę Ty korzystasz z aplikacji, a nie ktoś podszywający się pod Ciebie.
      </p>

      <div class="text-center">
        <button
          v-if="!expandedCards[0]"
          class="mt-2 text-cyan-400 text-xs font-semibold hover:underline"
          @click="expandedCards[0] = true"
        >
          Czytaj więcej...
        </button>

        <button
          v-else
          class="mt-2 text-cyan-400 text-xs font-semibold hover:underline"
          @click="expandedCards[0] = false"
        >
          Zwiń
        </button>
      </div>

    </UCard>

    <!-- Karta 2 -->
    <UCard
      class="bg-white/5 backdrop-blur-md border border-slate-800 text-white shadow-lg flex flex-col items-center overflow-hidden transition-all duration-300"
      :class="{ 'max-h-full': expandedCards[1] }"
      :ui="{
        root: 'p-0',
        body: 'sm:px-1 p-0',
        header: 'sm:px-0 p-0 w-full',
        footer: 'p-0',
      }"
    >
      <template #header>
        <img
          src="assets/img/zasada.jpg"
          alt="Zasada działania"
          class="object-cover mb-2 h-22 w-full"
          loading="lazy"
        >
      </template>
      
      <h3 class="text-xl font-semibold mb-2 text-center">Zasada działania aplikacji</h3>
      <p
        class="text-slate-200 text-sm transition-all text-justify duration-300 px-4"
        :class="{ 'line-clamp-3': !expandedCards[1] }"
      >
        Podczas logowania i korzystania z aplikacji rejestrowane są Twoje naturalne zachowania, takie jak rytm pisania, prędkość klikania czy sposób poruszania kursorem. Te dane tworzą Twój unikalny profil, który jest porównywany przy kolejnych logowaniach. Jeśli wykryte zostaną nietypowe wzorce, system może poprosić o dodatkową weryfikację lub zablokować dostęp.
      </p>

      <div class="text-center">
        <button
          v-if="!expandedCards[1]"
          class="mt-2 text-cyan-400 text-xs font-semibold hover:underline"
          @click="expandedCards[1] = true"
        >
          Czytaj więcej...
        </button>

        <button
          v-else
          class="mt-2 text-cyan-400 text-xs font-semibold hover:underline"
          @click="expandedCards[1] = false"
        >
          Zwiń
        </button>
      </div>
    </UCard>

    <!-- Karta 3 -->
    <UCard
      class="bg-white/5 backdrop-blur-md border border-slate-800 text-white shadow-lg flex flex-col items-center overflow-hidden transition-all duration-300"
      :class="{ 'max-h-full': expandedCards[2] }"
      :ui="{
        root: 'p-0',
        body: 'sm:px-1 p-0',
        header: 'sm:px-0 p-0 w-full',
        footer: 'p-0',
      }"
    >
      <template #header>
        <img
          src="assets/img/cyberbezpieczenstwo.jpg"
          alt="Bezpieczeństwo"
          class="object-cover mb-2 h-22 w-full"
          loading="lazy"
        >
      </template>

      <h3 class="text-xl font-semibold mb-2 text-center">Dlaczego to bezpieczne?</h3>
      <p
        class="text-slate-200 text-sm transition-all text-justify duration-300 px-4"
        :class="{ 'line-clamp-3': !expandedCards[2] }"
      >
        Biometria behawioralna działa w tle i jest trudna do podrobienia, ponieważ każdy z nas ma niepowtarzalny sposób korzystania z urządzeń. Dzięki temu zwiększa bezpieczeństwo bez utrudniania codziennego korzystania z aplikacji – nie musisz pamiętać dodatkowych haseł czy kodów jednorazowych.
      </p>

      <div class="text-center">
        <button
          v-if="!expandedCards[2]"
          class="mt-2 text-cyan-400 text-xs font-semibold hover:underline"
          @click="expandedCards[2] = true"
        >
          Czytaj więcej...
        </button>

        <button
          v-else
          class="mt-2 text-cyan-400 text-xs font-semibold hover:underline"
          @click="expandedCards[2] = false"
        >
          Zwiń
        </button>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const expandedCards = ref([false, false, false]);

</script>