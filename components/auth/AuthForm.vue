<template>
  <div class="flex items-center justify-center min-h-[80svh]">
    <Transition name="slide-fade" mode="out-in" @before-enter="setHeight" @after-enter="resetHeight">
      <component
        :is="isLogin ? LoginForm : RegisterForm"
        :key="isLogin"
        @switch="isLogin = !isLogin"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

const isLogin = ref(true);
const minHeight = ref(0);
const container = ref(null);

function setHeight(el) {
  if (container.value) {
    minHeight.value = container.value.offsetHeight;
    nextTick(() => {
      minHeight.value = el.offsetHeight;
    });
  }
}

function resetHeight() {
  minHeight.value = 0;
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(.4,0,.2,1);
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
