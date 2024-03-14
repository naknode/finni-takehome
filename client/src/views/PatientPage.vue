<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col" v-if="patientData">
    <div class="flex flex-row justify-between items-center">
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
      <GoBackButton />
    </div>
    <PatientForm :data="patientData" @refresh:patient="refreshPatient" :creating="false" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { differenceInYears } from 'date-fns'

import { usePatientStore } from '../stores/patientStore'
import PatientForm from '@/components/PatientForm.vue'
import GoBackButton from '@/components/GoBackButton.vue'

const store = usePatientStore()

const patientData = ref()
const route = useRoute()
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
</script>
