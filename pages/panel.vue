<template>
  <div class="py-10 px-4 text-center">
    <UBreadcrumb :items="breadcrumbs" class="m-4">
      <template #separator>
        <span class="mx-2 text-(--ui-text-muted)">/</span>
      </template>
    </UBreadcrumb>

    <h1 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
      Panel użytkownika
    </h1>


    <UTabs
      v-if="useUserStore().isLoggedIn"
      v-model="active"
      :items="items"
      variant="link"
      class="gap-4 mt-10 flex-wrap"
      :ui="{ trigger: 'grow' }"
    >
      <template #fill-data="{ item }">
        <panel-change-user-data :item="item" />
      </template>

      <template #set-secret-word>
        <panel-secret-word />
      </template>

      <template #password>
        <panel-try-to-break />
      </template>
    </UTabs>

    <template v-else>
      <p class="mt-10">
        Nie jesteś zalogowany. Zaloguj się lub utwórz konto, aby kontynuować
      </p>

      <main-view-login-register-buttons class="mx-auto" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem, BreadcrumbItem  } from '@nuxt/ui';
import { useRoute, useRouter } from 'vue-router';

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: 'Strona główna',
    to: '/',
    icon: 'i-heroicons-home',
  },
  {
    label: 'Panel użytkownika',
    to: '/panel',
    class: 'text-secondary'
  }

];


const items = [
  {
    label: 'Profil użytkownika',
    description: 'Zmień swoje dane osobowe',
    icon: 'i-lucide-user',
    slot: 'fill-data' as const,
    value: 'profile'
  },
  {
    label: 'Sekretne słowo',
    description: 'Ustaw lub zmień swoje sekretne słowo',
    icon: 'i-lucide-lock',
    slot: 'set-secret-word' as const,
    value: 'secret'
  },
  {
    label: 'Zabawa łamania',
    description: 'Spróbuj odgadnąć sekretne słowo innego użytkownika',
    icon: 'i-lucide-lock-open',
    slot: 'password' as const,
    value: 'break'
  },
  {
    label: 'Statystyki',
    description: 'Statystyki',
    icon: 'i-lucide-chart-no-axes-column-decreasing',
    slot: 'stats' as const,
    value: 'stats'
  },
  {
    label: 'Modele',
    description: 'Modele',
    icon: 'i-lucide-waypoints',
    slot: 'models' as const,
    value: 'models'
  }
] satisfies TabsItem[];

const route = useRoute();
const router = useRouter();

const active = computed({
  get() {
    return (route.query.mode as string) || 'profile';
  },
  set(mode) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.replace({
      query: { mode },
    });
  }
});

</script>
