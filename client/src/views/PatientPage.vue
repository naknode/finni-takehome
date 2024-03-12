<template>
  <div>
    <h2>Patient Details: {{ patientData?.firstName }} {{ patientData?.lastName }}</h2>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

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
</script>
