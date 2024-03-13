<template>
  <div class="max-w-xl mx-auto py-4" v-if="patient">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="mb-6">
        <label
          for="large-input"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >First Name</label
        >
        <input
          type="text"
          id="firstName"
          v-model="patient.firstName"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div class="mb-6">
        <label for="middleName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Middle Name</label
        >
        <input
          type="text"
          id="middleName"
          v-model="patient.middleName"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div class="mb-6">
        <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Last Name</label
        >
        <input
          type="text"
          id="lastName"
          v-model="patient.lastName"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div>
        <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Date of Birth</label
        >
        <input
          type="date"
          @input="updateDateOfBirth($event)"
          :value="formattedDateOfBirth"
          id="dateOfBirth"
          class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div>
        <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Status</label
        >
        <select
          v-model="patient.status"
          id="status"
          class="p-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="inquiry">Inquiry</option>
          <option value="onboarding">Onboarding</option>
          <option value="active">Active</option>
          <option value="churned">Churned</option>
        </select>
      </div>

      <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Save
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Patient } from 'shared'
import { format, formatISO } from 'date-fns'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps<{
  data: Patient
}>()

const patient = ref<Patient | null>(null)

const formattedDateOfBirth = computed(() => {
  return patient.value ? format(new Date(patient.value.dateOfBirth), 'yyyy-MM-dd') : null
})

onMounted(async () => {
  patient.value = props.data
})

function updateDateOfBirth(event: Event) {
  const newDateOfBirth = (event.target as HTMLInputElement).value
  if (patient.value) {
    patient.value.dateOfBirth = new Date(newDateOfBirth)
  }
}

async function submitForm() {
  const { dateOfBirth, ...patientDataWithoutDOB } = patient.value as Patient

  const patientDataForSubmission = {
    ...patientDataWithoutDOB,
    dateOfBirth: formatISO(new Date(dateOfBirth))
  }
  try {
    const response = await fetch(`http://localhost:3000/patients/${patient.value?.uuid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientDataForSubmission)
    })

    if (!response.ok) {
      throw new Error(`There was an error: ${response.status}`)
    }

    const responseData = await response.json()
    toast.success(
      `Patient ${responseData.firstName} ${responseData.lastName} successfully updated. `
    )
  } catch (error) {
    console.error('Error submitting form... ', error)
  }
}
</script>
