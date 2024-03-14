<template>
  <div class="py-4" v-if="patient">
    <form @submit.prevent="submitForm" class="space-y-4">
      <div class="flex flex-row justify-between items-center mb-6">
        <div class="size-full pr-10">
          <label
            for="firstName"
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

        <div class="size-full pr-10">
          <label
            for="middleName"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Middle Name</label
          >
          <input
            type="text"
            id="middleName"
            v-model="patient.middleName"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div class="size-full">
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
      </div>

      <div class="flex flex-row justify-between items-center mb-6">
        <div class="size-full pr-10">
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

        <div class="size-full">
          <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Status</label
          >
          <select
            v-model="patient.status"
            id="status"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="inquiry">Inquiry</option>
            <option value="onboarding">Onboarding</option>
            <option value="active">Active</option>
            <option value="churned">Churned</option>
          </select>
        </div>
      </div>

      <PatientAddresses
        :existingAddresses="patient.addresses"
        :creating="props.creating"
        @update:addresses="updateAddresses"
      />

      <PatientAdditionalFields
        :existingAdditionalFields="patient.additionalFields"
        :creating="props.creating"
        @update:additionalField="updateAdditionalFields"
      />

      <div class="flex justify-between pt-10">
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 flex items-center flex-row"
        >
          <PlusIcon v-if="props.creating" class="h-6 w-6 text-white mr-3" />
          {{ props.creating ? 'Create' : 'Update' }} Patient
        </button>
        <button
          v-if="!props.creating"
          @click="deletePatient"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 flex items-center flex-row"
        >
          <TrashIcon class="h-6 w-6 text-white mr-3" />
          Delete
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref, watch } from 'vue'
import type { AdditionalField, Address, Patient } from 'shared'
import { format, formatISO } from 'date-fns'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useRouter } from 'vue-router'

import PatientAddresses from './PatientAddresses.vue'
import PatientAdditionalFields from './PatientAdditionalFields.vue'

const props = defineProps<{
  data: Patient
  creating: boolean
}>()

const emits = defineEmits(['refresh:patient'])

const updateAddresses = (updatedAddresses: Address[]) => {
  if (patient.value) {
    patient.value.addresses = updatedAddresses
  }
}

const updateAdditionalFields = (updateAdditionalFields: AdditionalField[]) => {
  if (patient.value) {
    patient.value.additionalFields = updateAdditionalFields
  }
}

const patient = ref<Patient | null>(null)

const formattedDateOfBirth = computed(() => {
  return patient.value ? format(new Date(patient.value.dateOfBirth), 'yyyy-MM-dd') : null
})

const router = useRouter()

watch(
  () => props.data,
  (newVal: Patient) => {
    patient.value = newVal
  },
  { deep: true }
)

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
    if (props.creating) {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientDataForSubmission)
      })

      if (!response.ok) {
        toast.error(
          `Failed to update patient ${patient.value?.firstName} ${patient.value?.lastName}.`
        )
        throw new Error(`There was an error: ${response.status}`)
      }

      const responseData = await response.json()

      setTimeout(() => {
        toast.success(
          `Patient ${responseData.firstName} ${responseData.lastName} successfully created. `
        )
      }, 100)
      router.push(`/patient/${responseData.uuid}`)
    } else {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/patients/${patient.value?.uuid}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patientDataForSubmission)
        }
      )

      if (!response.ok) {
        toast.error(
          `Failed to update patient ${patient.value?.firstName} ${patient.value?.lastName}.`
        )
        throw new Error(`There was an error: ${response.status}`)
      }

      const responseData = await response.json()
      toast.success(
        `Patient ${responseData.firstName} ${responseData.lastName} successfully updated. `
      )

      emits('refresh:patient')
    }
  } catch (error) {
    console.error('Error submitting form... ', error)
  }
}

async function deletePatient(event: Event) {
  try {
    event.preventDefault()

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/patients/${patient.value?.uuid}`,
      {
        method: 'DELETE'
      }
    )
    if (response.ok) {
      router.push('/dashboard')
      setTimeout(() => {
        toast.success(
          `Patient ${patient.value?.firstName} ${patient.value?.lastName} successfully deleted. `
        )
      }, 200)
    } else {
      toast.error(
        `Failed to delete patient ${patient.value?.firstName} ${patient.value?.lastName}.`
      )
      throw new Error('Failed to delete patient')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
