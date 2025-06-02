<template>
  <div class="border border-slate-800 rounded-2xl p-6 shadow-lg bg-slate-900 mb-6">
    <div class="text-lg font-semibold mb-4">
      🔐 Hasło: <span class="font-mono text-emerald-400">{{ attack.secretWord }}</span>
    </div>

    <div
      v-for="attacker in attack.attackers"
      :key="attacker.attackerId"
      class="border-t border-slate-700 pt-4 mt-2 text-slate-300"
    >
      <div class="space-y-1">
        <div class="font-semibold text-white">
          👤 {{ isMine ? 'Cel' : 'Atakujący' }}: {{ attacker.attackerEmail }}
          <span
            v-if="attacker.isMine"
            class="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded"
          >
            Mój
          </span>
        </div>
        <div>🔁 Próby: <span class="font-mono">{{ attacker.attemptsCount }}</span></div>
        <div>✅ Sukcesy: <span class="font-mono">{{ attacker.successCount }}</span></div>
        <div>📉 Śr. błąd: <span class="font-mono">{{ attacker.avgError.toFixed(2) }}</span></div>
        <div>📊 Śr. podobieństwo: <span class="font-mono">{{ attacker.avgSimilarity.toFixed(2) }}%</span></div>
      </div>

      <details class="mt-3 text-sm bg-slate-800/50 p-3 rounded-lg text-slate-200">
        <summary class="cursor-pointer font-medium text-sky-400 hover:underline">📂 Szczegóły prób</summary>
        <ul class="list-disc list-inside mt-2 max-h-52 overflow-y-auto pr-2 space-y-1">
          <li
            v-for="attempt in attacker.attempts"
            :key="attempt.createdAt + attempt.attackerId"
          >
            📅 {{ attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : 'brak daty' }},
            Podobieństwo: <span class="font-mono">{{ attempt.similarity.toFixed(2) }}%</span>,
            Błąd: <span class="font-mono">{{ attempt.error.toFixed(3) }}</span>,
            Status:
            <span :class="attempt.success ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'">
              {{ attempt.success ? 'Sukces' : 'Porażka' }}
            </span>
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  attack: AttackSummary
  isMine: boolean
}>();
</script>
