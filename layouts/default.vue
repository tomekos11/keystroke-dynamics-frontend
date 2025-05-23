<template>
  <div class="min-h-screen flex flex-col">
    <custom-navigation />
    
    <main class="flex-1 bg-gray-900" >
      <slot />
    </main>

    <custom-footer />
  </div>
</template>