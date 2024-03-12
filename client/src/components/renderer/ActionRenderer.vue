<template>
  <div class="flex gap-2 items-center justify-center" style="height: 100%">
    <button
      @click="view"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xs p-1 rounded"
    >
      View
    </button>
    <button
      @click="del"
      class="bg-red-500 hover:bg-red-700 text-white font-bold text-xs p-1 rounded"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
import { defineProps, inject } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const props = defineProps({
  data: Object
})

const router = useRouter()

const view = () => {
  router.push({
    name: 'patient',
    params: { data: props.params.data, uuid: props.params.data.uuid }
  })
}

const gridApi = inject('gridApi')
const fetchPatients = inject('fetchPatients')

const del = async () => {
  try {
    const response = await fetch(`http://localhost:3000/patients/${props.params.data.uuid}`, {
      method: 'DELETE'
    })
    if (response.ok) {
      console.log(`Deleted patient with ID: ${props.params.data.uuid}`)
      toast.success(
        `Patient ${props.params.data.firstName} ${props.params.data.lastName} successfully deleted. `
      )

      await fetchPatients()
    } else {
      toast.error(
        `Failed to delete patient ${props.params.data.firstName} ${props.params.data.lastName}.`
      )
      throw new Error('Failed to delete patient')
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
