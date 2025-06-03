<template>
  <UCard
    v-if="userStore.activeSecretWord"
    class="bg-transparent"
    :ui="{
      root: 'p-0',
      body: 'sm:px-0 p-0',
      header: 'sm:px-0 p-0 w-full',
      footer: 'p-0',
    }"
  >

    <h2 class="text-2xl font-bold tracking-tight text-primary drop-shadow-sm mb-6">
      Lista próbek
    </h2>

    <UButtonGroup>
      <UButton label="Sprawdź poprawność próbek" :loading="samplesCorrectnessLoading" variant="ghost" @click="checkSamplesCorrectness" />
      <UButton v-if="showSamplesCorrectness" label="Zwiń" color="info" variant="ghost" :loading="samplesCorrectnessLoading" @click="showSamplesCorrectness = false" />
    </UButtonGroup>

    <UCollapsible v-model:open="showSamplesCorrectness">
      <div/> 
      <template #content>
        <!-- <div v-if="samplesCorrectness" class="flex flex-col gap-3 my-3">
          <UCard>Liczba próbek: <b class="text-primary">{{ samplesCorrectness.stats.samples }}</b></UCard>
          <UCard>Średni czas kliku [ms]: <b class="text-primary">{{ Math.round(samplesCorrectness.stats.pressAvg * 100) / 100 }}</b></UCard>
          <UCard>Odchylenie standardowe średniego czasu kliku [ms]:  <b class="text-primary">{{ Math.round(samplesCorrectness.stats.pressStd * 100) / 100 }}</b></UCard>
          <UCard>Średni czas czekania na następny klawisz [ms]: <b class="text-primary">{{ Math.round(samplesCorrectness.stats.waitAvg * 100) / 100 }}</b></UCard>
          <UCard>Odchylenie standardowe czasu czekania na następny klawisz [ms]: <b class="text-primary">{{ Math.round(samplesCorrectness.stats.waitStd * 100) / 100 }}</b></UCard>
        </div> -->

        <table v-if="samplesCorrectness">
          <table>
            <tr>
              <td colspan="2"/>

              <td v-for="(stat, index) in samplesCorrectness.pressStat" :key="index">
                {{ stat.key }}
              </td>
            </tr>

            <tr>
              <td rowspan="2">
                Trzymanie klawisza
              </td>

              <td>
                Średni czas
              </td>
              
              <td v-for="(stat, index) in samplesCorrectness.pressStat" :key="index">
                {{ Math.round(stat.avg * 100) / 100 }}
              </td>
            </tr>

            <tr>

              
              <td>
                Średnie odchylenie standardowe
              </td>
              
              <td v-for="(stat, index) in samplesCorrectness.pressStat" :key="index">
                {{ Math.round(stat.std * 100) / 100 }}
              </td>
            </tr>

            <tr>
              <td rowspan="2">
                Oczekiwania na następny klawisz
              </td>

              <td>
                Średni czas oczekiwania
              </td>
              
              <td v-for="(stat, index) in samplesCorrectness.waitStat" :key="index">
                {{ Math.round(stat.avg * 100) / 100 }}
              </td>
            </tr>

            <tr>
              <td>
                Średnie Odchylenie standardowe
              </td>
              
              <td v-for="(stat, index) in samplesCorrectness.waitStat" :key="index">
                {{ Math.round(stat.std * 100) / 100 }}
              </td>
            </tr>
          </table>
        </table>
      </template>
    </UCollapsible>
    
    <UTable
      ref="table"
      :data="userStore.activeSecretWord?.attempts"
      :columns="columns"
      :loading="loading"
      sticky
      :empty="`Lista próbek dla słowa ${userStore.activeSecretWord.word} jest pusta`"
    >
      <template #expanded="{ row }">
        <pre>{{ row.original }}</pre>
      </template>

      <template #cell-keyPresses="{ row }">
        <span style="color: red;">{{ row.original.keyPresses }}</span>
      </template>
    </UTable>

    <UModal v-model:open="showModal" title="Szczegóły próby">
      <template #body>
        <div>
          <div v-if="selectedAttempt">
            <UAlert
              title="Uwaga!"
              description="Kliknięcie na klawisz pokaże szczegółowe dane na temat jego przyciśnięcia"
              class="mb-3"
            />
            <h3 class="font-bold mb-2">Wciśnięte klawisze według kolejności:</h3>
            <div class="flex flex-wrap gap-1.5 mb-4">
              <button
                v-for="(key, idx) in selectedAttempt.keyPresses"
                :key="idx"
                :class="[
                  'px-3 py-1 rounded border font-semibold transition-colors duration-200 shadow',
                  openedDetails[idx]
                    ? 'bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 text-white border-slate-950 shadow-lg hover:from-slate-900 hover:to-black'
                    : 'bg-gradient-to-r from-green-700 via-green-800 to-green-900 text-white border-slate-950 hover:from-green-900 hover:to-green-500'
                ]"
                @click="toggleDetails(idx)"
              >
                {{ key.value }}
              </button>
            </div>
            <div v-for="(key, idx) in selectedAttempt.keyPresses" :key="'details-' + idx">
              <transition name="fade">
                <div v-if="openedDetails[idx]" class="mb-4 p-3 border rounded">
                  <div><b>Klawisz:</b> {{ key.value }}</div>
                  <div><b>pressDuration:</b> {{ key.pressDuration }} ms</div>
                  <div><b>waitDuration:</b> {{ key.waitDuration }} ms</div>
                  <div><b>pressedAt:</b> {{ key.pressedAt }}</div>
                  <div><b>releasedAt:</b> {{ key.releasedAt }}</div>
                  <div><b>Modyfikatory:</b>
                    <ul class="ml-4">
                      <li v-for="(mod, modKey) in key.modifiers" :key="modKey">
                        {{ modKey }}: <b>{{ mod ? 'TAK' : 'nie' }}</b>
                      </li>
                    </ul>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div v-else>
            <em>Brak danych do wyświetlenia.</em>
          </div>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { UButton, UCheckbox, UIcon } from '#components';
import type { Attempt, SamplesCorrectness } from '~/types/types';

defineProps<{
  loading: boolean
}>();

const UBadge = resolveComponent('UBadge');
const UDropdownMenu = resolveComponent('UDropdownMenu');

const showModal = ref(false);
const selectedAttempt = ref<Attempt | null>(null);

const columns: TableColumn<Attempt>[] = [
  {
    id: 'select',
    header: ({ table }) => h(UCheckbox, {
      'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
      'aria-label': 'Select all'
    }),
    cell: ({ row }) => h(UCheckbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
      'aria-label': 'Select row'
    }),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'id',
  },
  {
    accessorKey: 'createdAt',
    header: 'Data stworzenia',
    cell: ({ row }) => {
      return new Date(row.getValue('createdAt')).toLocaleString('pl-PL', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
  },
  {
    accessorKey: 'isCorrect',
    header: 'Poprawny',
    cell: ({ row }) => {
      const color = row.getValue('isCorrect') ? 'success' : 'error';

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
        h(UIcon, {
          name:  row.getValue('isCorrect') ? 'i-lucide-check' : 'i-lucide-x'
        })
      );
    }
  }, 
  {
    accessorKey: 'keyPresses',
    header: 'Ilość naciśniętych klawiszy',
    cell: ({ row }) => (row.getValue('keyPresses')?.length || 0),
  },
  {
    accessorKey: 'keyPresses',
    header: 'Kolejność klawiszy',
    cell: ({ row }) => (row.getValue('keyPresses')?.map(el => el.value)?.join(',') || ''),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: [
              {
                label: 'Szczegóły',
                icon: 'i-lucide-info',
                onClick: () => {
                  selectedAttempt.value = row.original;
                  showModal.value = true;
                }
              },
              {
                label: 'Usuń rekord',
                icon: 'i-lucide-trash-2',
                onClick: () => onRemove(row.original.id)
              }
            ],
            'aria-label': 'Actions dropdown'
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown'
            })
        )
      );
    }
  }
];

const onRemove = async (id: number) => {
  try {
    const { remainingAttempts } = await useFetchWithAuth<{message: string; remainingAttempts: Attempt[]}>(`/secret-word/attempts/${id}`, {
      method: 'DELETE'
    });

    if(userStore.activeSecretWord){
      userStore.activeSecretWord.attempts = remainingAttempts;
    }

  } catch (err) {
    console.error(err);
  }
};

const openedDetails = ref<boolean[]>([]);

function toggleDetails(idx: number) {
  openedDetails.value[idx] = !openedDetails.value[idx];
}

// Resetuj otwarte szczegóły przy zmianie attemptu
watch(selectedAttempt, (val) => {
  if (!val) return;
  openedDetails.value = Array(val.keyPresses.length).fill(false);
});

const userStore = useUserStore();

const samplesCorrectness = ref<SamplesCorrectness | null>(null);
const showSamplesCorrectness = ref(false);
const samplesCorrectnessLoading = ref(false);

const checkSamplesCorrectness = async () => {
  if(!userStore.activeSecretWord) return;
  samplesCorrectnessLoading.value = true;

  try {
    const res = await useFetchWithAuth<SamplesCorrectness>('/keystrokes/evaluate', {
      method: 'post',
      body: {
        secretWord: userStore.activeSecretWord.word
      }
    });

    samplesCorrectness.value = res;
    showSamplesCorrectness.value = true;
  } catch (err) {
    console.error(err);
  } finally {
    samplesCorrectnessLoading.value = false;
  }
};

</script>

<style scoped>

th, td {
  padding: 7px 10px;
  border: 1px solid ;
}
</style>