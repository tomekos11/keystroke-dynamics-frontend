import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Attempt } from '~/types/types';

export const useAttemptsStore = defineStore('attempts', () => {
  // Stan
  const attempts = ref<Attempt[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // Funkcja do pobierania danych przez useAsyncData
  const fetchAttempts = async () => {
    loading.value = true;
    error.value = null;
    try {
      // useAsyncData zwraca obiekt z .data, .pending, .error
      const { data, error: fetchError } = await useAsyncData(
        'attempts', // klucz cache
        async () => {
          return await useFetchWithAuth<Attempt[]>('/users/attempts');
        },
        {
          default: () => [],
          // Możesz dodać inne opcje, np. server, lazy, immediate itp.
        }
      );

      // Przypisz dane do stanu
      attempts.value = data.value ?? [];
      error.value = fetchError.value;
    } catch (err: any) {
      attempts.value = [];
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  return { attempts, loading, error, fetchAttempts };
});
