<template>
  <div class="my-4">
    <div class="flex justify-between items-center text-white text-xl mb-2 px-4">
      <button title="Poprzedni" class="hover:text-sky-400 transition" @click="prevPage">
        ←
      </button>
      <div class="text-sm text-gray-300">
        Strona {{ currentPage + 1 }} / {{ totalPages }}
      </div>
      <button title="Następny" class="hover:text-sky-400 transition" @click="nextPage">
        →
      </button>
    </div>

    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  type BarOptions,
  type ChartOptions
} from 'chart.js';
import type { AttackOnMe } from '~/types/types';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const props = defineProps<{
  attack: AttackOnMe
}>();

const pageSize = 3;
const currentPage = ref(0);

const totalPages = computed(() =>
  Math.ceil(props.attack.attackers.length / pageSize)
);

const paginatedAttackers = computed(() =>
  props.attack.attackers.slice(
    currentPage.value * pageSize,
    (currentPage.value + 1) * pageSize
  )
);

const chartData = computed(() => ({
  labels: paginatedAttackers.value.map(a => a.attackerEmail),
  datasets: [
    {
      label: 'Śr. podobieństwo (%)',
      backgroundColor: 'rgba(34,197,94,0.6)',
      data: paginatedAttackers.value.map(a => a.avgSimilarity),
      yAxisID: 'similarityAxis'
    },
    {
      label: 'Śr. błąd',
      backgroundColor: 'rgba(239,68,68,0.6)',
      data: paginatedAttackers.value.map(a => a.avgError),
      yAxisID: 'errorAxis'
    }
  ]
}));

const chartOptions: ChartOptions = {
  responsive: true,
  
  plugins: {
    legend: {
      position: 'top',
      labels: { color: 'white' }
    },
    tooltip: {
      mode: 'index',
      intersect: false
    }
  },
  scales: {
    x: {
      ticks: { color: 'white' },
      grid: { color: '#334155' }
    },
    similarityAxis: {
      type: 'linear',
      position: 'left',
      beginAtZero: true,
      max: 100,
      ticks: { color: 'white' },
      grid: { color: '#334155' }
    },
    errorAxis: {
      type: 'linear',
      position: 'right',
      beginAtZero: true,
      ticks: { color: 'white' },
      grid: { drawOnChartArea: false }
    }
  }
};

function nextPage() {
  currentPage.value = (currentPage.value + 1) % totalPages.value;
}

function prevPage() {
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value;
}
</script>

<style scoped>
</style>
