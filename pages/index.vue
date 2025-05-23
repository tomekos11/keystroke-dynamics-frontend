<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
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
    <main class="flex-1 flex flex-col items-center justify-center gap-10 px-4">

      <main-view-cards />

      <main-view-login-register-buttons />

      <!-- Film edukacyjny -->
      <div class="w-full max-w-3xl mt-10 flex flex-col items-center">
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
    </main>

    <auth-form />
  </div>

</template>

<script setup lang="ts">

</script>