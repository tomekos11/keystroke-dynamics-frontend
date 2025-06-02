<template>
  <div class="border border-slate-800 rounded-xl p-4 shadow bg-slate-900 mb-6">
    <div
      class="text-base font-semibold text-white mb-2 flex items-center justify-between cursor-pointer"
      @click="toggleExpanded"
    >
      <div>
        Hasło:
        <span class="font-mono text-emerald-400">{{ attack.secretWord }}</span>
        <div class="flex mt-1 text-xs text-slate-400 gap-x-4 gap-y-0.5">
          <div>
            <div>Próby: <span class="font-mono text-slate-200">{{ attack.totalAttempts }}</span></div>
            <div>Max podobieństwo: <span class="font-mono text-slate-200">{{ attack.maxSimilarity.toFixed(2) }}%</span></div>
            <div>Max błąd: <span class="font-mono text-slate-200">{{ attack.maxError.toFixed(3) }}</span></div>

          </div>
          <div>
            <div>Sukcesy: <span class="font-mono text-slate-200">{{ attack.totalSuccesses }}</span></div>
            <div>Min podobieństwo: <span class="font-mono text-slate-200">{{ attack.minSimilarity.toFixed(2) }}%</span></div>
            <div>Min błąd: <span class="font-mono text-slate-200">{{ attack.minError.toFixed(3) }}</span></div>

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
        expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
      ]"
    >
      <attacks-attack-comparison-chart v-if="expanded" :attack="attack" />
      <div
        v-for="attacker in attack.attackers"
        :key="attacker.attackerId"
        class="border-t border-slate-700 pt-3 mt-3 text-sm text-slate-300"
      >
        <div class="font-semibold text-white mb-1">
          {{ isMine ? 'Cel' : 'Atakujący' }}: {{ attacker.attackerEmail }}
          <span
            v-if="attacker.isMine"
            class="ml-2 px-1.5 py-0.5 bg-green-600/20 text-green-400 text-xs rounded"
          >
            Mój
          </span>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-1">
          <div>Próby: <span class="font-mono">{{ attacker.attemptsCount }}</span></div>
          <div>Sukcesy: <span class="font-mono">{{ attacker.successCount }}</span></div>
          <div>Śr. błąd: <span class="font-mono">{{ attacker.avgError.toFixed(2) }}</span></div>
          <div>Śr. podobieństwo: <span class="font-mono">{{ attacker.avgSimilarity.toFixed(2) }}%</span></div>
        </div>

        <details class="mt-4 bg-slate-800/60 p-3 rounded-lg text-slate-200">
          <summary class="cursor-pointer font-medium text-sky-400 hover:underline text-sm">
            Szczegóły prób ({{ attacker.attempts.length }})
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
                  v-for="attempt in attacker.attempts"
                  :key="attempt.createdAt + attempt.attackerId"
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
import { ref } from 'vue';
import type { AttackOnMe } from '~/types/types';

defineProps<{
  attack: AttackOnMe
  isMine: boolean
}>();

const expanded = ref(false);

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>
