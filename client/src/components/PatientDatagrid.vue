<template>
  <div class="ag-theme-alpine" style="width: 100%">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      @row-clicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="10"
      :paginationPageSizeSelector="[10, 25, 50, 100]"
      :rowData="filteredData"
      class="ag-theme-alpine"
      style="height: 520px"
      :defaultColDef="defaultColDef"
      :animateRows="true"
    ></ag-grid-vue>
    <div class="flex space-x-4 mt-7">
      <div class="w-1/4">
        <input
          type="text"
          placeholder="Search patients by city..."
          v-model="query"
          class="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format, differenceInYears } from 'date-fns'
import { computed, ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import type { RowClickedEvent, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import statusCellRenderer from './renderer/statusCellRenderer'
import type { Patient } from 'shared'
import router from '../router'

const query = ref()

const defaultColDef = ref({
  filter: 'agTextColumnFilter',
  floatingFilter: true
})

const gridOptions = {
  getRowStyle: () => ({
    cursor: 'pointer'
  })
}

const filteredData = computed(() => {
  if (!query.value) {
    return props.data
  }

  return props.data.filter((patient) => {
    return patient.addresses.some((address) =>
      address.city.toLowerCase().includes(query.value.toLowerCase())
    )
  })
})

interface Props {
  data: Patient[]
}

const props = defineProps<Props>()

const columnDefs = [
  { headerName: 'First Name', field: 'firstName', flex: 1, filter: true },
  { headerName: 'Middle Name', field: 'middleName', filter: true },
  { headerName: 'Last Name', field: 'lastName', flex: 1, filter: true },
  {
    headerName: 'Date of Birth',
    field: 'dateOfBirth',
    valueFormatter: (params: ValueFormatterParams) => format(new Date(params.value), 'MM/dd/yyyy'),
    flex: 1
  },
  {
    headerName: 'Age',
    field: 'dateOfBirth',
    valueGetter: (params: ValueGetterParams) =>
      differenceInYears(new Date(), new Date(params.data.dateOfBirth)),
    flex: 1,
    filter: true
  },
  { headerName: 'Status', field: 'status', filter: true, cellRenderer: statusCellRenderer }
]

const onRowClicked = (event: RowClickedEvent) => {
  const patientUuid = event.data.uuid

  router.push({ name: 'patient', params: { uuid: patientUuid } })
}
</script>
