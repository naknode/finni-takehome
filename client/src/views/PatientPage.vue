<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl my-8">{{ patientData?.firstName }} {{ patientData?.lastName }}</h1>
      <button
        type="button"
        @click="goBack"
        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        Go back
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const patientData = ref(route.params?.state?.patientData || null)

onMounted(async () => {
  const uuid = route.params.uuid
  const response = await fetch(`http://localhost:3000/patient/${uuid}`)
  if (response.ok) {
    patientData.value = await response.json()
  } else {
    console.error('Failed to fetch patient data')
  }
})

const goBack = () => {
  window.location.href = '/dashboard'
}
</script>
