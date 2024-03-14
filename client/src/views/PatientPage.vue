<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col" v-if="patientData">
    <h1 class="text-4xl my-8 flex items-center">
      {{ patientData?.firstName }} {{ patientData?.lastName }} ({{
        getAge(patientData?.dateOfBirth)
      }}
      yrs. old)
      <span
        :class="[getStatusClass(patientData?.status), 'ml-5']"
        style="text-transform: uppercase"
        >{{ patientData?.status }}</span
      >
    </h1>
    <button
      type="button"
      @click="goBack"
      class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      Go back
    </button>

    <PatientForm :data="patientData" @refresh:patient="refreshPatient" :creating="false" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { differenceInYears } from 'date-fns'

import { usePatientStore } from '../stores/patientStore'
import PatientForm from '@/components/PatientForm.vue'

const store = usePatientStore()

const patientData = ref()
const route = useRoute()
const router = useRouter()
const uuid = ref(route.params.uuid || null)

async function getLatestPatient() {
  const data = await store.fetchPatient(uuid.value)
  patientData.value = data
}

function getAge(dateOfBirth) {
  return differenceInYears(new Date(), new Date(dateOfBirth))
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 text-xl font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'
    case 'onboarding':
      return 'bg-yellow-100 text-yellow-800 text-xl font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300'
    case 'churned':
      return 'bg-red-100 text-red-800 text-xl font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300'
    default:
    case 'inquiry':
      return 'bg-blue-100 text-blue-800 text-xl font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300'
  }
}

onMounted(async () => getLatestPatient())

const refreshPatient = async () => getLatestPatient()

const goBack = () => {
  router.push('/dashboard')
}
</script>
