<template>
  <nav class="px-4 py-2 flex justify-between items-center ">
    <div>
      XD
    </div>
    <div>
      {{ userStore.email || 'Niezalogowany' }}
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
</script>