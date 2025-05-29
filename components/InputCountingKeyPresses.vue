<template>
  <UInput v-model="newSample" type="text" @keydown="onKeyDown" @keyup="onKeyUp" />
</template>

<script setup lang="ts">
import type { KeyPress } from '~/types/types';


const newSample = ref('');
const loading = ref(false);
const error = ref('');

const keyPresses = ref<KeyPress[]>([]);

const shiftSpecialChars: Record<string, string> = {
  '1': '!',
  '2': '@',
  '3': '#',
  '4': '$',
  '5': '%',
  '6': '^',
  '7': '&',
  '8': '*',
  '9': '(',
  '0': ')',
  '`': '~',
  '-': '_',
  '=': '+',
  '[': '{',
  ']': '}',
  '\\': '|',
  ';': ':',
  '\'': '"',
  ',': '<',
  '.': '>',
  '/': '?',
};

// Lista klawiszy modyfikujących, których NIE zapisujemy
const modifierKeys = ['Shift', 'Control', 'Alt', 'Meta'];

let lastReleasedAt: Date | null = null;
const activeKeys = new Map<string, { pressedAt: Date, modifiers: any }>();

// Mapowanie kombinacji klawiszy na znaki specjalne (przykład PL)
const resolveKeyValue = (e: KeyboardEvent): string => {
  // Przykładowe mapowanie dla polskich znaków
  if (e.altKey) {
    switch (e.key.toLowerCase()) {
    case 'a':
      return e.shiftKey ? 'Ą' : 'ą';
    case 'c':
      return e.shiftKey ? 'Ć' : 'ć';
    case 'e':
      return e.shiftKey ? 'Ę' : 'ę';
    case 'l':
      return e.shiftKey ? 'Ł' : 'ł';
    case 'o':
      return e.shiftKey ? 'Ó' : 'ó';
    case 's':
      return e.shiftKey ? 'Ś' : 'ś';
    case 'n':
      return e.shiftKey ? 'Ń' : 'ń';
    case 'z':
      return e.shiftKey ? 'Ż' : 'ż';
    case 'x':
      return e.shiftKey ? 'Ź' : 'ź';
    }
  }
  // ...dodaj kolejne mapowania wg potrzeb...

  // Mapowanie znaków specjalnych dla Shift+cyfra/znak
  if (e.shiftKey && Object.prototype.hasOwnProperty.call(shiftSpecialChars, e.key)) {
    return shiftSpecialChars[e.key];
  }

  // Jeśli Shift, zwracamy wielką literę
  if (e.shiftKey && e.key.length === 1) return e.key.toUpperCase();
  // Zwykły znak
  return e.key;
};

// Obsługa naciśnięcia klawisza
const onKeyDown = (e: KeyboardEvent) => {
  // Ignoruj powtarzające się naciśnięcia (trzymanie klawisza)
  if (e.repeat) return;
  const now = new Date();
  const value = resolveKeyValue(e);

  // Zapamiętaj moment naciśnięcia i modyfikatory
  activeKeys.set(e.code, {
    pressedAt: now,
    modifiers: {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    }
  });
};

// Obsługa puszczenia klawisza
const onKeyUp = (e: KeyboardEvent) => {
  // nie zapisuje guzików shift itp
  if (modifierKeys.includes(e.key)) {
    activeKeys.delete(e.code);
    return;
  }

  const now = new Date();
  const value = resolveKeyValue(e);

  const active = activeKeys.get(e.code);
  if (!active) return;

  const pressDuration = now.getTime() - active.pressedAt.getTime();
  const waitDuration = lastReleasedAt ? active.pressedAt.getTime() - lastReleasedAt.getTime() : 0;

  keyPresses.value.push({
    value,
    pressedAt: active.pressedAt,
    releasedAt: now,
    pressDuration,
    waitDuration,
    modifiers: active.modifiers
  });

  lastReleasedAt = now;
  activeKeys.delete(e.code);
};

// Funkcja walidująca i korygująca wpisy
const validateAndCorrectKeyPresses = (entries: KeyPress[]): KeyPress[] => {
  const inverseShiftMap = Object.entries(shiftSpecialChars).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {} as Record<string, string>);

  const polishCharsMap: Record<string, { base: string; alt: boolean; shift: boolean }> = {
    'ą': { base: 'a', alt: true, shift: false },
    'Ą': { base: 'a', alt: true, shift: true },
    'ć': { base: 'c', alt: true, shift: false },
    'Ć': { base: 'c', alt: true, shift: true },
    'ę': { base: 'e', alt: true, shift: false },
    'Ę': { base: 'e', alt: true, shift: true },
    'ł': { base: 'l', alt: true, shift: false },
    'Ł': { base: 'l', alt: true, shift: true },
    'ó': { base: 'o', alt: true, shift: false },
    'Ó': { base: 'o', alt: true, shift: true },
    'ś': { base: 's', alt: true, shift: false },
    'Ś': { base: 's', alt: true, shift: true },
    'ń': { base: 'n', alt: true, shift: false },
    'Ń': { base: 'n', alt: true, shift: true },
    'ż': { base: 'z', alt: true, shift: false },
    'Ż': { base: 'z', alt: true, shift: true },
    'ź': { base: 'x', alt: true, shift: false },
    'Ź': { base: 'x', alt: true, shift: true },
  };

  return entries.map(entry => {
    let value = entry.value;
    const { modifiers } = entry;

    // Korekta liter
    if (/^[a-zA-Z]$/.test(value)) {
      value = modifiers.shift ? value.toUpperCase() : value.toLowerCase();
    }

    // Korekta znaków specjalnych
    if (Object.prototype.hasOwnProperty.call(inverseShiftMap, value)) {
      if (!modifiers.shift) {
        value = inverseShiftMap[value];
      }
    } else if (modifiers.shift && Object.prototype.hasOwnProperty.call(shiftSpecialChars, value)) {
      value = shiftSpecialChars[value];
    }

    // Korekta polskich znaków
    if (Object.prototype.hasOwnProperty.call(polishCharsMap, value)) {
      const expected = polishCharsMap[value];
      if (modifiers.alt !== expected.alt || modifiers.shift !== expected.shift) {
        value = expected.base;
        if (modifiers.shift) value = value.toUpperCase();
      }
    }

    return { ...entry, value };
  });
};

const clearKeyPresses = () => {
  newSample.value = '';
  keyPresses.value = [];
  lastReleasedAt = null;
  activeKeys.clear();
};

defineExpose({
  loading,
  error,
  keyPresses,
  newSample,
  clearKeyPresses,
  validateAndCorrectKeyPresses,
});
</script>
