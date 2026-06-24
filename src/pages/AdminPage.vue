<script setup lang="ts">
import { ref, reactive } from 'vue'

const isLoggedIn = ref(false)
const username = ref('')
const password = ref('')
const loginError = ref('')

const routes = ref<any[]>([])
const currentRouteId = ref<number | null>(null)
const selectedRoute = ref(null)
const showModal = ref(false)
const isEditMode = ref(false)
const editingRouteId = ref<number | null>(null)

const newRoute = reactive({
  name: '',
  from_station: '',
  to_station: '',
  stations: [{ name: '' }]
})

async function login() {
  const res = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username.value, password: password.value })
  })
  const data = await res.json()
  if (data.success) {
    isLoggedIn.value = true
    loadRoutes()
  } else {
    loginError.value = data.message
  }
}

async function loadRoutes() {
  const res = await fetch('http://localhost:3001/api/routes')
  const data = await res.json()
  if (data.success) {
    routes.value = data.data
  }
  loadCurrentRoute()
}

async function loadCurrentRoute() {
  try {
    const res = await fetch('http://localhost:3001/api/current-route')
    const data = await res.json()
    if (data.success) {
      const matched = routes.value.find(r => r.name === data.data.routeName)
      if (matched) {
        currentRouteId.value = matched.id
      }
    }
  } catch (e) {
    console.error('加载当前线路失败:', e)
  }
}

async function setCurrentRoute(id: number) {
  const res = await fetch('http://localhost:3001/api/current-route', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ route_id: id })
  })
  const data = await res.json()
  if (data.success) {
    alert(data.message)
    currentRouteId.value = id
  }
}

async function addRoute() {
  const res = await fetch('http://localhost:3001/api/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRoute)
  })
  const data = await res.json()
  if (data.success) {
    alert(data.message)
    showModal.value = false
    loadRoutes()
    resetForm()
  }
}

async function updateRoute() {
  if (editingRouteId.value === null) return
  const res = await fetch(`http://localhost:3001/api/routes/${editingRouteId.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRoute)
  })
  const data = await res.json()
  if (data.success) {
    alert(data.message)
    showModal.value = false
    loadRoutes()
    resetForm()
  }
}

async function deleteRoute(id: number) {
  if (confirm('确定删除这条线路吗？')) {
    const res = await fetch(`http://localhost:3001/api/routes/${id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    if (data.success) {
      alert(data.message)
      loadRoutes()
    }
  }
}

async function openEditModal(id: number) {
  const res = await fetch(`http://localhost:3001/api/routes/${id}`)
  const data = await res.json()
  if (data.success) {
    const route = data.data
    newRoute.name = route.name
    newRoute.from_station = route.from_station
    newRoute.to_station = route.to_station
    newRoute.stations = route.stations.map((s: any) => ({ name: s.name }))
    editingRouteId.value = id
    isEditMode.value = true
    showModal.value = true
  }
}

function openAddModal() {
  resetForm()
  isEditMode.value = false
  editingRouteId.value = null
  showModal.value = true
}

function resetForm() {
  newRoute.name = ''
  newRoute.from_station = ''
  newRoute.to_station = ''
  newRoute.stations = [{ name: '' }]
}

function addStationInput() {
  newRoute.stations.push({ name: '' })
}

function removeStation(index: number) {
  if (newRoute.stations.length > 1) {
    newRoute.stations.splice(index, 1)
  }
}
</script>

<template>
  <div class="w-full h-full bg-gray-100 overflow-auto">
    <div v-if="!isLoggedIn" class="flex items-center justify-center w-full h-full">
      <div class="bg-white rounded-lg shadow-xl p-8 w-96">
        <h2 class="text-2xl font-bold text-center mb-6 text-blue-600">后台登录</h2>
        <div v-if="loginError" class="text-red-500 text-center mb-4">{{ loginError }}</div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <input 
              v-model="username" 
              type="text" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <input 
              v-model="password" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123456"
            />
          </div>
          <button 
            @click="login"
            class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            登录
          </button>
        </div>
      </div>
    </div>

    <div v-else class="p-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">公交线路管理</h1>
          <button 
            @click="openAddModal"
            class="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            添加线路
          </button>
        </div>

        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">线路名称</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">起点站</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">终点站</th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="route in routes" :key="route.id">
                <td class="px-6 py-4 text-sm font-medium text-blue-600">
                  {{ route.name }}
                  <span v-if="currentRouteId === route.id" class="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">当前</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ route.from_station }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ route.to_station }}</td>
                <td class="px-6 py-4">
                  <button
                    v-if="currentRouteId !== route.id"
                    @click="setCurrentRoute(route.id)"
                    class="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    设为当前
                  </button>
                  <button 
                    @click="openEditModal(route.id)"
                    class="text-green-500 hover:text-green-700 mr-4"
                  >
                    编辑
                  </button>
                  <button 
                    @click="deleteRoute(route.id)"
                    class="text-red-500 hover:text-red-700 mr-4"
                  >
                    删除
                  </button>
                </td>
              </tr>
              <tr v-if="routes.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">暂无线路数据</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
        <h2 class="text-xl font-bold mb-6 text-gray-800 flex-shrink-0">{{ isEditMode ? '编辑公交线路' : '添加公交线路' }}</h2>

        <div class="space-y-4 overflow-y-auto flex-1 pr-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">线路名称</label>
            <input
              v-model="newRoute.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="如：B25"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">起点站</label>
            <input
              v-model="newRoute.from_station"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="起点站名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">终点站</label>
            <input
              v-model="newRoute.to_station"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="终点站名称"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">途经站点</label>
            <div v-for="(station, index) in newRoute.stations" :key="index" class="flex gap-2 mb-2">
              <input
                v-model="station.name"
                type="text"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                :placeholder="`站点 ${index + 1}`"
              />
              <button
                v-if="newRoute.stations.length > 1"
                @click="removeStation(index)"
                class="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                -
              </button>
            </div>
            <button
              @click="addStationInput"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              + 添加站点
            </button>
          </div>
        </div>

        <div class="flex gap-4 mt-6 flex-shrink-0">
          <button
            @click="showModal = false"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
          <button
            @click="isEditMode ? updateRoute() : addRoute()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {{ isEditMode ? '确定修改' : '确定添加' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
