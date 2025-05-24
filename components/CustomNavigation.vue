<template>
  <nav class="px-4 py-2 flex justify-between items-center ">
    <router-link to="/">
      Keystroke Dynamics
    </router-link>
    
    <div v-if="!userStore.isLoggedIn">
      <UButton
        class="bg-secondary hover:bg-secondary-500 "
        label="Zaloguj się"
        to="/auth?mode=login"
      />
    </div>

    <div v-else>
      {{ userStore.email }}
    </div>

  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
</script>