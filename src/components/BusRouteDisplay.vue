<script setup lang="ts">
import { computed } from 'vue'

interface Station {
  name: string
}

const props = defineProps<{
  stations: Station[]
}>()

function splitChars(str: string): string[] {
  return Array.from(str)
}

const stationRows = computed(() => {
  const rows = []
  const maxPerRow = 18
  for (let i = 0; i < props.stations.length; i += maxPerRow) {
    rows.push(props.stations.slice(i, i + maxPerRow))
  }
  return rows
})

function needScroll(stationName: string): boolean {
  return stationName.length > 7
}

function scrollDuration(stationName: string): string {
  const baseDuration = 4
  const extraDuration = Math.min(stationName.length - 7, 5) * 0.6
  return (baseDuration + extraDuration) + 's'
}
</script>

<template>
  <div class="bg-white py-2 px-4">
    <div class="relative space-y-4">
      <div 
        v-for="(row, rowIndex) in stationRows" 
        :key="rowIndex"
        class="flex items-start justify-between relative"
      >
        <div class="absolute top-2.5 left-0 right-0 h-1 bg-gray-400 z-0"></div>
        
        <div 
          v-for="(station, index) in row" 
          :key="index"
          class="flex flex-col items-center relative z-10 px-0.5"
        >
          <div class="w-5 h-5 rounded-full bg-blue-600"></div>
          
          <div class="mt-1 text-center min-h-[3rem]">
            <div 
              v-if="needScroll(station.name)" 
              class="text-blue-600 text-xs leading-none font-bold overflow-hidden"
            >
              <div 
                class="animate-scroll-vertical"
                :style="{ animationDuration: scrollDuration(station.name) }"
              >
                <span v-for="(char, charIndex) in splitChars(station.name)" :key="charIndex" class="block">
                  {{ char }}
                </span>
                <span class="block opacity-0 h-0">|</span>
                <span v-for="(char, charIndex) in splitChars(station.name)" :key="'dup-' + charIndex" class="block">
                  {{ char }}
                </span>
              </div>
            </div>
            <div 
              v-else 
              class="text-blue-600 text-xs leading-none font-bold"
            >
              <span v-for="(char, charIndex) in splitChars(station.name)" :key="charIndex" class="block">
                {{ char }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes scroll-vertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.animate-scroll-vertical {
  animation: scroll-vertical linear infinite;
}
</style>
