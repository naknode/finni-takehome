<template>
  <div class="mx-auto py-4">
    <h2 class="text-3xl mb-4">Additional Fields ({{ additionalFieldsTotal }})</h2>
    <div
      v-for="(field, index) in additionalFields"
      :key="index"
      class="my-4 pb-5"
      :class="{
        'bg-yellow-50': !field.uuid && !props.creating,
        'bg-red-50 p-2 rounded-lg ': field.toDelete,
        'field-seperator': !field.toDelete
      }"
    >
      <div class="flex space-x-4 mb-4">
        <div class="w-1/3">
          <label for="label" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Label</label
          >
          <input
            type="text"
            id="label"
            :disabled="field.toDelete"
            v-model="field.label"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div class="w-1/3">
          <label for="value" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Value</label
          >
          <input
            type="text"
            id="value"
            :disabled="field.toDelete"
            v-model="field.value"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div class="w-1/3">
          <label for="type" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Type</label
          >
          <select
            :disabled="field.toDelete"
            v-model="field.type"
            id="type"
            class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          v-if="!field.toDelete"
          @click="removeAdditionalField(index, $event)"
          class="mt-3 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900 float-right"
        >
          {{ field?.uuid ? 'Delete' : 'Remove' }}
        </button>

        <button
          v-if="field.toDelete"
          @click="restoreAdditionalField(index, $event)"
          class="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
        >
          Restore Field
        </button>
      </div>
    </div>
    <button
      class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      @click="addAdditionalField"
    >
      Add New Field
    </button>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { computed, ref, watch } from 'vue'
import { FieldType, type AdditionalField } from 'shared'
import { useRoute } from 'vue-router'

const emits = defineEmits(['update:additionalField'])
const route = useRoute()

const props = defineProps({
  existingAdditionalFields: {
    type: Array as () => AdditionalField[],
    default: () => []
  },
  creating: {
    type: Boolean,
    default: false
  }
})

const patientUuid = (route.params.uuid as string) || undefined

const additionalFieldsTotal = computed(
  () => additionalFields.value.filter((additionalField) => !additionalField.toDelete).length
)

const newAdditionalField = (): AdditionalField => ({
  patientUuid,
  type: FieldType.String,
  value: faker.lorem.words(2),
  label: faker.lorem.words(1)
})

const additionalFields = ref(
  props.existingAdditionalFields.length ? props.existingAdditionalFields : []
)

watch(
  () => props.existingAdditionalFields,
  (newVal: AdditionalField[]) => {
    additionalFields.value = newVal.length ? newVal : []
  },
  { deep: true }
)

const addAdditionalField = (event: Event) => {
  event.preventDefault()
  additionalFields.value.push(newAdditionalField())

  emits('update:additionalField', additionalFields.value)
}

const restoreAdditionalField = async (index: number, event: Event) => {
  event.preventDefault()

  delete additionalFields.value[index].toDelete

  emits('update:additionalField', additionalFields.value)
}

const removeAdditionalField = async (index: number, event: Event) => {
  event.preventDefault()

  if (additionalFields.value[index]?.uuid) {
    additionalFields.value[index].toDelete = true
  } else {
    additionalFields.value.splice(index, 1)
  }

  emits('update:additionalField', additionalFields.value)
}
</script>
<style scoped>
.field-seperator {
  border-bottom: 1px solid #cccccc;
}
</style>
