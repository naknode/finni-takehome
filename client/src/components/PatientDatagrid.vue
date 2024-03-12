<template>
  <div class="ag-theme-alpine" style="width: 100%">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :pagination="true"
      :paginationPageSize="10"
      :paginationPageSizeSelector="[10, 25, 50, 100]"
      @grid-ready="onGridReady"
      :rowData="rowData"
      class="ag-theme-alpine"
      style="height: 520px"
      :defaultColDef="defaultColDef"
      :animateRows="true"
    ></ag-grid-vue>
  </div>
</template>

<script setup>
import { format, differenceInYears } from 'date-fns'
import { ref, onMounted, provide } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import ActionRenderer from './renderer/ActionRenderer.vue'
import statusCellRenderer from './renderer/statusCellRenderer'

const defaultColDef = ref({
  filter: 'agTextColumnFilter',
  floatingFilter: true
})

const columnDefs = [
  { headerName: 'First Name', field: 'firstName', flex: 1, filter: true },
  { headerName: 'Middle Name', field: 'middleName', filter: true },
  { headerName: 'Last Name', field: 'lastName', flex: 1, filter: true },
  {
    headerName: 'Date of Birth',
    field: 'dateOfBirth',
    valueFormatter: (params) => format(new Date(params.value), 'MM/dd/yyyy'),
    flex: 1
  },
  {
    headerName: 'Age',
    field: 'dateOfBirth',
    valueGetter: (params) => differenceInYears(new Date(), new Date(params.data.dateOfBirth)),
    flex: 1,
    filter: true
  },
  { headerName: 'Status', field: 'status', filter: true, cellRenderer: statusCellRenderer },
  {
    headerName: '',
    cellRenderer: ActionRenderer,
    minWidth: 150,
    filter: false,
    sort: false
  }
]

const rowData = ref([])

const gridApi = ref(null)
const gridColumnApi = ref(null)

const onGridReady = (params) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}

const fetchPatients = async () => {
  const response = await fetch('http://localhost:3000/patients')
  if (response.ok) {
    rowData.value = await response.json()
  } else {
    console.error('Failed to fetch patient data')
  }
}

provide('gridApi', gridApi)
provide('fetchPatients', fetchPatients)

onMounted(async () => {
  fetchPatients()
})
</script>

<style scoped></style>
