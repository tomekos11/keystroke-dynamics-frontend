<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8 text-center">

      <panel-secret-word-add-attempt v-if="userStore.secretWord" />

      <panel-secret-word-set v-else />
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';

const userStore = useUserStore();
</script>