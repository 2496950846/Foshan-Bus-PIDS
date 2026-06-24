<script setup lang="ts">
defineProps<{
  routeName: string
  fromStation: string
  toStation: string
}>()
</script>

<template>
  <div class="info-bar">
    <div class="info-bar-content">
      <span class="route-name">{{ routeName }}</span>
      
      <span class="info-text">本车从</span>
      
      <span class="station-highlight">{{ fromStation }}</span>
      
      <span class="info-text">开往</span>
      
      <span class="station-highlight">{{ toStation }}</span>
    </div>
  </div>
</template>

<style scoped>
.info-bar {
  background-color: #2563eb;
  padding: 1.5vh 3vw;
  flex-shrink: 0;
}

.info-bar-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.route-name {
  color: #facc15;
  font-weight: bold;
  font-size: 4vh;
}

.info-text {
  color: white;
  font-size: 3.2vh;
}

.station-highlight {
  color: #facc15;
  font-weight: bold;
  font-size: 3.2vh;
}
</style>
