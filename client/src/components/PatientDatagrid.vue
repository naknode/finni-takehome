<template>
  <div class="ag-theme-alpine" style="width: 100%">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      @row-clicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="10"
      :paginationPageSizeSelector="[10, 25, 50, 100]"
      :rowData="props.data"
      class="ag-theme-alpine"
      style="height: 520px"
      :defaultColDef="defaultColDef"
      :animateRows="true"
    ></ag-grid-vue>
  </div>
</template>

<script setup lang="ts">
import { format, differenceInYears } from 'date-fns'
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import type { RowClickedEvent, ValueFormatterParams, ValueGetterParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import statusCellRenderer from './renderer/statusCellRenderer'
import type { Patient } from 'shared'
import router from '../router'

const defaultColDef = ref({
  filter: 'agTextColumnFilter',
  floatingFilter: true
})

const gridOptions = {
  getRowStyle: () => ({
    cursor: 'pointer'
  })
}

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
