<script setup lang="ts">
defineProps<{
  routeName: string
  fromStation: string
  toStation: string
}>()
</script>

<template>
  <div class="bg-blue-600 py-3 px-6">
    <div class="flex items-center justify-center gap-6">
      <span class="text-yellow-400 font-bold text-2xl">{{ routeName }}</span>
      
      <span class="text-white text-xl">本车从</span>
      
      <span class="text-yellow-400 font-bold text-xl">{{ fromStation }}</span>
      
      <span class="text-white text-xl">开往</span>
      
      <span class="text-yellow-400 font-bold text-xl">{{ toStation }}</span>
    </div>
  </div>
</template>
