import { defineStore } from 'pinia'
import type { Patient } from 'shared'
import { ref, computed } from 'vue'

export const usePatientStore = defineStore('patients', () => {
  const patients = ref<Patient[]>([])

  const getAllPatients = computed(() => patients)

  function updateState(state: Patient[]) {
    patients.value = state
  }

  async function fetchPatients() {
    try {
      const response = await fetch('http://localhost:3000/patients')

      if (response.ok) {
        patients.value = await response.json()
      } else {
        console.error('Failed to fetch patient data')
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  return { getAllPatients, updateState, patients, fetchPatients }
})
