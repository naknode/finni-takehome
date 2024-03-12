<script setup>
import { onMounted } from 'vue'

import PatientDatagrid from '@/components/PatientDatagrid.vue'
import { usePatientStore } from '@/stores/patientStore'

const store = usePatientStore()

onMounted(() => {
  store.fetchPatients()
})
</script>

<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col">
    <h1 class="text-4xl my-8">Patients</h1>
    <PatientDatagrid :data="store.patients" />
  </div>
</template>
