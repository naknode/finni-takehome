<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col">
    <h1 class="text-4xl my-8 flex items-center">Create Patient</h1>
    <button
      type="button"
      @click="goBack"
      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      Go back
    </button>

    <PatientForm :data="patientData" :creating="true" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { usePatientStore } from '../stores/patientStore'
import PatientForm from '@/components/PatientForm.vue'

const store = usePatientStore()

const patientData = ref({})
const router = useRouter()

async function createNewPatient() {
  const data = store.createNewPatient()
  patientData.value = data
}

onMounted(async () => createNewPatient())

const goBack = () => {
  router.push('/dashboard')
}
</script>
