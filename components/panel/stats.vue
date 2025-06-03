<template>
  <div v-if="pending" class="text-center py-8">
    <UProgress animation="carousel" />
    <p class="mt-2 text-gray-500">Ładowanie statystyk...</p>
  </div>
  <div v-else class="max-w-5xl mx-auto py-10 px-4 text-slate-100">
    <!-- Tabs with Nuxt UI -->
    <UTabs
      v-model="view"
      :items="[
        { label: 'Ataki na mnie', value: 'received' },
        { label: 'Moje ataki', value: 'sent' }
      ]"
      class="mb-8"
      variant="pill"
    />

    <!-- Attacks on me -->
    <div v-if="view === 'received'">
      <div v-if="stats?.attacksOnMe?.length">
        <attacks-attack-list-on-me
          v-for="attack in stats.attacksOnMe"
          :key="attack.secretWordId"
          :attack="attack"
          :is-mine="false"
        />
      </div>

      <div v-else class="text-center text-slate-400 py-10 italic">
        <UIcon name="lucide:alert-triangle" class="mr-2" />
        Brak danych o atakach na Ciebie.
      </div>
    </div>

    <!-- My attacks -->
    <div v-if="view === 'sent'">
      <div v-if="stats?.attacksByMe?.length">
        <attacks-attack-list-by-me
          v-for="attack in stats.attacksByMe"
          :key="attack.targetId"
          :attack="attack"
        />
      </div>
      
      <div v-else class="text-center text-slate-400 py-10 italic">
        <UIcon name="lucide:alert-triangle" class="mr-2" />
        Nie przeprowadziłeś żadnych ataków.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StatsResponse } from '~/types/types';

const view = ref<'received' | 'sent'>('received');

const { data: stats, pending } =  useAsyncData<StatsResponse>('stats', () =>
  useFetchWithAuth<StatsResponse>('/user/stats').then((res) => res ?? { attacksOnMe: [], attacksByMe: [] })
);
</script>
