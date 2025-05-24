<template>
  <div>
    <UBreadcrumb :items="items" class="m-4">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>

    <auth-form />
  </div>
</template>

<script setup lang="ts">
import type { BreadcrumbItem } from '@nuxt/ui';

const route = useRoute();

const items = computed<BreadcrumbItem[]>(() => {
  const arr = [
    {
      label: 'Strona główna',
      to: '/',
      icon: 'i-heroicons-home',
    }
  ];

  if(route.query.mode === 'login') {
    const login = {
      label: 'Logowanie',
      to: '/auth?mode=login',
      icon: 'i-heroicons-arrow-right',
      class: 'text-secondary'
    };
    arr.push(login);
  }
  
  else {
    const register = {
      label: 'Rejestracja',
      to: '/auth?mode=register',
      icon: 'i-heroicons-user-plus',
      class: 'text-secondary'
    };
    arr.push(register);
  }

  return arr;
});

</script>