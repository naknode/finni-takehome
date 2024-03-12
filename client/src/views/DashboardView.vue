<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
import PatientDatagrid from '../components/PatientDatagrid.vue'
</script>

<template>
  <div
    class="relative max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 flex-col"
  >
    <h1 class="text-4xl mt-4">Patients</h1>
    <PatientDatagrid />
  </div>
</template>
