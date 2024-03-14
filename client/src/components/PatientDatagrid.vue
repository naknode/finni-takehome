<template>
  <div class="ag-theme-alpine grid-container" style="width: 100%">
    <ag-grid-vue
      :columnDefs="columnDefs"
      :gridOptions="gridOptions"
      @row-clicked="onRowClicked"
      :pagination="true"
      :paginationPageSize="25"
      :paginationPageSizeSelector="[10, 25, 50, 100]"
      :rowData="props.data"
      class="ag-theme-alpine"
      style="height: 100%"
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
import type { Address, Patient } from 'shared'
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
    headerName: 'Age',
    width: 100,
    field: 'dateOfBirth',
    valueGetter: (params: ValueGetterParams) =>
      differenceInYears(new Date(), new Date(params.data.dateOfBirth)),
    filter: true
  },
  {
    headerName: 'Status',
    field: 'status',
    filter: true,
    cellRenderer: statusCellRenderer,
    width: 125
  },
  {
    headerName: 'City',
    field: 'addresses',
    valueGetter: (params: ValueGetterParams) => {
      if (params.data.addresses && params.data.addresses.length > 0) {
        return params.data.addresses.map((address: Address) => address.city).join(', ')
      } else {
        return '--'
      }
    },
    flex: 1,
    filter: true
  }
]

const onRowClicked = (event: RowClickedEvent) => {
  const patientUuid = event.data.uuid

  router.push({ name: 'patient', params: { uuid: patientUuid } })
}
</script>
<style scoped>
.grid-container {
  height: calc(100vh - 200px);
}

.full-height-grid {
  width: 100%;
  height: 100%;
}
</style>
