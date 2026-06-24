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
  const baseDuration = 8
  const extraDuration = Math.min(stationName.length - 7, 5) * 1
  const totalDuration = baseDuration + extraDuration
  const pauseDuration = 2
  return (totalDuration + pauseDuration * 2) + 's'
}

function getLineStyle(row: Station[], rowIndex: number) {
  const maxPerRow = 18
  const totalRows = stationRows.value.length
  const count = row.length
  const isFirstRow = rowIndex === 0
  const isLastRow = rowIndex === totalRows - 1
  const extendPercent = 100 / maxPerRow * 1

  let left = (100 / maxPerRow) * 0.5
  let right = 100 - (100 / maxPerRow) * (count - 0.5)

  if (!isFirstRow) {
    left -= extendPercent
  }

  if (!isLastRow) {
    right -= extendPercent
  }

  const style: Record<string, string> = {}

  if (isLastRow) {
    style.left = '-4vw'
  } else {
    style.left = left + '%'
  }

  if (isFirstRow) {
    style.right = '-4vw'
  } else {
    style.right = right + '%'
  }

  return style
}
</script>

<template>
  <div class="route-display-container">
    <div class="station-rows">
      <div 
        v-for="(row, rowIndex) in stationRows" 
        :key="rowIndex"
        class="station-row"
      >
        <div class="station-line" :style="getLineStyle(row, rowIndex)"></div>
        
        <div 
          v-for="(station, index) in row" 
          :key="index"
          class="station"
        >
          <div class="station-dot"></div>
          
          <div class="station-name">
            <div 
              v-if="needScroll(station.name)" 
              class="station-name-scroll"
            >
              <div 
                class="animate-scroll-vertical"
                :style="{ animationDuration: scrollDuration(station.name) }"
              >
                <span v-for="(char, charIndex) in splitChars(station.name)" :key="charIndex" class="block">
                  {{ char }}
                </span>
              </div>
            </div>
            <div 
              v-else 
              class="station-name-text"
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
.route-display-container {
  width: 100%;
  height: 100%;
  background: white;
  padding: 1vh 2vw;
  display: flex;
  align-items: center;
}

.station-rows {
  position: relative;
  width: 100%;
}

.station-row {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  margin-bottom: 8vh;
}

.station-row:last-child {
  margin-bottom: 0;
}

.station-line {
  position: absolute;
  top: 2vh;
  left: 0;
  right: 0;
  height: 0.6vh;
  background-color: #9ca3af;
  z-index: 0;
}

.station {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 10;
  flex: 0 0 calc(100% / 18);
  min-width: 0;
  padding: 0 0.2vw;
  box-sizing: border-box;
}

.station-dot {
  width: 4vh;
  height: 4vh;
  min-width: 20px;
  min-height: 20px;
  border-radius: 50%;
  background-color: #2563eb;
  flex-shrink: 0;
}

.station-name {
  margin-top: 1vh;
  text-align: center;
  height: 20vh;
  min-height: 100px;
  width: 100%;
  overflow: hidden;
}

.station-name-text {
  color: #2563eb;
  font-size: 2.8vh;
  line-height: 1.2;
  font-weight: bold;
}

.station-name-scroll {
  color: #2563eb;
  font-size: 2.8vh;
  line-height: 1.2;
  font-weight: bold;
  overflow: hidden;
  height: 100%;
}

@keyframes scroll-vertical {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(0);
  }
  70% {
    transform: translateY(calc(-100% + 20vh));
  }
  90% {
    transform: translateY(calc(-100% + 20vh));
  }
  100% {
    transform: translateY(0);
  }
}

.animate-scroll-vertical {
  animation: scroll-vertical ease-in-out infinite;
}
</style>
