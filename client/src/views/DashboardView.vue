<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import PatientDatagrid from '@/components/PatientDatagrid.vue'
import { usePatientStore } from '@/stores/patientStore'

const store = usePatientStore()

onMounted(() => {
  store.fetchPatients()
})

const router = useRouter()

const createPatient = () => router.push('/create-patient')
</script>

<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col">
    <div class="flex justify-between items-center">
      <h1 class="text-4xl my-8">Patients</h1>
      <button
        @click="createPatient"
        type="button"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Create Patient
      </button>
    </div>
    <PatientDatagrid :data="store.patients" />
  </div>
</template>
