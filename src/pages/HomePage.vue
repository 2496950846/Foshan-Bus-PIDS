<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BusRouteDisplay from '@/components/BusRouteDisplay.vue'
import BusInfoBar from '@/components/BusInfoBar.vue'

const routes = ref<any[]>([])
const currentRouteId = ref<number | null>(null)
const busData = ref({
  routeName: 'B25',
  fromStation: '大学城（中部枢纽）总站',
  toStation: '体育中心总站',
  stations: [
    { name: '大学城（中部枢纽）' },
    { name: '广大公寓' },
    { name: '广大生活区' },
    { name: '广大' },
    { name: '华师' },
    { name: '星海学院' },
    { name: '地铁大学城北' },
    { name: '仑头立交' },
    { name: '琶洲大桥北' },
    { name: '科韵路' },
    { name: '学院' },
    { name: '上社' },
    { name: '华景新城' },
    { name: '师大暨大' },
    { name: '岗顶' },
    { name: '石牌桥' },
    { name: '体育中心' },
    { name: '体育中心总站' }
  ]
})

async function loadRoutes() {
  try {
    const res = await fetch('http://localhost:3001/api/routes')
    const data = await res.json()
    if (data.success) {
      routes.value = data.data
    }
  } catch (e) {
    console.error('加载线路列表失败:', e)
  }
}

async function loadCurrentRoute() {
  try {
    const res = await fetch('http://localhost:3001/api/current-route')
    const data = await res.json()
    if (data.success) {
      busData.value = data.data
      const matched = routes.value.find(r => r.name === data.data.routeName)
      if (matched) {
        currentRouteId.value = matched.id
      }
    }
  } catch (e) {
    console.error('加载当前线路失败:', e)
  }
}

async function switchRoute(routeId: number) {
  try {
    const res = await fetch('http://localhost:3001/api/current-route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route_id: routeId })
    })
    const data = await res.json()
    if (data.success) {
      currentRouteId.value = routeId
      const routeRes = await fetch(`http://localhost:3001/api/routes/${routeId}`)
      const routeData = await routeRes.json()
      if (routeData.success) {
        busData.value = {
          routeName: routeData.data.name,
          fromStation: routeData.data.from_station,
          toStation: routeData.data.to_station,
          stations: routeData.data.stations.map((s: any) => ({ name: s.name }))
        }
      }
    }
  } catch (e) {
    console.error('切换线路失败:', e)
  }
}

onMounted(async () => {
  await loadRoutes()
  await loadCurrentRoute()
})
</script>

<template>
  <div class="w-full h-full bg-white flex flex-col overflow-hidden">
    <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
      <div class="w-full">
        <BusRouteDisplay :stations="busData.stations" />
      </div>
    </div>
    <BusInfoBar
      :route-name="busData.routeName"
      :from-station="busData.fromStation"
      :to-station="busData.toStation"
    />
  </div>
</template>
