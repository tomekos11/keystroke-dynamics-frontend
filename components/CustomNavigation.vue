<template>
  <nav class="px-4 py-2 flex justify-between items-center bg-slate-900">

    <UButton
      color="neutral"
      variant="ghost"
      class="flex items-center gap-2 px-3 py-2 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-800"
      to="/"
    >
      Keystroke Dynamics
    </UButton>
    
    <div v-if="!userStore.isLoggedIn">
      <UButton
        class="bg-secondary hover:bg-secondary-500 "
        label="Zaloguj się"
        to="/auth?mode=login"
      />
    </div>

    <UDropdownMenu
      v-else
      :items="dropdownItems"
      :popper="{ placement: 'bottom-end' }"
      class="inline-block"
    >
      <UButton
        color="neutral"
        variant="ghost"
        class="flex items-center gap-2 px-3 py-2 rounded-full transition hover:bg-gray-100 dark:hover:bg-gray-800"
        icon="i-lucide-user"
      >
        <span class="hidden sm:inline">{{ userStore.email }}</span>
      </UButton>
    </UDropdownMenu>

  </nav>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';

const userStore = useUserStore();
const router = useRouter();

const handlePanel = () => {
  router.push('/panel');
};

const handleLogout = () => {
  userStore.logout();
  router.push('/auth?mode=login');
};

const dropdownItems = [
  [
    {
      label: 'Panel użytkownika',
      icon: 'i-lucide-user-cog',
      onSelect: handlePanel,
      class: 'text-primary-600 dark:text-primary-400'
    }
  ],
  [
    {
      label: 'Wyloguj',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout,
      class: 'text-red-600 dark:text-red-400'
    }
  ]
];

</script>