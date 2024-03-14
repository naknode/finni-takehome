<template>
  <div class="relative max-w-[85rem] w-full mx-auto px-8 flex-col">
    <div class="flex flex-row justify-between items-center">
      <h1 class="text-4xl my-8 flex items-center">Create Patient</h1>
      <GoBackButton />
    </div>
    <PatientForm :data="patientData" :creating="true" />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import { usePatientStore } from '../stores/patientStore'
import PatientForm from '@/components/PatientForm.vue'
import GoBackButton from '@/components/GoBackButton.vue'

const store = usePatientStore()

const patientData = ref({})

async function createNewPatient() {
  const data = store.createNewPatient()
  patientData.value = data
}

onMounted(async () => createNewPatient())
</script>
