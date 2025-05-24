<template>
  <div class="w-full max-w-3xl mt-10 flex flex-col items-center">
    <h3 class="text-2xl font-bold text-white mb-4">Zacznij korzystać</h3>
        
    <div class="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
      <UButton
        color="primary"
        class="flex-1 justify-evenly  rounded-lg py-6 transition-transform hover:scale-[1.025]"
        size="xl"
        variant="ghost"
        to="/auth?mode=login"
        icon="i-heroicons-arrow-right"
        trailing
      >
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-1">Logowanie</h3>
          <p class="text-sm font-normal opacity-80">
            Zaloguj się przez biometrię behawioralną
          </p>
        </div>
      </UButton>

      <UButton
        color="secondary"
        class="flex-1 justify-evenly rounded-lg py-6 transition-transform hover:scale-[1.025]"
        size="xl"
        variant="ghost"
        to="/auth?mode=register"
        icon="i-heroicons-user-plus"
        trailing
      >
        <div class="text-center">
          <h3 class="text-lg font-semibold mb-1">Rejestracja</h3>
          <p class="text-sm font-normal opacity-80">
            Załóż nowe konto bezpieczeństwa
          </p>
        </div>
      </UButton>
    </div>
  </div>
</template>