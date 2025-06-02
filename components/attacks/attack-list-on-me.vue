<template>
  <div class="border border-slate-800 rounded-xl p-4 shadow bg-slate-900 mb-6">
    <div
      class="text-base font-semibold text-white mb-2 flex items-center justify-between cursor-pointer"
      @click="toggleExpanded"
    >
      <div>
        Hasło:
        <span class="font-mono text-emerald-400">{{ attack.secretWord }}</span>
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

        <details class="mt-3 bg-slate-800/50 p-3 rounded text-slate-200">
          <summary class="cursor-pointer font-medium text-sky-400 hover:underline">
            Szczegóły prób ({{ attacker.attempts.length }})
          </summary>
          <ul class="mt-2 max-h-48 overflow-y-auto space-y-1 text-xs leading-relaxed">
            <li
              v-for="attempt in attacker.attempts"
              :key="attempt.createdAt + attempt.attackerId"
              class="border-b border-slate-700 pb-1"
            >
              {{ attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : 'brak daty' }},
              podobieństwo: <span class="font-mono">{{ attempt.similarity.toFixed(2) }}%</span>,
              błąd: <span class="font-mono">{{ attempt.error.toFixed(3) }}</span>,
              <span :class="attempt.success ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
                {{ attempt.success ? 'Sukces' : 'Porażka' }}
              </span>
            </li>
          </ul>
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
