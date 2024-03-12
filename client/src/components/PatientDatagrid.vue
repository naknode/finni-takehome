<template>
  <div class="ag-theme-alpine" style="height: 500px; width: 600px">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :rowData="rowData"
      class="ag-theme-alpine"
      :animateRows="true"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const columnDefs = [
  { headerName: 'First Name', field: 'firstName' },
  { headerName: 'Middle Name', field: 'middleName' },
  { headerName: 'Last Name', field: 'lastName' },
  { headerName: 'Date of Birth', field: 'dateOfBirth' },
  { headerName: 'Status', field: 'status' }
]

const rowData = ref([])

onMounted(async () => {
  const response = await fetch('http://localhost:3000/patients')
  if (response.ok) {
    const data = await response.json()
    rowData.value = data
  } else {
    console.error('Failed to fetch patient data:', response.statusText)
  }
})
</script>

<style scoped></style>
