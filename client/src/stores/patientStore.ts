import { faker } from '@faker-js/faker'
import { defineStore } from 'pinia'
import { Status, type Patient } from 'shared'
import { ref, computed } from 'vue'

export const usePatientStore = defineStore('patients', () => {
  const patients = ref<Patient[]>([])

  const getAllPatients = computed(() => patients)

  function updateState(state: Patient[]) {
    patients.value = state
  }

  async function getPatient(uuid: string): Promise<Patient | undefined> {
    if (patients.value.length) {
      return patients.value.find((p) => p.uuid === uuid)
    } else {
      return await fetchPatient(uuid)
    }
  }

  function createNewPatient() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate(),
      status: Status.Inquiry,
      addresses: [],
      additionalFields: []
    }
  }

  async function fetchPatients() {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/patients`)

      if (response.ok) {
        patients.value = await response.json()
      } else {
        console.error('Failed to fetch patient data')
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  async function fetchPatient(uuid: string): Promise<Patient | undefined> {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/patient/${uuid}`)
      if (response.ok) {
        return await response.json()
      } else {
        console.error('Failed to fetch patient data')
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  return {
    getAllPatients,
    updateState,
    patients,
    fetchPatients,
    getPatient,
    fetchPatient,
    createNewPatient
  }
})
