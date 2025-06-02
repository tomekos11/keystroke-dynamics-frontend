<template>
  <div
    v-for="word in attacker.words"
    :key="word.secretWordId"
    class="border border-slate-800 rounded-2xl p-6 shadow-lg bg-slate-900 mb-6"
  >
    <div class="text-lg font-semibold mb-4">
      🎯 Cel: <span class="font-mono text-pink-400">{{ word.secretWord }}</span>
    </div>

    <div class="space-y-1 text-slate-300">
      <div>🔁 Próby: <span class="font-mono">{{ word.attemptsCount }}</span></div>
      <div>✅ Sukcesy: <span class="font-mono">{{ word.successCount }}</span></div>
      <div>📉 Śr. błąd: <span class="font-mono">{{ word.avgError.toFixed(2) }}</span></div>
      <div>📊 Śr. podobieństwo: <span class="font-mono">{{ word.avgSimilarity.toFixed(2) }}%</span></div>
      <div v-if="word.isMine" class="mt-1">
        <span class="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-semibold rounded">
          Twoje hasło
        </span>
      </div>
    </div>

    <details class="mt-3 text-sm bg-slate-800/50 p-3 rounded-lg text-slate-200">
      <summary class="cursor-pointer font-medium text-sky-400 hover:underline">📂 Szczegóły prób</summary>
      <ul class="list-disc list-inside mt-2 max-h-52 overflow-y-auto pr-2 space-y-1">
        <li
          v-for="attempt in word.attempts"
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
</template>

<script setup lang="ts">
defineProps<{
  attacker: {
    attackerId: number
    attackerEmail: string
    words: {
      secretWordId: number
      secretWord: string
      attemptsCount: number
      successCount: number
      avgError: number
      avgSimilarity: number
      isMine: boolean
      attempts: {
        similarity: number
        success: boolean
        error: number
        createdAt: string | null
        attackerId: number
        attackerEmail: string
        word: string
        wordId: number
      }[]
    }[]
  }
}>();
</script>
