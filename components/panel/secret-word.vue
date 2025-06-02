<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="mb-8 text-center">



      <template v-if="userStore.activeSecretWord">
        <panel-secret-word-last-selected-secret-word />
        <panel-secret-word-add-attempt />
      </template>
      <panel-secret-word-set v-else />

    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '#imports';

const userStore = useUserStore();
</script>