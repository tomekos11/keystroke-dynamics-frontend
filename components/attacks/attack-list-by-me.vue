<template>
  <div class="border border-slate-800 rounded-xl p-4 shadow bg-slate-900 mb-6">
    <div
      class="text-base font-semibold text-white mb-2 flex items-center justify-between cursor-pointer"
      @click="toggleExpanded"
    >
      <div>
        Atakowany: <span class="font-mono text-sky-400">{{ attack.targetEmail || 'Nieznany Atakujący' }}</span>
        <div class="text-xs text-slate-400 mt-1">
          <div class="mb-1">
            Ilość atakowanych słów: 
            <span class="font-mono text-slate-200">{{ totalWordsAttacked }}</span>
          </div>

          <div class="flex gap-x-4">
            <div>
              Wszystkie Próby: 
              <span class="font-mono text-slate-200">{{ totalAttemptsOverall }}</span>
            </div>
            <div>
              Wszystkie Sukcesy: 
              <span class="font-mono text-slate-200">{{ totalSuccessesOverall }}</span>
            </div>
          </div>
        </div>

      </div>
      <div class="text-xs text-sky-400">
        {{ expanded ? 'Zwiń' : 'Rozwiń' }}
      </div>
    </div>

    <div
      ref="detailsRef"
      :class="[
        'transition-all duration-300 ease-in-out overflow-hidden',
        expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      ]"
    >
      <div
        v-for="word in attack.words"
        :key="word.secretWordId"
        class="border-t border-slate-700 pt-3 mt-3 text-sm text-slate-300"
      >
        <div class="font-semibold text-white mb-1">
          Cel: <span class="font-mono text-pink-400">{{ word.secretWord }}</span>
          <span
            v-if="word.isMine"
            class="ml-2 px-1.5 py-0.5 bg-green-600/20 text-green-400 text-xs rounded"
          >
            Twoje hasło
          </span>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
          <div>Próby: <span class="font-mono">{{ word.attemptsCount }}</span></div>
          <div>Sukcesy: <span class="font-mono">{{ word.successCount }}</span></div>
          <div>Śr. błąd: <span class="font-mono">{{ word.avgError.toFixed(2) }}</span></div>
          <div>Śr. podobieństwo: <span class="font-mono">{{ word.avgSimilarity.toFixed(2) }}%</span></div>
        </div>

        <details class="mt-2 bg-slate-800/60 p-3 rounded-lg text-slate-200">
          <summary class="cursor-pointer font-medium text-sky-400 hover:underline text-sm">
            Szczegóły prób ({{ word.attempts.length }})
          </summary>
          <div class="mt-3 overflow-x-auto max-h-60 overflow-y-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead class="sticky top-0 bg-slate-800 text-slate-400 border-b border-slate-600">
                <tr>
                  <th class="py-1 pr-2">Data</th>
                  <th class="py-1 pr-2">Podobieństwo</th>
                  <th class="py-1 pr-2">Błąd</th>
                  <th class="py-1">Wynik</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="attempt in word.attempts"
                  :key="attempt.createdAt + (attempt.attackerId || word.secretWordId)"
                  class="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td class="py-1 pr-2 whitespace-nowrap">
                    {{ attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : 'brak daty' }}
                  </td>
                  <td class="py-1 pr-2 font-mono text-emerald-300">
                    {{ attempt.similarity.toFixed(2) }}%
                  </td>
                  <td class="py-1 pr-2 font-mono text-orange-300">
                    {{ attempt.error.toFixed(3) }}
                  </td>
                  <td
                    class="py-1 font-semibold"
                    :class="attempt.success ? 'text-green-400' : 'text-red-400'"
                  >
                    {{ attempt.success ? 'Sukces' : 'Porażka' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import type { AttackByMe } from '~/types/types';

const props = defineProps<{
  attack: AttackByMe
}>();

const expanded = ref(false);
const detailsRef = ref<HTMLElement | null>(null);

function toggleExpanded() {
  expanded.value = !expanded.value;
}

const totalWordsAttacked = computed(() => {
  return props.attack.words?.length || 0;
});

const totalAttemptsOverall = computed(() => {
  return props.attack.words?.reduce((sum, word) => sum + (word.attemptsCount || 0), 0) || 0;
});

const totalSuccessesOverall = computed(() => {
  return props.attack.words?.reduce((sum, word) => sum + (word.successCount || 0), 0) || 0;
});
</script>