<template>
  <div class="flex items-center justify-center min-h-[80svh]">
    <Transition name="slide-fade" mode="out-in" @before-enter="setHeight" @after-enter="resetHeight">
      <component
        :is="isLogin ? LoginForm : RegisterForm"
        :key="isLogin"
        @switch="onSwitch"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

const route = useRoute();
const router = useRouter();

const isLogin = ref(route.query.mode === 'login' ? true : false);
const minHeight = ref(0);
const container = ref(null);

const setHeight = (el) => {
  if (container.value) {
    minHeight.value = container.value.offsetHeight;
    nextTick(() => {
      minHeight.value = el.offsetHeight;
    });
  }
};

const resetHeight = () => {
  minHeight.value = 0;
};

const onSwitch = () => {
  isLogin.value = !isLogin.value;
  router.replace(isLogin.value ? '/auth?mode=login' : '/auth?mode=register');
};

onMounted(() => console.log('mounted'));
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
